"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EmployeeNavbar from "@/components/employee/EmployeeNavbar";
import EmployeeSidebar from "@/components/employee/EmployeeSidebar";
import EmployeeLeaveStatus from "@/sections/employee/leaves/EmployeeLeaveStatus";
import useNotification from "@/hooks/useNotification";

export default function EmployeeLeaves() {  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState({
    casual: 1,
    sick: 2,
    earned: 1,
    unpaid: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [previousRequests, setPreviousRequests] = useState([]);
  const router = useRouter();
  const { notifications, showSuccess, showInfo } = useNotification();
  useEffect(() => {
    const token = localStorage.getItem("employeeToken");
    if (!token) {
      router.push("/employee/auth/signin");
      return;
    }
    fetchLeaveData();
  }, [router]);
  // Refresh data when page becomes visible (user returns from request page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchLeaveData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Also refresh data when component mounts
    const handleFocus = () => {
      fetchLeaveData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Real-time polling for leave status updates
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const interval = setInterval(() => {
      fetchLeaveData(true); // Silent refresh for real-time updates
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [isRealTimeEnabled]);
  const fetchLeaveData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      
      const token = localStorage.getItem("employeeToken");
      const response = await fetch(
        "http://localhost:5000/api/employee/leaves",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const newLeaveBalance = {
          casual: data.casualLeaves || 1,
          sick: data.sickLeaves || 2,
          earned: data.earnedLeaves || 1,
          unpaid: data.unpaidLeaves || 0,
        };
          // Only update state if data has actually changed
        const hasBalanceChanged = JSON.stringify(newLeaveBalance) !== JSON.stringify(leaveBalance);
        const hasRequestsChanged = JSON.stringify(data.leaveRequests || []) !== JSON.stringify(leaveRequests);
        
        if (hasBalanceChanged || hasRequestsChanged || !silent) {
          // Check for status changes in leave requests
          if (silent && previousRequests.length > 0) {
            const newRequests = data.leaveRequests || [];
            
            newRequests.forEach(newRequest => {
              const previousRequest = previousRequests.find(req => req._id === newRequest._id);
              if (previousRequest && previousRequest.status !== newRequest.status) {
                // Status changed - show notification
                const statusText = newRequest.status.charAt(0).toUpperCase() + newRequest.status.slice(1);
                const leaveType = newRequest.leaveType || newRequest.type || 'Leave';
                const message = `Your ${leaveType} request has been ${statusText.toLowerCase()}!`;
                
                if (newRequest.status === 'approved') {
                  showSuccess(message, 5000);
                } else if (newRequest.status === 'rejected') {
                  showInfo(message, 6000);
                }
              }
            });
          }
          
          setPreviousRequests(data.leaveRequests || []);
          setLeaveBalance(newLeaveBalance);
          setLeaveRequests(data.leaveRequests || []);
          setLastUpdate(Date.now());
          
          // Clear any existing errors on successful update
          if (error) setError("");
        }
      } else {
        if (!silent) {
          setError("Failed to fetch leave data");
        }
      }
    } catch (err) {
      if (!silent) {
        setError("Network error. Please try again.");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "casual":
        return "bg-blue-100 text-blue-800";
      case "sick":
        return "bg-green-100 text-green-800";
      case "earned":
        return "bg-purple-100 text-purple-800";
      case "unpaid":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EmployeeNavbar />
        <div className="flex">
          <EmployeeSidebar />
          <main className="flex-1 p-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">Loading...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }  return (
    <div className="p-8">
      {/* Notification Display */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`max-w-sm w-full shadow-lg rounded-lg pointer-events-auto overflow-hidden transition-all duration-300 ${
                notification.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : notification.type === 'info'
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {notification.type === 'success' ? (
                      <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : notification.type === 'info' ? (
                      <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className={`text-sm font-medium ${
                      notification.type === 'success'
                        ? 'text-green-900'
                        : notification.type === 'info'
                        ? 'text-blue-900'
                        : 'text-yellow-900'
                    }`}>
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {" "}        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Leave Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your leave requests and view balance
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Real-time status indicator */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className={`w-2 h-2 rounded-full ${isRealTimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span>
                {isRealTimeEnabled ? 'Live updates' : 'Updates paused'}
              </span>
              <button
                onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {isRealTimeEnabled ? 'Pause' : 'Resume'}
              </button>
            </div>
            <Link
              href="/employee/leaves/request"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Request Leave
            </Link>
          </div>
        </div>

        {/* Real-time Leave Status Component */}
        <div className="mb-8">
          <EmployeeLeaveStatus 
            leaveRequests={leaveRequests}
            onRefresh={() => fetchLeaveData(true)}
            className="mb-6"
          />
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {/* Leave Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Casual Leave
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {leaveBalance.casual}
                </p>
                <p className="text-sm text-gray-500">days remaining</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Sick Leave
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {leaveBalance.sick}
                </p>
                <p className="text-sm text-gray-500">days remaining</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border border-purple-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Earned Leave
                </h3>
                <p className="text-2xl font-bold text-purple-600">
                  {leaveBalance.earned}
                </p>
                <p className="text-sm text-gray-500">days remaining</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Unpaid Leave
                </h3>
                <p className="text-2xl font-bold text-gray-600">
                  {leaveBalance.unpaid}
                </p>
                <p className="text-sm text-gray-500">days taken</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        {/* Leave Requests History */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Leave Request History
            </h2>
          </div>

          {leaveRequests.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-500 text-lg mb-4">
                No leave requests found
              </div>
              <Link
                href="/employee/leaves/request"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit Your First Request
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaveRequests.map((request, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                            request.type
                          )}`}
                        >
                          {request.type?.charAt(0).toUpperCase() +
                            request.type?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(request.startDate)} -{" "}
                        {formatDate(request.endDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {request.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(request.appliedOn)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status?.charAt(0).toUpperCase() +
                            request.status?.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
