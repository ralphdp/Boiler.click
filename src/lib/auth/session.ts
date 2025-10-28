import { NextRequest, NextResponse } from "next/server";
import { serialize, parse } from "cookie";
import { SignJWT, jwtVerify } from "jose";
import { config } from "@/lib/config";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();
const SESSION_SECRET = new TextEncoder().encode(config.auth.sessionSecret);
const SESSION_COOKIE_NAME = "boiler_session";
const SHORT_SESSION_EXPIRY_SECONDS = 60 * 60 * 24; // 1 day
const LONG_SESSION_EXPIRY_SECONDS = 60 * 60 * 24 * 7; // 7 days

interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  expiresAt: number;
}

/**
 * Creates a new session token.
 * @param userId The ID of the user.
 * @param email The email of the user.
 * @param role The role of the user.
 * @param expirySeconds The expiry time in seconds.
 * @returns The signed JWT session token.
 */
async function createSessionToken(
  userId: string,
  email: string,
  role: string,
  expirySeconds: number = LONG_SESSION_EXPIRY_SECONDS
): Promise<string> {
  const expiresAt = Math.floor(Date.now() / 1000) + expirySeconds;
  const token = await new SignJWT({ userId, email, role, expiresAt })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(SESSION_SECRET);

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt: new Date(expiresAt * 1000),
    },
  });

  return token;
}

/**
 * Verifies a session token and returns its payload.
 * @param token The session token.
 * @returns The session payload if valid, null otherwise.
 */
async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET, {
      algorithms: ["HS256"],
    });
    const session = await prisma.session.findUnique({
      where: { token },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    // Ensure payload has required fields
    const sessionPayload = payload as unknown as SessionPayload;
    if (
      !sessionPayload.userId ||
      !sessionPayload.email ||
      !sessionPayload.role
    ) {
      return null;
    }

    return sessionPayload;
  } catch (error) {
    console.error("Session token verification failed:", error);
    return null;
  }
}

/**
 * Sets the session cookie in the response.
 * @param response The NextResponse object.
 * @param token The session token.
 * @param rememberMe Whether to remember the user for a longer period.
 */
export function setSessionCookie(
  response: NextResponse,
  token: string,
  rememberMe: boolean = true
) {
  const maxAge = rememberMe
    ? LONG_SESSION_EXPIRY_SECONDS
    : SHORT_SESSION_EXPIRY_SECONDS;
  const cookie = serialize(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAge,
  });
  response.headers.set("Set-Cookie", cookie);
}

/**
 * Clears the session cookie from the response.
 * @param response The NextResponse object.
 */
export function clearSessionCookie(response: NextResponse) {
  const cookie = serialize(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // Expires immediately
  });
  response.headers.set("Set-Cookie", cookie);
}

/**
 * Gets the session token from the request cookies.
 * @param request The NextRequest object.
 * @returns The session token or null if not found.
 */
export function getSessionTokenFromRequest(
  request: NextRequest
): string | null {
  const cookieHeader = request.headers.get("cookie");
  const cookies = parse(cookieHeader || "");
  return cookies[SESSION_COOKIE_NAME] || null;
}

/**
 * Destroys a session in the database.
 * @param token The session token to destroy.
 */
export async function destroySession(token: string) {
  try {
    const payload = await verifySessionToken(token);
    if (payload) {
      await prisma.session.deleteMany({
        where: {
          userId: payload.userId,
          token: token,
        },
      });
    }
  } catch (error) {
    console.error("Failed to destroy session:", error);
  }
}

/**
 * Authenticates a user and creates a session.
 * @param user The user object.
 * @param rememberMe Whether to remember the user.
 * @returns The session token.
 */
export async function authenticateUser(
  user: User,
  rememberMe: boolean
): Promise<string> {
  const expirySeconds = rememberMe
    ? LONG_SESSION_EXPIRY_SECONDS
    : SHORT_SESSION_EXPIRY_SECONDS;
  const sessionToken = await createSessionToken(
    user.id,
    user.email,
    user.role,
    expirySeconds
  );
  return sessionToken;
}

/**
 * Gets the current authenticated user from the session.
 * @param request The NextRequest object.
 * @returns The User object if authenticated, null otherwise.
 */
export async function getCurrentUser(
  request: NextRequest
): Promise<User | null> {
  const sessionToken = getSessionTokenFromRequest(request);
  if (!sessionToken) {
    return null;
  }

  const payload = await verifySessionToken(sessionToken);
  if (!payload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      telephone: true,
      emailVerified: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      password: true,
      verificationToken: true,
      verificationTokenExpiry: true,
      resetToken: true,
      resetTokenExpiry: true,
      accounts: {
        select: {
          id: true,
          provider: true,
          providerId: true,
          createdAt: true,
        },
      },
    },
  });

  return user;
}
