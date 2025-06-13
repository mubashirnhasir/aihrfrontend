"use client";
import Search from "@/public/icons/search";
import React, { useEffect, useState } from "react";
import EmployeeCard from "../attendance/employeeCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const NewHires = () => {
  const [searchText, setSearchText] = useState("");
  const [newHires, setNewHires] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewHires = async () => {
      try {
        const response = await fetch("/api/employees");
        const employees = await response.json();

        if (response.ok && Array.isArray(employees)) {
          // Calculate employees hired this month
          const today = new Date();
          const firstDayOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
          );

          const hiredThisMonth = employees.filter((emp) => {
            const joinDate = new Date(emp.joiningDate || emp.createdAt);
            return joinDate >= firstDayOfMonth && joinDate <= today;
          });

          // Sort by joining date (newest first)
          hiredThisMonth.sort((a, b) => {
            const dateA = new Date(a.joiningDate || a.createdAt);
            const dateB = new Date(b.joiningDate || b.createdAt);
            return dateB - dateA;
          });

          setNewHires(hiredThisMonth);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching new hires:", error);
        setLoading(false);
      }
    };

    fetchNewHires();

    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(fetchNewHires, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredEmployees = newHires.filter(
    (emp) =>
      emp.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.designation?.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.department?.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  const getCurrentMonthYear = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="contain px-2 relative">
      <Link
        href={"/dashboard"}
        className="flex items-center justify-start px-4 py-2 border-b border-gray-200"
      >
        <ArrowLeft /> Go Back
      </Link>

      <div className="top flex justify-between items-end">
        <div className="text flex flex-col gap-2 px-2">
          <div className="font-semibold text-2xl">New Hires</div>
          <div className="font-medium supporting-text">
            Employees who joined in {getCurrentMonthYear()}
          </div>
        </div>

        <div className="BtnContainer flex gap-2 h-fit ">
          <div className="search flex items-center justify-start border-main rounded-lg w-[300px] ">
            <div className="px-2">
              <Search />
            </div>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              type="text"
              placeholder="Search New Hires..."
              className="w-full h-full items-center focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="p-2 w-full h-full mt-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading new hires...</div>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">
              {newHires.length === 0
                ? `No new hires in ${getCurrentMonthYear()}`
                : "No employees match your search criteria"}
            </div>
          </div>
        ) : (
          <div className="flex gap-4 flex-wrap">
            {filteredEmployees.map((emp, index) => (
              <NewHireCard key={emp._id || index} employee={emp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Custom card component for new hires
const NewHireCard = ({ employee }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysAgo = (dateString) => {
    const joinDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - joinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays === 0) return "Today";
    return `${diffDays} days ago`;
  };

  const joinDate = employee.joiningDate || employee.createdAt;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 w-[280px]">
      {/* Status indicator */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-600">NEW HIRE</span>
        </div>
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {getDaysAgo(joinDate)}
        </span>
      </div>

      {/* Employee image and basic info */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 mb-3 overflow-hidden">
          {employee.profilePicture ? (
            <img
              src={employee.profilePicture}
              alt={employee.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-semibold">
              {employee.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <h3 className="font-semibold text-lg text-center">{employee.name}</h3>
        <p className="text-sm text-gray-600">{employee.designation}</p>
      </div>

      {/* Employee details */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">#</span>
          <span className="text-gray-700">
            {employee.employeeId || employee._id?.slice(-6) || "N/A"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500">🏢</span>
          <span className="text-gray-700">{employee.department || "N/A"}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500">📧</span>
          <span className="text-gray-700 truncate">{employee.email}</span>
        </div>

        {/* Joining date */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500">📅</span>
          <span className="text-gray-700">Joined: {formatDate(joinDate)}</span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500">⚡</span>
          <span className="text-gray-700 capitalize">
            {employee.status || "Active"}
          </span>
        </div>

        {/* Phone number if available */}
        {employee.phone && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500">📱</span>
            <span className="text-gray-700">{employee.phone}</span>
          </div>
        )}
      </div>

      {/* Action button */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <Link
          href={`/dashboard/attendance/allemployees?search=${encodeURIComponent(
            employee.name
          )}`}
          className="text-blue-600 text-sm hover:underline"
        >
          View Employee Details
        </Link>
      </div>
    </div>
  );
};

export default NewHires;
