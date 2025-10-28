import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/lib/auth/password";
import { authenticateUser, setSessionCookie } from "@/lib/auth/session";

// Force Node.js runtime for Prisma compatibility
export const runtime = "nodejs";

const prisma = new PrismaClient();

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

    // Exchange code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: config.auth.google.clientId,
        client_secret: config.auth.google.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${config.site.url.replace(/\/$/, "")}/api/auth/google/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", await tokenResponse.text());
      return NextResponse.redirect(
        `${config.site.url}/login?error=token_exchange_failed`
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    // Get user info from Google
    const userResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
    );

    if (!userResponse.ok) {
      console.error("User info fetch failed:", await userResponse.text());
      return NextResponse.redirect(
        `${config.site.url}/login?error=user_info_failed`
      );
    }

    const googleUser = await userResponse.json();
    const { id, email, given_name, family_name } = googleUser;

    if (!email) {
      return NextResponse.redirect(`${config.site.url}/auth/login?error=no_email`);
    }

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // User exists, check if Google account is linked
      const account = await prisma.account.findUnique({
        where: {
          provider_providerId: {
            provider: "google",
            providerId: id,
          },
        },
      });

      if (!account) {
        // Link Google account to existing user
        await prisma.account.create({
          data: {
            userId: user.id,
            provider: "google",
            providerId: id,
            accessToken: access_token,
            refreshToken: tokenData.refresh_token || null,
          },
        });
      }
    } else {
      // Create new user
      const superAdminEmails = config.auth.superAdminEmails || [];
      const isSuperAdmin = superAdminEmails.includes(email.toLowerCase());

      user = await prisma.user.create({
        data: {
          email,
          firstName: given_name || "User",
          lastName: family_name || "",
          password: null, // OAuth users don't need a password
          emailVerified: true, // OAuth providers verify email
          role: isSuperAdmin ? "super_admin" : "user",
          accounts: {
            create: {
              provider: "google",
              providerId: id,
              accessToken: access_token,
              refreshToken: tokenData.refresh_token || null,
            },
          },
        },
      });
    }

    // Create session (OAuth logins are treated as "remember me" by default)
    const sessionToken = await authenticateUser(user, true);

    // Create response with redirect to account page
    const response = NextResponse.redirect(`${config.site.url}/account`);
    // OAuth logins are treated as "remember me" by default
    setSessionCookie(response, sessionToken, true);

    return response;
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(`${config.site.url}/auth/login?error=oauth_error`);
  }
}
