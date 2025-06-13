"use client";
import React, { useState, useEffect, useRef } from "react";
import Notification from "../public/icons/notification";
import Settings from "../public/icons/settings";
import Search from "../public/icons/search";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Don't render if not authenticated
  if (!isAuthenticated()) {
    return null;
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
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
            placeholder="Search here "
            className="w-full h-full focus:outline-none mx-2 px-2"
          />
        </div>
      </div>
      <div className=" h-fit p-3 flex items-center justify-center w-fit rounded-lg">
        <Notification />
      </div>
      <div className=" h-fit p-3 flex items-center justify-center w-fit rounded-lg">
        <Settings />
      </div>
        {/* User Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <div 
          className="h-fit flex p-1 border border-main items-center justify-center w-fit rounded-lg cursor-pointer hover:bg-gray-50"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <img
            src="/images/profile.png"
            alt="Profile Picture"
            className="object-cover rounded-lg w-10 h-10"
          />
        </div>
        
        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-900">{user?.username || 'Admin User'}</div>
              <div className="text-sm text-gray-500">{user?.email || 'admin@synapthr.com'}</div>
            </div>
            <div className="py-1">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Navbar;
