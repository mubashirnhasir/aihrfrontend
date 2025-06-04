import React from 'react'
import LeaveTable from './leaveTable'
import OvertimeRequests from '../attendance/overtimeRequests'
import AttendanceCards from '../attendance/attendanceCards'
import LeaveCard from './leaveCard'
import Holidays from '../dashboard/holidays'
import LeaveTypeChart from './leaveTypeChart'
import DepartmentLeaveChart from './departmentLeaveChart'

const LeaveWrapper = () => {
  return (
    <div className="space-y-4">
      {/* Leave Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-200 p-6">
        <LeaveCard />
        {/* Add more LeaveCard components if needed */}
      </div>

      {/* Mid Section: Holidays + Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <Holidays />
        <DepartmentLeaveChart />
        <LeaveTypeChart />
      </div>

      {/* Overtime Section */}
      <div className='px-4'>
        <OvertimeRequests />
      </div>
    </div>
  )
}

export default LeaveWrapper
