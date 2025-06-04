import React from "react";
import User from "@/public/icons/user";

const EmployeeProfileCard = ({ employeeData }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">My Profile</h3>
      
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          {employeeData?.profilePicture ? (
            <img
              src={employeeData.profilePicture}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <User color="blue" />
          )}
        </div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">
            {employeeData?.name || "Employee Name"}
          </h4>
          <p className="text-sm text-gray-600">
            {employeeData?.designation || "Position"}
          </p>
          <p className="text-sm text-gray-500">
            {employeeData?.department || "Department"}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Employee ID:</span>
            <p className="font-medium">{employeeData?.employeeId || "EMP001"}</p>
          </div>
          <div>
            <span className="text-gray-500">Joining Date:</span>
            <p className="font-medium">
              {employeeData?.joiningDate 
                ? new Date(employeeData.joiningDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
        
        <button className="w-full mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          View Full Profile
        </button>
      </div>
    </div>
  );
};

export default EmployeeProfileCard;
