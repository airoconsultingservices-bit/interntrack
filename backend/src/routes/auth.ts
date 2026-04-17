import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../config/database";
import { config } from "../config/env";
import { logger } from "../config/logger";
import { sendVerificationEmail } from "../services/email";

const router = Router();

/* ─── Helper: generate a secure random token ─── */
function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/* ─── Helper: generate a 6-digit OTP ─── */
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/* ═══════════════════════════════════════════════════════════
   POST /api/auth/register
   Creates tenant + user + student profile, sends verification
   ═══════════════════════════════════════════════════════════ */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { firstName, middleName, lastName, email, password, phone, state, university } = req.body;

    // ── Validation ──
    const errors: Record<string, string> = {};
    if (!firstName?.trim()) errors.firstName = "First name is required";
    if (!lastName?.trim()) errors.lastName = "Last name is required";
    if (!email?.trim() || !email.includes("@")) errors.email = "Valid email is required";
    if (!password || password.length < 6) errors.password = "Password must be at least 6 characters";
    if (!state?.trim()) errors.state = "State is required";
    if (!university?.trim()) errors.university = "University is required";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: "Validation failed", details: errors });
    }

    // ── Check for existing user ──
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    // ── Hash password ──
    const passwordHash = await bcrypt.hash(password, 12);

    // ── Generate email verification token ──
    const emailVerifyToken = generateToken();
    const emailVerifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // ── Create tenant + user + profile in a transaction ──
    const slug = `user-${email.split("@")[0].replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${Date.now()}`;

    const user = await prisma.$transaction(async (tx) => {
      // Create a tenant for the new user
      const tenant = await tx.tenant.create({
        data: {
          name: `${firstName.trim()} ${lastName.trim()}'s Workspace`,
          slug,
          plan: "FREE",
          maxUsers: 50,
          maxAppsPerMonth: 100,
        },
      });

      // Create the user
      const newUser = await tx.user.create({
        data: {
          email: email.toLowerCase().trim(),
          passwordHash,
          firstName: firstName.trim(),
          middleName: middleName?.trim() || null,
          lastName: lastName.trim(),
          phone: phone?.trim() || null,
          role: "STUDENT",
          emailVerified: false,
          emailVerifyToken,
          emailVerifyExpires,
          tenantId: tenant.id,
          profile: {
            create: {
              phone: phone?.trim() || null,
              state: state.trim(),
              university: university.trim(),
            },
          },
        },
        include: { profile: true },
      });

      return newUser;
    });

    // ── Send verification email ──
    await sendVerificationEmail(email.toLowerCase().trim(), emailVerifyToken, firstName.trim());

    // ── Generate JWT (user can use the app but with limited access until verified) ──
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any }
    );

    logger.info(`New user registered: ${email} (${firstName} ${lastName})`);

    return res.status(201).json({
      message: "Account created successfully. Please verify your email.",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
      },
    });
  } catch (err: any) {
    logger.error(`Registration error: ${err.message}`);
    return res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

/* ═══════════════════════════════════════════════════════════
   GET /api/auth/verify-email?token=...
   Verifies the user's email address
   ═══════════════════════════════════════════════════════════ */
router.get("/verify-email", async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(400).json({ error: "Verification token is required" });
    }

    const user = await prisma.user.findUnique({
      where: { emailVerifyToken: token },
    });

    if (!user) {
      return res.status(404).json({ error: "Invalid or expired verification token" });
    }

    if (user.emailVerified) {
      return res.json({ message: "Email already verified" });
    }

    if (user.emailVerifyExpires && user.emailVerifyExpires < new Date()) {
      return res.status(410).json({ error: "Verification link has expired. Please request a new one." });
    }

    // Mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpires: null,
      },
    });

    logger.info(`Email verified for user: ${user.email}`);
    return res.json({ message: "Email verified successfully!" });
  } catch (err: any) {
    logger.error(`Email verification error: ${err.message}`);
    return res.status(500).json({ error: "Verification failed. Please try again." });
  }
});

/* ═══════════════════════════════════════════════════════════
   POST /api/auth/resend-verification
   Resends the email verification link
   ═══════════════════════════════════════════════════════════ */
router.post("/resend-verification", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.emailVerified) return res.json({ message: "Email already verified" });

    const emailVerifyToken = generateToken();
    const emailVerifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifyToken, emailVerifyExpires },
    });

    await sendVerificationEmail(email, emailVerifyToken, user.firstName);

    return res.json({ message: "Verification email resent" });
  } catch (err: any) {
    logger.error(`Resend verification error: ${err.message}`);
    return res.status(500).json({ error: "Failed to resend verification email" });
  }
});

/* ═══════════════════════════════════════════════════════════
   POST /api/auth/send-otp
   Sends a phone OTP (mock - logs to console)
   ═══════════════════════════════════════════════════════════ */
router.post("/send-otp", async (req: Request, res: Response) => {
  try {
    const { phone, email } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone number is required" });
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        phone: phone.trim(),
        phoneOtp: await bcrypt.hash(otp, 10),
        phoneOtpExpires: otpExpires,
      },
    });

    // ── MOCK: Log OTP to console instead of sending SMS ──
    logger.info("═══════════════════════════════════════════════════");
    logger.info("  PHONE OTP (Mock - Console Output)");
    logger.info("═══════════════════════════════════════════════════");
    logger.info(`  Phone: ${phone}`);
    logger.info(`  OTP Code: ${otp}`);
    logger.info(`  Expires: ${otpExpires.toISOString()}`);
    logger.info("═══════════════════════════════════════════════════");

    return res.json({
      message: "OTP sent to your phone number",
      // Include OTP in response ONLY in development for testing
      ...(config.nodeEnv === "development" && { _devOtp: otp }),
    });
  } catch (err: any) {
    logger.error(`Send OTP error: ${err.message}`);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
});

/* ═══════════════════════════════════════════════════════════
   POST /api/auth/verify-otp
   Verifies the phone OTP
   ═══════════════════════════════════════════════════════════ */
router.post("/verify-otp", async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.phoneOtp || !user.phoneOtpExpires) {
      return res.status(400).json({ error: "No OTP was requested. Please request a new one." });
    }

    if (user.phoneOtpExpires < new Date()) {
      return res.status(410).json({ error: "OTP has expired. Please request a new one." });
    }

    const isValid = await bcrypt.compare(otp, user.phoneOtp);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid OTP code" });
    }

    // Mark phone as verified and clear OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        phoneVerified: true,
        phoneOtp: null,
        phoneOtpExpires: null,
      },
    });

    // Update profile phone as well
    if (user.phone) {
      await prisma.studentProfile.updateMany({
        where: { userId: user.id },
        data: { phone: user.phone },
      });
    }

    logger.info(`Phone verified for user: ${user.email}`);
    return res.json({ message: "Phone number verified successfully!" });
  } catch (err: any) {
    logger.error(`Verify OTP error: ${err.message}`);
    return res.status(500).json({ error: "OTP verification failed" });
  }
});

/* ═══════════════════════════════════════════════════════════
   POST /api/auth/login
   Standard email/password login
   ═══════════════════════════════════════════════════════════ */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { profile: true, tenant: true },
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Account is deactivated" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any }
    );

    const fullName = [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ");

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        fullName,
        phone: user.phone,
        role: user.role,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        plan: user.tenant.plan,
        profile: user.profile,
      },
    });
  } catch (err: any) {
    logger.error(`Login error: ${err.message}`);
    return res.status(500).json({ error: "Login failed" });
  }
});

/* ─── Health check ─── */
router.get("/", (_req, res) => res.json({ status: "ok", route: "auth" }));

export default router;
