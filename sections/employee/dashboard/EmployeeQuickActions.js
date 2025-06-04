import React, { useState } from "react";
import Calendar from "@/public/icons/calendar";
import Folder from "@/public/icons/folder";
import User from "@/public/icons/user";
import DocumentFile from "@/public/icons/documentFile";
import Link from "next/link";

const EmployeeQuickActions = ({ attendanceData }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleClockAction = async () => {
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("employeeToken");
      const action = attendanceData?.isCheckedIn ? "clock-out" : "clock-in";
      
      const response = await fetch(`http://localhost:5000/api/employee/attendance/${action}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Successfully ${action === "clock-in" ? "clocked in" : "clocked out"}!`);
        // Refresh the page to update attendance data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setMessage(data.message || "Action failed");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Request Leave",
      description: "Apply for time off",
      icon: <Calendar color="blue" />,
      href: "/employee/leaves/request",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: attendanceData?.isCheckedIn ? "Clock Out" : "Clock In",
      description: attendanceData?.isCheckedIn ? "End your work day" : "Start your work day",
      icon: <User color="green" />,
      action: handleClockAction,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      loading: loading
    },
    {
      title: "Upload Document",
      description: "Submit documents",
      icon: <DocumentFile color="purple" />,
      href: "/employee/documents/upload",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "Career Development",
      description: "View skill roadmap",
      icon: <Folder color="orange" />,
      href: "/employee/career-development",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      
      {message && (
        <div className={`mb-4 p-3 rounded-md text-sm ${
          message.includes("Successfully") 
            ? "bg-green-100 text-green-700" 
            : "bg-red-100 text-red-700"
        }`}>
          {message}
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          if (action.href) {
            return (
              <Link
                key={index}
                href={action.href}
                className="group p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                  {action.icon}
                </div>
                <h4 className={`font-medium ${action.textColor} group-hover:${action.textColor}`}>
                  {action.title}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {action.description}
                </p>
              </Link>
            );
          } else {
            return (
              <button
                key={index}
                onClick={action.action}
                disabled={action.loading}
                className="group p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 text-left disabled:opacity-50"
              >
                <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                  {action.icon}
                </div>
                <h4 className={`font-medium ${action.textColor} group-hover:${action.textColor}`}>
                  {action.loading ? "Processing..." : action.title}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {action.description}
                </p>
              </button>
            );
          }
        })}
      </div>
    </div>
  );
};

export default EmployeeQuickActions;
