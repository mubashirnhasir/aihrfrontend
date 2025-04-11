"use client"

import Link from 'next/link'
import React, { useState } from 'react'

const Signin = () => {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleButtonSubmit = () => {
        console.log("You clicked me");

    }


    return (
        <div className='flex items-center justify-between p-4 border-2 border-black h-screen w-full'>
            <div className='h-full w-[50%] flex items-center justify-center'>
                <div className="left w-[50%] flex flex-col gap-4">
                    <div className='flex gap-2 flex-col'>
                        <div className="head text-4xl font-semibold">
                           Sign In
                        </div>
                        <div className="subhead supporting-text text-lg">
                            Welcome back! Please enter your details.
                        </div>
                    </div>
                    <div className="inputs flex flex-col gap-4">
                        {/* Email */}
                        <div className='flex flex-col gap-2'>
                            <div className='label font-medium text-lg'>Email</div>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="text" placeholder='Johndoe@mail.com' className='border text-lg border-[#D0D5DD] px-4 py-2 rounded-lg input-shadow bg-white' />
                        </div>

                        {/* Password */}
                        <div className='flex flex-col gap-2'>
                            <div className='label font-medium text-lg'>Password</div>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password" placeholder='Password' className='border text-lg border-[#D0D5DD] px-4 py-2 rounded-lg input-shadow bg-white' />
                        </div>

                        <div className='flex justify-end primary-text font-semibold ' >Forgot Password</div>
                        <button
                            onClick={handleButtonSubmit}
                            className='btnPrimary tracking-wide text-white font-semibold text-lg rounded-lg py-3 px-4'>Sign In</button>
                    </div>
                    <div className='subhead supporting-text text-lg'>Don't have an account ? <Link href={"/signup"} className='primary-text text-lg font-semibold'>Create Here </Link> </div>
                </div>
            </div>
            <div className='h-full w-[50%] flex items-center justify-center'>
                <div className="right h-full w-full rounded-lg">
                    <div className='h-full relative w-full'>
                        <img src="images/Geometricshapes.png" alt="Side image for signup page" className='h-full w-full object-cover rounded-lg' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signin