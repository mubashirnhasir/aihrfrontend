// Test script to verify the employee profile fix
const https = require("https");
const http = require("http");

// Test configuration
const FRONTEND_URL = "http://localhost:3000";
const BACKEND_URL = "http://localhost:5000";

// Test employee credentials
const TEST_EMPLOYEE = {
  employeeId: "EMP01",
  password: "test123",
};

async function testProfileFix() {
  console.log("🔧 Testing Employee Profile Fix...\n");

  try {
    // Step 1: Test backend server is running
    console.log("1. Testing backend server connection...");
    await testServerConnection(BACKEND_URL);
    console.log("✅ Backend server is running\n");

    // Step 2: Test employee signin
    console.log("2. Testing employee authentication...");
    const authResult = await testEmployeeAuth();

    if (!authResult.success) {
      console.log("❌ Authentication failed:", authResult.error);
      return;
    }

    console.log("✅ Employee authentication successful");
    console.log(`   Token: ${authResult.token.substring(0, 20)}...`);
    console.log(`   Employee: ${authResult.employee.name}\n`);

    // Step 3: Test profile API endpoint
    console.log("3. Testing profile API endpoint...");
    const profileResult = await testProfileAPI(authResult.token);

    if (!profileResult.success) {
      console.log("❌ Profile API test failed:", profileResult.error);
      return;
    }

    console.log("✅ Profile API working correctly");
    console.log(`   Employee Name: ${profileResult.data.name}`);
    console.log(`   Employee ID: ${profileResult.data.employeeId}`);
    console.log(`   Has Personal Info: ${!!profileResult.data.personalInfo}`);
    console.log(`   Has Contact Info: ${!!profileResult.data.contactInfo}\n`);

    // Step 4: Test frontend API proxy
    console.log("4. Testing frontend API proxy...");
    const proxyResult = await testFrontendProxy(authResult.token);

    if (!proxyResult.success) {
      console.log("❌ Frontend proxy test failed:", proxyResult.error);
      return;
    }

    console.log("✅ Frontend API proxy working correctly\n");

    console.log("🎉 ALL TESTS PASSED!");
    console.log("\n📝 Summary:");
    console.log("- Backend server is running on port 5000");
    console.log("- Employee authentication is working");
    console.log("- Profile API endpoint is functioning");
    console.log("- Frontend API proxy is operational");
    console.log("\n✅ The profile error should be resolved!");
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
  }
}

function testServerConnection(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: "/api/employee/dashboard",
      method: "GET",
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      resolve(true);
    });

    req.on("error", (error) => {
      reject(new Error(`Backend server not responding: ${error.message}`));
    });

    req.on("timeout", () => {
      reject(new Error("Backend server connection timeout"));
    });

    req.end();
  });
}

function testEmployeeAuth() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      employeeId: TEST_EMPLOYEE.employeeId,
      password: TEST_EMPLOYEE.password,
    });

    const options = {
      hostname: "localhost",
      port: 5000,
      path: "/api/auth/employee/signin",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
      },
    };

    const req = http.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          const result = JSON.parse(responseData);
          if (res.statusCode === 200 && result.token) {
            resolve({
              success: true,
              token: result.token,
              employee: result.employee,
            });
          } else {
            resolve({
              success: false,
              error: result.message || "Authentication failed",
            });
          }
        } catch (error) {
          resolve({
            success: false,
            error: "Invalid response format",
          });
        }
      });
    });

    req.on("error", (error) => {
      resolve({
        success: false,
        error: error.message,
      });
    });

    req.write(data);
    req.end();
  });
}

function testProfileAPI(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path: "/api/employee/profile",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          const result = JSON.parse(responseData);
          if (res.statusCode === 200) {
            resolve({
              success: true,
              data: result,
            });
          } else {
            resolve({
              success: false,
              error: result.message || "Profile API failed",
            });
          }
        } catch (error) {
          resolve({
            success: false,
            error: "Invalid response format",
          });
        }
      });
    });

    req.on("error", (error) => {
      resolve({
        success: false,
        error: error.message,
      });
    });

    req.end();
  });
}

function testFrontendProxy(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/employee/profile",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve({
            success: true,
          });
        } else {
          resolve({
            success: false,
            error: `Status ${res.statusCode}: ${responseData}`,
          });
        }
      });
    });

    req.on("error", (error) => {
      resolve({
        success: false,
        error: error.message,
      });
    });

    req.end();
  });
}

// Run the test
testProfileFix();
