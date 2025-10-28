#!/usr/bin/env node

/**
 * OAuth Redirect URI Generator
 * Generates the correct redirect URIs for OAuth providers based on environment
 */

const config = {
  development:
    process.env.NEXT_PUBLIC_DEVELOPMENT_SITE_URL?.replace(/\/$/, "") ||
    `http://localhost:${process.env.NEXT_PUBLIC_PORT_FRONTEND || "3000"}`,
  production:
    process.env.NEXT_PUBLIC_PRODUCTION_SITE_URL?.replace(/\/$/, "") ||
    "https://boiler.click",
};

const providers = ["google", "github", "discord", "facebook", "twitter"];

console.log("🔗 OAuth Redirect URIs Configuration\n");

console.log("📋 Copy these URIs to your OAuth provider settings:\n");

providers.forEach((provider) => {
  console.log(`🔸 ${provider.toUpperCase()}:`);
  console.log(
    `   Development: ${config.development}/api/auth/${provider}/callback`
  );
  console.log(
    `   Production:  ${config.production}/api/auth/${provider}/callback`
  );
  console.log("");
});

console.log("📝 Instructions:");
console.log("1. Go to your OAuth provider's developer console");
console.log("2. Find your app/application settings");
console.log("3. Add the redirect URIs above to the allowed list");
console.log("4. Save the changes");
console.log("");

console.log("⚠️  Important:");
console.log("- Make sure the URIs match exactly (including http/https)");
console.log("- Use separate OAuth apps for development and production");
console.log("- Never commit OAuth secrets to version control");
console.log("");

console.log("🌐 Current Environment:");
console.log(`   NODE_ENV: ${process.env.NODE_ENV || "development"}`);
console.log(
  `   Site URL: ${process.env.NODE_ENV === "production" ? config.production : config.development}`
);
