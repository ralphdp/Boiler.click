import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth/session";
import { getTranslations, createTranslator } from "@/lib/utils";
import { generateBackupCodes } from "@/lib/auth/two-factor";

export const runtime = "nodejs";

const prisma = new PrismaClient();

/**
 * GET /api/auth/backup-codes
 * Get current backup codes
 */
export async function GET(request: NextRequest) {
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

    // Get unused backup codes
    const backupCodes = await prisma.backupCode.findMany({
      where: {
        userId: user.id,
        used: false,
      },
      select: {
        id: true,
        code: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        backupCodes: backupCodes.map((bc) => bc.code),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get backup codes error:", error);
    const messages = await getTranslations("en");
    const t = createTranslator(messages);
    return NextResponse.json(
      { error: t("auth.messages.unexpectedError") },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auth/backup-codes
 * Generate new backup codes (replaces old ones)
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

    // Delete old backup codes
    await prisma.backupCode.deleteMany({
      where: { userId: user.id },
    });

    // Generate new ones
    const newCodes = generateBackupCodes(8);
    await prisma.backupCode.createMany({
      data: newCodes.map((code) => ({
        userId: user.id,
        code,
        used: false,
      })),
    });

    return NextResponse.json(
      {
        backupCodes: newCodes,
        message: "New backup codes generated",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Generate backup codes error:", error);
    const messages = await getTranslations("en");
    const t = createTranslator(messages);
    return NextResponse.json(
      { error: t("auth.messages.unexpectedError") },
      { status: 500 }
    );
  }
}

