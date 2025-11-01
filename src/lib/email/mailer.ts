import { Resend } from "resend";
import { config } from "@/lib/config";
import { getEmailTemplate, EmailTemplateOptions } from "./templates";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const resend = new Resend(config.email.resendApiKey);

/**
 * Sends an email using Resend API.
 * @param options Email options (to, subject, html).
 */
async function sendEmail(options: EmailOptions) {
  if (!config.email.resendApiKey) {
    console.warn(
      "Resend API key not configured. Skipping email send to:",
      options.to
    );
    return;
  }
  try {
    const { data, error } = await resend.emails.send({
      from: config.email.fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error(`Resend API error for ${options.to}:`, error);

      // Handle domain verification error gracefully
      if (
        error.statusCode === 403 &&
        error.message?.includes("domain is not verified")
      ) {
        console.warn(
          `Domain not verified in Resend. Email to ${options.to} skipped.`
        );
        console.warn("Please verify your domain at https://resend.com/domains");
        return; // Don't throw error, just skip sending
      }

      throw new Error("Failed to send email.");
    }

    console.log(
      `Email sent to ${options.to} with subject: ${options.subject}`,
      data
    );
  } catch (error) {
    console.error(`Failed to send email to ${options.to}:`, error);

    // Handle domain verification error gracefully
    if (
      error instanceof Error &&
      error.message.includes("domain is not verified")
    ) {
      console.warn(
        `Domain not verified in Resend. Email to ${options.to} skipped.`
      );
      console.warn("Please verify your domain at https://resend.com/domains");
      return; // Don't throw error, just skip sending
    }

    throw new Error("Failed to send email.");
  }
}

export const emailService = {
  /**
   * Sends a welcome email to a new user.
   * @param to The recipient's email address.
   * @param firstName The recipient's first name.
   */
  sendWelcomeEmail: async (to: string, firstName: string) => {
    const emailHtml = await getEmailTemplate({
      template: "welcome",
      data: {
        title: "Welcome to Boiler™!",
        content: "",
        userName: firstName,
        buttonText: "Get Started",
        buttonUrl: config.site.url,
      },
    });

    await sendEmail({
      to,
      subject: "Welcome to Boiler™!",
      html: emailHtml,
    });
  },

  /**
   * Sends an email verification link.
   * @param to The recipient's email address.
   * @param verificationLink The verification URL.
   * @param firstName The recipient's first name (optional).
   */
  sendVerificationEmail: async (
    to: string,
    verificationLink: string,
    firstName?: string
  ) => {
    const emailHtml = await getEmailTemplate({
      template: "verification",
      data: {
        title: "Verify Your Email",
        content: "",
        userName: firstName,
        buttonText: "Verify Email",
        buttonUrl: verificationLink,
      },
    });

    await sendEmail({
      to,
      subject: "Verify Your Email for Boiler™",
      html: emailHtml,
    });
  },

  /**
   * Sends a password reset link.
   * @param to The recipient's email address.
   * @param resetLink The password reset URL.
   * @param firstName The recipient's first name (optional).
   */
  sendResetPasswordEmail: async (
    to: string,
    resetLink: string,
    firstName?: string
  ) => {
    const emailHtml = await getEmailTemplate({
      template: "reset",
      data: {
        title: "Reset Your Password",
        content: "",
        userName: firstName,
        buttonText: "Reset Password",
        buttonUrl: resetLink,
      },
    });

    await sendEmail({
      to,
      subject: "Reset Your Boiler™ Password",
      html: emailHtml,
    });
  },

  /**
   * Sends a custom notification email.
   * @param to The recipient's email address.
   * @param subject The email subject.
   * @param templateOptions The template options.
   */
  sendNotificationEmail: async (
    to: string,
    subject: string,
    templateOptions: EmailTemplateOptions
  ) => {
    const emailHtml = await getEmailTemplate(templateOptions);

    await sendEmail({
      to,
      subject,
      html: emailHtml,
    });
  },

  /**
   * Sends a 2FA code email.
   * @param to The recipient's email address.
   * @param code The 6-digit verification code.
   * @param firstName The recipient's first name (optional).
   */
  send2FACodeEmail: async (to: string, code: string, firstName?: string) => {
    const emailHtml = await getEmailTemplate({
      template: "notification",
      data: {
        title: "Your Security Code",
        content: `
          <p style="font-size: 16px; margin: 24px 0;">Use this code to complete your sign-in:</p>
          <div style="text-align: center; margin: 32px 0;">
            <div style="display: inline-block; background-color: #f3f4f6; padding: 16px 24px; border-radius: 8px; font-family: monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #1f2937;">
              ${code}
            </div>
          </div>
          <p style="font-size: 14px; color: #6b7280;">This code will expire in 5 minutes. If you didn't request this code, please ignore this email.</p>
        `,
        userName: firstName,
      },
    });

    await sendEmail({
      to,
      subject: "Your Boiler™ Security Code",
      html: emailHtml,
    });
  },
};
