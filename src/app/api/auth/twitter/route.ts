import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

export async function GET(request: NextRequest) {
  try {
    const baseUrl = config.site.url.replace(/\/$/, ""); // Remove trailing slash
    const twitterAuthUrl =
      `https://twitter.com/i/oauth2/authorize?` +
      `client_id=${config.auth.twitter.clientId}&` +
      `redirect_uri=${encodeURIComponent(`${baseUrl}/api/auth/twitter/callback`)}&` +
      `scope=tweet.read%20users.read&` +
      `response_type=code&` +
      `code_challenge=challenge&` +
      `code_challenge_method=plain`;

    return NextResponse.redirect(twitterAuthUrl);
  } catch (error) {
    console.error("Twitter OAuth initiation error:", error);
    return NextResponse.redirect(
      `${config.site.url.replace(/\/$/, "")}/login?error=oauth_error`
    );
  }
}
