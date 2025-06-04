"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EmployeeDashboardWrapper from "@/sections/employee/dashboard/EmployeeDashboardWrapper";

export default function EmployeeDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("employeeToken");
      if (!token) {
        router.push("/employee/auth/signin");
        return;
      }

      const response = await fetch("http://localhost:5000/api/employee/dashboard", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data.data);
      } else if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("employeeToken");
        localStorage.removeItem("employeeData");
        router.push("/employee/auth/signin");
      } else {
        setError("Failed to load dashboard data");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <EmployeeDashboardWrapper dashboardData={dashboardData} />
    </div>
  );
}
