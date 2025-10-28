import { z } from "zod";

// Password validation regex and messages
const passwordRegex = {
  minLength: /.{8,}/,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[^A-Za-z0-9]/,
};

const passwordMessages = {
  minLength: "Password must be at least 8 characters long",
  uppercase: "Password must contain at least one uppercase letter",
  lowercase: "Password must contain at least one lowercase letter",
  number: "Password must contain at least one number",
  special: "Password must contain at least one special character",
};

// Common password schema
const basePasswordSchema = z
  .string()
  .min(8, passwordMessages.minLength)
  .max(100, "Password is too long")
  .regex(passwordRegex.uppercase, passwordMessages.uppercase)
  .regex(passwordRegex.lowercase, passwordMessages.lowercase)
  .regex(passwordRegex.number, passwordMessages.number)
  .regex(passwordRegex.special, passwordMessages.special);

// Register Schema
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
    password: basePasswordSchema,
    confirmPassword: basePasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Login Schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Reset Password Schema
export const resetPasswordSchema = z
  .object({
    password: basePasswordSchema,
    confirmPassword: basePasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Resend Verification Schema
export const resendVerificationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Profile Update Schema
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

// Change Password Schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: basePasswordSchema,
    confirmNewPassword: basePasswordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  });
