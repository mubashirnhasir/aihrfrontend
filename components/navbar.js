import React from 'react'
import Notification from './icons/notification'
import Settings from './icons/settings'
import Search from './icons/search'

const Navbar = () => {
    return (
        <div className='wrap flex items-center justify-between gap-4 py-2 px-4'>
            <div className='w-full flex justify-end items-center'>

                <div className="searchbar border w-[260px] flex items-center justify-center px-2 h-[45px] rounded-lg border-main">
                    <div><Search/></div>
                    <input type="text" placeholder='Sreach here '  className='w-full h-full focus:outline-none mx-2 px-2' />
                </div>

            </div>
            <div className=' h-fit p-3 flex items-center justify-center w-fit rounded-lg'><Notification /></div>
            <div className=' h-fit p-3 flex items-center justify-center w-fit rounded-lg'><Settings /></div>
            <div className=' h-fit flex p-1 border border-main items-center justify-center w-fit rounded-lg'>
                <img src="images/profile.png" alt="Profile Picture"  className='object-cover rounded-lg' />
            </div>
        </div>
    )
}

export default Navbar