"use client";

import { useState, useEffect } from "react";
import CardGlobal from "../cardGlobal";
import User from "@/public/icons/user";
import Arrow from "@/public/icons/arrowleft";
import Dashboard from "@/public/icons/dashboard";
import DocumentFile from "@/public/icons/documentFile";

const AttendanceCards = () => {
  const [attendanceStats, setAttendanceStats] = useState({
    todaysAttendance: 0,
    onTime: 0,
    lateCome: 0,
    loading: true,
    error: null,
  }); // Fetch attendance data from the API
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        // Fetch total employee count for attendance calculations
        const countResponse = await fetch("/api/employees/count");
        const countData = await countResponse.json();

        let totalEmployees = 0;

        if (countResponse.ok && countData.success) {
          totalEmployees = countData.count;
        } else {
          // Fall back to fetching all employees if count endpoint fails
          const employeesResponse = await fetch("/api/employees");
          const employees = await employeesResponse.json();

          if (employeesResponse.ok && Array.isArray(employees)) {
            totalEmployees = employees.length;
          } else {
            throw new Error("Failed to fetch employee data");
          }
        }
        if (totalEmployees > 0) {
          // Calculate today's attendance statistics                    // For now, we'll use mock calculations based on employee count
          // In a real implementation, you'd fetch actual attendance records
          const todaysAttendance = Math.floor(totalEmployees * 0.85); // 85% attendance rate
          const onTime = Math.floor(todaysAttendance * 0.78); // 78% on time
          const lateCome = todaysAttendance - onTime;

          setAttendanceStats({
            todaysAttendance,
            onTime,
            lateCome,
            loading: false,
            error: null,
          });
        } else {
          throw new Error("Failed to fetch employee data");
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setAttendanceStats({
          todaysAttendance: 0,
          onTime: 0,
          lateCome: 0,
          loading: false,
          error: "Failed to load attendance data",
        });
      }
    };

    fetchAttendanceData();
  }, []);

  const getDisplayValue = (value) => {
    if (attendanceStats.loading) return "Loading...";
    if (attendanceStats.error) return "Error";
    return value;
  };

  const data = [
    {
      heading: "Todays Attendance",
      count: getDisplayValue(attendanceStats.todaysAttendance),
      bg: "bg-blue-100",
      border: "border-blue-500",
    },
    {
      heading: "On Time",
      count: getDisplayValue(attendanceStats.onTime),
      bg: "bg-yellow-100",
      border: "border-yellow-500",
    },
    {
      heading: "Late Come",
      count: getDisplayValue(attendanceStats.lateCome),
      bg: "bg-green-100",
      border: "border-green-500",
    },
  ];

  const svg = [<User />, <Arrow />, <Dashboard />, <DocumentFile />];
  return (
    <div className="space-y-4">
      <div className="flex h-full items-start  gap-8 w-full">
        {data.map((data, index) => (
          <div key={index}>
            <CardGlobal
              title={data.heading}
              count={data.count}
              icon={svg[index]}
              bg={data.bg}
              border={data.border}
            />
          </div>
        ))}
      </div>

      {/* Error message display */}
      {attendanceStats.error && (
        <div className="text-center">
          <div className="text-red-600 text-sm mb-2">
            ⚠️ {attendanceStats.error}
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
      {attendanceStats.loading && (
        <div className="text-center text-gray-500 text-sm">
          <div className="animate-pulse">Fetching attendance data...</div>
        </div>
      )}
    </div>
  );
};

export default AttendanceCards;
