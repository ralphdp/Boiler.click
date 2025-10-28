import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        `${config.site.url}/login?error=oauth_error`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${config.site.url}/login?error=missing_code`
      );
    }

    // For now, we'll implement a simple redirect-based OAuth flow
    // In a production app, you'd want to use Passport.js middleware properly
    return NextResponse.redirect(
      `${config.site.url}/login?error=oauth_not_implemented`
    );
  } catch (error) {
    console.error("Facebook OAuth callback error:", error);
    return NextResponse.redirect(`${config.site.url}/auth/login?error=oauth_error`);
  }
}
