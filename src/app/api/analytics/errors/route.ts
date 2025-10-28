import { NextRequest, NextResponse } from "next/server";
import { apiRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = apiRateLimit(request);
    if (rateLimitResponse.status !== 200) {
      return rateLimitResponse;
    }

    const errorData = await request.json();

    // Log error (in production, you'd send to your error tracking service)
    console.error("Error tracked:", {
      message: errorData.message,
      stack: errorData.stack,
      context: errorData.context,
      url: errorData.url,
      userAgent: errorData.userAgent,
      timestamp: errorData.timestamp,
    });

    // Here you could send to external services like:
    // - Sentry
    // - Bugsnag
    // - LogRocket
    // - Custom error database

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing error report:", error);
    return NextResponse.json(
      { error: "Failed to process error report" },
      { status: 500 }
    );
  }
}
