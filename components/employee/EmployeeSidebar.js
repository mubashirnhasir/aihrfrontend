"use client";
import React, { useState, useEffect } from "react";
import Dashboard from "../../public/icons/dashboard";
import User from "../../public/icons/user";
import Folder from "../../public/icons/folder";
import Calendar from "../../public/icons/calendar";
import Assets from "../../public/icons/assets";
import Arrow from "../../public/icons/arrowleft";
import Logobtn from "@/public/icons/logobtn";
import ProductLogo from "@/public/icons/productLogo";
import Link from "next/link";
import { BrainCircuit } from "lucide-react";

const EmployeeSidebar = () => {
  const [side, setSide] = useState(false);
  const [tab1, setTab1] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("employeeToken");
    const userData = localStorage.getItem("employeeData");
    setIsAuthenticated(token && userData);
  }, []);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleTab = (e) => {
    setTab1(e);
  };

  const handleSidebar = () => {
    setSide(!side);
  };
  const employeeNavItems = [
    {
      icon: <Dashboard color={tab1 === 0 ? "white" : "black"} />,
      label: "Dashboard",
      href: "/employee/dashboard",
      index: 0,
    },
    {
      icon: <User color={tab1 === 1 ? "white" : "black"} />,
      label: "My Profile",
      href: "/employee/profile",
      index: 1,
    },
    {
      icon: <Calendar color={tab1 === 2 ? "white" : "black"} />,
      label: "My Attendance",
      href: "/employee/attendance",
      index: 2,
    },
    {
      icon: <Folder color={tab1 === 3 ? "white" : "black"} />,
      label: "Leave Requests",
      href: "/employee/leaves",
      index: 3,
    },
    {
      icon: <Assets color={tab1 === 4 ? "white" : "black"} />,
      label: "My Documents",
      href: "/employee/documents",
      index: 4,
    },
    {
      icon: <User color={tab1 === 5 ? "white" : "black"} />,
      label: "Career Development",
      href: "/employee/career",
      index: 5,
    },
    {
      icon: (
        <BrainCircuit
          size={20}
          color={tab1 === 6 ? "white" : "currentColor"}
        />
      ),
      label: "AI Chatbot",
      href: "/employee/aiagent",
      index: 6,
    },
  ];

  return (
    <div
      className={`h-screen px-4 flex justify-between relative flex-col gap-4 py-4 transition-all border-r border-main duration-300 ${
        side ? "w-[5%]" : "w-[14%]"
      }`}
    >
      {" "}
      <div>
        <div className="logo mb-6 flex items-center gap-3">
          <ProductLogo />
          {!side && (
            <div className="text-xl font-bold text-gray-800">Synapt HR</div>
          )}
        </div>
        <div
          onClick={handleSidebar}
          className="absolute top-6 right-[-18px] z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white shadow-md"
        >
          <div className={`${side ? "rotate-180" : ""} transition-transform`}>
            <Arrow />
          </div>
        </div>
        <div className="tabs flex flex-col gap-2">
          {employeeNavItems.map((item) => (
            <div
              key={item.index}
              onClick={() => handleTab(item.index)}
              className={`px-2 py-2 flex gap-2 cursor-pointer items-center justify-start rounded-lg ${
                tab1 === item.index
                  ? "btnPrimary text-white"
                  : "bg-white text-gray-500"
              }`}
            >
              <div className="flex gap-2 items-center justify-center">
                <Link className="flex gap-2" href={item.href}>
                  <div>{item.icon}</div>
                  {!side && <div>{item.label}</div>}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bottom flex flex-col gap-2">
        {!side && (
          <div className="relative mt-10 p-4 text-white flex flex-col items-center justify-center bg-[linear-gradient(15deg,_#4A25E1_26.3%,_#6946F4_54.5%,_#7B5AFF_80.11%)] rounded-2xl">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                <BrainCircuit size={32} color="#6946F4" />
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-2 pt-8">
              <div className="font-bold text-lg text-white">Need Help?</div>
              <div className="text-sm opacity-90 leading-relaxed px-2">
                Contact HR or check our knowledge base
              </div>
              <Link
                href="/employee/help"
                className="px-5 py-2 mt-2 cursor-pointer rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/20"
              >
                Get Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeSidebar;
