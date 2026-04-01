import { Router } from "express";
const router = Router();
router.get("/", (_req, res) => res.json({ status: "ok", route: "auth" }));
export default router;
