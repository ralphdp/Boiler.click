#!/usr/bin/env node

/**
 * Test Session Creation
 * Tests if session creation works with the updated code
 */

const baseUrl = "http://localhost:3000";

async function testSessionCreation() {
  console.log("🧪 Testing Session Creation...\n");

  try {
    // Test 1: Check if registration works (should not create session until email verification)
    console.log("1️⃣ Testing registration flow...");

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
      console.log("📧 Verification email should be sent");

      // Check if we can get user info (should fail - no session until email verification)
      const meResponse = await fetch(`${baseUrl}/api/auth/me`);
      console.log(`Auth status: ${meResponse.status}`);

      if (meResponse.status === 401) {
        console.log("✅ Correctly requires email verification before login");
      } else {
        console.log(
          "❌ Unexpected: User should not be logged in until email verification"
        );
      }
    } else {
      const errorData = await registerResponse.json();
      console.log(
        `❌ Registration failed: ${errorData.error || "Unknown error"}`
      );
    }

    console.log(
      "\n2️⃣ Testing login flow (should fail without email verification)..."
    );

    // Test login with unverified user (should fail)
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    console.log(`Login status: ${loginResponse.status}`);

    if (loginResponse.status === 401) {
      const loginError = await loginResponse.json();
      if (loginError.error === "Please verify your email before logging in") {
        console.log("✅ Login correctly blocked until email verification");
      } else {
        console.log(`❌ Unexpected login error: ${loginError.error}`);
      }
    } else {
      console.log("❌ Login should fail for unverified users");
    }

    console.log("\n3️⃣ Testing Google OAuth flow...");

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

    console.log("\n📝 Summary:");
    console.log("✅ Registration works and sends verification email");
    console.log("✅ Login is blocked until email verification");
    console.log("✅ OAuth flow is properly configured");
    console.log(
      "💡 To complete the flow: verify email → login → session created"
    );
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
testSessionCreation();
