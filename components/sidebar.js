"use client";
import React, { useEffect, useState } from "react";
import Dashboard from "../public/icons/dashboard";
import User from "../public/icons/user";
import Folder from "../public/icons/folder";
import Calendar from "../public/icons/calendar";
import Assets from "../public/icons/assets";
import Arrow from "../public/icons/arrowleft";
import Logobtn from "@/public/icons/logobtn";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductLogo from "@/public/icons/productLogo";
import {
  BrainCircuit,
  CopySlash,
  FileText,
  FileUser,
  LayoutDashboard,
  MonitorSmartphone,
  PlaneLanding,
  TentTree,
  TrendingUp,
} from "lucide-react";

const Sidebar = () => {
  const [side, setSide] = useState(false);
  const [tab1, setTab1] = useState(0);
  const router = useRouter();

  // Load tab index from localStorage on mount
  useEffect(() => {
    const savedTab = localStorage.getItem("sidebarTab");
    if (savedTab !== null) {
      setTab1(parseInt(savedTab));
    }
  }, []);

  const handleTab = (e, route) => {
    setTab1(e);
    localStorage.setItem("sidebarTab", e); // Save tab index to localStorage
    router.push(route); // Navigate to the route
  };

  const handleSidebar = () => {
    setSide(!side);
  };

  return (
    <div
      className={`h-screen px-4 flex justify-between relative flex-col gap-4 py-4  transition-all border-r border-main  duration-300 ${
        side ? "w-[5%]" : "w-[14%]"
      } `}
    >
      <div>
        <div className="logo mb-6 flex items-center gap-4 text-xl font-semibold">
          <div>
            <ProductLogo />{" "}
          </div>
          <div>Synapt HR</div>{" "}
        </div>        <div className="tabs flex flex-col gap-2">
          <div
            onClick={() => handleTab(0, "/dashboard")}
            className={`px-2 py-2 flex gap-2 cursor-pointer items-center justify-start rounded-lg ${
              tab1 === 0 ? "btnPrimary text-white" : "bg-white text-gray-500"
            }`}
          >
            <div className="flex gap-2 items-center justify-center ">
              <div>
                {/* <Dashboard color={`${tab1 === 0 ? "white" : "black"}`} /> */}
                <LayoutDashboard />
              </div>
              {!side && <div className="text-lg font-medium">Dashboard</div>}
            </div>
          </div>
          <div
            onClick={() => handleTab(1, "/dashboard/attendance")}
            className={`px-2 py-2 rounded-lg flex gap-2 cursor-pointer items-center justify-start ${
              tab1 === 1 ? "btnPrimary text-white" : "bg-white text-gray-500"
            }`}
          >
            <div className="flex gap-2 items-center justify-center ">
              <div>
                {/* <User color={`${tab1 === 1 ? "white" : "black"}`} /> */}
                <FileUser />
              </div>
              {!side && <div className="text-lg font-medium">Attendance</div>}
            </div>
          </div>
          <div
            onClick={() => handleTab(2, "/dashboard/leaves")}
            className={`px-2 py-2  rounded-lg flex gap-2 cursor-pointer items-center justify-start ${
              tab1 === 2 ? "btnPrimary text-white" : "bg-white text-gray-500"
            }`}
          >
            <div className="flex gap-2 items-center justify-center ">
              <div>
                {/* <Folder color={`${tab1 === 2 ? "white" : "black"}`} /> */}
                <TentTree />
              </div>
              {!side && <div className="text-lg font-medium">Leaves</div>}
            </div>
          </div>
          <div
            onClick={() => handleTab(3, "/dashboard/documents")}
            className={`px-2 py-2 flex gap-2 cursor-pointer items-center justify-start rounded-lg ${
              tab1 === 3 ? "btnPrimary text-white" : "bg-white text-gray-500"
            }`}
          >
            <div className="flex gap-2 items-center justify-center ">
              <div>
                {/* <Calendar color={`${tab1 === 3 ? "white" : "black"}`} /> */}
                <FileText />
              </div>
              {!side && <div className="text-lg font-medium">Documents</div>}
            </div>
          </div>
          <div
            onClick={() => handleTab(4, "/dashboard/assets")}
            className={`px-2 py-2 flex gap-2 cursor-pointer items-center justify-start rounded-lg ${
              tab1 === 4 ? "btnPrimary text-white" : "bg-white text-gray-500"
            }`}
          >
            <div className="flex gap-2 items-center justify-center ">
              <div>
                {/* <Assets color={`${tab1 === 4 ? "white" : "black"}`} /> */}
                <MonitorSmartphone />
              </div>
              {!side && <div className="text-lg font-medium">Assets</div>}
            </div>
          </div>
          <div
            onClick={() => handleTab(5, "/dashboard/employee-retention")}
            className={`px-2 py-2 flex gap-2 cursor-pointer items-center justify-start rounded-lg ${
              tab1 === 5 ? "btnPrimary text-white" : "bg-white text-gray-500"
            }`}
          >
            <div className="flex gap-2 items-center justify-center ">
              <div>
                <PlaneLanding />
              </div>
              {!side && (
                <div className="text-lg font-medium">AI Retention</div>
              )}
            </div>
          </div>
          <div
            onClick={() => handleTab(6, "/dashboard/aiagent")}
            className={`px-2 py-2 flex gap-2 cursor-pointer items-center justify-start rounded-lg ${
              tab1 === 6 ? "btnPrimary text-white" : "bg-white text-gray-500"
            }`}
          >
            <div className="flex gap-2 items-center justify-center ">
              <div>
                <BrainCircuit />
              </div>
              {!side && (
                <div className="text-lg font-medium">AI Chatbot </div>
              )}
            </div>
          </div>
        </div>
        <div
          onClick={() => handleSidebar()}
          className="absolute border border-gray-300 flex cursor-pointer items-center justify-center h-10 w-10 top-10 right-[-20] z-[10] bg-white rounded-full  "
          style={{
            boxShadow:
              "0px 6px 6px -6px rgba(0, 0, 0, 0.16), 0px 0px 1px 0px rgba(0, 0, 0, 0.40)",
          }}
        >
          {!side ? (
            <div className="">
              <Arrow />
            </div>
          ) : (
            <div className="transform rotate-180">
              <Arrow />
            </div>
          )}
        </div>
      </div>

      {!side && (
        <div className=" relative p-2 text-white flex items-center justify-center bg-[linear-gradient(15deg,_#4A25E1_26.3%,_#6946F4_54.5%,_#7B5AFF_80.11%)] h-[240px] rounded-lg  ">
          <div className="absolute top-[-50] left-[50%] translate-x-[-50%]">
            <Logobtn />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="font-semibold text-xl text-white">
              AI Features Suite
            </div>
            <div className="text-center text-sm">
              Try Our AI-Powered Tools: Screening, Job Descriptions & Emails
            </div>
            <Link
              href="/dashboard/ai-features"
              className="px-4 py-2 cursor-pointer rounded-lg bg-white/20 text-white font-semibold hover:bg-white/30 transition-colors"
            >
              Try AI Features
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
