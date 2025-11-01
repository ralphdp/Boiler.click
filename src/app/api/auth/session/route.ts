import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getTranslations, getTranslationValue } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    const lang =
      request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ||
      "en";
    const messages = await getTranslations(lang);

    if (!user) {
      return NextResponse.json(
        { error: getTranslationValue(messages, "api.errors.notAuthenticated") },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          emailVerified: user.emailVerified,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Session error:", error);
    const messages = await getTranslations("en");
    return NextResponse.json(
      {
        error: getTranslationValue(messages, "api.errors.internalServerError"),
      },
      { status: 500 }
    );
  }
}
