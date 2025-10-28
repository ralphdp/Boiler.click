import { NextRequest, NextResponse } from "next/server";
import {
  getSessionTokenFromRequest,
  destroySession,
  clearSessionCookie,
} from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const sessionToken = getSessionTokenFromRequest(request);

    if (sessionToken) {
      await destroySession(sessionToken);
    }

    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    clearSessionCookie(response);
    return response;
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
