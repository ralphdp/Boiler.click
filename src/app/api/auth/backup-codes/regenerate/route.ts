import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth/session";
import { getTranslations, createTranslator } from "@/lib/utils";
import { generateBackupCodes } from "@/lib/auth/two-factor";

export const runtime = "nodejs";

const prisma = new PrismaClient();

/**
 * POST /api/auth/backup-codes/regenerate
 * Regenerate backup codes for the current user
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

    if (!user.twoFactorEnabled) {
      return NextResponse.json(
        { error: "2FA is not enabled for this account" },
        { status: 400 }
      );
    }

    // Generate new backup codes
    const newBackupCodes = generateBackupCodes(8);

    // Delete all existing backup codes
    await prisma.backupCode.deleteMany({
      where: { userId: user.id },
    });

    // Create new backup codes
    await prisma.backupCode.createMany({
      data: newBackupCodes.map((code) => ({
        userId: user.id,
        code,
        used: false,
      })),
    });

    return NextResponse.json(
      {
        message: "Backup codes regenerated successfully",
        backupCodes: newBackupCodes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Regenerate backup codes error:", error);
    const messages = await getTranslations("en");
    const t = createTranslator(messages);
    return NextResponse.json(
      { error: t("auth.messages.unexpectedError") },
      { status: 500 }
    );
  }
}

