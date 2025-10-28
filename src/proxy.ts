/* Proxy for authentication */
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Lightweight session check for middleware (Edge Runtime compatible)
async function hasValidSession(request: NextRequest): Promise<boolean> {
  try {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return false;

    const cookies = cookieHeader.split(";").reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>
    );

    const sessionToken = cookies["boiler_session"];
    if (!sessionToken) return false;

    // Verify JWT token without database query (Edge Runtime compatible)
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
    const { payload } = await jwtVerify(sessionToken, secret, {
      algorithms: ["HS256"],
    });

    // Check if token is expired
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Automatically protect all /account/* and /admin/* routes
  const isProtectedRoute =
    pathname.startsWith("/account") || pathname.startsWith("/admin");

  // Automatically handle all /auth/* routes
  const isAuthRoute = pathname.startsWith("/auth");

  // For protected routes, check authentication
  if (isProtectedRoute) {
    const hasSession = await hasValidSession(request);
    if (!hasSession) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // For auth routes, redirect if already authenticated
  if (isAuthRoute) {
    const hasSession = await hasValidSession(request);
    if (hasSession) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/auth/:path*"],
};
