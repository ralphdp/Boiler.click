#!/usr/bin/env node

/**
 * Environment Setup Script
 * Sets DATABASE_URL based on NODE_ENV
 */

const fs = require("fs");
const path = require("path");

// On Vercel, skip this script - environment variables are set in Vercel dashboard
if (process.env.VERCEL === "1") {
  console.log(
    "✅ Skipping setup-env.js on Vercel (using environment variables from dashboard)"
  );
  process.exit(0);
}

// Load .env file manually
const envPath = path.join(process.cwd(), ".env");
let envVars = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  const lines = envContent.split("\n");

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith("#")) {
      const [key, ...valueParts] = trimmedLine.split("=");
      if (key && valueParts.length > 0) {
        let value = valueParts.join("=");
        // Remove quotes if present
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        envVars[key] = value;
      }
    }
  }
}

// Determine which database URL to use
const isProduction = process.env.NODE_ENV === "production";
const databaseUrl = isProduction
  ? envVars.DATABASE_REMOTE_URL || envVars.DATABASE_LOCAL_URL
  : envVars.DATABASE_LOCAL_URL || envVars.DATABASE_REMOTE_URL;

if (!databaseUrl) {
  console.error("❌ No database URL found in environment variables");
  console.error(
    "Please set DATABASE_LOCAL_URL and/or DATABASE_REMOTE_URL in your .env file"
  );
  console.error("Available variables:", Object.keys(envVars));
  process.exit(1);
}

// Update or add DATABASE_URL
let envContent = "";
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, "utf8");
}

const lines = envContent.split("\n");
let foundDatabaseUrl = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith("DATABASE_URL=")) {
    lines[i] = `DATABASE_URL="${databaseUrl}"`;
    foundDatabaseUrl = true;
    break;
  }
}

if (!foundDatabaseUrl) {
  lines.push(`DATABASE_URL="${databaseUrl}"`);
}

// Write updated .env file
const updatedContent = lines.join("\n");
fs.writeFileSync(envPath, updatedContent);

// Also set as environment variable for this process
process.env.DATABASE_URL = databaseUrl;

console.log(
  `✅ DATABASE_URL set to ${isProduction ? "remote" : "local"} database`
);
console.log(`📍 Using: ${databaseUrl.substring(0, 50)}...`);
