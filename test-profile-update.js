// Test file for employee profile update functionality
const BASE_URL = "http://localhost:5000";

// Mock token for testing (you can replace with actual employee token if available)
const MOCK_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

async function testProfileUpdate() {
  console.log("🧪 Testing Employee Profile Update API...\n");

  try {
    // Test 1: Personal Info Update
    console.log("1️⃣ Testing Personal Info Update");
    const personalInfoData = {
      personalInfo: {
        firstName: "John",
        lastName: "Doe Updated",
        dateOfBirth: "1990-01-15",
        gender: "male",
        maritalStatus: "married",
        nationality: "American",
        address: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
    };

    const personalResponse = await fetch(
      `${BASE_URL}/api/employee/profile?name=John Doe`,
      {
        method: "PUT",
        headers: {
          Authorization: MOCK_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(personalInfoData),
      }
    );

    console.log(`Status: ${personalResponse.status}`);
    if (personalResponse.ok) {
      const result = await personalResponse.json();
      console.log("✅ Personal Info update successful");
      console.log(
        "Updated fields:",
        Object.keys(personalInfoData.personalInfo)
      );
    } else {
      const error = await personalResponse.text();
      console.log("❌ Personal Info update failed:", error);
    }

    // Test 2: Contact Info Update
    console.log("\n2️⃣ Testing Contact Info Update");
    const contactInfoData = {
      contactInfo: {
        email: "john.doe.updated@company.com",
        phone: "+1-555-0199",
        alternativePhone: "+1-555-0299",
        workEmail: "john.work@company.com",
        linkedinProfile: "https://linkedin.com/in/johndoe",
        skypeId: "john.doe.skype",
      },
    };

    const contactResponse = await fetch(
      `${BASE_URL}/api/employee/profile?name=John Doe`,
      {
        method: "PUT",
        headers: {
          Authorization: MOCK_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactInfoData),
      }
    );

    console.log(`Status: ${contactResponse.status}`);
    if (contactResponse.ok) {
      const result = await contactResponse.json();
      console.log("✅ Contact Info update successful");
      console.log("Updated fields:", Object.keys(contactInfoData.contactInfo));
    } else {
      const error = await contactResponse.text();
      console.log("❌ Contact Info update failed:", error);
    }

    // Test 3: Emergency Contact Update
    console.log("\n3️⃣ Testing Emergency Contact Update");
    const emergencyContactData = {
      emergencyContact: {
        name: "Jane Doe",
        relationship: "spouse",
        phone: "+1-555-0300",
        alternativePhone: "+1-555-0301",
        email: "jane.doe@email.com",
        address: "123 Main Street, New York, NY 10001",
      },
    };

    const emergencyResponse = await fetch(
      `${BASE_URL}/api/employee/profile?name=John Doe`,
      {
        method: "PUT",
        headers: {
          Authorization: MOCK_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emergencyContactData),
      }
    );

    console.log(`Status: ${emergencyResponse.status}`);
    if (emergencyResponse.ok) {
      const result = await emergencyResponse.json();
      console.log("✅ Emergency Contact update successful");
      console.log(
        "Updated fields:",
        Object.keys(emergencyContactData.emergencyContact)
      );
    } else {
      const error = await emergencyResponse.text();
      console.log("❌ Emergency Contact update failed:", error);
    }

    // Test 4: Bank Details Update
    console.log("\n4️⃣ Testing Bank Details Update");
    const bankDetailsData = {
      bankDetails: {
        bankName: "Chase Bank",
        accountNumber: "****1234",
        routingNumber: "021000021",
        accountType: "checking",
        accountHolderName: "John Doe",
        swiftCode: "CHASUS33",
        iban: "US64SVBKUS6S3300958879",
      },
    };

    const bankResponse = await fetch(
      `${BASE_URL}/api/employee/profile?name=John Doe`,
      {
        method: "PUT",
        headers: {
          Authorization: MOCK_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bankDetailsData),
      }
    );

    console.log(`Status: ${bankResponse.status}`);
    if (bankResponse.ok) {
      const result = await bankResponse.json();
      console.log("✅ Bank Details update successful");
      console.log("Updated fields:", Object.keys(bankDetailsData.bankDetails));
    } else {
      const error = await bankResponse.text();
      console.log("❌ Bank Details update failed:", error);
    }

    // Test 5: Preferences Update
    console.log("\n5️⃣ Testing Preferences Update");
    const preferencesData = {
      preferences: {
        language: "en",
        timezone: "America/New_York",
        theme: "dark",
        dateFormat: "MM/dd/yyyy",
        timeFormat: "12h",
        notifications: {
          email: true,
          sms: false,
          push: true,
          leaveRequests: true,
          attendance: true,
          payroll: true,
          announcements: false,
        },
      },
    };

    const preferencesResponse = await fetch(
      `${BASE_URL}/api/employee/profile?name=John Doe`,
      {
        method: "PUT",
        headers: {
          Authorization: MOCK_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferencesData),
      }
    );

    console.log(`Status: ${preferencesResponse.status}`);
    if (preferencesResponse.ok) {
      const result = await preferencesResponse.json();
      console.log("✅ Preferences update successful");
      console.log(
        "Updated notification settings:",
        Object.keys(preferencesData.preferences.notifications)
      );
    } else {
      const error = await preferencesResponse.text();
      console.log("❌ Preferences update failed:", error);
    }

    // Test 6: Multiple Sections Update
    console.log("\n6️⃣ Testing Multiple Sections Update");
    const multipleData = {
      personalInfo: {
        firstName: "John",
        lastName: "Doe Multi",
      },
      contactInfo: {
        phone: "+1-555-MULTI",
      },
      preferences: {
        theme: "light",
      },
    };

    const multipleResponse = await fetch(
      `${BASE_URL}/api/employee/profile?name=John Doe`,
      {
        method: "PUT",
        headers: {
          Authorization: MOCK_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(multipleData),
      }
    );

    console.log(`Status: ${multipleResponse.status}`);
    if (multipleResponse.ok) {
      const result = await multipleResponse.json();
      console.log("✅ Multiple sections update successful");
      console.log("Updated sections:", Object.keys(multipleData));
    } else {
      const error = await multipleResponse.text();
      console.log("❌ Multiple sections update failed:", error);
    }

    // Test 7: Error Handling - Invalid Section
    console.log("\n7️⃣ Testing Error Handling - Invalid Section");
    const invalidData = {
      invalidSection: {
        someField: "value",
      },
    };

    const invalidResponse = await fetch(
      `${BASE_URL}/api/employee/profile?name=John Doe`,
      {
        method: "PUT",
        headers: {
          Authorization: MOCK_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidData),
      }
    );

    console.log(`Status: ${invalidResponse.status}`);
    if (invalidResponse.status === 400) {
      const error = await invalidResponse.json();
      console.log("✅ Error handling works correctly");
      console.log("Error message:", error.message);
    } else {
      console.log("❌ Error handling failed - should return 400 status");
    }

    // Test 8: Error Handling - Missing Employee Name
    console.log("\n8️⃣ Testing Error Handling - Missing Employee Name");
    const noNameResponse = await fetch(`${BASE_URL}/api/employee/profile`, {
      method: "PUT",
      headers: {
        Authorization: MOCK_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(personalInfoData),
    });

    console.log(`Status: ${noNameResponse.status}`);
    if (noNameResponse.status === 400) {
      const error = await noNameResponse.json();
      console.log("✅ Missing name error handling works correctly");
      console.log("Error message:", error.message);
    } else {
      console.log("❌ Missing name error handling failed");
    }

    console.log("\n🎉 Profile Update API Testing Complete!");
  } catch (error) {
    console.error("❌ Test execution failed:", error.message);
  }
}

// Run the test
testProfileUpdate();
