import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth/session";
import { getTranslations, createTranslator } from "@/lib/utils";

export const runtime = "nodejs";

const prisma = new PrismaClient();

/**
 * POST /api/auth/disable-2fa
 * Disable 2FA for the current user
 */
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
        { error: t("auth.messages.notAuthenticated") },
        { status: 401 }
      );
    }

    // Disable 2FA and clear related data
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorMethod: null,
        totpSecret: null,
      },
    });

    // Delete all backup codes
    await prisma.backupCode.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json(
      {
        message: "2FA disabled successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Disable 2FA error:", error);
    const messages = await getTranslations("en");
    const t = createTranslator(messages);
    return NextResponse.json(
      { error: t("auth.messages.unexpectedError") },
      { status: 500 }
    );
  }
}

