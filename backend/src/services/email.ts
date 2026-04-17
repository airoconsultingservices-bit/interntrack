import { createClient } from "@supabase/supabase-js";
import { config } from "../config/env";
import { logger } from "../config/logger";

const supabase = config.supabase.url && config.supabase.serviceKey
  ? createClient(config.supabase.url, config.supabase.serviceKey)
  : null;

/**
 * Send an email verification link to the user.
 * Uses Supabase Auth's built-in email sending when available,
 * falls back to console logging for development.
 */
export async function sendVerificationEmail(
  email: string,
  token: string,
  firstName: string
): Promise<void> {
  const frontendUrl = config.corsOrigins[0] || "http://localhost:5173";
  const verifyUrl = `${frontendUrl}/verify-email?token=${token}`;

  // In production with Supabase configured, use Supabase Auth email
  if (supabase && config.supabase.url) {
    try {
      // Use Supabase's built-in auth email functionality
      // This leverages Supabase's email templates and SMTP configuration
      const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
        data: { verification_token: token, first_name: firstName },
        redirectTo: verifyUrl,
      });

      if (error) {
        logger.warn(`Supabase email failed, logging to console: ${error.message}`);
        logVerificationEmail(email, verifyUrl, firstName);
        return;
      }

      logger.info(`Verification email sent to ${email} via Supabase`);
      return;
    } catch (err) {
      logger.warn(`Supabase email error, falling back to console: ${err}`);
    }
  }

  // Fallback: log to console (development mode)
  logVerificationEmail(email, verifyUrl, firstName);
}

function logVerificationEmail(email: string, verifyUrl: string, firstName: string): void {
  logger.info("═══════════════════════════════════════════════════");
  logger.info("  EMAIL VERIFICATION (Dev Mode - Console Output)");
  logger.info("═══════════════════════════════════════════════════");
  logger.info(`  To: ${email}`);
  logger.info(`  Subject: Verify your InternTrack email, ${firstName}!`);
  logger.info(`  Body:`);
  logger.info(`    Hi ${firstName},`);
  logger.info(`    Please verify your email by clicking the link below:`);
  logger.info(`    ${verifyUrl}`);
  logger.info(`    This link expires in 24 hours.`);
  logger.info("═══════════════════════════════════════════════════");
}
