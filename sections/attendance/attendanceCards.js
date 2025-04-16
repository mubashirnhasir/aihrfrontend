import React from 'react'
import CardGlobal from '../cardGlobal'
import User from '@/public/icons/user'
import Arrow from '@/public/icons/arrowleft'
import Dashboard from '@/public/icons/dashboard'
import DocumentFile from '@/public/icons/documentFile'

const AttendanceCards = () => {
    const data = [
        {
            heading: "Todays Attendance",
            count: 111,
            bg: "bg-blue-100",
            border: "border-blue-500"
        },
        {
            heading: "On Time",
            count: 12,
            bg: "bg-yellow-100",
            border: "border-yellow-500"
        },
        {
            heading: "Late Come",
            count: 23,
            bg: "bg-green-100",
            border: "border-green-500"
        },
        
    ]

    const svg = [
        <User />,
        <Arrow />,
        <Dashboard />,
        <DocumentFile />
    ]
    return (
        <div>
            <div className='flex h-full items-start  gap-8 w-full'>
                {
                    data.map((data, index) => (
                        <div
                            key={index}
                        >
                            <CardGlobal
                                title={data.heading}
                                count={data.count}
                                icon={svg[index]}
                                bg={data.bg}
                                border={data.border}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default AttendanceCards