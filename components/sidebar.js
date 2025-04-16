"use client"
import React, { useState } from 'react'
import Dashboard from '../public/icons/dashboard'
import User from '../public/icons/user'
import Folder from '../public/icons/folder'
import Calendar from '../public/icons/calendar'
import Assets from '../public/icons/assets'
import Arrow from '../public/icons/arrowleft'
import Logobtn from '@/public/icons/logobtn'

const Sidebar = () => {
  const [side, setSide] = useState(false)
  const [tab1, setTab1] = useState(0)

  const handleTab = (e) => {
    setTab1(e)
  }

  const handleSidebar = () => {
    setSide(!side)
  }

  return (
    <div className={`h-screen px-4 flex justify-between relative flex-col gap-4 py-4  transition-all border-r border-main  duration-300 ${side ? 'w-[5%]' : "w-[14%]"} `}>
      <div>
        <div className='logo mb-6'>
          Product Logo
        </div>
        <div className="tabs flex flex-col gap-2">
          <div
            onClick={() => handleTab(0)}
            className={`px-2 py-2 flex gap-2 cursor-pointer items-center justify-start rounded-lg ${tab1 === 0 ? "btnPrimary text-white" : "bg-white text-gray-500"}`}>
            <div className='flex gap-2 items-center justify-center '>
              <div><Dashboard color={`${tab1 === 0 ? "white" : "black"}`} /></div>
              {!side && <div>Dashboard</div>}
            </div>
          </div>
          <div
            onClick={() => handleTab(1)}
            className={`px-2 py-2 rounded-lg flex gap-2 cursor-pointer items-center justify-start ${tab1 === 1 ? "btnPrimary text-white" : "bg-white text-gray-500"}`} >
            <div className='flex gap-2 items-center justify-center '>
              <div><User color={`${tab1 === 1 ? "white" : "black"}`} /></div>
              {!side && <div>Attendance</div>}
            </div>
          </div>
          <div
            onClick={() => handleTab(2)}
            className={`px-2 py-2  rounded-lg flex gap-2 cursor-pointer items-center justify-start ${tab1 === 2 ? "btnPrimary text-white" : "bg-white text-gray-500"}`}>
            <div className='flex gap-2 items-center justify-center '>
              <div><Folder color={`${tab1 === 2 ? "white" : "black"}`} /></div>
              {!side && <div>Leaves</div>}
            </div>
          </div>
          <div
            onClick={() => handleTab(3)}
            className={`px-2 py-2 flex gap-2 cursor-pointer items-center justify-start rounded-lg ${tab1 === 3 ? "btnPrimary text-white" : "bg-white text-gray-500"}`}>
            <div className='flex gap-2 items-center justify-center '>
              <div><Calendar color={`${tab1 === 3 ? "white" : "black"}`} /></div>
              {!side && <div>Documents</div>}
            </div>
          </div>
          <div
            onClick={() => handleTab(4)}
            className={`px-2 py-2 flex gap-2 cursor-pointer items-center justify-start rounded-lg ${tab1 === 4 ? "btnPrimary text-white" : "bg-white text-gray-500"}`}>
            <div className='flex gap-2 items-center justify-center '>
              <div><Assets color={`${tab1 === 4 ? "white" : "black"}`} /></div>
              {!side && <div>Assets</div>}
            </div>
          </div>
        </div>
        <div
          onClick={() => handleSidebar()}
          className='absolute flex cursor-pointer items-center justify-center h-10 w-10 top-10 right-[-20] z-[10] bg-white rounded-full  '
          style={{
            boxShadow: "0px 6px 6px -6px rgba(0, 0, 0, 0.16), 0px 0px 1px 0px rgba(0, 0, 0, 0.40)"
          }}
        >
          {!side ?
            <div><Arrow /></div>
            : <div className='transform rotate-180'><Arrow /></div>
          }
        </div>
      </div>

      {
        !side &&
        <div className=" relative p-2 text-white flex items-center justify-center bg-[linear-gradient(15deg,_#4A25E1_26.3%,_#6946F4_54.5%,_#7B5AFF_80.11%)] h-[240px] rounded-lg  ">
          <div className='absolute top-[-50] left-[50%] translate-x-[-50%]'><Logobtn /></div>
          <div className='flex flex-col items-center gap-2'>
            <div className='font-semibold text-xl text-white'>Use Our AI</div>
            <div className='text-center text-sm'>Try Generating Letters with out AI</div>
          <div className='px-4 py-2 cursor-pointer rounded-lg bg-white/20 text-white font-semibold ' > Generate Now</div>
          </div>
        </div>
      }


    </div>
  )
}

export default Sidebar