import { getEmailTemplate, EmailTemplateOptions } from "./templates";

/**
 * Email preview utility for development
 * This allows you to preview email templates in the browser
 */
export async function previewEmailTemplate(
  template: "welcome" | "verification" | "reset" | "notification",
  data: any
) {
  const options: EmailTemplateOptions = {
    template,
    data: {
      title: data.title || "Email Preview",
      content: data.content || "This is a preview of the email template.",
      userName: data.userName || "John Doe",
      buttonText: data.buttonText || "Click Here",
      buttonUrl: data.buttonUrl || "#",
      footerText: data.footerText || "This is a preview email.",
    },
  };

  return await getEmailTemplate(options);
}

/**
 * Generate preview HTML for all email templates
 */
export async function generateEmailPreviews() {
  const previews = {
    welcome: await previewEmailTemplate("welcome", {
      userName: "John Doe",
      buttonText: "Get Started",
      buttonUrl: "https://boiler.click",
    }),
    verification: await previewEmailTemplate("verification", {
      userName: "John Doe",
      buttonText: "Verify Email",
      buttonUrl: "https://boiler.click/verify-email?token=abc123",
    }),
    reset: await previewEmailTemplate("reset", {
      userName: "John Doe",
      buttonText: "Reset Password",
      buttonUrl: "https://boiler.click/reset-password?token=abc123",
    }),
    notification: await previewEmailTemplate("notification", {
      title: "Account Update",
      content:
        "Your account has been updated successfully. Here are the changes that were made.",
      userName: "John Doe",
      buttonText: "View Account",
      buttonUrl: "https://boiler.click/account",
      footerText: "If you have any questions, please contact support.",
    }),
  };

  return previews;
}
