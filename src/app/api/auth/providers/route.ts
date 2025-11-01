import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

export async function GET(request: NextRequest) {
  try {
    // Return which OAuth providers are configured
    const providers = {
      google: !!(config.auth.google.clientId && config.auth.google.clientSecret),
      github: !!(config.auth.github.clientId && config.auth.github.clientSecret),
      discord: !!(config.auth.discord.clientId && config.auth.discord.clientSecret),
      facebook: !!(config.auth.facebook.clientId && config.auth.facebook.clientSecret),
      twitter: !!(config.auth.twitter.clientId && config.auth.twitter.clientSecret),
    };

    return NextResponse.json({ providers }, { status: 200 });
  } catch (error) {
    console.error("Get providers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}

