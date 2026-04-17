/**
 * Vercel Serverless Function entry point.
 * Wraps the Express app so all /api/* routes are handled by one function.
 */
import app from "../backend/src/server";
export default app;
