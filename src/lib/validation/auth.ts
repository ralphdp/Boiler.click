import { z } from "zod";
import { getTranslations, getTranslationValue } from "@/lib/utils";

// Password validation regex
const passwordRegex = {
  minLength: /.{8,}/,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[^A-Za-z0-9]/,
};

// Function to get password messages based on language
async function getPasswordMessages(lang: string = "en") {
  const messages = await getTranslations(lang);
  return {
    minLength: getTranslationValue(messages, "validation.password.minLength"),
    uppercase: getTranslationValue(messages, "validation.password.uppercase"),
    lowercase: getTranslationValue(messages, "validation.password.lowercase"),
    number: getTranslationValue(messages, "validation.password.number"),
    special: getTranslationValue(messages, "validation.password.special"),
    tooLong: getTranslationValue(messages, "validation.password.tooLong"),
  };
}

// Function to get form messages based on language
async function getFormMessages(lang: string = "en") {
  const messages = await getTranslations(lang);
  return {
    firstNameRequired: getTranslationValue(
      messages,
      "validation.form.firstNameRequired"
    ),
    firstNameTooLong: getTranslationValue(
      messages,
      "validation.form.firstNameTooLong"
    ),
    lastNameRequired: getTranslationValue(
      messages,
      "validation.form.lastNameRequired"
    ),
    lastNameTooLong: getTranslationValue(
      messages,
      "validation.form.lastNameTooLong"
    ),
    nameFormat: getTranslationValue(messages, "validation.form.nameFormat"),
    validEmail: getTranslationValue(messages, "validation.form.validEmail"),
    validPhoneNumber: getTranslationValue(
      messages,
      "validation.form.validPhoneNumber"
    ),
    passwordRequired: getTranslationValue(
      messages,
      "validation.password.passwordRequired"
    ),
    currentPasswordRequired: getTranslationValue(
      messages,
      "validation.password.currentPasswordRequired"
    ),
    doNotMatch: getTranslationValue(messages, "validation.password.doNotMatch"),
    newPasswordsDoNotMatch: getTranslationValue(
      messages,
      "validation.password.newPasswordsDoNotMatch"
    ),
  };
}

// Function to create base password schema with translations
async function createBasePasswordSchema(lang: string = "en") {
  const passwordMessages = await getPasswordMessages(lang);

  return z
    .string()
    .min(8, passwordMessages.minLength)
    .max(100, passwordMessages.tooLong)
    .regex(passwordRegex.uppercase, passwordMessages.uppercase)
    .regex(passwordRegex.lowercase, passwordMessages.lowercase)
    .regex(passwordRegex.number, passwordMessages.number)
    .regex(passwordRegex.special, passwordMessages.special);
}

// Register Schema
export async function getRegisterSchema(lang: string = "en") {
  const formMessages = await getFormMessages(lang);
  const basePasswordSchema = await createBasePasswordSchema(lang);

  return z
    .object({
      firstName: z
        .string()
        .min(1, formMessages.firstNameRequired)
        .max(50, formMessages.firstNameTooLong)
        .regex(/^[a-zA-Z\s'-]+$/, formMessages.nameFormat),
      lastName: z
        .string()
        .min(1, formMessages.lastNameRequired)
        .max(50, formMessages.lastNameTooLong)
        .regex(/^[a-zA-Z\s'-]+$/, formMessages.nameFormat),
      email: z.string().email(formMessages.validEmail),
      telephone: z
        .string()
        .regex(/^\+?[0-9\s-()]*$/, formMessages.validPhoneNumber)
        .optional()
        .or(z.literal("")),
      password: basePasswordSchema,
      confirmPassword: basePasswordSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: formMessages.doNotMatch,
      path: ["confirmPassword"],
    });
}

// Login Schema
export async function getLoginSchema(lang: string = "en") {
  const formMessages = await getFormMessages(lang);

  return z.object({
    email: z.string().email(formMessages.validEmail),
    password: z.string().min(1, formMessages.passwordRequired),
    rememberMe: z.boolean().optional(),
  });
}

// Forgot Password Schema
export async function getForgotPasswordSchema(lang: string = "en") {
  const formMessages = await getFormMessages(lang);

  return z.object({
    email: z.string().email(formMessages.validEmail),
  });
}

// Reset Password Schema
export async function getResetPasswordSchema(lang: string = "en") {
  const formMessages = await getFormMessages(lang);
  const basePasswordSchema = await createBasePasswordSchema(lang);

  return z
    .object({
      password: basePasswordSchema,
      confirmPassword: basePasswordSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: formMessages.doNotMatch,
      path: ["confirmPassword"],
    });
}

// Resend Verification Schema
export async function getResendVerificationSchema(lang: string = "en") {
  const formMessages = await getFormMessages(lang);

  return z.object({
    email: z.string().email(formMessages.validEmail),
  });
}

// Profile Update Schema
export async function getProfileUpdateSchema(lang: string = "en") {
  const formMessages = await getFormMessages(lang);

  return z.object({
    firstName: z
      .string()
      .min(1, formMessages.firstNameRequired)
      .max(50, formMessages.firstNameTooLong)
      .regex(/^[a-zA-Z\s'-]+$/, formMessages.nameFormat),
    lastName: z
      .string()
      .min(1, formMessages.lastNameRequired)
      .max(50, formMessages.lastNameTooLong)
      .regex(/^[a-zA-Z\s'-]+$/, formMessages.nameFormat),
    email: z.string().email(formMessages.validEmail),
    telephone: z
      .string()
      .regex(/^\+?[0-9\s-()]*$/, formMessages.validPhoneNumber)
      .optional()
      .or(z.literal("")),
  });
}

// Change Password Schema
export async function getChangePasswordSchema(lang: string = "en") {
  const formMessages = await getFormMessages(lang);
  const basePasswordSchema = await createBasePasswordSchema(lang);

  return z
    .object({
      currentPassword: z.string().min(1, formMessages.currentPasswordRequired),
      newPassword: basePasswordSchema,
      confirmNewPassword: basePasswordSchema,
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: formMessages.newPasswordsDoNotMatch,
      path: ["confirmNewPassword"],
    });
}

// Legacy schemas for backward compatibility (using English)
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name is too long")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Name can only contain letters, spaces, hyphens, and apostrophes"
      ),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name is too long")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Name can only contain letters, spaces, hyphens, and apostrophes"
      ),
    email: z.string().email("Please enter a valid email address"),
    telephone: z
      .string()
      .regex(/^\+?[0-9\s-()]*$/, "Please enter a valid phone number")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password is too long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password is too long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password is too long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password is too long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resendVerificationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  email: z.string().email("Please enter a valid email address"),
  telephone: z
    .string()
    .regex(/^\+?[0-9\s-()]*$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password is too long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmNewPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password is too long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  });
