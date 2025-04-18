import Check from '@/public/icons/check'
import React from 'react'

const OvertimeRequests = () => {
    const Approvals = [
        {
            username: "Olivia Ryhe",
            email: "olivia@mail.com",
            checkin: "10:30 PM",
            checkout: "1 AM",
            overtime: "30 Min",
        },
        {
            username: "Olivia Ryhe",
            email: "olivia@mail.com",
            checkin: "10:30 PM",
            checkout: "1 AM",
            overtime: "30 Min",
        },
        {
            username: "Olivia Ryhe",
            email: "olivia@mail.com",
            checkin: "10:30 PM",
            checkout: "1 AM",
            overtime: "30 Min",
        },
        {
            username: "Olivia Ryhe",
            email: "olivia@mail.com",
            checkin: "10:30 PM",
            checkout: "1 AM",
            overtime: "30 Min",
        },
        {
            username: "Olivia Ryhe",
            email: "olivia@mail.com",
            checkin: "10:30 PM",
            checkout: "1 AM",
            overtime: "30 Min",
        },{
            username: "Olivia Ryhe",
            email: "olivia@mail.com",
            checkin: "10:30 PM",
            checkout: "1 AM",
            overtime: "30 Min",
        },
    ]
    return (
        <div className='border border-main rounded-lg h-fit p-2 w-full '>
            <div className='heads flex items-center justify-between px-2'>
                <div className='text-lg font-semibold'>Overtime to Approve</div>
                <div className='font-medium supporting-text'>View All</div>
            </div>
            <div className='bg-gray-200 h-[1px] rounded-full my-2'></div>
            <div className='p-2 relative mt-4 flex h-[400px] w-full flex-col rounded-md'>
                <div className="sticky text-lg font-medium left-0 top-0 flex text-gray-700 w-full rounded-t-md border border-gray-200 bg-gray-100 px-3 py-2 text-[12px] ">
                    <div className="w-[20%] text-start">Employee Name</div>
                    <div className="w-[20%] text-start">Check-In</div>
                    <div className="w-[20%] text-start">Check-Out</div>
                    <div className="w-[20%] text-start">Overtime</div>
                    <div className="w-[20%] text-start">Actions</div>
                </div>
                <div
                    className={`flex w-full flex-col overflow-y-auto rounded-b-md border border-t-0 border-gray-200 bg-main text-[14px]`}
                >
                    
                    {Approvals.map((data, index) => (
                        <div
                            key={index}
                            className={`flex w-full px-3 py-4 border-b border-gray-200 items-center`}
                        >
                            <div className="w-[20%]">
                                <div className="profile flex  gap-4 items-center ">
                                    <div className='h-10 w-10 rounded-full'><img src="/images/profile.png" className='h-full w-full object-cover rounded-full' alt="profile picture" /></div>
                                    <div className=''>
                                        <div className='text-lg font-medium'>{data.username}</div>
                                        <div className='supporting-text font-medium'>{data.email}</div>
                                    </div>
                                </div>
                            </div>

                            {/* second column */}
                            <div className="w-[20%]">
                                <div className=''>
                                    <div className='supporting-text font-medium'>{data.checkin}</div>
                                </div>
                            </div>
                            {/* Third column */}
                            <div className="w-[20%]">
                                <div className=''>
                                    <div className='supporting-text font-medium'>{data.checkout}</div>
                                </div>
                            </div>
                            {/* fourth column */}
                            <div className="w-[20%]">
                                <div className=''>
                                    <div className='supporting-text font-medium'>{data.overtime}</div>
                                </div>
                            </div>
                            {/* fifth column */}
                            <div className="w-[20%]">
                                <div className='cursor-pointer'>
                                    <div className='border border-green-400 w-fit rounded-lg bg-green-100 p-2'>
                                        <Check />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default OvertimeRequests   