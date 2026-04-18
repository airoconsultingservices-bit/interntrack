import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { logger } from "../config/logger";
import { generateJobs } from "../services/jobGenerator";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/admin/users
 * Returns all users with profile info for the admin panel.
 */
router.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        emailVerified: true,
        phone: true,
        phoneVerified: true,
        lastLoginAt: true,
        createdAt: true,
        tenant: {
          select: { plan: true },
        },
        profile: {
          select: { university: true, state: true, major: true },
        },
        _count: {
          select: { applications: true, resumes: true },
        },
      },
    });

    const formatted = users.map((u) => ({
      id: u.id,
      name: [u.firstName, u.middleName, u.lastName].filter(Boolean).join(" "),
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      plan: u.tenant?.plan || "FREE",
      uni: u.profile?.university || "",
      state: u.profile?.state || "",
      major: u.profile?.major || "",
      status: u.isActive ? "Active" : "Suspended",
      isActive: u.isActive,
      emailVerified: u.emailVerified,
      phone: u.phone,
      phoneVerified: u.phoneVerified,
      apps: u._count.applications,
      resumes: u._count.resumes,
      lastLogin: u.lastLoginAt,
      joined: u.createdAt,
    }));

    return res.json(formatted);
  } catch (err: any) {
    logger.error("Admin users list error:", err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /api/admin/users/:id/status
 * Suspend or activate a user.
 * Body: { isActive: boolean }
 */
router.patch("/users/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ error: "isActive must be a boolean" });
    }

    // Don't allow suspending yourself
    const adminId = (req as any).user?.id;
    if (adminId === id) {
      return res.status(400).json({ error: "You cannot suspend your own account" });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
      },
    });

    const action = isActive ? "activated" : "suspended";
    logger.info(`User ${updated.email} ${action} by admin ${adminId}`);

    return res.json({
      message: `User ${updated.firstName} ${updated.lastName} has been ${action}`,
      user: updated,
    });
  } catch (err: any) {
    logger.error("Admin user status update error:", err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /api/admin/users/:id/reset-password
 * Admin resets a user's password.
 * Body: { password?: string }
 * If no password provided, generates a random one and returns it.
 */
router.patch("/users/:id/reset-password", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user?.id;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Use provided password or generate a random one
    let newPassword = req.body.password;
    const wasGenerated = !newPassword;
    if (!newPassword) {
      newPassword = crypto.randomBytes(6).toString("base64url"); // ~8 char random password
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });

    logger.info(`Password reset for user ${user.email} by admin ${adminId}`);

    return res.json({
      message: `Password reset for ${user.firstName} ${user.lastName}`,
      ...(wasGenerated && { generatedPassword: newPassword }),
    });
  } catch (err: any) {
    logger.error("Admin password reset error:", err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/admin/users/:id
 * Permanently remove a user and all associated data.
 */
router.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user?.id;

    if (adminId === id) {
      return res.status(400).json({ error: "You cannot delete your own account" });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Cascade delete handles related records (profile, resumes, applications, etc.)
    await prisma.user.delete({ where: { id } });

    logger.info(`User ${user.email} deleted by admin ${adminId}`);
    return res.json({ message: `User ${user.firstName} ${user.lastName} has been removed` });
  } catch (err: any) {
    logger.error("Admin user delete error:", err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/admin/ingest-jobs
 * Generate AI-powered internship listings and store in database.
 * Body: { count?: number } (default 500)
 */
router.post("/ingest-jobs", async (req: Request, res: Response) => {
  try {
    const count = Math.min(req.body.count || 500, 1000);
    const adminId = (req as any).user?.id;

    logger.info(`AI job ingestion started by admin ${adminId}: ${count} jobs requested`);

    // Generate job listings
    const jobs = generateJobs(count);

    // Batch insert: first create/find companies, then create internships
    let companiesCreated = 0;
    let internshipsCreated = 0;
    const companyCache: Record<string, string> = {}; // name -> id

    for (const job of jobs) {
      // Find or create company
      let companyId = companyCache[job.companyName];
      if (!companyId) {
        let company = await prisma.company.findFirst({ where: { name: job.companyName } });
        if (!company) {
          company = await prisma.company.create({
            data: {
              name: job.companyName,
              logo: job.companyLogo,
              industry: job.companyIndustry,
              website: job.companyWebsite,
              careersUrl: job.applicationUrl,
              isVerified: true,
              isActive: true,
            },
          });
          companiesCreated++;
        }
        companyId = company.id;
        companyCache[job.companyName] = companyId;
      }

      // Create internship
      await prisma.internship.create({
        data: {
          companyId,
          title: job.title,
          description: job.description,
          location: job.location,
          isRemote: job.isRemote,
          skills: job.skills,
          requirements: job.requirements,
          applicationUrl: job.applicationUrl,
          portalType: "DIRECT",
          compensation: job.compensation,
          source: "AI Generated",
          isActive: true,
          deadline: job.deadline === "Rolling" ? null : new Date(`${job.deadline} 2026`),
        },
      });
      internshipsCreated++;
    }

    logger.info(`AI job ingestion complete: ${internshipsCreated} internships, ${companiesCreated} new companies`);

    return res.status(201).json({
      message: `Successfully ingested ${internshipsCreated} internship listings`,
      stats: {
        internshipsCreated,
        companiesCreated,
        categories: [...new Set(jobs.map((j) => j.category))],
      },
    });
  } catch (err: any) {
    logger.error("AI job ingestion error:", err);
    return res.status(500).json({ error: err.message || "Job ingestion failed" });
  }
});

/**
 * GET /api/admin/ingest-stats
 * Get current ingestion stats.
 */
router.get("/ingest-stats", async (_req: Request, res: Response) => {
  try {
    const totalInternships = await prisma.internship.count();
    const totalCompanies = await prisma.company.count();
    const activeInternships = await prisma.internship.count({ where: { isActive: true } });

    return res.json({ totalInternships, totalCompanies, activeInternships });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/* ─── Health check ─── */
router.get("/", (_req, res) => res.json({ status: "ok", route: "admin" }));

export default router;
