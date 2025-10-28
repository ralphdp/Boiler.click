import { NextRequest, NextResponse } from "next/server";
import { apiRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = apiRateLimit(request);
    if (rateLimitResponse.status !== 200) {
      return rateLimitResponse;
    }

    const performanceData = await request.json();

    // Log performance metrics (in production, you'd send to your analytics service)
    console.log("Performance metric received:", {
      name: performanceData.name,
      duration: performanceData.duration,
      timestamp: performanceData.timestamp,
    });

    // Here you could send to external services like:
    // - Google Analytics
    // - Mixpanel
    // - Custom performance monitoring
    // - APM tools like New Relic

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing performance metric:", error);
    return NextResponse.json(
      { error: "Failed to process performance metric" },
      { status: 500 }
    );
  }
}
