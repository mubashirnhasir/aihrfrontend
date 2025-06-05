// Test script to check attendance data and test fresh clock-in/clock-out cycle
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

async function testAttendanceFlow() {
  console.log("🧪 Testing Complete Attendance Flow");
  console.log("=" + "=".repeat(50));

  try {
    // First, get auth token
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
    if (!signinResponse.ok) {
      console.error("❌ Employee signin failed:", signinData.message);
      return;
    }

    console.log("✅ Employee signin successful");
    const token = signinData.token;

    // Check current attendance data
    console.log("\n📊 Checking current attendance data...");
    const attendanceResponse = await makeRequest(
      `${BACKEND_URL}/api/employee/attendance`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const attendanceData = await attendanceResponse.json();
    console.log("Attendance response status:", attendanceResponse.status);
    console.log("Attendance data:", JSON.stringify(attendanceData, null, 2));

    // Get dashboard data to see today's status
    console.log("\n📋 Checking dashboard data...");
    const dashboardResponse = await makeRequest(
      `${BACKEND_URL}/api/employee/dashboard`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const dashboardData = await dashboardResponse.json();
    if (dashboardResponse.ok) {
      console.log(
        "Today's attendance status:",
        JSON.stringify(dashboardData.data.attendance, null, 2)
      );
    }

    console.log("\n🏁 Test completed");
  } catch (error) {
    console.error("❌ Test error:", error.message);
  }
}

testAttendanceFlow().catch(console.error);
