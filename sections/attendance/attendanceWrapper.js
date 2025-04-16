import React from 'react'
import AttendanceCards from './attendanceCards'
import OnLeave from '../dashboard/onLeave'
import Break from './break'
import OvertimeRequests from './overtimeRequests'
import Link from 'next/link'

const AttendanceWrapper = () => {
    return (
        <div>
            <div className="cards bg-gray-200 flex gap-2 p-6  ">
                <AttendanceCards />
            </div>
            <div className='p-2 flex gap-4 justify-between'>
                <OnLeave subText={"People who are not present in office"} cardText={"Offline Employees"}/>
                <Break/>
                <Link href={'/dashboard/attendance/allemployees'} className='btnPrimary px-4 py-2 rounded-lg h-fit text-white'>View All Employees</Link>
            </div>
            <div>
                <OvertimeRequests/>
            </div>
        </div>
    )
}

export default AttendanceWrapper