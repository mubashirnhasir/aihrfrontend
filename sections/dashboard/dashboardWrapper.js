import React from 'react'
import Card from './card'
import OnLeave from './onLeave'
import Employees from './employees'
import Documents from './documents'

const DashboardWrapper = () => {
    return (
        <div className='w-full'>
            <div className="cards bg-gray-200 flex gap-2 p-6  ">
                <Card />
            </div>
            <div className='items flex w-full gap-8 p-4'>
                <div className='w-[30%]'><OnLeave /></div>
                <div className='w-[30%]'><Employees/></div>
            </div>
            <div className='w-[30%] p-4'><Documents/></div>
        </div>
    )
}

export default DashboardWrapper