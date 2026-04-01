import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { prisma } from "../config/database";

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string; tenantId: string };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "Authentication required" });
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true, email: true, role: true, tenantId: true, isActive: true } });
    if (!user || !user.isActive) return res.status(401).json({ error: "Invalid account" });
    req.user = { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId };
    next();
  } catch { return res.status(401).json({ error: "Authentication failed" }); }
};

export const requireRole = (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ error: "Insufficient permissions" });
  next();
};
