// Test script specifically for clock-out
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

async function testClockOut() {
  console.log("🧪 Testing Clock-Out Functionality");
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

    // Test clock-out
    console.log("\n⏰ Testing clock-out endpoint...");
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
    console.log("Clock-out response data:", JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("✅ Clock-out successful");

      // Now test clock-in again
      console.log("\n⏰ Testing clock-in after clock-out...");
      const clockInResponse = await makeRequest(
        `${BACKEND_URL}/api/employee/attendance/clock-in`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const clockInData = await clockInResponse.json();
      console.log("Clock-in response status:", clockInResponse.status);
      console.log(
        "Clock-in response data:",
        JSON.stringify(clockInData, null, 2)
      );

      if (clockInResponse.ok) {
        console.log("✅ Clock-in after clock-out successful");
      } else {
        console.error(
          "❌ Clock-in after clock-out failed:",
          clockInData.message
        );
      }
    } else {
      console.error("❌ Clock-out failed:", data.message);
    }

    console.log("\n🏁 Test completed");
  } catch (error) {
    console.error("❌ Test error:", error.message);
  }
}

testClockOut().catch(console.error);
