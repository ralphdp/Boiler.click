export const config = {
  // Environment
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isMaintenance: process.env.MAINTENANCE_MODE === "true",

  // Site Configuration
  site: {
    title: process.env.NEXT_PUBLIC_SITE_TITLE || "Boiler™",
    url:
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_PRODUCTION_SITE_URL || "https://boiler.click"
        : process.env.NEXT_PUBLIC_DEVELOPMENT_SITE_URL ||
          `http://localhost:${process.env.NEXT_PUBLIC_PORT_FRONTEND || "3000"}`,
    email: process.env.NEXT_PUBLIC_SITE_EMAIL_SUPPORT || "hi@boiler.click",
    address: process.env.NEXT_PUBLIC_SITE_PHYSICAL_ADDRESS || "123 Oak St.",
    telephone: process.env.NEXT_PUBLIC_SITE_TELEPHONE || "+18885551234",
  },

  // Social Media
  social: {
    github: process.env.NEXT_PUBLIC_SOCIAL_GITHUB || "",
    x: process.env.NEXT_PUBLIC_SOCIAL_X || "",
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "",
    youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || "",
  },

  // Analytics
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  },

  // Database
  database: {
    local: process.env.DATABASE_LOCAL_URL || "",
    remote: process.env.DATABASE_REMOTE_URL || "",
    // Use remote in production, local in development
    url:
      process.env.NODE_ENV === "production"
        ? process.env.DATABASE_REMOTE_URL ||
          process.env.DATABASE_LOCAL_URL ||
          ""
        : process.env.DATABASE_LOCAL_URL ||
          process.env.DATABASE_REMOTE_URL ||
          "",
  },
  redis: {
    local: process.env.REDIS_LOCAL_URL || "",
    remote: process.env.REDIS_REMOTE_URL || "",
    // Use remote in production, local in development
    url:
      process.env.NODE_ENV === "production"
        ? process.env.REDIS_REMOTE_URL || process.env.REDIS_LOCAL_URL || ""
        : process.env.REDIS_LOCAL_URL || process.env.REDIS_REMOTE_URL || "",
  },

  // Authentication
  auth: {
    jwtSecret: process.env.JWT_SECRET || "",
    sessionSecret: process.env.SESSION_SECRET || "",
    superAdminEmails:
      process.env.AUTH_SUPER_ADMIN?.split(",").map((e) => e.trim()) || [],
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    },
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID || "",
      clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
    },
  },

  // Payment Processing
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  },

  // Email
  email: {
    resendApiKey: process.env.RESEND_API_KEY || "",
    fromEmail: process.env.RESEND_FROM_EMAIL || "hi@boiler.click",
  },
};

// Validation helpers
export const isConfigured = (key: keyof typeof config): boolean => {
  const value = config[key];
  if (typeof value === "object" && value !== null) {
    return Object.values(value).some((v) => v && v !== "");
  }
  return Boolean(value);
};

// Feature flags
export const features = {
  analytics: isConfigured("analytics"),
  database: isConfigured("database"),
  redis: isConfigured("redis"),
  auth: isConfigured("auth"),
  stripe: isConfigured("stripe"),
  email: isConfigured("email"),
};

// Features are already exported above
