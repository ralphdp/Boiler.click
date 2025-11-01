import speakeasy from "speakeasy";
import QRCode from "qrcode";
import crypto from "crypto";
import { config } from "@/lib/config";
import { getRedisClient } from "@/lib/redis";

/**
 * Generate a TOTP secret for a user
 */
export function generateTotpSecret(email: string): { secret: string; uri: string } {
  const secret = speakeasy.generateSecret({
    length: 32,
    name: `Boiler™ (${email})`,
    issuer: "Boiler™",
  });

  return {
    secret: secret.base32 || "",
    uri: secret.otpauth_url || "",
  };
}

/**
 * Generate QR code data URL from TOTP URI
 */
export async function generateQRCode(uri: string): Promise<string> {
  try {
    const dataURL = await QRCode.toDataURL(uri);
    return dataURL;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
}

/**
 * Verify a TOTP code
 */
export function verifyTotpCode(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 2, // Allow for 2 time steps (60 seconds) of clock drift
  });
}

/**
 * Generate backup codes
 */
export function generateBackupCodes(count: number = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    // Generate a random 8-character code
    const code = crypto.randomBytes(4).toString("hex").toUpperCase();
    codes.push(code);
  }
  return codes;
}

/**
 * Verify an email OTP (simple 6-digit code)
 */
export function generateEmailOTP(): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
}

/**
 * Verify email OTP (simple string comparison)
 */
export function verifyEmailOTP(expectedCode: string, providedCode: string): boolean {
  return expectedCode === providedCode;
}

/**
 * Store temporary OTP in memory (or use Redis in production)
 * This is a simple in-memory cache for development
 */
const otpCache = new Map<string, { code: string; expiresAt: number }>();

export async function storeOTP(email: string, code: string, expiryMinutes: number = 5): Promise<void> {
  const redis = getRedisClient();
  
  if (redis) {
    // Use Redis for storage
    const key = `otp:${email}`;
    await redis.setex(key, expiryMinutes * 60, code);
  } else {
    // Fallback to in-memory storage
    const expiresAt = Date.now() + expiryMinutes * 60 * 1000;
    otpCache.set(email, { code, expiresAt });

    // Clean up expired OTPs
    setTimeout(() => {
      otpCache.delete(email);
    }, expiryMinutes * 60 * 1000);
  }
}

export async function getOTP(email: string): Promise<string | null> {
  const redis = getRedisClient();
  
  if (redis) {
    // Use Redis for retrieval
    const key = `otp:${email}`;
    return await redis.get(key);
  } else {
    // Fallback to in-memory storage
    const stored = otpCache.get(email);
    if (!stored) {
      return null;
    }

    if (Date.now() > stored.expiresAt) {
      otpCache.delete(email);
      return null;
    }

    return stored.code;
  }
}

export async function clearOTP(email: string): Promise<void> {
  const redis = getRedisClient();
  
  if (redis) {
    // Use Redis for deletion
    const key = `otp:${email}`;
    await redis.del(key);
  } else {
    // Fallback to in-memory storage
    otpCache.delete(email);
  }
}

// In-memory store for 2FA login sessions (fallback if Redis not available)
const loginSessionCache = new Map<string, { userId: string; method: string; expiresAt: number }>();

/**
 * Store a temporary login session for 2FA verification
 */
export async function store2FALoginSession(sessionId: string, userId: string, method: string, expiryMinutes: number = 10): Promise<void> {
  const redis = getRedisClient();
  
  if (redis) {
    // Use Redis for storage
    const key = `2fa_login:${sessionId}`;
    const data = JSON.stringify({ userId, method });
    await redis.setex(key, expiryMinutes * 60, data);
  } else {
    // Fallback to in-memory storage
    const expiresAt = Date.now() + expiryMinutes * 60 * 1000;
    loginSessionCache.set(sessionId, { userId, method, expiresAt });

    // Clean up expired sessions
    setTimeout(() => {
      loginSessionCache.delete(sessionId);
    }, expiryMinutes * 60 * 1000);
  }
}

/**
 * Retrieve and delete a 2FA login session
 */
export async function getAndDelete2FALoginSession(sessionId: string): Promise<{ userId: string; method: string } | null> {
  const redis = getRedisClient();
  
  if (redis) {
    // Use Redis for retrieval
    const key = `2fa_login:${sessionId}`;
    const data = await redis.get(key);
    if (data) {
      await redis.del(key); // Delete after retrieval
      return JSON.parse(data);
    }
    return null;
  } else {
    // Fallback to in-memory storage
    const stored = loginSessionCache.get(sessionId);
    if (!stored) {
      return null;
    }

    if (Date.now() > stored.expiresAt) {
      loginSessionCache.delete(sessionId);
      return null;
    }

    loginSessionCache.delete(sessionId);
    return { userId: stored.userId, method: stored.method };
  }
}

