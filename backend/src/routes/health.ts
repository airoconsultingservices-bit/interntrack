import { Router } from "express";
import { prisma } from "../config/database";
const router = Router();
router.get("/", async (_req, res) => {
  let dbOk = true;
  try { await prisma.$queryRaw`SELECT 1`; } catch { dbOk = false; }
  const mem = process.memoryUsage();
  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()) + "s",
    memory: Math.round(mem.heapUsed / 1024 / 1024) + "MB",
    database: dbOk ? "ok" : "error",
  });
});
export default router;
