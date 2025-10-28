#!/usr/bin/env node

/**
 * Add Node.js runtime configuration to all API routes that use Prisma
 */

const fs = require("fs");
const path = require("path");

const apiFiles = [
  "src/app/api/auth/github/callback/route.ts",
  "src/app/api/auth/google/callback/route.ts",
  "src/app/api/account/change-password/route.ts",
  "src/app/api/auth/resend-verification/route.ts",
  "src/app/api/auth/forgot-password/route.ts",
  "src/app/api/auth/register/route.ts",
  "src/app/api/auth/change-password/route.ts",
  "src/app/api/auth/me/route.ts",
  "src/app/api/auth/profile/route.ts",
  "src/app/api/auth/verify-email/route.ts",
  "src/app/api/auth/reset-password/route.ts",
  "src/app/api/auth/login/route.ts",
  "src/app/api/account/profile/route.ts",
];

function addRuntimeConfig(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");

  // Check if runtime is already configured
  if (content.includes("export const runtime = 'nodejs'")) {
    console.log(`✅ Already configured: ${filePath}`);
    return;
  }

  // Check if file uses PrismaClient
  if (!content.includes("PrismaClient")) {
    console.log(`⏭️  Skipping (no Prisma): ${filePath}`);
    return;
  }

  // Add runtime configuration after imports
  const lines = content.split("\n");
  let insertIndex = -1;

  // Find the last import statement
  for (let i = 0; i < lines.length; i++) {
    if (
      lines[i].startsWith("import ") ||
      (lines[i].startsWith("const ") && lines[i].includes("require"))
    ) {
      insertIndex = i;
    }
  }

  if (insertIndex === -1) {
    console.log(`❌ Could not find import section in: ${filePath}`);
    return;
  }

  // Insert runtime configuration
  lines.splice(
    insertIndex + 1,
    0,
    "",
    "// Force Node.js runtime for Prisma compatibility",
    "export const runtime = 'nodejs';"
  );

  const newContent = lines.join("\n");
  fs.writeFileSync(filePath, newContent);
  console.log(`✅ Updated: ${filePath}`);
}

console.log("🔧 Adding Node.js runtime configuration to API routes...\n");

apiFiles.forEach(addRuntimeConfig);

console.log("\n🎉 Runtime configuration complete!");
