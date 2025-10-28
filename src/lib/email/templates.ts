import { config } from "@/lib/config";

export interface EmailTemplateData {
  title: string;
  content: string;
  buttonText?: string;
  buttonUrl?: string;
  footerText?: string;
  userName?: string;
}

export interface EmailTemplateOptions {
  template: "welcome" | "verification" | "reset" | "notification";
  data: EmailTemplateData;
}

/**
 * Base email template with consistent styling
 */
// In src/lib/email/templates.ts, update the getBaseTemplate function:

function getBaseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Boiler.click</title>
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
        <h1>Boiler.click</h1>
        <p class="subtitle">Full-Stack SaaS Boilerplate</p>
      </div>
      
      <!-- Content -->
      <div class="content">
        ${content}
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <p>© ${new Date().getFullYear()} Boiler.click. All rights reserved.</p>
        <p>
          <a href="${config.site.url}">Visit our website</a> | 
          <a href="${config.site.url}/support">Support</a> | 
          <a href="${config.site.url}/legal">Legal</a>
        </p>
        <div class="social-links">
          ${config.social.github ? `<a href="${config.social.github}">GitHub</a>` : ""}
          ${config.social.x ? `<a href="${config.social.x}">X (Twitter)</a>` : ""}
          ${config.social.facebook ? `<a href="${config.social.facebook}">Facebook</a>` : ""}
          ${config.social.youtube ? `<a href="${config.social.youtube}">YouTube</a>` : ""}
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
export function getWelcomeTemplate(data: EmailTemplateData): string {
  const content = `
    <h2>Welcome to Boiler.click!</h2>
    <p>Hi ${data.userName || "there"},</p>
    <p>Welcome to Boiler.click! Your account has been successfully created and you're now part of our community.</p>
    <p>You can now start using all the features of our platform to build amazing SaaS applications.</p>
    <div class="button-container">
      <a href="${data.buttonUrl || config.site.url}" class="button">Get Started</a>
    </div>
    <p>If you have any questions, feel free to reach out to our support team.</p>
  `;

  return getBaseTemplate(content);
}

/**
 * Email verification template
 */
export function getVerificationTemplate(data: EmailTemplateData): string {
  const content = `
    <h2>Verify Your Email Address</h2>
    <p>Hi ${data.userName || "there"},</p>
    <p>Thank you for signing up! To complete your registration, please verify your email address by clicking the button below.</p>
    <div class="button-container">
      <a href="${data.buttonUrl}" class="button">${data.buttonText || "Verify Email"}</a>
    </div>
    <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
    <p style="word-break: break-all; background-color: #f3f4f6; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 14px;">${data.buttonUrl}</p>
    <p><strong>This link will expire in 24 hours.</strong></p>
    <p>If you didn't create an account with us, please ignore this email.</p>
  `;

  return getBaseTemplate(content);
}

/**
 * Password reset template
 */
export function getResetPasswordTemplate(data: EmailTemplateData): string {
  const content = `
    <h2>Reset Your Password</h2>
    <p>Hi ${data.userName || "there"},</p>
    <p>You requested to reset your password. Click the button below to create a new password.</p>
    <div class="button-container">
      <a href="${data.buttonUrl}" class="button">${data.buttonText || "Reset Password"}</a>
    </div>
    <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
    <p style="word-break: break-all; background-color: #f3f4f6; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 14px;">${data.buttonUrl}</p>
    <p><strong>This link will expire in 1 hour.</strong></p>
    <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
  `;

  return getBaseTemplate(content);
}

/**
 * General notification template
 */
export function getNotificationTemplate(data: EmailTemplateData): string {
  const content = `
    <h2>${data.title}</h2>
    <p>Hi ${data.userName || "there"},</p>
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

  return getBaseTemplate(content);
}

/**
 * Get email template based on type
 */
export function getEmailTemplate(options: EmailTemplateOptions): string {
  switch (options.template) {
    case "welcome":
      return getWelcomeTemplate(options.data);
    case "verification":
      return getVerificationTemplate(options.data);
    case "reset":
      return getResetPasswordTemplate(options.data);
    case "notification":
      return getNotificationTemplate(options.data);
    default:
      return getNotificationTemplate(options.data);
  }
}
