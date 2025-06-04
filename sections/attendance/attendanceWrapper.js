import React from 'react'
import AttendanceCards from './attendanceCards'
import OnLeave from '../dashboard/onLeave'
import Break from './break'
import OvertimeRequests from './overtimeRequests'
import Link from 'next/link'

const AttendanceWrapper = () => {
    return (
        <div>
            {/* Cards Section */}
            <div className="cards bg-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
                <AttendanceCards />
                {/* Add more <AttendanceCards /> if needed */}
            </div>

            {/* Mid Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                <OnLeave subText={"People who are not present in office"} cardText={"Offline Employees"} />
               <div className='col-span-1' >
                 <Break />
               </div>
                <div className="justify-self-end">
  <Link
    href="/dashboard/attendance/allemployees"
    className="btnPrimary block max-w-[200px] w-full text-center px-4 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
  >
    View All Employees
  </Link>
</div>

            </div>

            {/* Overtime Requests */}
            <div className='px-4'>
                <OvertimeRequests />
            </div>
        </div>
    )
}

export default AttendanceWrapper
