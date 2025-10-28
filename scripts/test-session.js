#!/usr/bin/env node

/**
 * Test Session Creation
 * Tests if session creation works with the updated code
 */

const baseUrl = "http://localhost:3000";

async function testSessionCreation() {
  console.log("🧪 Testing Session Creation...\n");

  try {
    // Test 1: Check if we can create a session via registration
    console.log("1️⃣ Testing session creation via registration...");

    const testUser = {
      firstName: "Test",
      lastName: "User",
      email: `test-${Date.now()}@example.com`,
      password: "TestPassword123!",
      confirmPassword: "TestPassword123!",
    };

    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testUser),
    });

    console.log(`Registration status: ${registerResponse.status}`);

    if (registerResponse.ok) {
      console.log("✅ Registration successful");

      // Check if we can get user info
      const meResponse = await fetch(`${baseUrl}/api/auth/me`);
      console.log(`Auth status: ${meResponse.status}`);

      if (meResponse.status === 200) {
        const userData = await meResponse.json();
        console.log("✅ Session creation working");
        console.log(
          `User: ${userData.user?.firstName} ${userData.user?.lastName}`
        );
      } else {
        console.log("❌ Session not created properly");
      }
    } else {
      const errorData = await registerResponse.json();
      console.log(
        `❌ Registration failed: ${errorData.error || "Unknown error"}`
      );
    }

    console.log("\n2️⃣ Testing Google OAuth flow...");

    // Test Google OAuth initiation
    const googleResponse = await fetch(`${baseUrl}/api/auth/google`, {
      method: "GET",
      redirect: "manual",
    });

    if (googleResponse.status === 307 || googleResponse.status === 302) {
      console.log("✅ Google OAuth initiation working");
      console.log("💡 Try clicking the Google login button in your browser");
    } else {
      console.log(
        `❌ Google OAuth initiation failed: ${googleResponse.status}`
      );
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
testSessionCreation();
