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
    const emailHtml = getEmailTemplate({
      template: "welcome",
      data: {
        title: "Welcome to Boiler.click!",
        content: "",
        userName: firstName,
        buttonText: "Get Started",
        buttonUrl: config.site.url,
      },
    });

    await sendEmail({
      to,
      subject: "Welcome to Boiler.click!",
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
    const emailHtml = getEmailTemplate({
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
      subject: "Verify Your Email for Boiler.click",
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
    const emailHtml = getEmailTemplate({
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
      subject: "Reset Your Boiler.click Password",
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
    const emailHtml = getEmailTemplate(templateOptions);

    await sendEmail({
      to,
      subject,
      html: emailHtml,
    });
  },
};
