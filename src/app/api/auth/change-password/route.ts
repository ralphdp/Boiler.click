import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { changePasswordSchema } from "@/lib/validation/auth";
import {
  comparePassword,
  hashPassword,
  savePasswordToHistory,
  checkPasswordHistory,
} from "@/lib/auth/password";
import { getCurrentUser } from "@/lib/auth/session";

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate the request body
    const validatedData = changePasswordSchema.parse(body);
    const { currentPassword, newPassword } = validatedData;

    // Get the full user with password
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { password: true },
    });

    if (!fullUser || !fullUser.password) {
      return NextResponse.json(
        { error: "No password set for this account" },
        { status: 400 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      fullUser.password
    );
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Check if new password has been used before
    const passwordCheck = await checkPasswordHistory(user.id, newPassword);
    if (passwordCheck.isReused) {
      return NextResponse.json(
        { error: passwordCheck.message || "You cannot reuse a previous password" },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update the user's password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
      },
    });

    // Save password to history
    await savePasswordToHistory(user.id, hashedNewPassword);

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Change password error:", error);

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
