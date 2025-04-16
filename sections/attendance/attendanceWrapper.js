import React from 'react'
import AttendanceCards from './attendanceCards'
import OnLeave from '../dashboard/onLeave'
import Break from './break'

const AttendanceWrapper = () => {
    return (
        <div>
            <div className="cards bg-gray-200 flex gap-2 p-6  ">
                <AttendanceCards />
            </div>
            <div className='p-2 flex gap-4'>
                <OnLeave subText={"People who are not present in office"} cardText={"Offline Employees"}/>
                <Break/>
            </div>
        </div>
    )
}

export default AttendanceWrapper