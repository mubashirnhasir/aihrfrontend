"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TestLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleTestLogin = async () => {
    setLoading(true);

    // Set the fresh test token in localStorage (generated just now)
    const testToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3M2Q2YmJjOGIyMWIxYzAyYjA3OTdmMCIsImVtcGxveWVlSWQiOiJFTVAwMDEiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDk1OTI0MTIsImV4cCI6MTc0OTY3ODgxMn0.nlWwuGkPm4uPRpmAFRXoh4IWYwPDRj2RMIcl_yTUtUs";

    const testEmployeeData = {
      id: "673d6bbc8b21b1c02b0797f0",
      employeeId: "EMP001",
      email: "test@example.com",
      name: "Test Employee",
      isFirstLogin: true,
    };

    localStorage.setItem("employeeToken", testToken);
    localStorage.setItem("employeeData", JSON.stringify(testEmployeeData));

    console.log("✅ Test login successful!");
    console.log("🔑 Token set:", testToken.substring(0, 50) + "...");

    // Redirect to onboarding
    router.push("/employee/onboarding");
    setLoading(false);
  };

  const handleRealLogin = () => {
    router.push("/employee/auth/signin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Login</h1>
          <p className="text-gray-600">Choose how to proceed</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleTestLogin}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Setting up..." : "🧪 Quick Test Login (Skip Auth)"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <button
            onClick={handleRealLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            🔐 Real Employee Login
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Test Login Info:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Uses valid JWT token</li>
            <li>• Employee ID: EMP001</li>
            <li>• Email: test@example.com</li>
            <li>• Token valid for 24 hours</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
