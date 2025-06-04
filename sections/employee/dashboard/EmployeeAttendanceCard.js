import React from "react";

const EmployeeAttendanceCard = ({ attendanceData }) => {
  const currentTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const formatTime = (timeString) => {
    if (!timeString) return 'Not recorded';
    return new Date(timeString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const calculateHours = (clockIn, clockOut) => {
    if (!clockIn) return 0;
    const endTime = clockOut ? new Date(clockOut) : new Date();
    const startTime = new Date(clockIn);
    const diffInHours = (endTime - startTime) / (1000 * 60 * 60);
    return Math.max(0, diffInHours).toFixed(1);
  };

  const todayAttendance = attendanceData?.today;
  const isCheckedIn = attendanceData?.isCheckedIn;
  const todayHours = todayAttendance ? calculateHours(todayAttendance.clockIn, todayAttendance.clockOut) : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Today's Attendance</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Status:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isCheckedIn 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {isCheckedIn ? 'Clocked In' : 'Not Clocked In'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Clock In Time:</span>
          <span className="font-medium">{formatTime(todayAttendance?.clockIn)}</span>
        </div>

        {todayAttendance?.clockOut && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Clock Out Time:</span>
            <span className="font-medium">{formatTime(todayAttendance.clockOut)}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Hours Today:</span>
          <span className="font-medium">{todayHours} hrs</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Current Time:</span>
          <span className="font-medium">{currentTime}</span>
        </div>
      </div>    </div>
  );
};

export default EmployeeAttendanceCard;
