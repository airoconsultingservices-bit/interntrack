import winston from "winston";
import { config } from "./env";

export const logger = winston.createLogger({
  level: config.isProduction ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    config.isProduction ? winston.format.json() : winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, stack }) =>
        `${timestamp} [${level}]: ${stack || message}`
      )
    )
  ),
  defaultMeta: { service: "interntrack-api" },
  transports: [new winston.transports.Console()],
});
