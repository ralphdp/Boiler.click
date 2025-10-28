/* Forgot password API route */
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { forgotPasswordSchema } from "@/lib/validation/auth";
import { generateResetToken } from "@/lib/auth/tokens";
import { emailService } from "@/lib/email/mailer";
import { config } from "@/lib/config";

// Force Node.js runtime for Prisma compatibility
export const runtime = "nodejs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = forgotPasswordSchema.parse(body);
    const { email } = validatedData;

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        {
          message:
            "If an account with that email exists, we've sent a password reset link.",
        },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = generateResetToken(user.id, user.email);

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Send reset email
    const resetLink = `${config.site.url}/auth/reset-password?token=${resetToken}`;
    await emailService.sendResetPasswordEmail(email, resetLink, user.firstName);

    return NextResponse.json(
      {
        message:
          "If an account with that email exists, we've sent a password reset link.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);

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
