import Arrow from '@/public/icons/arrowleft'
import Dashboard from '@/public/icons/dashboard'
import DocumentFile from '@/public/icons/documentFile'
import { User } from 'lucide-react'
import React from 'react'
import CardGlobal from '../cardGlobal'

const LeaveCard = () => {

    const data = [
        {
          heading: "Employees on Leave",
          count: 323
        },
        {
          heading: "Requests to Approve",
          count: 12
        },
        {
          heading: "Approved Leaves this month",
          count: 23
        },
        {
          heading: "Rejected Leave this Month",
          count: 323
        }
      ];
      

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

export default LeaveCard