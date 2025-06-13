"use client";

import Arrow from "@/public/icons/arrowleft";
import Dashboard from "@/public/icons/dashboard";
import DocumentFile from "@/public/icons/documentFile";
import { User } from "lucide-react";
import React, { useState, useEffect } from "react";
import CardGlobal from "../cardGlobal";

const LeaveCard = () => {
  const [leaveStats, setLeaveStats] = useState({
    employeesOnLeave: 0,
    requestsToApprove: 0,
    approvedLeavesThisMonth: 0,
    rejectedLeavesThisMonth: 0,
    loading: true,
    error: null,
  });
  // Fetch leave data from the API
  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await fetch("/api/employees");
        const employees = await response.json();

        if (response.ok && Array.isArray(employees)) {
          // Calculate leave statistics from employee data
          const today = new Date();
          const firstDayOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
          );

          let requestsToApprove = 0;
          let approvedLeavesThisMonth = 0;
          let rejectedLeavesThisMonth = 0;

          employees.forEach((emp) => {
            if (emp.leaveRequests && Array.isArray(emp.leaveRequests)) {
              emp.leaveRequests.forEach((leave) => {
                const leaveCreatedDate = new Date(
                  leave.createdAt || leave.startDate
                );

                // Check for pending requests
                if (leave.status === "pending") {
                  requestsToApprove++;
                }

                // Check for approved leaves this month
                if (
                  leave.status === "approved" &&
                  leaveCreatedDate >= firstDayOfMonth
                ) {
                  approvedLeavesThisMonth++;
                }

                // Check for rejected leaves this month
                if (
                  leave.status === "rejected" &&
                  leaveCreatedDate >= firstDayOfMonth
                ) {
                  rejectedLeavesThisMonth++;
                }
              });
            }
          });

          // Get accurate employees on leave count from dedicated endpoint
          const leaveResponse = await fetch('/api/on-leave-today');
          const leaveData = await leaveResponse.json();
          const employeesOnLeave = leaveData.success ? leaveData.count : 0;

          setLeaveStats({
            employeesOnLeave,
            requestsToApprove,
            approvedLeavesThisMonth,
            rejectedLeavesThisMonth,
            loading: false,
            error: null,
          });
        } else {
          throw new Error("Failed to fetch employee data");
        }
      } catch (error) {
        console.error("Error fetching leave data:", error);
        setLeaveStats({
          employeesOnLeave: 0,
          requestsToApprove: 0,
          approvedLeavesThisMonth: 0,
          rejectedLeavesThisMonth: 0,
          loading: false,
          error: "Failed to load leave data",
        });
      }
    };    fetchLeaveData();
    
    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(fetchLeaveData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getDisplayValue = (value) => {
    if (leaveStats.loading) return "Loading...";
    if (leaveStats.error) return "Error";
    return value;
  };
  const data = [
    {
      heading: "Employees on Leave",
      count: getDisplayValue(leaveStats.employeesOnLeave),
      bg: "bg-blue-100",
      border: "border-blue-500",
      href: null, // No navigation for this card
    },
    {
      heading: "Requests to Approve",
      count: getDisplayValue(leaveStats.requestsToApprove),
      bg: "bg-yellow-100",
      border: "border-yellow-500",
      href: "/dashboard/leaves/requests", // Navigate to admin leave requests page
    },
    {
      heading: "Approved Leaves this month",
      count: getDisplayValue(leaveStats.approvedLeavesThisMonth),
      bg: "bg-green-100",
      border: "border-green-500",
      href: "/dashboard/leaves/requests?status=approved", // Navigate to approved leaves
    },
    {
      heading: "Rejected Leave this Month",
      count: getDisplayValue(leaveStats.rejectedLeavesThisMonth),
      bg: "bg-red-100",
      border: "border-red-500",
      href: "/dashboard/leaves/requests?status=rejected", // Navigate to rejected leaves
    },
  ];

  const svg = [<User />, <Arrow />, <Dashboard />, <DocumentFile />];

  return (
    <div className="space-y-4">      <div className="flex h-full items-start  gap-8 w-full">
        {data.map((cardData, index) => (
          <div key={index}>
            <CardGlobal
              title={cardData.heading}
              count={cardData.count}
              icon={svg[index]}
              bg={cardData.bg}
              border={cardData.border}
              href={cardData.href}
            />
          </div>
        ))}
      </div>

      {/* Error message display */}
      {leaveStats.error && (
        <div className="text-center">
          <div className="text-red-600 text-sm mb-2">⚠️ {leaveStats.error}</div>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 text-sm hover:underline"
          >
            Refresh Page
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {leaveStats.loading && (
        <div className="text-center text-gray-500 text-sm">
          <div className="animate-pulse">Fetching leave data...</div>
        </div>
      )}
    </div>
  );
};

export default LeaveCard;
