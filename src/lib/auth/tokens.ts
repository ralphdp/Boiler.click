import jwt from "jsonwebtoken";
import { config } from "@/lib/config";

interface TokenPayload {
  userId: string;
  email: string;
  type: "verification" | "reset";
}

const JWT_SECRET = config.auth.jwtSecret;

if (!JWT_SECRET) {
  console.error("JWT_SECRET is not defined in environment variables.");
}

/**
 * Generates a JWT token for email verification.
 * @param userId The ID of the user.
 * @param email The email of the user.
 * @returns The generated token.
 */
export function generateVerificationToken(
  userId: string,
  email: string
): string {
  return jwt.sign(
    { userId, email, type: "verification" },
    JWT_SECRET,
    { expiresIn: "24h" } // Verification links expire in 24 hours
  );
}

/**
 * Generates a JWT token for password reset.
 * @param userId The ID of the user.
 * @param email The email of the user.
 * @returns The generated token.
 */
export function generateResetToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email, type: "reset" },
    JWT_SECRET,
    { expiresIn: "1h" } // Password reset links expire in 1 hour
  );
}

/**
 * Verifies and decodes a JWT token.
 * @param token The token to verify.
 * @param type The expected type of the token ("verification" or "reset").
 * @returns The decoded payload if valid, null otherwise.
 */
export function verifyToken(
  token: string,
  type: "verification" | "reset"
): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    if (decoded.type === type) {
      return decoded;
    }
    return null;
  } catch (error) {
    console.error(`Token verification failed for type ${type}:`, error);
    return null;
  }
}
