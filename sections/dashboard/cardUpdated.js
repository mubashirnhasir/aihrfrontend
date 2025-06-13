"use client";

import User from "@/public/icons/user";
import React, { useState, useEffect } from "react";
import CardGlobal from "../cardGlobal";
import Arrow from "@/public/icons/arrowleft";
import Dashboard from "@/public/icons/dashboard";
import DocumentFile from "@/public/icons/documentFile";
import { fetchAllEmployees, calculateEmployeeStats } from "@/lib/employeeUtils";
import { useRouter } from "next/navigation";

const Card = () => {
  const router = useRouter();
  const [employeeStats, setEmployeeStats] = useState({
    totalEmployees: 0,
    employeesOnLeave: 0,
    newHires: 0,
    employeesReliving: 0,
    loading: true,
    error: null,
  }); // Fetch employee data from the API
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // Fetch employee data for detailed statistics
        const employees = await fetchAllEmployees();
        const stats = calculateEmployeeStats(employees); // Fetch accurate leave count from dedicated endpoint
        const leaveResponse = await fetch("/api/on-leave-today");
        const leaveData = await leaveResponse.json();
        console.log("Dashboard: Leave data from API:", leaveData);
        const actualEmployeesOnLeave = leaveData.success
          ? leaveData.count
          : stats.employeesOnLeave;
        console.log(
          "Dashboard: Setting employees on leave count to:",
          actualEmployeesOnLeave
        );

        setEmployeeStats({
          ...stats,
          employeesOnLeave: actualEmployeesOnLeave, // Use the accurate count from backend
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setEmployeeStats({
          totalEmployees: 0,
          employeesOnLeave: 0,
          newHires: 0,
          employeesReliving: 0,
          loading: false,
          error: "Failed to load employee data",
        });
      }
    };

    fetchEmployeeData();

    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(fetchEmployeeData, 30000);

    return () => clearInterval(interval);
  }, []);

  const getDisplayValue = (value) => {
    if (employeeStats.loading) return "Loading...";
    if (employeeStats.error) return "Error";
    return value;
  };
  const data = [
    {
      heading: "Total employees",
      count: getDisplayValue(employeeStats.totalEmployees),
      bg: "bg-blue-100",
      border: "border-blue-500",
      href: "/dashboard/attendance/allemployees",
    },
    {
      heading: "Employees on leave",
      count: getDisplayValue(employeeStats.employeesOnLeave),
      bg: "bg-yellow-100",
      border: "border-yellow-500",
      href: "/dashboard/leaves/employees-on-leave",
    },
    {
      heading: "New Hires",
      count: getDisplayValue(employeeStats.newHires),
      bg: "bg-green-100",
      border: "border-green-500",
      href: "/dashboard/attendance/new-hires",
    },
    {
      heading: "Employees Reliving",
      count: getDisplayValue(employeeStats.employeesReliving),
      bg: "bg-red-100",
      border: "border-red-500",
      href: "/dashboard/attendance/allemployees",
    },
  ];

  const svg = [
    <User key="user" />,
    <Arrow key="arrow" />,
    <Dashboard key="dashboard" />,
    <DocumentFile key="document" />,
  ];

  return (
    <div className="space-y-4">
      {" "}
      <div className="flex h-full items-start gap-8 w-full">
        {data.map((item, index) => (
          <div key={index}>
            <CardGlobal
              title={item.heading}
              count={item.count}
              icon={svg[index]}
              bg={item.bg}
              border={item.border}
              href={item.href}
            />
          </div>
        ))}
      </div>
      {/* Error message display */}
      {employeeStats.error && (
        <div className="text-center">
          <div className="text-red-600 text-sm mb-2">
            ⚠️ {employeeStats.error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 text-sm hover:underline"
          >
            Refresh Page
          </button>
        </div>
      )}
      {/* Loading indicator */}
      {employeeStats.loading && (
        <div className="text-center text-gray-500 text-sm">
          <div className="animate-pulse">Fetching employee data...</div>
        </div>
      )}
    </div>
  );
};

export default Card;
