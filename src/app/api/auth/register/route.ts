import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { registerSchema } from "@/lib/validation/auth";
import { hashPassword, savePasswordToHistory } from "@/lib/auth/password";
import { generateVerificationToken } from "@/lib/auth/tokens";
import { emailService } from "@/lib/email/mailer";
import { config } from "@/lib/config";

// Force Node.js runtime for Prisma compatibility
export const runtime = "nodejs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = registerSchema.parse(body);
    const { firstName, lastName, email, telephone, password } = validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user first to get the user ID
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        telephone: telephone || null,
        password: hashedPassword,
        verificationToken: null, // Will be set after generation
        verificationTokenExpiry: null, // Will be set after generation
        role: config.auth.superAdminEmails?.includes(email.toLowerCase())
          ? "super_admin"
          : "user",
      },
    });

    // Generate verification token with the actual user ID
    const verificationToken = generateVerificationToken(user.id, email);

    // Update the user with the verification token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Save password to history
    await savePasswordToHistory(user.id, hashedPassword);

    // Send verification email
    const verificationLink = `${config.site.url}/auth/verify-email?token=${verificationToken}`;
    await emailService.sendVerificationEmail(
      email,
      verificationLink,
      firstName
    );

    // Send welcome email
    await emailService.sendWelcomeEmail(email, firstName);

    return NextResponse.json(
      {
        message:
          "User created successfully. Please check your email to verify your account.",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
