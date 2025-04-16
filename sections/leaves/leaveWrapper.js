import React from 'react'
import LeaveTable from './leaveTable'
import OvertimeRequests from '../attendance/overtimeRequests'
import AttendanceCards from '../attendance/attendanceCards'
import LeaveCard from './leaveCard'
import Holidays from '../dashboard/holidays'

const LeaveWrapper = () => {
  return (
    <div>
         <div className="cards bg-gray-200 flex gap-2 p-6  ">
                <LeaveCard/>
            </div>
            <div className='p-2 flex gap-4 justify-between'>
               <Holidays/>
               
            </div>
            <div>
                <OvertimeRequests/>
            </div>
    </div>
  )
}

export default LeaveWrapper