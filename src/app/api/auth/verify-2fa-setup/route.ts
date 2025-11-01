import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth/session";
import { getTranslations, createTranslator } from "@/lib/utils";
import { verifyTotpCode, getOTP, clearOTP } from "@/lib/auth/two-factor";

export const runtime = "nodejs";

const prisma = new PrismaClient();

/**
 * POST /api/auth/verify-2fa-setup
 * Verify TOTP code during setup to confirm 2FA is working
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

    const body = await request.json();
    const { secret, code, method } = body;

    if (!code || !method) {
      return NextResponse.json(
        { error: "Code and method are required" },
        { status: 400 }
      );
    }

    if (method === "totp" && !secret) {
      return NextResponse.json(
        { error: "Secret is required for TOTP verification" },
        { status: 400 }
      );
    }

    let isValid = false;

    if (method === "totp") {
      // Verify TOTP code
      isValid = verifyTotpCode(secret, code);
    } else if (method === "email") {
      // Verify email OTP from cache
      const storedCode = await getOTP(user.email);
      if (storedCode && storedCode === code) {
        isValid = true;
        await clearOTP(user.email);
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        verified: true,
        message: "Verification successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify 2FA setup error:", error);
    const messages = await getTranslations("en");
    const t = createTranslator(messages);
    return NextResponse.json(
      { error: t("auth.messages.unexpectedError") },
      { status: 500 }
    );
  }
}

