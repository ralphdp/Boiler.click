import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { loginSchema } from "@/lib/validation/auth";
import { comparePassword } from "@/lib/auth/password";
import { authenticateUser, setSessionCookie } from "@/lib/auth/session";
import { getTranslations, getTranslationValue, createTranslator } from "@/lib/utils";
import { store2FALoginSession, generateEmailOTP, storeOTP } from "@/lib/auth/two-factor";
import { emailService } from "@/lib/email/mailer";
import crypto from "crypto";

// Force Node.js runtime for Prisma compatibility
export const runtime = "nodejs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = loginSchema.parse(body);
    const { email, password, rememberMe } = validatedData;

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const lang =
        request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ||
        "en";
      const messages = await getTranslations(lang);
      return NextResponse.json(
        { error: getTranslationValue(messages, "auth.messages.invalidCredentials") },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user.emailVerified) {
      const lang =
        request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ||
        "en";
      const messages = await getTranslations(lang);
      return NextResponse.json(
        { error: getTranslationValue(messages, "auth.messages.emailVerificationRequired") },
        { status: 401 }
      );
    }

    // Check if user has a password (not OAuth-only)
    if (!user.password) {
      const lang =
        request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ||
        "en";
      const messages = await getTranslations(lang);
      return NextResponse.json(
        {
          error: getTranslationValue(messages, "auth.messages.socialLoginRequired"),
        },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      const lang =
        request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ||
        "en";
      const messages = await getTranslations(lang);
      return NextResponse.json(
        { error: getTranslationValue(messages, "auth.messages.invalidCredentials") },
        { status: 401 }
      );
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled && user.twoFactorMethod) {
      // Generate a temporary session ID for 2FA verification
      const sessionId = crypto.randomBytes(32).toString("hex");
      await store2FALoginSession(sessionId, user.id, user.twoFactorMethod, 10);

      // Send 2FA code if email method
      if (user.twoFactorMethod === "email") {
        const emailCode = generateEmailOTP();
        await storeOTP(user.email, emailCode, 5);
        await emailService.send2FACodeEmail(user.email, emailCode, user.firstName);
      }

      // Return 2FA challenge
      const lang =
        request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ||
        "en";
      const messages = await getTranslations(lang);
      const t = createTranslator(messages);
      return NextResponse.json(
        {
          requiresTwoFactor: true,
          sessionId,
          method: user.twoFactorMethod,
        },
        { status: 200 }
      );
    }

    // No 2FA, proceed with normal login
    const sessionToken = await authenticateUser(user, rememberMe || false);

    // Create response
    const lang =
      request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ||
      "en";
    const messages = await getTranslations(lang);
    const response = NextResponse.json(
      {
        message: getTranslationValue(messages, "auth.messages.loginSuccessful"),
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
    setSessionCookie(response, sessionToken, rememberMe || false);

    return response;
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof z.ZodError) {
      const lang =
        request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ||
        "en";
      const messages = await getTranslations(lang);
      return NextResponse.json(
        {
          error: getTranslationValue(messages, "api.errors.validationFailed"),
          details: error.errors,
        },
        { status: 400 }
      );
    }

    const lang =
      request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ||
      "en";
    const messages = await getTranslations(lang);
    return NextResponse.json(
      {
        error: getTranslationValue(messages, "api.errors.internalServerError"),
      },
      { status: 500 }
    );
  }
}
