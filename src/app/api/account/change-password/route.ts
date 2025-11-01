import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import {
  comparePassword,
  hashPassword,
  checkPasswordHistory,
  savePasswordToHistory,
} from "@/lib/auth/password";
import { changePasswordSchema } from "@/lib/validation/auth";
import { getTranslations, createTranslator } from "@/lib/utils";

// Force Node.js runtime for Prisma compatibility
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    const lang =
      request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ||
      "en";
    const messages = await getTranslations(lang);
    const t = createTranslator(messages);

    if (!user) {
      return NextResponse.json(
        { error: t("api.errors.notAuthenticated") },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = changePasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: t("api.errors.validationFailed"),
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
        { error: t("auth.messages.noPasswordSet") },
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
        { error: t("auth.messages.incorrectPassword") },
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
        { error: t("auth.messages.reusePassword") },
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
      { message: t("auth.messages.passwordChangedSuccess") },
      { status: 200 }
    );
  } catch (error) {
    console.error("Change password error:", error);
    const messages = await getTranslations("en");
    const t = createTranslator(messages);
    return NextResponse.json(
      { error: t("api.errors.internalServerError") },
      { status: 500 }
    );
  }
}
