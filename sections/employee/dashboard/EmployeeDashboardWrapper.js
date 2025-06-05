"use client";
import React from "react";
import EmployeeProfileCard from "./EmployeeProfileCard";
import EmployeeQuickActions from "./EmployeeQuickActions";
import EmployeeAttendanceCard from "./EmployeeAttendanceCard";
import EmployeeLeaveBalance from "./EmployeeLeaveBalance";
import EmployeeUpcomingEvents from "./EmployeeUpcomingEvents";
import EmployeeRecentDocuments from "./EmployeeRecentDocuments";
import EmployeeAnnouncements from "./EmployeeAnnouncements";

const EmployeeDashboardWrapper = ({ dashboardData }) => {
  if (!dashboardData) {
    return (
      <div className="p-6">
        <div className="text-center">Loading your dashboard...</div>
      </div>
    );
  }

  const {
    employee,
    attendance,
    leaves,
    documents,
    career
  } = dashboardData;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {employee?.name || "Employee"}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your work today.
        </p>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <EmployeeQuickActions attendanceData={attendance} />
          
          {/* Attendance & Leave Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EmployeeAttendanceCard attendanceData={attendance} />
            <EmployeeLeaveBalance leaveData={leaves} />
          </div>

          {/* Recent Documents */}
          <EmployeeRecentDocuments documentsData={documents} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Profile Card */}
          <EmployeeProfileCard employeeData={employee} />
          
          {/* Upcoming Events */}
          <EmployeeUpcomingEvents />
          
          {/* Announcements */}
          <EmployeeAnnouncements />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboardWrapper;
