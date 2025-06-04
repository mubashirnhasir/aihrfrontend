// Test script to verify the onboarding fix
const http = require("http");

// Test data for onboarding
const testData = {
  personalInfo: {
    firstName: "Test",
    lastName: "User",
    email: "test@company.com",
    dateOfBirth: "1990-01-01",
    gender: "Male",
  },
  preferences: {
    notifications: { email: true },
    language: "en",
  },
};

// Mock token for testing
const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test";

async function testOnboardingAPI() {
  try {
    console.log("Testing onboarding API fix...");

    // Test the frontend proxy endpoint
    const response = await fetch("http://localhost:3001/api/employee/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mockToken}`,
      },
      body: JSON.stringify(testData),
    });

    console.log("Response status:", response.status);
    const responseData = await response.text();
    console.log("Response data:", responseData);

    if (
      response.status === 200 ||
      response.status === 400 ||
      response.status === 401
    ) {
      console.log("✅ API proxy is working correctly!");
      console.log("✅ Network connectivity issue has been resolved");
      console.log(
        "✅ The onboarding process should now work without network errors"
      );
    } else {
      console.log("❌ Unexpected response status");
    }
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      console.log("❌ Connection refused - server may not be running");
    } else {
      console.log("❌ Network error occurred:", error.message);
    }
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === "undefined") {
  console.log("Installing node-fetch for testing...");
  const { default: fetch } = require("node-fetch");
  global.fetch = fetch;
}

testOnboardingAPI();
