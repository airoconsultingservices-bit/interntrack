import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { config } from "./config/env";
import { logger } from "./config/logger";
import { errorHandler } from "./middleware/errorHandler";
import { authMiddleware } from "./middleware/auth";
import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profiles";
import companyRoutes from "./routes/companies";
import internshipRoutes from "./routes/internships";
import applicationRoutes from "./routes/applications";
import resumeRoutes from "./routes/resumes";
import subscriptionRoutes from "./routes/subscriptions";
import webhookRoutes from "./routes/webhooks";
import adminRoutes from "./routes/admin";
import healthRoutes from "./routes/health";

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: config.corsOrigins, credentials: true, methods: ["GET", "POST", "PUT", "PATCH", "DELETE"] }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: config.isProduction ? 100 : 1000 }));
app.use(morgan(config.isProduction ? "combined" : "dev", { stream: { write: (msg: string) => logger.http(msg.trim()) } }));

app.use("/api/webhooks/stripe", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Public routes
app.use("/api/health", healthRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }), authRoutes);

// Protected routes
app.use("/api/profile", authMiddleware, profileRoutes);
app.use("/api/companies", authMiddleware, companyRoutes);
app.use("/api/internships", authMiddleware, internshipRoutes);
app.use("/api/applications", authMiddleware, applicationRoutes);
app.use("/api/resumes", authMiddleware, resumeRoutes);
app.use("/api/subscriptions", authMiddleware, subscriptionRoutes);
app.use("/api/admin", authMiddleware, adminRoutes);

app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, "0.0.0.0", () => {
  logger.info(`InternTrack API running on port ${PORT} [${config.nodeEnv}]`);
});

export default app;
