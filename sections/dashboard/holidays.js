import Calendar from '@/public/icons/calendar'
import React from 'react'

const Holidays = () => {
  return (
    <div>
        <div className='border border-gray-200 p-4 min-h-[400px] max-h-full rounded-lg'>
            <div className='flex flex-col gap-1 '>
                <div className='text-lg font-medium '>Upcoming Holidays</div>
                <div className='supporting-text '>This Month</div>
            </div>
            <div className='h-[1px] bg-gray-300 w-full my-2'></div>
            <div className='flex felx-col gap-2'>
                <div className="card p-4 flex items-start gap-2 bg-gradient-to-b from-[#38D2F5] to-[#0BA5EC] w-full rounded-lg border border-white h-[100px] cursor-pointer transition-all hover:shadow-[0px_22px_18px_-12px_rgba(0,0,0,0.14)]">
                        <div className='bg-[#0BA5EC] p-2 rounded-lg border border-white'><Calendar color={"white"} /></div>
                        <div className='text-white'>
                            <div className='text-lg font-semibold'>Independance Day</div>
                            <div className='font-medium'>14 August 2025</div>
                        </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Holidays