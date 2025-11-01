import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { getTranslations, createTranslator } from "@/lib/utils";
import { authenticateUser, setSessionCookie } from "@/lib/auth/session";
import { verifyTotpCode, getOTP, clearOTP, getAndDelete2FALoginSession } from "@/lib/auth/two-factor";
import { verifyBackupCode } from "@/lib/auth/backup-codes";

export const runtime = "nodejs";

const prisma = new PrismaClient();

// Validation schema for 2FA verification
const verify2FASchema = z.object({
  sessionId: z.string().min(1),
  code: z.string().length(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const validatedData = verify2FASchema.parse(body);
    const { sessionId, code } = validatedData;

    // Get language for translations
    const lang =
      request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ||
      "en";
    const messages = await getTranslations(lang);
    const t = createTranslator(messages);

    // Retrieve the pending login session
    const loginSession = await getAndDelete2FALoginSession(sessionId);

    if (!loginSession) {
      return NextResponse.json(
        { error: t("auth.messages.invalidOrExpiredSession") },
        { status: 400 }
      );
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: loginSession.userId },
    });

    if (!user || !user.twoFactorEnabled) {
      return NextResponse.json(
        { error: t("auth.messages.invalidOrExpiredSession") },
        { status: 400 }
      );
    }

    // Verify the 2FA code based on method
    let isValid = false;

    if (loginSession.method === "totp" && user.totpSecret) {
      // Verify TOTP code
      isValid = verifyTotpCode(user.totpSecret, code);
    } else if (loginSession.method === "email") {
      // Verify email OTP
      const storedCode = await getOTP(user.email);
      if (storedCode && storedCode === code) {
        isValid = true;
        await clearOTP(user.email);
      }
    }

    // If TOTP/email verification failed, check if it's a backup code
    if (!isValid) {
      isValid = await verifyBackupCode(user.id, code);
    }

    if (!isValid) {
      return NextResponse.json(
        { error: t("auth.messages.invalid2FACode") },
        { status: 400 }
      );
    }

    // 2FA verified! Create session
    const sessionToken = await authenticateUser(user, false);

    // Create response
    const response = NextResponse.json(
      {
        message: t("auth.messages.loginSuccessful"),
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          telephone: user.telephone,
          role: user.role,
          emailVerified: user.emailVerified,
        },
      },
      { status: 200 }
    );

    // Set session cookie
    setSessionCookie(response, sessionToken, false);

    return response;
  } catch (error) {
    console.error("Verify 2FA error:", error);

    if (error instanceof z.ZodError) {
      const lang =
        request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ||
        "en";
      const messages = await getTranslations(lang);
      const t = createTranslator(messages);
      return NextResponse.json(
        { error: t("api.errors.validationFailed"), details: error.errors },
        { status: 400 }
      );
    }

    const lang =
      request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ||
      "en";
    const messages = await getTranslations(lang);
    const t = createTranslator(messages);
    return NextResponse.json(
      { error: t("api.errors.internalServerError") },
      { status: 500 }
    );
  }
}

