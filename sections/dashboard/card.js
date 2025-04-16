// import User from '@/public/icons/user'
// import React from 'react'

// const Card = ({title, number, icon}) => {
//     const data = [
//         {
//             heading: "Total employees",
//             count: 323
//         },
//         {
//             heading: "Employees on leave",
//             count: 12
//         },
//         {
//             heading: "New Hires",
//             count: 23
//         },
//         {
//             heading: "Employees Reliving",
//             count: 11
//         },
//     ]

//     return (
//         <div className='flex h-full items-start  gap-8 w-full'>
//             {
//                 data.map((data, index) => (
//                     <div key={index} className='p-4 justify-between cursor-pointer hover:shadow-lg transition-all gap-4 rounded-lg items-end w-[240px] flex border border-main bg-white'>
//                         <div className='top'>
//                             <div className='font-medium supporting-text'>{data.heading}</div>
//                             <div className='text-4xl font-semibold'>{data.count}</div>
//                         </div>
//                         <div className="icon border p-2 h-fit text-main shadow-sm w-fit rounded-lg border-main ">
//                             <User color={"blue"} height={26} width={26} />
//                         </div>
//                     </div>
//                 ))
//             }
//         </div>
//     )
// }

// export default Card


import User from '@/public/icons/user'
import React from 'react'
import CardGlobal from '../cardGlobal'
import Arrow from '@/public/icons/arrowleft'
import Dashboard from '@/public/icons/dashboard'
import DocumentFile from '@/public/icons/documentFile'

const Card = () => {
    const data = [
        {
            heading: "Total employees",
            count: 323,
            bg: "bg-blue-100",
            border: "border-blue-500"
        },
        {
            heading: "Employees on leave",
            count: 12,
            bg: "bg-yellow-100",
            border: "border-yellow-500"
        },
        {
            heading: "New Hires",
            count: 23,
            bg: "bg-green-100",
            border: "border-green-500"
        },
        {
            heading: "Employees Reliving",
            count: 11,
            bg: "bg-red-100",
            border: "border-red-500"
        }
    ]

    const svg = [
        <User />,
        <Arrow />,
        <Dashboard />,
        <DocumentFile />
    ]

    return (
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
    )
}

export default Card