"use client"
import User from '@/public/icons/user'
import React, { useRef } from 'react'

const CardGlobal = ({title,count,icon ,bg ,border}) => {


    return (
        <div>
            <div className='p-4 justify-between cursor-pointer hover:shadow-lg transition-all gap-4 rounded-lg items-end min-w-[240px] flex border border-main bg-white'>
                <div className='top'>
                    <div className='font-medium  whitespace-nowrap supporting-text'>{title}</div>
                    <div className='text-4xl whitespace-nowrap font-semibold'>{count}</div>
                </div>
                <div className={`icon border p-2 h-fit text-main shadow-lg w-fit ${bg || "bg-white"} rounded-lg ${border || "border-main"}`}>
                    {icon || <User color={"blue"} height={26} width={26} />}
                </div>
            </div>
        </div>
    )
}

export default CardGlobal