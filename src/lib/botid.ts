/**
 * BotID utility functions using official @vercel/botid package
 */

import { checkBotId } from "botid/server";

// BotID verification result interface
export interface BotIdResult {
  isBot: boolean;
  score?: number;
  riskLevel?: "low" | "medium" | "high";
  error?: string;
}

// Check if BotID should be enabled (always true when deployed to Vercel)
export const isBotIdEnabled = (): boolean => {
  return process.env.NODE_ENV === "production" && process.env.VERCEL === "1";
};

// Verify BotID on server-side using official API
export const verifyBotId = async (): Promise<BotIdResult> => {
  try {
    // In development, always allow
    if (process.env.NODE_ENV !== "production") {
      return {
        isBot: false,
        score: 1.0,
        riskLevel: "low",
      };
    }

    // Use official BotID server-side check
    const result = await checkBotId();

    // Calculate score based on bot detection result
    const score = result.isHuman ? 1.0 : result.isBot ? 0.0 : 0.5;

    return {
      isBot: result.isBot,
      score: score,
      riskLevel: getRiskLevel(score),
    };
  } catch (error) {
    console.error("BotID verification failed:", error);
    return {
      isBot: false, // Default to allowing in case of error
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Get BotID risk level based on score
export const getRiskLevel = (score: number): "low" | "medium" | "high" => {
  if (score >= 0.8) return "low";
  if (score >= 0.5) return "medium";
  return "high";
};

// BotID configuration (no environment variables needed)
export const getBotIdConfig = () => {
  return {
    enabled: isBotIdEnabled(),
    environment: process.env.NODE_ENV as "development" | "production",
    isVercel: process.env.VERCEL === "1",
  };
};
