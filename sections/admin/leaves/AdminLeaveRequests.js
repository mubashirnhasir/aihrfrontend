"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

const AdminLeaveRequests = () => {
  const searchParams = useSearchParams();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("pending");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const { showSuccess, showError } = useToast();
  // Set initial filter from URL query parameters
  useEffect(() => {
    const statusParam = searchParams.get("status");
    console.log("AdminLeaveRequests: Status param from URL:", statusParam);
    if (
      statusParam &&
      ["pending", "approved", "rejected", "all"].includes(statusParam)
    ) {
      console.log("AdminLeaveRequests: Setting filter to:", statusParam);
      setFilter(statusParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchLeaveRequests();
  }, [filter]);

  // Real-time polling for updates
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const interval = setInterval(() => {
      fetchLeaveRequests(true); // Silent refresh
    }, 5000); // Poll every 5 seconds for admin (faster updates)

    return () => clearInterval(interval);
  }, [filter, isRealTimeEnabled]);
  const fetchLeaveRequests = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const token = localStorage.getItem("auth_token");
      let url = "http://localhost:5000/api/leaves/pending";
      if (filter !== "pending") {
        url = `http://localhost:5000/api/leaves/requests/all?status=${filter}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const newRequests = data.data || [];

        // Only update if data has changed
        if (
          JSON.stringify(newRequests) !== JSON.stringify(leaveRequests) ||
          !silent
        ) {
          setLeaveRequests(newRequests);
          setLastUpdate(Date.now());

          // Clear errors on successful update
          if (error) setError("");
        }
      } else {
        if (!silent) {
          setError("Failed to fetch leave requests");
        }
      }
    } catch (err) {
      if (!silent) {
        setError("Network error. Please try again.");
        console.error("Error fetching leave requests:", err);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };
  const handleLeaveAction = async (requestId, action, rejectionReason = "") => {
    try {
      setActionLoading(requestId);
      const token = localStorage.getItem("auth_token");
      const userData = localStorage.getItem("user_data");
      const user = userData ? JSON.parse(userData) : null;

      const response = await fetch(
        `http://localhost:5000/api/leaves/request/${requestId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: action,
            approvedBy: user?.id,
            rejectionReason: rejectionReason,
          }),
        }
      );
      if (response.ok) {
        // Immediate refresh to show changes
        await fetchLeaveRequests();
        setSelectedRequest(null);

        // Show success message
        const actionText = action === "approved" ? "approved" : "rejected";
        showSuccess(
          `Leave request ${actionText} successfully! Employee will see updates shortly.`,
          4000
        );
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.message || `Failed to ${action} leave request`;
        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (err) {
      const errorMessage = "Network error. Please try again.";
      setError(errorMessage);
      showError(errorMessage);
      console.error(`Error ${action} leave request:`, err);
    } finally {
      setActionLoading(null);
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

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case "casual":
        return "bg-blue-100 text-blue-800";
      case "sick":
        return "bg-orange-100 text-orange-800";
      case "earned":
        return "bg-purple-100 text-purple-800";
      case "unpaid":
        return "bg-gray-100 text-gray-800";
      case "maternity":
        return "bg-pink-100 text-pink-800";
      case "paternity":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading leave requests...</div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header with Real-time Status */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Leave Requests Management
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Review and manage employee leave requests
          </p>
        </div>

        {/* Real-time status indicator */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div
            className={`w-2 h-2 rounded-full ${
              isRealTimeEnabled ? "bg-green-500 animate-pulse" : "bg-gray-400"
            }`}
          ></div>
          <span>{isRealTimeEnabled ? "Live updates" : "Updates paused"}</span>
          <button
            onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {isRealTimeEnabled ? "Pause" : "Resume"}
          </button>
          <button
            onClick={() => fetchLeaveRequests()}
            className="ml-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
          >
            Refresh Now
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            {
              key: "pending",
              label: "Pending Approval",
              count: leaveRequests.filter((r) => r.status === "pending").length,
            },
            {
              key: "approved",
              label: "Approved",
              count: leaveRequests.filter((r) => r.status === "approved")
                .length,
            },
            {
              key: "rejected",
              label: "Rejected",
              count: leaveRequests.filter((r) => r.status === "rejected")
                .length,
            },
            { key: "all", label: "All Requests", count: leaveRequests.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                filter === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    filter === tab.key
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Leave Requests List */}
      {leaveRequests.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No leave requests
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === "pending"
              ? "No pending requests at this time."
              : `No ${filter} requests found.`}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {leaveRequests.map((request) => (
              <li key={request._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <User className="h-10 w-10 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {request.employeeId?.name || "Unknown Employee"}
                          </p>
                          <span
                            className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLeaveTypeColor(
                              request.leaveType
                            )}`}
                          >
                            {request.leaveType?.charAt(0).toUpperCase() +
                              request.leaveType?.slice(1)}{" "}
                            Leave
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>
                            {formatDate(request.startDate)} -{" "}
                            {formatDate(request.endDate)}
                          </span>
                          <span className="mx-2">•</span>
                          <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>
                            {request.duration} day
                            {request.duration !== 1 ? "s" : ""}
                          </span>
                          {request.isHalfDay && (
                            <>
                              <span className="mx-2">•</span>
                              <span className="text-orange-600">
                                Half Day ({request.halfDayType})
                              </span>
                            </>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          <span className="font-medium">Department:</span>{" "}
                          {request.employeeId?.department || "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status?.charAt(0).toUpperCase() +
                          request.status?.slice(1)}
                      </span>
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Reason:</span>{" "}
                      {request.reason}
                    </p>
                  </div>

                  {/* Action Buttons for Pending Requests */}
                  {request.status === "pending" && (
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() =>
                          handleLeaveAction(request._id, "approved")
                        }
                        disabled={actionLoading === request._id}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        <CheckCircle className="mr-1.5 h-4 w-4" />
                        {actionLoading === request._id
                          ? "Processing..."
                          : "Approve"}
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt(
                            "Please provide a reason for rejection (optional):"
                          );
                          if (reason !== null) {
                            // User didn't cancel
                            handleLeaveAction(request._id, "rejected", reason);
                          }
                        }}
                        disabled={actionLoading === request._id}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        <XCircle className="mr-1.5 h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  )}

                  {/* Show approval details for processed requests */}
                  {request.status !== "pending" && request.approvedAt && (
                    <div className="mt-3 text-sm text-gray-500">
                      <span className="font-medium">
                        {request.status === "approved"
                          ? "Approved"
                          : "Rejected"}{" "}
                        on:
                      </span>{" "}
                      {formatDate(request.approvedAt)}
                      {request.approvedBy && (
                        <>
                          {" by "}
                          <span className="font-medium">
                            {request.approvedBy.name}
                          </span>
                        </>
                      )}
                      {request.rejectionReason && (
                        <div className="mt-1">
                          <span className="font-medium">Reason:</span>{" "}
                          {request.rejectionReason}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Leave Request Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium">Employee:</span>{" "}
                        {selectedRequest.employeeId?.name}
                      </div>
                      <div>
                        <span className="font-medium">Department:</span>{" "}
                        {selectedRequest.employeeId?.department}
                      </div>
                      <div>
                        <span className="font-medium">Leave Type:</span>{" "}
                        {selectedRequest.leaveType}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span>{" "}
                        {selectedRequest.duration} day(s)
                      </div>
                      <div>
                        <span className="font-medium">Dates:</span>{" "}
                        {formatDate(selectedRequest.startDate)} -{" "}
                        {formatDate(selectedRequest.endDate)}
                      </div>
                      {selectedRequest.isHalfDay && (
                        <div>
                          <span className="font-medium">Half Day:</span>{" "}
                          {selectedRequest.halfDayType}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Reason:</span>
                        <p className="mt-1 text-gray-600">
                          {selectedRequest.reason}
                        </p>
                      </div>
                      {selectedRequest.emergencyContact && (
                        <div>
                          <span className="font-medium">
                            Emergency Contact:
                          </span>{" "}
                          {selectedRequest.emergencyContact}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Applied On:</span>{" "}
                        {formatDate(selectedRequest.createdAt)}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>{" "}
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            selectedRequest.status
                          )}`}
                        >
                          {selectedRequest.status?.charAt(0).toUpperCase() +
                            selectedRequest.status?.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedRequest(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeaveRequests;
