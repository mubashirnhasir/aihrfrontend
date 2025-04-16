import React from 'react';

const LeaveTable = ({ employees }) => {
  return (
    <div className='mt-6 relative flex h-[600px] w-full flex-col rounded-md'>
      {/* Table header */}
      <div className="sticky top-0 flex text-gray-700 w-full rounded-t-md border border-gray-200 bg-gray-100 px-3 py-2 text-[12px] font-medium">
        <div className="w-[25%] text-start">Employee Name</div>
        <div className="w-[15%] text-start">Role</div>
        <div className="w-[15%] text-start">Department</div>
        <div className="w-[15%] text-start">Leave Type</div>
        <div className="w-[15%] text-start">Leave Duration</div>
        <div className="w-[15%] text-start">Dates</div>
      </div>

      {/* Table body */}
      <div className="flex w-full flex-col overflow-y-auto rounded-b-md border border-t-0 border-gray-200 bg-main text-[14px]">
        {employees.map((emp, index) => (
          <div
            key={index}
            className="flex w-full px-3 py-4 border-b border-gray-200 items-center"
          >
            <div className="w-[25%]">
              <div className="flex gap-4 items-center">
                <img src={emp.image} className="h-10 w-10 rounded-full object-cover" alt="profile" />
                <div>
                  <div className="text-sm font-medium">{emp.name}</div>
                  <div className="text-xs text-gray-500">{emp.handle}</div>
                </div>
              </div>
            </div>
            <div className="w-[15%]">{emp.role}</div>
            <div className="w-[15%]">{emp.department}</div>
            <div className="w-[15%]">{emp.leaveType}</div>
            <div className="w-[15%]">{emp.duration}</div>
            <div className="w-[15%]">{emp.dates}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveTable;
