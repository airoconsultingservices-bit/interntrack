import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { logger } from "../config/logger";

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

/* ─── Health check ─── */
router.get("/", (_req, res) => res.json({ status: "ok", route: "admin" }));

export default router;
