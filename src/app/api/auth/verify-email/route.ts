import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth/tokens";
import { getTranslations, getTranslationValue } from "@/lib/utils";

// Force Node.js runtime for Prisma compatibility
export const runtime = "nodejs";

async function verifyEmailToken(token: string | null, lang: string = "en") {
  const messages = await getTranslations(lang);

  if (!token) {
    return NextResponse.json(
      {
        error: getTranslationValue(
          messages,
          "api.errors.verificationTokenRequired"
        ),
      },
      { status: 400 }
    );
  }

  // Verify the token
  const tokenPayload = verifyToken(token, "verification");
  if (!tokenPayload) {
    return NextResponse.json(
      {
        error: getTranslationValue(
          messages,
          "api.errors.invalidOrExpiredToken"
        ),
      },
      { status: 400 }
    );
  }

  // Find the user
  const user = await prisma.user.findUnique({
    where: { id: tokenPayload.userId },
  });

  if (!user) {
    return NextResponse.json(
      { error: getTranslationValue(messages, "api.errors.userNotFound") },
      { status: 404 }
    );
  }

  // Check if token is still valid in database
  if (
    !user.verificationToken ||
    !user.verificationTokenExpiry ||
    user.verificationTokenExpiry < new Date()
  ) {
    return NextResponse.json(
      {
        error: getTranslationValue(
          messages,
          "api.errors.verificationTokenExpired"
        ),
      },
      { status: 400 }
    );
  }

  // Update user to mark email as verified
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    },
  });

  return NextResponse.json(
    {
      message: getTranslationValue(
        messages,
        "api.errors.emailVerifiedSuccessfully"
      ),
    },
    { status: 200 }
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const lang =
      request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ||
      "en";
    return await verifyEmailToken(token, lang);
  } catch (error) {
    console.error("Email verification error:", error);
    const messages = await getTranslations("en");
    return NextResponse.json(
      {
        error: getTranslationValue(messages, "api.errors.internalServerError"),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;
    const lang =
      request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ||
      "en";
    return await verifyEmailToken(token, lang);
  } catch (error) {
    console.error("Email verification error:", error);
    const messages = await getTranslations("en");
    return NextResponse.json(
      {
        error: getTranslationValue(messages, "api.errors.internalServerError"),
      },
      { status: 500 }
    );
  }
}
