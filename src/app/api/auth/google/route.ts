import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

export async function GET(request: NextRequest) {
  try {
    const baseUrl = config.site.url.replace(/\/$/, ""); // Remove trailing slash
    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${config.auth.google.clientId}&` +
      `redirect_uri=${encodeURIComponent(`${baseUrl}/api/auth/google/callback`)}&` +
      `scope=openid%20email%20profile&` +
      `response_type=code&` +
      `access_type=offline`;

    return NextResponse.redirect(googleAuthUrl);
  } catch (error) {
    console.error("Google OAuth initiation error:", error);
    return NextResponse.redirect(
      `${config.site.url.replace(/\/$/, "")}/login?error=oauth_error`
    );
  }
}
