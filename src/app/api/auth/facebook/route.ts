import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

export async function GET(request: NextRequest) {
  try {
    const baseUrl = config.site.url.replace(/\/$/, ""); // Remove trailing slash
    const facebookAuthUrl =
      `https://www.facebook.com/v18.0/dialog/oauth?` +
      `client_id=${config.auth.facebook.clientId}&` +
      `redirect_uri=${encodeURIComponent(`${baseUrl}/api/auth/facebook/callback`)}&` +
      `scope=email&` +
      `response_type=code`;

    return NextResponse.redirect(facebookAuthUrl);
  } catch (error) {
    console.error("Facebook OAuth initiation error:", error);
    return NextResponse.redirect(
      `${config.site.url.replace(/\/$/, "")}/login?error=oauth_error`
    );
  }
}
