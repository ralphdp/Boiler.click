import { NextRequest, NextResponse } from "next/server";

interface RateLimitConfig {
  limit: number;
  windowMs: number;
  message?: string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function createRateLimit(config: RateLimitConfig) {
  return function rateLimitMiddleware(request: NextRequest) {
    const ip =
      request.headers.get("x-forwarded-for") ?? 
      request.headers.get("x-real-ip") ?? 
      "127.0.0.1";
    const key = `${ip}:${request.nextUrl.pathname}`;

    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired one
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return NextResponse.next();
    }

    if (entry.count >= config.limit) {
      return new NextResponse(
        JSON.stringify({
          error: config.message || "Too many requests",
          retryAfter: Math.ceil((entry.resetTime - now) / 1000),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.ceil((entry.resetTime - now) / 1000).toString(),
            "X-RateLimit-Limit": config.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": entry.resetTime.toString(),
          },
        }
      );
    }

    entry.count++;
    return NextResponse.next();
  };
}

// Predefined rate limiters
export const apiRateLimit = createRateLimit({
  limit: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: "API rate limit exceeded",
});

export const authRateLimit = createRateLimit({
  limit: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: "Authentication rate limit exceeded",
});

export const contactRateLimit = createRateLimit({
  limit: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Contact form rate limit exceeded",
});

export const newsletterRateLimit = createRateLimit({
  limit: 1,
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  message: "Newsletter subscription rate limit exceeded",
});

// IP-based blocking for suspicious activity
const blockedIPs = new Set<string>();
const suspiciousActivity = new Map<
  string,
  { count: number; lastSeen: number }
>();

export function checkBlockedIP(ip: string): boolean {
  return blockedIPs.has(ip);
}

export function recordSuspiciousActivity(ip: string): void {
  const now = Date.now();
  const activity = suspiciousActivity.get(ip);

  if (!activity) {
    suspiciousActivity.set(ip, { count: 1, lastSeen: now });
    return;
  }

  // Reset if more than 1 hour has passed
  if (now - activity.lastSeen > 60 * 60 * 1000) {
    activity.count = 1;
    activity.lastSeen = now;
    return;
  }

  activity.count++;
  activity.lastSeen = now;

  // Block IP if too many suspicious activities
  if (activity.count > 10) {
    blockedIPs.add(ip);
    suspiciousActivity.delete(ip);
  }
}

// Clean up old suspicious activity records
setInterval(() => {
  const now = Date.now();
  for (const [ip, activity] of suspiciousActivity.entries()) {
    if (now - activity.lastSeen > 24 * 60 * 60 * 1000) {
      // 24 hours
      suspiciousActivity.delete(ip);
    }
  }
}, 60 * 60 * 1000); // Check every hour
