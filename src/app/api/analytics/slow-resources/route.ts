import { NextRequest, NextResponse } from "next/server";
import { apiRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = apiRateLimit(request);
    if (rateLimitResponse.status !== 200) {
      return rateLimitResponse;
    }

    const resourceData = await request.json();

    // Log slow resources (in production, you'd send to your monitoring service)
    console.warn("Slow resource detected:", {
      name: resourceData.name,
      duration: resourceData.duration,
      size: resourceData.size,
      timestamp: resourceData.timestamp,
    });

    // Here you could send to external services like:
    // - Google Analytics
    // - Custom performance monitoring
    // - APM tools
    // - Alerting systems

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing slow resource report:", error);
    return NextResponse.json(
      { error: "Failed to process slow resource report" },
      { status: 500 }
    );
  }
}
