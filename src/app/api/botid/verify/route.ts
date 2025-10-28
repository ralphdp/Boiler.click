import { NextRequest, NextResponse } from "next/server";
import { verifyBotId, isBotIdEnabled } from "@/lib/botid";

export async function POST(request: NextRequest) {
  try {
    // In development, always return success
    if (!isBotIdEnabled()) {
      return NextResponse.json({
        success: true,
        message: "BotID disabled in development",
        score: 1.0,
        riskLevel: "low",
        isBot: false,
      });
    }

    // Use official BotID verification (no token needed)
    const result = await verifyBotId();

    // Check if the result indicates a bot
    if (result.isBot) {
      return NextResponse.json(
        {
          success: false,
          error: "Bot detected",
          riskLevel: result.riskLevel,
          isBot: result.isBot,
          score: result.score,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "BotID verified successfully",
      score: result.score,
      riskLevel: result.riskLevel,
      isBot: result.isBot,
    });
  } catch (error) {
    console.error("BotID verification error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
