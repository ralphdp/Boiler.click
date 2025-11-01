import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth/session";
import {
  comparePassword,
  hashPassword,
  checkPasswordHistory,
  savePasswordToHistory,
} from "@/lib/auth/password";
import { changePasswordSchema } from "@/lib/validation/auth";
import { useLanguage } from "@/contexts/LanguageContext";

// Force Node.js runtime for Prisma compatibility
export const runtime = "nodejs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const t = useLanguage();
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { error: t("auth.messages.notAuthenticated") },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = changePasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: t("auth.messages.validationFailed"),
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = validationResult.data;

    // Get user with password
    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        password: true,
      },
    });

    if (!userWithPassword || !userWithPassword.password) {
      return NextResponse.json(
        { error: t("auth.messages.userNotFoundOrNoPassword") },
        { status: 404 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      userWithPassword.password
    );
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: t("auth.messages.currentPasswordIncorrect") },
        { status: 400 }
      );
    }

    // Check if new password is different from current
    const isSamePassword = await comparePassword(
      newPassword,
      userWithPassword.password
    );
    if (isSamePassword) {
      return NextResponse.json(
        { error: t("auth.messages.newPasswordMustBeDifferent") },
        { status: 400 }
      );
    }

    // Check password history
    const passwordCheck = await checkPasswordHistory(user.id, newPassword);
    if (passwordCheck.isReused) {
      return NextResponse.json(
        { error: passwordCheck.message },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
      },
    });

    // Save password to history
    await savePasswordToHistory(user.id, hashedNewPassword);

    return NextResponse.json(
      { message: t("auth.messages.passwordChangedSuccessfully") },
      { status: 200 }
    );
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: t("auth.messages.internalServerError") },
      { status: 500 }
    );
  }
}
