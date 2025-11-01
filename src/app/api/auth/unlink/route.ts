import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth/session";
import { getTranslations, createTranslator } from "@/lib/utils";

export const runtime = "nodejs";

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
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

    const url = new URL(request.url);
    const provider = url.searchParams.get("provider");

    if (!provider) {
      return NextResponse.json(
        { error: "Provider is required" },
        { status: 400 }
      );
    }

    // Check if account exists
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        provider: provider.toLowerCase(),
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: t("auth.messages.accountNotLinked") },
        { status: 404 }
      );
    }

    // Prevent unlinking if it's the only account and user has no password
    const hasPassword = user.password && user.password.trim().length > 0;
    const allAccounts = await prisma.account.findMany({
      where: { userId: user.id },
    });

    if (allAccounts.length === 1 && !hasPassword) {
      return NextResponse.json(
        { error: t("auth.messages.cannotUnlinkLastAccount") },
        { status: 400 }
      );
    }

    // Delete the account
    await prisma.account.delete({
      where: { id: account.id },
    });

    return NextResponse.json(
      { message: t("auth.messages.accountUnlinkedSuccessfully") },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unlink account error:", error);
    const messages = await getTranslations("en");
    const t = createTranslator(messages);
    return NextResponse.json(
      { error: t("auth.messages.unexpectedError") },
      { status: 500 }
    );
  }
}

