"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Calendar, FileText } from "lucide-react";

const EmployeeLeaveStatus = ({
  leaveRequests = [],
  onRefresh = null,
  className = "",
}) => {
  const [refreshInterval, setRefreshInterval] = useState(null);

  // Auto-refresh every 30 seconds for real-time updates
  useEffect(() => {
    if (onRefresh) {
      const interval = setInterval(() => {
        onRefresh();
      }, 30000); // 30 seconds

      setRefreshInterval(interval);

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [onRefresh]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
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

  const recentRequests = leaveRequests
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.appliedOn || b.startDate) -
        new Date(a.createdAt || a.appliedOn || a.startDate)
    )
    .slice(0, 5); // Show only the 5 most recent requests

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Leave Requests
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Track your latest leave request status
            </p>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Refresh
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {recentRequests.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No leave requests
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't submitted any leave requests yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentRequests.map((request, index) => (
              <div
                key={request.id || index}
                className={`border rounded-lg p-4 ${getStatusColor(
                  request.status
                )}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(request.status)}
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                          request.type
                        )}`}
                      >
                        {request.type?.charAt(0).toUpperCase() +
                          request.type?.slice(1)}{" "}
                        Leave
                      </span>
                      <span className="text-sm text-gray-600">
                        {request.duration || 1} day
                        {(request.duration || 1) !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {formatDate(request.startDate)} -{" "}
                        {formatDate(request.endDate)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-medium">Reason:</span>{" "}
                      {request.reason}
                    </p>

                    <div className="text-xs text-gray-500">
                      Applied on{" "}
                      {formatDate(
                        request.appliedOn ||
                          request.createdAt ||
                          request.startDate
                      )}
                    </div>
                  </div>

                  <div className="ml-4">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status?.charAt(0).toUpperCase() +
                        request.status?.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Show approval/rejection details */}
                {request.status === "approved" && (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <div className="flex items-center text-sm text-green-700">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>Approved - Your leave has been confirmed</span>
                    </div>
                  </div>
                )}

                {request.status === "rejected" && (
                  <div className="mt-3 pt-3 border-t border-red-200">
                    <div className="flex items-center text-sm text-red-700 mb-1">
                      <XCircle className="h-4 w-4 mr-1" />
                      <span>Request Rejected</span>
                    </div>
                    {request.rejectionReason && (
                      <p className="text-sm text-red-600">
                        <span className="font-medium">Reason:</span>{" "}
                        {request.rejectionReason}
                      </p>
                    )}
                  </div>
                )}

                {request.status === "pending" && (
                  <div className="mt-3 pt-3 border-t border-yellow-200">
                    <div className="flex items-center text-sm text-yellow-700">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Pending review by management</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {leaveRequests.length > 5 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Showing {recentRequests.length} of {leaveRequests.length} requests
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeLeaveStatus;
