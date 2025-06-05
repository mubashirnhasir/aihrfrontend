// Create a fresh test employee for testing clock-in/clock-out
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

async function createTestEmployee() {
  console.log("🧪 Creating Fresh Test Employee for Clock-In/Clock-Out Testing");
  console.log("=" + "=".repeat(70));

  try {
    // First, get admin token (assuming you have admin login)
    console.log("🔐 Getting admin token...");
    const adminSigninResponse = await makeRequest(
      `${BACKEND_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "admin@company.com",
          password: "admin123",
        }),
      }
    );

    let token = null;
    if (adminSigninResponse.ok) {
      const adminData = await adminSigninResponse.json();
      token = adminData.token;
      console.log("✅ Admin signin successful");
    } else {
      console.log("❌ Admin signin failed, trying with employee token...");
      // Fall back to employee token for creating employees
      const empSigninResponse = await makeRequest(
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

      if (empSigninResponse.ok) {
        const empData = await empSigninResponse.json();
        token = empData.token;
        console.log("✅ Using employee token instead");
      }
    }

    if (!token) {
      console.error("❌ Could not get authentication token");
      return;
    }

    // Create a new test employee
    console.log("\n👤 Creating new test employee...");
    const newEmployeeData = {
      name: "Test Clock Employee",
      email: "testclock@company.com",
      employeeId: "TESTCLOCK001",
      password: "testpassword123",
      designation: "Test Developer",
      department: "QA",
      phone: "1234567890",
      address: "Test Address",
    };

    const createResponse = await makeRequest(`${BACKEND_URL}/api/employees`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEmployeeData),
    });

    const createData = await createResponse.json();
    console.log("Create employee response status:", createResponse.status);
    console.log(
      "Create employee response:",
      JSON.stringify(createData, null, 2)
    );

    if (createResponse.ok) {
      console.log("✅ Test employee created successfully");

      // Now test clock-in with the new employee
      console.log("\n⏰ Testing clock-in with new employee...");
      const empSigninResponse = await makeRequest(
        `${BACKEND_URL}/api/auth/employee/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId: "TESTCLOCK001",
            password: "testpassword123",
          }),
        }
      );

      if (empSigninResponse.ok) {
        const empData = await empSigninResponse.json();
        const empToken = empData.token;
        console.log("✅ New employee signin successful");

        // Test clock-in
        const clockInResponse = await makeRequest(
          `${BACKEND_URL}/api/employee/attendance/clock-in`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${empToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const clockInData = await clockInResponse.json();
        console.log("Clock-in response status:", clockInResponse.status);
        console.log("Clock-in response:", JSON.stringify(clockInData, null, 2));

        if (clockInResponse.ok) {
          console.log("✅ Clock-in successful!");

          // Wait a moment and test clock-out
          console.log("\n⏳ Waiting 2 seconds before testing clock-out...");
          await new Promise((resolve) => setTimeout(resolve, 2000));

          const clockOutResponse = await makeRequest(
            `${BACKEND_URL}/api/employee/attendance/clock-out`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${empToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          const clockOutData = await clockOutResponse.json();
          console.log("Clock-out response status:", clockOutResponse.status);
          console.log(
            "Clock-out response:",
            JSON.stringify(clockOutData, null, 2)
          );

          if (clockOutResponse.ok) {
            console.log("✅ Clock-out successful!");
            console.log(
              "\n🎉 CLOCK-IN/CLOCK-OUT FUNCTIONALITY IS WORKING CORRECTLY!"
            );
          } else {
            console.error("❌ Clock-out failed:", clockOutData.message);
          }
        } else {
          console.error("❌ Clock-in failed:", clockInData.message);
        }
      } else {
        console.error("❌ New employee signin failed");
      }
    } else {
      console.error("❌ Failed to create test employee:", createData.message);
    }

    console.log("\n🏁 Test completed");
  } catch (error) {
    console.error("❌ Test error:", error.message);
  }
}

createTestEmployee().catch(console.error);
