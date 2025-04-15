import React from 'react'
import Card from './card'
import OnLeave from './onLeave'
import Employees from './employees'
import Documents from './documents'
import Posts from './posts'
import Holidays from './holidays'

const DashboardWrapper = () => {
    return (
        <div className='w-full'>
            <div className="cards bg-gray-200 flex gap-2 p-6  ">
                <Card />
            </div>
            <div className='items flex w-full gap-8 p-4'>
                <div className='w-[30%]'><OnLeave /></div>
                <div className='w-[30%]'><Employees /></div>
            </div>
            <div className='flex gap-10'>
                <div className='w-[30%] m-4'><Documents /></div>
                <div className='w-[30%] m-4'><Posts /></div>
            </div>
            <div className='flex flex-col gap-4' >
            <div className='w-[30%] m-4'><Holidays/></div>
            </div>
        </div>
    )
}

export default DashboardWrapper