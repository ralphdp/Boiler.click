import { config } from "@/lib/config";
import { getTranslations, getTranslationValue } from "@/lib/utils";

export interface EmailTemplateData {
  title: string;
  content: string;
  buttonText?: string;
  buttonUrl?: string;
  footerText?: string;
  userName?: string;
  totpCode?: string;
  backupCodes?: string[];
}

export interface EmailTemplateOptions {
  template: "welcome" | "verification" | "reset" | "notification";
  data: EmailTemplateData;
}

/**
 * Base email template with consistent styling
 */
// In src/lib/email/templates.ts, update the getBaseTemplate function:

async function getBaseTemplate(
  content: string,
  lang: string = "en"
): Promise<string> {
  const messages = await getTranslations(lang);
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Boiler&trade;</title>
  <style>
  /* Reset styles */
  body, table, td, p, a, li, blockquote {
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
  table, td {
    mso-table-lspace: 0pt;
    mso-table-rspace: 0pt;
  }
  img {
    -ms-interpolation-mode: bicubic;
  }
  
  /* Base styles */
  body {
    margin: 0;
    padding: 0;
    width: 100% !important;
    min-width: 100%;
    height: 100%;
    background-color: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #374151 !important; /* Force text color */
  }
  
  .email-container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 12px; /* Show rounded corners in browser */
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* Show shadow in browser */
    border: 1px solid #e5e7eb;
  }
  
  .header {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    padding: 32px 24px;
    text-align: center;
  }
  
  .header h1 {
    margin: 0;
    color: #ffffff !important; /* Force white text */
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.025em;
  }
  
  .header .subtitle {
    margin: 8px 0 0 0;
    color: #e0e7ff !important; /* Force light text */
    font-size: 16px;
    font-weight: 400;
  }
  
  .content {
    padding: 40px 32px;
  }
  
  .content h2 {
    margin: 0 0 16px 0;
    color: #1f2937 !important; /* Force dark text */
    font-size: 24px;
    font-weight: 600;
    line-height: 1.3;
  }
  
  .content p {
    margin: 0 0 16px 0;
    color: #4b5563 !important; /* Force text color */
    font-size: 16px;
    line-height: 1.6;
  }
  
  .content p:last-child {
    margin-bottom: 0;
  }
  
  .button-container {
    text-align: center;
    margin: 32px 0;
  }
  
  .button {
    display: inline-block;
    padding: 14px 28px;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: #ffffff !important;
    text-decoration: none;
    border-radius: 8px; /* Show rounded corners in browser */
    font-weight: 600;
    font-size: 16px;
    transition: all 0.2s ease;
    box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.3); /* Show shadow in browser */
    border: 2px solid #7c3aed;
  }

  .button:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    color: #ffffff !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 8px -1px rgba(139, 92, 246, 0.4);
    border-color: #6d28d9;
  }
  
  .divider {
    height: 1px;
    background-color: #e5e7eb;
    margin: 32px 0;
  }
  
  .footer {
    background-color: #f9fafb;
    padding: 24px 32px;
    text-align: center;
    border-top: 1px solid #e5e7eb;
  }
  
  .footer p {
    margin: 0 0 8px 0;
    color: #6b7280 !important; /* Force text color */
    font-size: 14px;
  }
  
  .footer p:last-child {
    margin-bottom: 0;
  }
  
  .footer a {
    color: #8b5cf6 !important; /* Force link color */
    text-decoration: none;
  }
  
  .footer a:hover {
    text-decoration: underline;
  }
  
  .social-links {
    margin: 16px 0 0 0;
  }
  
  .social-links a {
    display: inline-block;
    margin: 0 8px;
    color: #6b7280 !important; /* Force text color */
    text-decoration: none;
    font-size: 14px;
  }
  
  .social-links a:hover {
    color: #8b5cf6 !important;
  }
  
  /* iOS Mail compatibility overrides - more specific targeting */
@supports (-webkit-appearance: none) and (not (display: -webkit-box)) {
  .email-container {
    border-radius: 0 !important;
    box-shadow: none !important;
  }
  
  .button {
    border-radius: 0 !important;
    box-shadow: none !important;
  }
}

/* iOS Mail specific fixes - only for actual iOS devices */
@media screen and (-webkit-min-device-pixel-ratio: 0) and (max-device-width: 1024px) and (-webkit-touch-callout: none) {
  .email-container {
    border-radius: 0 !important;
    box-shadow: none !important;
  }
  
  .button {
    border-radius: 0 !important;
    box-shadow: none !important;
  }
}

/* Alternative iOS Mail detection using user agent targeting */
@media screen and (-webkit-min-device-pixel-ratio: 0) and (max-width: 768px) and (orientation: portrait) {
  .email-container {
    border-radius: 0 !important;
    box-shadow: none !important;
  }
  
  .button {
    border-radius: 0 !important;
    box-shadow: none !important;
  }
}
  
  /* Responsive styles */
  @media only screen and (max-width: 600px) {
    .email-container {
      margin: 0;
      border-radius: 0;
    }
    
    .header {
      padding: 24px 16px;
    }
    
    .header h1 {
      font-size: 24px;
    }
    
    .content {
      padding: 24px 16px;
    }
    
    .content h2 {
      font-size: 20px;
    }
    
    .footer {
      padding: 16px;
    }
  }
</style>
</head>
<body>
  <div style="padding: 20px 0;">
    <div class="email-container">
      <!-- Header -->
      <div class="header">
        <h1>Boiler&trade;</h1>
        <p class="subtitle">Full-Stack SaaS Boilerplate</p>
      </div>
      
      <!-- Content -->
      <div class="content">
        ${content}
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <p>${getTranslationValue(messages, "email.templates.common.footer").replace("{year}", new Date().getFullYear().toString())}</p>
        <p>
          <a href="${config.site.url}">${getTranslationValue(messages, "email.templates.common.visitWebsite")}</a> | 
          <a href="${config.site.url}/support">${getTranslationValue(messages, "email.templates.common.support")}</a> | 
          <a href="${config.site.url}/legal">${getTranslationValue(messages, "email.templates.common.legal")}</a>
        </p>
        <div class="social-links">
          ${config.social.github ? `<a href="${config.social.github}">${getTranslationValue(messages, "email.templates.common.github")}</a>` : ""}
          ${config.social.x ? `<a href="${config.social.x}">${getTranslationValue(messages, "email.templates.common.twitter")}</a>` : ""}
          ${config.social.facebook ? `<a href="${config.social.facebook}">${getTranslationValue(messages, "email.templates.common.facebook")}</a>` : ""}
          ${config.social.youtube ? `<a href="${config.social.youtube}">${getTranslationValue(messages, "email.templates.common.youtube")}</a>` : ""}
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Welcome email template
 */
export async function getWelcomeTemplate(
  data: EmailTemplateData,
  lang: string = "en"
): Promise<string> {
  const messages = await getTranslations(lang);

  const content = `
    <h2>${getTranslationValue(messages, "email.templates.welcome.title")}</h2>
    <p>${getTranslationValue(messages, "email.templates.welcome.greeting").replace("{userName}", data.userName || "there")}</p>
    <p>${getTranslationValue(messages, "email.templates.welcome.message")}</p>
    <p>${getTranslationValue(messages, "email.templates.welcome.action")}</p>
    <div class="button-container">
      <a href="${data.buttonUrl || config.site.url}" class="button">${getTranslationValue(messages, "email.templates.welcome.buttonText")}</a>
    </div>
    <p>${getTranslationValue(messages, "email.templates.welcome.support")}</p>
  `;

  return await getBaseTemplate(content, lang);
}

/**
 * Email verification template
 */
export async function getVerificationTemplate(
  data: EmailTemplateData,
  lang: string = "en"
): Promise<string> {
  const messages = await getTranslations(lang);

  const content = `
    <h2>${getTranslationValue(messages, "email.templates.verification.title")}</h2>
    <p>${getTranslationValue(messages, "email.templates.verification.greeting").replace("{userName}", data.userName || "there")}</p>
    <p>${getTranslationValue(messages, "email.templates.verification.message")}</p>
    <div class="button-container">
      <a href="${data.buttonUrl}" class="button">${data.buttonText || getTranslationValue(messages, "email.templates.verification.buttonText")}</a>
    </div>
    <p>${getTranslationValue(messages, "email.templates.verification.alternativeText")}</p>
    <p style="word-break: break-all; background-color: #f3f4f6; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 14px;">${data.buttonUrl}</p>
    <p><strong>${getTranslationValue(messages, "email.templates.verification.expiry")}</strong></p>
    <p>${getTranslationValue(messages, "email.templates.verification.ignoreText")}</p>
  `;

  return await getBaseTemplate(content, lang);
}

/**
 * Password reset template
 */
export async function getResetPasswordTemplate(
  data: EmailTemplateData,
  lang: string = "en"
): Promise<string> {
  const messages = await getTranslations(lang);

  const content = `
    <h2>${getTranslationValue(messages, "email.templates.resetPassword.title")}</h2>
    <p>${getTranslationValue(messages, "email.templates.resetPassword.greeting").replace("{userName}", data.userName || "there")}</p>
    <p>${getTranslationValue(messages, "email.templates.resetPassword.message")}</p>
    <div class="button-container">
      <a href="${data.buttonUrl}" class="button">${data.buttonText || getTranslationValue(messages, "email.templates.resetPassword.buttonText")}</a>
    </div>
    <p>${getTranslationValue(messages, "email.templates.resetPassword.alternativeText")}</p>
    <p style="word-break: break-all; background-color: #f3f4f6; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 14px;">${data.buttonUrl}</p>
    <p><strong>${getTranslationValue(messages, "email.templates.resetPassword.expiry")}</strong></p>
    <p>${getTranslationValue(messages, "email.templates.resetPassword.ignoreText")}</p>
  `;

  return await getBaseTemplate(content, lang);
}

/**
 * General notification template
 */
export async function getNotificationTemplate(
  data: EmailTemplateData,
  lang: string = "en"
): Promise<string> {
  const messages = await getTranslations(lang);

  const content = `
    <h2>${data.title}</h2>
    <p>${getTranslationValue(messages, "email.templates.notification.greeting").replace("{userName}", data.userName || "there")}</p>
    ${data.content}
    ${
      data.buttonText && data.buttonUrl
        ? `
      <div class="button-container">
        <a href="${data.buttonUrl}" class="button">${data.buttonText}</a>
      </div>
    `
        : ""
    }
    ${data.footerText ? `<p>${data.footerText}</p>` : ""}
  `;

  return await getBaseTemplate(content, lang);
}

/**
 * Get email template based on type
 */
export async function getEmailTemplate(
  options: EmailTemplateOptions,
  lang: string = "en"
): Promise<string> {
  switch (options.template) {
    case "welcome":
      return await getWelcomeTemplate(options.data, lang);
    case "verification":
      return await getVerificationTemplate(options.data, lang);
    case "reset":
      return await getResetPasswordTemplate(options.data, lang);
    case "notification":
      return await getNotificationTemplate(options.data, lang);
    default:
      return await getNotificationTemplate(options.data, lang);
  }
}
