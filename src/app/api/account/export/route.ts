import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { getTranslations, createTranslator } from "@/lib/utils";

export const runtime = "nodejs";

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

    // Fetch all user data with related records
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        accounts: {
          select: {
            id: true,
            provider: true,
            providerId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        sessions: {
          select: {
            id: true,
            token: true,
            expiresAt: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!userData) {
      return NextResponse.json(
        { error: t("auth.messages.userNotFound") },
        { status: 404 }
      );
    }

    // Prepare GDPR-compliant data export
    const exportData = {
      export_date: new Date().toISOString(),
      user_info: {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        telephone: userData.telephone || null,
        emailVerified: userData.emailVerified,
        role: userData.role,
        createdAt: userData.createdAt.toISOString(),
        updatedAt: userData.updatedAt.toISOString(),
      },
      authentication: {
        hasPassword: !!userData.password,
        emailVerified: userData.emailVerified,
        connectedAccounts: userData.accounts.map((account) => ({
          provider: account.provider,
          providerId: account.providerId,
          linkedAt: account.createdAt.toISOString(),
          lastUpdated: account.updatedAt.toISOString(),
        })),
        activeSessions: userData.sessions
          .filter((session) => new Date(session.expiresAt) > new Date())
          .map((session) => ({
            sessionId: session.id,
            expiresAt: session.expiresAt.toISOString(),
            createdAt: session.createdAt.toISOString(),
          })),
      },
      metadata: {
        exportFormat: "GDPR_JSON_v1",
        exportedBy: "Boiler™ Platform",
        purpose: "User data export as per GDPR Article 20",
      },
    };

    // Return JSON file with appropriate headers
    const jsonString = JSON.stringify(exportData, null, 2);
    const filename = `boiler-data-export-${userData.email}-${Date.now()}.json`;

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Data export error:", error);
    const messages = await getTranslations("en");
    const t = createTranslator(messages);
    return NextResponse.json(
      { error: t("auth.messages.dataExportFailed") },
      { status: 500 }
    );
  }
}
