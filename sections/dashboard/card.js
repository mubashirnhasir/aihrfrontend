import User from '@/public/icons/user'
import React from 'react'

const Card = () => {
    const data = [
        {
            heading: "Total employees",
            count: 323
        },
        {
            heading: "Total employees",
            count: 323
        },
        {
            heading: "Total employees",
            count: 323
        },
        {
            heading: "Total employees",
            count: 323
        },
    ]

    return (
        <div className='flex h-full items-start  gap-8 w-full'>
            {
                data.map((data, index) => (
                    <div key={index} className='p-4 justify-between cursor-pointer hover:shadow-lg transition-all gap-4 rounded-lg items-end w-[240px] flex border border-main bg-white'>
                        <div className='top'>
                            <div className='font-medium supporting-text'>{data.heading}</div>
                            <div className='text-4xl font-semibold'>{data.count}</div>
                        </div>
                        <div className="icon border p-2 h-fit text-main shadow-sm w-fit rounded-lg border-main ">
                            <User color={"blue"} height={26} width={26} />
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default Card