// Test script to debug clock-in/clock-out issues
const https = require("https");
const http = require("http");

const BACKEND_URL = "http://localhost:5000";

function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: options.method || "GET",
      headers: options.headers || {},
    };

    const req = http.request(requestOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: () => Promise.resolve(jsonData),
          });
        } catch (e) {
          resolve({
            ok: false,
            status: res.statusCode,
            json: () => Promise.resolve({ message: data }),
          });
        }
      });
    });

    req.on("error", reject);

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function testEmployeeAuth() {
  console.log("🔐 Testing employee authentication...");

  try {
    // First, sign in with a test employee
    const signinResponse = await makeRequest(
      `${BACKEND_URL}/api/auth/employee/signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: "EMP001",
          password: "password123",
        }),
      }
    );

    const signinData = await signinResponse.json();
    console.log("Signin response:", signinData);

    if (!signinResponse.ok) {
      console.error("❌ Employee signin failed:", signinData.message);
      return null;
    }

    console.log("✅ Employee signin successful");
    return signinData.token;
  } catch (error) {
    console.error("❌ Auth test error:", error.message);
    return null;
  }
}

async function testClockIn(token) {
  console.log("\n⏰ Testing clock-in endpoint...");

  try {
    const response = await makeRequest(
      `${BACKEND_URL}/api/employee/attendance/clock-in`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log("Clock-in response status:", response.status);
    console.log("Clock-in response data:", data);

    if (response.ok) {
      console.log("✅ Clock-in successful");
      return true;
    } else {
      console.error("❌ Clock-in failed:", data.message);
      return false;
    }
  } catch (error) {
    console.error("❌ Clock-in test error:", error.message);
    return false;
  }
}

async function testClockOut(token) {
  console.log("\n⏰ Testing clock-out endpoint...");

  try {
    const response = await makeRequest(
      `${BACKEND_URL}/api/employee/attendance/clock-out`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log("Clock-out response status:", response.status);
    console.log("Clock-out response data:", data);

    if (response.ok) {
      console.log("✅ Clock-out successful");
      return true;
    } else {
      console.error("❌ Clock-out failed:", data.message);
      return false;
    }
  } catch (error) {
    console.error("❌ Clock-out test error:", error.message);
    return false;
  }
}

async function testAttendanceEndpoints() {
  console.log("🧪 Testing Attendance Clock-In/Clock-Out Endpoints");
  console.log("=" + "=".repeat(60));

  const token = await testEmployeeAuth();
  if (!token) {
    console.log("\n❌ Cannot test attendance endpoints without valid token");
    return;
  }

  // Test clock-in
  const clockInSuccess = await testClockIn(token);

  if (clockInSuccess) {
    // Wait a moment then test clock-out
    console.log("\n⏳ Waiting 2 seconds before testing clock-out...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await testClockOut(token);
  }

  console.log("\n🏁 Test completed");
}

// Run the test
testAttendanceEndpoints().catch(console.error);
