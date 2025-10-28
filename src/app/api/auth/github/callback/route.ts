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
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: config.auth.github.clientId,
          client_secret: config.auth.github.clientSecret,
          code,
          redirect_uri: `${config.site.url.replace(/\/$/, "")}/api/auth/github/callback`,
        }),
      }
    );

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", await tokenResponse.text());
      return NextResponse.redirect(
        `${config.site.url}/login?error=token_exchange_failed`
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    if (!access_token) {
      console.error("No access token received:", tokenData);
      return NextResponse.redirect(
        `${config.site.url}/login?error=no_access_token`
      );
    }

    // Get user info from GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!userResponse.ok) {
      console.error("User info fetch failed:", await userResponse.text());
      return NextResponse.redirect(
        `${config.site.url}/login?error=user_info_failed`
      );
    }

    const githubUser = await userResponse.json();
    const { id, login, name, email } = githubUser;

    // Get user email (might be private)
    let userEmail = email;
    if (!userEmail) {
      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (emailResponse.ok) {
        const emails = await emailResponse.json();
        const primaryEmail = emails.find((e: any) => e.primary);
        userEmail = primaryEmail?.email;
      }
    }

    if (!userEmail) {
      return NextResponse.redirect(`${config.site.url}/auth/login?error=no_email`);
    }

    // Parse name
    const nameParts = name ? name.split(" ") : [login];
    const firstName = nameParts[0] || login;
    const lastName = nameParts.slice(1).join(" ") || "";

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email: userEmail } });

    if (user) {
      // User exists, check if GitHub account is linked
      const account = await prisma.account.findUnique({
        where: {
          provider_providerId: {
            provider: "github",
            providerId: id.toString(),
          },
        },
      });

      if (!account) {
        // Link GitHub account to existing user
        await prisma.account.create({
          data: {
            userId: user.id,
            provider: "github",
            providerId: id.toString(),
            accessToken: access_token,
            refreshToken: tokenData.refresh_token || null,
          },
        });
      }
    } else {
      // Create new user
      const superAdminEmails = config.auth.superAdminEmails || [];
      const isSuperAdmin = superAdminEmails.includes(userEmail.toLowerCase());

      user = await prisma.user.create({
        data: {
          email: userEmail,
          firstName,
          lastName,
          password: null, // OAuth users don't need a password
          emailVerified: true, // OAuth providers verify email
          role: isSuperAdmin ? "super_admin" : "user",
          accounts: {
            create: {
              provider: "github",
              providerId: id.toString(),
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
    console.error("GitHub OAuth callback error:", error);
    return NextResponse.redirect(`${config.site.url}/auth/login?error=oauth_error`);
  }
}
