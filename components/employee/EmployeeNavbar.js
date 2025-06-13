"use client";
import React, { useState, useEffect } from "react";
import Notification from "../../public/icons/notification";
import Settings from "../../public/icons/settings";
import Search from "../../public/icons/search";
import { useRouter } from "next/navigation";

const EmployeeNavbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employee, setEmployee] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("employeeToken");
    const userData = localStorage.getItem("employeeData");
    if (token && userData) {
      setEmployee(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, []);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("employeeToken");
    localStorage.removeItem("employeeData");
    router.push("/employee/auth/signin");
  };

  return (
    <div className="wrap flex items-center justify-between gap-4 py-2 px-4 border-b border-gray-200">
      <div className="w-full flex justify-end items-center">
        <div className="searchbar border w-[260px] flex items-center justify-center px-2 h-[45px] rounded-lg border-main">
          <div>
            <Search />
          </div>
          <input
            type="text"
            placeholder="Search documents, policies..."
            className="w-full h-full focus:outline-none mx-2 px-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="h-fit p-3 flex items-center justify-center w-fit rounded-lg">
        <Notification />
      </div>

      <div className="h-fit p-3 flex items-center justify-center w-fit rounded-lg">
        <Settings />
      </div>

      <div className="h-fit flex p-1 border border-main items-center justify-center w-fit rounded-lg">
        <img
          src="/images/profile.png"
          alt="Profile"
          className="h-8 w-8 rounded object-cover"
        />{" "}
        <div className="flex flex-col px-2">
          <div className="text-sm font-medium">
            {employee?.firstName || "Employee"}
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-red-500 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeNavbar;
