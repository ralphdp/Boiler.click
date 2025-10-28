import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: {
    score: number;
    label: string;
  };
}

export interface PasswordMatchValidationResult {
  isMatch: boolean;
  error: string;
}

/**
 * Hashes a plain text password.
 * @param password The plain text password.
 * @returns The hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plain text password with a hashed password.
 * @param password The plain text password.
 * @param hash The hashed password.
 * @returns True if passwords match, false otherwise.
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Validates password strength and requirements.
 * @param password The password to validate.
 * @returns A PasswordValidationResult object.
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;

  // Length
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  } else {
    score++;
  }

  // Uppercase
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  } else {
    score++;
  }

  // Lowercase
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  } else {
    score++;
  }

  // Number
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  } else {
    score++;
  }

  // Special character
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character");
  } else {
    score++;
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    strength: {
      score: Math.min(score, 4), // Max score of 4 for display purposes
      label: getPasswordStrengthLabel(score),
    },
  };
}

/**
 * Checks if two passwords match.
 * @param password The first password.
 * @param confirmPassword The second password.
 * @returns A PasswordMatchValidationResult object.
 */
export function checkPasswordMatch(
  password: string,
  confirmPassword: string
): PasswordMatchValidationResult {
  const isMatch = password === confirmPassword;
  return {
    isMatch,
    error: isMatch ? "" : "Passwords do not match",
  };
}

/**
 * Gets the human-readable label for password strength.
 * @param score The password strength score.
 * @returns The strength label.
 */
export function getPasswordStrengthLabel(score: number): string {
  if (score === 0) return "Very Weak";
  if (score === 1) return "Weak";
  if (score === 2) return "Medium";
  if (score === 3) return "Strong";
  if (score >= 4) return "Very Strong";
  return "Very Weak";
}

/**
 * Gets the Tailwind CSS color class for password strength.
 * @param score The password strength score.
 * @returns The Tailwind CSS color class.
 */
export function getPasswordStrengthColor(score: number): string {
  if (score === 0) return "text-red-500";
  if (score === 1) return "text-orange-500";
  if (score === 2) return "text-yellow-500";
  if (score === 3) return "text-green-500";
  if (score >= 4) return "text-green-500";
  return "text-gray-500";
}

/**
 * Checks if a new password has been used previously by the user.
 * @param userId The ID of the user.
 * @param newPassword The new password to check.
 * @returns An object with isReused flag and message.
 */
export async function checkPasswordHistory(
  userId: string,
  newPassword: string
): Promise<{ isReused: boolean; message: string }> {
  const history = await prisma.passwordHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5, // Check last 5 passwords
  });

  for (const entry of history) {
    if (await comparePassword(newPassword, entry.passwordHash)) {
      return {
        isReused: true,
        message:
          "You cannot reuse a recently used password. Please choose a different password.",
      };
    }
  }

  return {
    isReused: false,
    message: "",
  };
}

/**
 * Saves a new password hash to the user's password history.
 * @param userId The ID of the user.
 * @param passwordHash The hashed password to save.
 */
export async function savePasswordToHistory(
  userId: string,
  passwordHash: string
): Promise<void> {
  await prisma.passwordHistory.create({
    data: {
      userId,
      passwordHash,
    },
  });
}
