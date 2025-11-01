import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { getTranslations, getTranslationValue } from "@/lib/utils";

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
 * @param lang The language for error messages.
 * @returns A PasswordValidationResult object.
 */
export async function validatePassword(
  password: string,
  lang: string = "en"
): Promise<PasswordValidationResult> {
  const messages = await getTranslations(lang);
  const errors: string[] = [];
  let score = 0;

  // Length
  if (password.length < 8) {
    errors.push(getTranslationValue(messages, "validation.password.minLength"));
  } else {
    score++;
  }

  // Uppercase
  if (!/[A-Z]/.test(password)) {
    errors.push(getTranslationValue(messages, "validation.password.uppercase"));
  } else {
    score++;
  }

  // Lowercase
  if (!/[a-z]/.test(password)) {
    errors.push(getTranslationValue(messages, "validation.password.lowercase"));
  } else {
    score++;
  }

  // Number
  if (!/[0-9]/.test(password)) {
    errors.push(getTranslationValue(messages, "validation.password.number"));
  } else {
    score++;
  }

  // Special character
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push(getTranslationValue(messages, "validation.password.special"));
  } else {
    score++;
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    strength: {
      score: Math.min(score, 4), // Max score of 4 for display purposes
      label: await getPasswordStrengthLabel(score, lang),
    },
  };
}

/**
 * Checks if two passwords match.
 * @param password The first password.
 * @param confirmPassword The second password.
 * @param lang The language for error messages.
 * @returns A PasswordMatchValidationResult object.
 */
export async function checkPasswordMatch(
  password: string,
  confirmPassword: string,
  lang: string = "en"
): Promise<PasswordMatchValidationResult> {
  const messages = await getTranslations(lang);
  const isMatch = password === confirmPassword;
  return {
    isMatch,
    error: isMatch
      ? ""
      : getTranslationValue(messages, "validation.password.doNotMatch"),
  };
}

/**
 * Gets the human-readable label for password strength.
 * @param score The password strength score.
 * @param lang The language for the label.
 * @returns The strength label.
 */
export async function getPasswordStrengthLabel(
  score: number,
  lang: string = "en"
): Promise<string> {
  const messages = await getTranslations(lang);

  if (score === 0)
    return getTranslationValue(messages, "auth.password.strength.veryWeak");
  if (score === 1)
    return getTranslationValue(messages, "auth.password.strength.weak");
  if (score === 2)
    return getTranslationValue(messages, "auth.password.strength.medium");
  if (score === 3)
    return getTranslationValue(messages, "auth.password.strength.strong");
  if (score >= 4)
    return getTranslationValue(messages, "auth.password.strength.veryStrong");
  return getTranslationValue(messages, "auth.password.strength.veryWeak");
}

/**
 * Gets the translation key for password strength.
 * @param score The password strength score.
 * @returns The translation key.
 */
export function getPasswordStrengthTranslationKey(score: number): string {
  if (score === 0) return "auth.password.strength.veryWeak";
  if (score === 1) return "auth.password.strength.weak";
  if (score === 2) return "auth.password.strength.medium";
  if (score === 3) return "auth.password.strength.strong";
  if (score >= 4) return "auth.password.strength.veryStrong";
  return "auth.password.strength.veryWeak";
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
 * @param lang The language for error messages.
 * @returns An object with isReused flag and message.
 */
export async function checkPasswordHistory(
  userId: string,
  newPassword: string,
  lang: string = "en"
): Promise<{ isReused: boolean; message: string }> {
  const messages = await getTranslations(lang);
  const history = await prisma.passwordHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5, // Check last 5 passwords
  });

  for (const entry of history) {
    if (await comparePassword(newPassword, entry.passwordHash)) {
      return {
        isReused: true,
        message: getTranslationValue(
          messages,
          "validation.password.recentlyUsed"
        ),
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
