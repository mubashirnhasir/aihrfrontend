import React from "react";
import Link from "next/link";

const EmployeeLeaveBalance = ({ leaveData }) => {
  if (!leaveData) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Leave Balance</h3>
        <div className="text-center text-gray-500">Loading leave data...</div>
      </div>
    );
  }

  const { totalAllowed, used, remaining, pending } = leaveData;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Leave Balance</h3>
        <Link 
          href="/employee/leaves"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          View All
        </Link>
      </div>
      
      <div className="space-y-4">
        {/* Total Leave Overview */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Annual Leave</span>
            <span className="text-sm text-gray-600">{remaining}/{totalAllowed}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-blue-500"
              style={{ width: `${(remaining / totalAllowed) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Used: {used} days</span>
            <span>Remaining: {remaining} days</span>
          </div>
        </div>

        {/* Leave Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{remaining}</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 mt-4">
        <Link 
          href="/employee/leaves/request"
          className="w-full block text-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Request Leave
        </Link>      </div>
    </div>
  );
};

export default EmployeeLeaveBalance;
