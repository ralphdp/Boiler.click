import { NextRequest, NextResponse } from "next/server";
import { apiRateLimit } from "@/lib/rate-limit";
import {
  createValidatedApiHandler,
  CommonSchemas,
  createSuccessResponse,
  createErrorResponse,
} from "@/lib/api-validation";
import { z } from "zod";

// Web Vitals validation schema
const webVitalsSchema = z.object({
  name: z.string().min(1, "Metric name is required"),
  value: z.number().min(0, "Value must be positive"),
  delta: z.number(),
  id: z.string().min(1, "Metric ID is required"),
  navigationType: z.string().optional(),
  timestamp: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = apiRateLimit(request);
    if (rateLimitResponse.status !== 200) {
      return rateLimitResponse;
    }

    // Validate request body
    const body = await request.json();
    const validation = webVitalsSchema.safeParse(body);

    if (!validation.success) {
      return createErrorResponse(
        "Invalid web vital data",
        400,
        validation.error.errors
      );
    }

    const metric = validation.data;

    // Log web vitals (in production, you'd send to your analytics service)
    console.log("Web Vital received:", {
      name: metric.name,
      value: metric.value,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      timestamp: metric.timestamp || new Date().toISOString(),
    });

    // Here you could send to external services like:
    // - Google Analytics
    // - Mixpanel
    // - Custom analytics database
    // - Logging service like DataDog

    return createSuccessResponse({
      message: "Web vital recorded successfully",
      metricId: metric.id,
    });
  } catch (error) {
    console.error("Error processing web vital:", error);
    return createErrorResponse("Failed to process web vital", 500);
  }
}
