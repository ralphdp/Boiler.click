import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth/tokens";

// Force Node.js runtime for Prisma compatibility
export const runtime = "nodejs";

const prisma = new PrismaClient();

async function verifyEmailToken(token: string | null) {
  if (!token) {
    return NextResponse.json(
      { error: "Verification token is required" },
      { status: 400 }
    );
  }

  // Verify the token
  const tokenPayload = verifyToken(token, "verification");
  if (!tokenPayload) {
    return NextResponse.json(
      { error: "Invalid or expired verification token" },
      { status: 400 }
    );
  }

  // Find the user
  const user = await prisma.user.findUnique({
    where: { id: tokenPayload.userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check if token is still valid in database
  if (
    !user.verificationToken ||
    !user.verificationTokenExpiry ||
    user.verificationTokenExpiry < new Date()
  ) {
    return NextResponse.json(
      { error: "Verification token has expired" },
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
    { message: "Email verified successfully" },
    { status: 200 }
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    return await verifyEmailToken(token);
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;
    return await verifyEmailToken(token);
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
