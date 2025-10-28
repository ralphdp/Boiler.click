#!/usr/bin/env node

/**
 * OAuth Test Script
 * Tests the OAuth flow by making requests to the API endpoints
 */

const baseUrl = "http://localhost:3000";

async function testOAuthFlow() {
  console.log("🧪 Testing OAuth Flow...\n");

  try {
    // Test 1: Check if Google OAuth initiation works
    console.log("1️⃣ Testing Google OAuth initiation...");
    const googleInitResponse = await fetch(`${baseUrl}/api/auth/google`, {
      method: "GET",
      redirect: "manual", // Don't follow redirects
    });

    if (
      googleInitResponse.status === 307 ||
      googleInitResponse.status === 302
    ) {
      const location = googleInitResponse.headers.get("location");
      console.log("✅ Google OAuth initiation successful");
      console.log(`📍 Redirect URL: ${location?.substring(0, 100)}...`);

      if (location?.includes("accounts.google.com")) {
        console.log("✅ Redirecting to Google OAuth correctly");
      } else {
        console.log("❌ Not redirecting to Google OAuth");
      }
    } else {
      console.log(
        `❌ Google OAuth initiation failed with status: ${googleInitResponse.status}`
      );
    }

    console.log("\n2️⃣ Testing GitHub OAuth initiation...");
    const githubInitResponse = await fetch(`${baseUrl}/api/auth/github`, {
      method: "GET",
      redirect: "manual",
    });

    if (
      githubInitResponse.status === 307 ||
      githubInitResponse.status === 302
    ) {
      const location = githubInitResponse.headers.get("location");
      console.log("✅ GitHub OAuth initiation successful");
      console.log(`📍 Redirect URL: ${location?.substring(0, 100)}...`);

      if (location?.includes("github.com")) {
        console.log("✅ Redirecting to GitHub OAuth correctly");
      } else {
        console.log("❌ Not redirecting to GitHub OAuth");
      }
    } else {
      console.log(
        `❌ GitHub OAuth initiation failed with status: ${githubInitResponse.status}`
      );
    }

    console.log("\n3️⃣ Testing auth status endpoint...");
    const authStatusResponse = await fetch(`${baseUrl}/api/auth/me`);

    if (authStatusResponse.status === 401) {
      console.log("✅ Auth status endpoint working (401 - not authenticated)");
    } else {
      console.log(
        `❌ Auth status endpoint unexpected status: ${authStatusResponse.status}`
      );
    }

    console.log("\n🎉 OAuth flow test completed!");
    console.log("\n📝 Next steps:");
    console.log(
      "1. Make sure your Google OAuth app is configured in Google Cloud Console"
    );
    console.log(
      "2. Set the redirect URI to: http://localhost:3000/api/auth/google/callback"
    );
    console.log("3. Try clicking the Google login button in your app");
    console.log("4. Check the browser console for any errors");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.log("\n💡 Make sure your development server is running:");
    console.log("   npm run dev");
  }
}

// Run the test
testOAuthFlow();
