import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

export async function GET(request: NextRequest) {
  try {
    const baseUrl = config.site.url.replace(/\/$/, ""); // Remove trailing slash
    const discordAuthUrl =
      `https://discord.com/api/oauth2/authorize?` +
      `client_id=${config.auth.discord.clientId}&` +
      `redirect_uri=${encodeURIComponent(`${baseUrl}/api/auth/discord/callback`)}&` +
      `scope=identify%20email&` +
      `response_type=code`;

    return NextResponse.redirect(discordAuthUrl);
  } catch (error) {
    console.error("Discord OAuth initiation error:", error);
    return NextResponse.redirect(
      `${config.site.url.replace(/\/$/, "")}/login?error=oauth_error`
    );
  }
}
