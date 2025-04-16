import React from 'react'

const Break = () => {
    const data = [
        {
            name: "Ayesha",
            leave: "22 March - 22 April",
            leaveType: "Earned Leave",
            department: "Development",
            away:"Away from 25 Min"
        },
        {
            name: "Ayesha",
            leave: "22 March - 22 April",
            leaveType: "Earned Leave",
            department: "Development",
            away:"Away from 25 Min"
        },
        {
            name: "Ayesha",
            leave: "22 March - 22 April",
            leaveType: "Earned Leave",
            department: "Development",
            away:"Away from 25 Min"
        },
        {
            name: "Ayesha",
            leave: "22 March - 22 April",
            leaveType: "Earned Leave",
            department: "Development",
            away:"Away from 25 Min"
        },
        {
            name: "Ayesha",
            leave: "22 March - 22 April",
            leaveType: "Earned Leave",
            department: "Development",
            away:"Away from 25 Min"
        },
    ]
    return (
        <div>
            <div className='border rounded-lg border-main p-2 h-[400px] overflow-hidden gap-1 flex flex-col'>
                <div className='headings  flex flex-col gap-1 p-2  '>
                    <div className='text-xl font-semibold'>On Break</div>
                    <div className="subhead ">5 people on break</div>
                    <div className='bg-gray-200 w-full h-[1px] rounded-full shadow-xl'></div>
                </div>
                <div className='h-full overflow-y-scroll custom-scrollbar py-2'>
                    <div className='flex flex-col gap-4'>
                        {
                            data.map((data, index) => (
                                <div key={index} className='w-full flex justify-between px-3 border border-main rounded-lg py-4 '>
                                    <div className="left flex items-center justify-center gap-2">
                                        <div className="profile h-10 w-10 overflow-hidden bg-gray-200 rounded-full">
                                            <img src="/images/avatar.jpg" className='h-full rounded-full w-full object-cover' alt="Avatar" />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <div className='font-semibold text-xl text-main tracking-wide'>{data.name}</div>
                                            <div className="badge border-main px-2 py-[2px] gap-2 flex items-center justify-center rounded-lg placeholder-text font-medium text-sm bg-white">
                                                <div className='h-2 w-2 bg-blue-500 rounded-full'></div>
                                                <div>{data.department}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="right flex flex-col gap-2 items-end ">
                                        <div className="link font-medium supporting-text cursor-pointer">View Profile</div>
                                        <div className="badge border border-yellow-600 px-2 py-1 gap-2 flex items-center justify-center rounded-full  placeholder-text font-medium text-sm bg-yellow-100">
                                            <div className='h-2 w-2 bg-yellow-500 rounded-full'></div>
                                            <div className='text-yellow-600'>{data.away}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Break