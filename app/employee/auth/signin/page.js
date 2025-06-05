"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductLogo from "@/public/icons/productLogo";

export default function EmployeeSignIn() {
  const [formData, setFormData] = useState({
    employeeId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {      const response = await fetch("http://localhost:5000/api/auth/employee/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store employee token and data
        localStorage.setItem("employeeToken", data.token);
        localStorage.setItem("employeeData", JSON.stringify(data.employee));
        
        // Redirect based on first login status
        if (data.employee.isFirstLogin) {
          router.push("/employee/onboarding");
        } else {
          router.push("/employee/dashboard");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <ProductLogo />
            <div className="text-2xl font-bold text-gray-800">Synapt HR</div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Employee Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your employee account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
            <div className="space-y-4">
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                Employee ID or Email
              </label>
              <input
                id="employeeId"
                name="employeeId"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your employee ID or email"
                value={formData.employeeId}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/employee/auth/forgot-password" className="text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              New employee?{" "}
              <Link href="/employee/onboarding" className="text-blue-600 hover:text-blue-500">
                Complete your onboarding
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
