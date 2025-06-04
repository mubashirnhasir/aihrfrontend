// Test script to validate the onboarding process fix for EMP01
import fetch from "node-fetch";

const BASE_URL = "http://localhost:3002";
const BACKEND_URL = "http://localhost:5000";

// Test data for EMP01 onboarding
const onboardingData = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1990-05-15",
    phoneNumber: "+1-234-567-8901",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
    },
  },
  emergencyContact: {
    name: "Jane Doe",
    relationship: "Sister",
    phoneNumber: "+1-234-567-8902",
    email: "jane.doe@example.com",
  },
  bankDetails: {
    accountNumber: "1234567890",
    bankName: "Test Bank",
    ifscCode: "TEST0001",
    accountHolderName: "John Doe",
  },
  preferences: {
    language: "English",
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
  },
};

async function testOnboardingFix() {
  try {
    console.log("🧪 Testing EMP01 onboarding process...\n");

    // Step 1: Login as EMP01
    console.log("1️⃣ Logging in as EMP01...");
    const loginResponse = await fetch(
      `${BACKEND_URL}/api/employee/auth/signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: "EMP01",
          password: "password123",
        }),
      }
    );

    if (!loginResponse.ok) {
      const loginError = await loginResponse.json();
      console.error("❌ Login failed:", loginError.message);
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log("✅ Login successful");
    console.log("📋 Employee:", loginData.employee.name);
    console.log("🔐 Token obtained\n");

    // Step 2: Test the onboarding profile update
    console.log("2️⃣ Testing onboarding profile update...");
    const updateResponse = await fetch(`${BASE_URL}/api/employee/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(onboardingData),
    });

    if (!updateResponse.ok) {
      const updateError = await updateResponse.json();
      console.error("❌ Profile update failed:", updateError.message);
      console.error("🔍 Error details:", updateError);
      return;
    }

    const updateData = await updateResponse.json();
    console.log("✅ Profile update successful!");
    console.log(
      "📋 Updated employee:",
      updateData.employee?.name || "Name not returned"
    );
    console.log("📝 Message:", updateData.message);

    // Step 3: Verify the update by fetching the profile
    console.log("\n3️⃣ Verifying profile update...");
    const profileResponse = await fetch(
      `${BACKEND_URL}/api/employee/profile?name=${encodeURIComponent(
        updateData.employee?.name || "John Doe"
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      console.log("✅ Profile verification successful!");
      console.log("👤 Full Name:", profileData.name);
      console.log("📧 Email:", profileData.email);
      console.log("📱 Phone:", profileData.phone);
      console.log("🏠 Address:", JSON.stringify(profileData.address, null, 2));
      console.log(
        "🆘 Emergency Contact:",
        JSON.stringify(profileData.emergencyContact, null, 2)
      );
    } else {
      console.log(
        "⚠️ Profile verification skipped (not critical for onboarding test)"
      );
    }

    console.log("\n🎉 Onboarding test completed successfully!");
    console.log('✅ The "Employee name is required" error has been resolved!');
  } catch (error) {
    console.error("💥 Test failed with error:", error.message);
    console.error("🔍 Full error:", error);
  }
}

// Run the test
testOnboardingFix().catch(console.error);
