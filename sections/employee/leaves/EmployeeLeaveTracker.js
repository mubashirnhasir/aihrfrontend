"use client";
import { useState, useEffect } from "react";

const EmployeeLeaveTracker = ({ 
  leaveRequests = [], 
  leaveBalance = {}, 
  onRefresh, 
  className = "" 
}) => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800"
  };

  const leaveTypeColors = {
    casual: "bg-blue-100 text-blue-800",
    sick: "bg-orange-100 text-orange-800",
    earned: "bg-purple-100 text-purple-800",
    unpaid: "bg-gray-100 text-gray-800",
    maternity: "bg-pink-100 text-pink-800",
    paternity: "bg-indigo-100 text-indigo-800"
  };

  const filteredRequests = leaveRequests.filter(request => {
    if (filter === "all") return true;
    return request.status === filter;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case "date":
        aValue = new Date(a.startDate);
        bValue = new Date(b.startDate);
        break;
      case "type":
        aValue = a.leaveType;
        bValue = b.leaveType;
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      case "duration":
        aValue = a.duration || 0;
        bValue = b.duration || 0;
        break;
      default:
        aValue = a.createdAt || a.startDate;
        bValue = b.createdAt || b.startDate;
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatDateRange = (startDate, endDate) => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return startDate === endDate ? start : `${start} - ${end}`;
  };

  const getTotalUsedLeaves = () => {
    return leaveRequests
      .filter(req => req.status === "approved")
      .reduce((total, req) => total + (req.duration || 0), 0);
  };

  const getLeaveStats = () => {
    const stats = {
      total: leaveRequests.length,
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0
    };

    leaveRequests.forEach(req => {
      stats[req.status] = (stats[req.status] || 0) + 1;
    });

    return stats;
  };

  const stats = getLeaveStats();

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Leave Tracker
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Track your leave requests and balance
            </p>
          </div>
          
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* Leave Balance Summary */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Leave Balance</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(leaveBalance).map(([type, balance]) => (
            <div key={type} className="bg-white p-4 rounded-lg border">
              <div className="text-sm font-medium text-gray-600 capitalize mb-1">
                {type} Leave
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {balance}
              </div>
              <div className="text-xs text-gray-500">days available</div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <span className="font-medium">Total Used This Year:</span> {getTotalUsedLeaves()} days
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="p-6 border-b border-gray-200">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Request Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.cancelled}</div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Date</option>
              <option value="type">Leave Type</option>
              <option value="status">Status</option>
              <option value="duration">Duration</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          Leave History ({sortedRequests.length} requests)
        </h4>
        
        {sortedRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">No leave requests found</div>
            <div className="text-sm text-gray-400">
              {filter === "all" 
                ? "You haven't submitted any leave requests yet"
                : `No ${filter} requests found`
              }
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedRequests.map((request, index) => (
                  <tr key={request.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        leaveTypeColors[request.leaveType] || "bg-gray-100 text-gray-800"
                      }`}>
                        {request.leaveType?.charAt(0).toUpperCase() + request.leaveType?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateRange(request.startDate, request.endDate)}
                      {request.isHalfDay && (
                        <div className="text-xs text-gray-500">
                          Half Day ({request.halfDayType})
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.duration || 0} day{(request.duration || 0) !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        statusColors[request.status] || "bg-gray-100 text-gray-800"
                      }`}>
                        {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate" title={request.reason}>
                        {request.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.createdAt || request.startDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeLeaveTracker;