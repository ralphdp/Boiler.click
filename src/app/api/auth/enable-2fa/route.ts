import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { getTranslations, createTranslator } from "@/lib/utils";
import { generateTotpSecret, generateBackupCodes, generateQRCode, generateEmailOTP, storeOTP } from "@/lib/auth/two-factor";
import { emailService } from "@/lib/email/mailer";

export const runtime = "nodejs";

/**
 * POST /api/auth/enable-2fa
 * Initialize 2FA setup - generates TOTP secret or sends email code
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
    const { method } = body; // "email" or "totp"

    if (!method || !["email", "totp"].includes(method)) {
      return NextResponse.json(
        { error: "Invalid 2FA method. Must be 'email' or 'totp'" },
        { status: 400 }
      );
    }

    if (method === "totp") {
      // Generate TOTP secret
      const { secret, uri } = generateTotpSecret(user.email);
      const backupCodes = generateBackupCodes(8);
      
      // Generate QR code data URL
      const qrCodeUrl = await generateQRCode(uri);

      // Store secret temporarily (user needs to verify before enabling)
      return NextResponse.json(
        {
          secret,
          uri,
          qrCodeUrl,
          backupCodes,
          method: "totp",
        },
        { status: 200 }
      );
    } else {
      // Email method - generate and send verification code
      const emailCode = generateEmailOTP();
      await storeOTP(user.email, emailCode, 5); // Store for 5 minutes
      
      // Send the code via email
      await emailService.send2FACodeEmail(user.email, emailCode, user.firstName);
      
      return NextResponse.json(
        {
          method: "email",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Enable 2FA error:", error);
    const messages = await getTranslations("en");
    const t = createTranslator(messages);
    return NextResponse.json(
      { error: t("auth.messages.unexpectedError") },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/auth/enable-2fa
 * Complete 2FA setup after verification
 */
export async function PUT(request: NextRequest) {
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
    const { method, secret, backupCodes } = body;

    if (!method || !["email", "totp"].includes(method)) {
      return NextResponse.json(
        { error: "Invalid 2FA method" },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      twoFactorEnabled: true,
      twoFactorMethod: method,
    };

    if (method === "totp" && secret) {
      updateData.totpSecret = secret;
    }

    // Generate backup codes if not provided (for email method)
    const codesToStore = backupCodes && Array.isArray(backupCodes) 
      ? backupCodes 
      : generateBackupCodes(8);

    // Update user with 2FA settings
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    // Store backup codes
    await prisma.backupCode.createMany({
      data: codesToStore.map((code: string) => ({
        userId: user.id,
        code,
        used: false,
      })),
    });

    return NextResponse.json(
      {
        message: "2FA enabled successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Complete 2FA setup error:", error);
    const messages = await getTranslations("en");
    const t = createTranslator(messages);
    return NextResponse.json(
      { error: t("auth.messages.unexpectedError") },
      { status: 500 }
    );
  }
}

