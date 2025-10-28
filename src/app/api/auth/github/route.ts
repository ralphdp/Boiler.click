/* GitHub OAuth API route */
import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

export async function GET(request: NextRequest) {
  try {
    const baseUrl = config.site.url.replace(/\/$/, ""); // Remove trailing slash
    const githubAuthUrl =
      `https://github.com/login/oauth/authorize?` +
      `client_id=${config.auth.github.clientId}&` +
      `redirect_uri=${encodeURIComponent(`${baseUrl}/api/auth/github/callback`)}&` +
      `scope=user:email&` +
      `response_type=code`;

    return NextResponse.redirect(githubAuthUrl);
  } catch (error) {
    console.error("GitHub OAuth initiation error:", error);
    return NextResponse.redirect(
      `${config.site.url.replace(/\/$/, "")}/login?error=oauth_error`
    );
  }
}
