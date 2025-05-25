"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const CreateAccount = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const router = useRouter()

    const handleButtonSubmit = ()=>{
        router.push('/signup/validateemail')
    }

    return (
        <div className='flex items-center justify-between p-4 border-2 border-black h-screen w-full'>
            <div className='h-full w-[50%] flex items-center justify-center'>
                <div className="left w-[50%] flex flex-col gap-4">
                    <div>
                        <div className="head text-4xl font-semibold">
                            Create an account
                        </div>
                        <div className="subhead supporting-text text-lg">
                            Create an account to explore the HR Solution
                        </div>
                    </div>
                    <div className="inputs flex flex-col gap-4">
                        {/* // Username */}
                        <div className='flex flex-col gap-2'>
                            <div className='label font-medium text-lg'>Username</div>
                            <input
                            value={username}
                            onChange={(e)=> setUsername(e.target.value)}
                            type="text" placeholder='Johndoe' className='border text-lg border-[#D0D5DD] px-4 py-2 rounded-lg input-shadow bg-white' />
                        </div>

                        {/* Email */}
                        <div className='flex flex-col gap-2'>
                            <div className='label font-medium text-lg'>Email</div>
                            <input
                             value={email}
                             onChange={(e)=> setEmail(e.target.value)}
                            type="text" placeholder='Johndoe@mail.com' className='border text-lg border-[#D0D5DD] px-4 py-2 rounded-lg input-shadow bg-white' />
                        </div>

                        {/* Password */}
                        <div className='flex flex-col gap-2'>
                            <div className='label font-medium text-lg'>Password</div>
                            <input
                             value={password}
                             onChange={(e)=> setPassword(e.target.value)}
                            type="password" placeholder='Password' className='border text-lg border-[#D0D5DD] px-4 py-2 rounded-lg input-shadow bg-white' />
                        </div>

                        <button
                        onClick={handleButtonSubmit}
                        className='btnPrimary tracking-wide cursor-pointer text-white font-semibold text-lg rounded-lg py-3 px-4'>Get Started</button>
                    </div>
                    <div className='subhead supporting-text text-lg'>Already have an account ? <Link href={"/signin"} className='primary-text text-lg font-semibold'>Log in</Link> </div>
                </div>
            </div>
            <div className='h-full w-[50%] flex items-center justify-center'>
                <div className="right h-full w-full rounded-lg">
                    <div className='h-full relative w-full'>
                        <img src="images/SignupImage.png" alt="Side image for signup page" className='h-full w-full object-cover rounded-lg' />
                        <div className='bg-white/10 px-10 py-8 backdrop-blur-lg border-t-1 border-white absolute flex items-start justify-center bottom-0 h-[400px] w-full'>
                            <div className='text-4xl text-white font-dmsans'>
                                “Untitled has saved us thousands of hours of work. We’re able to spin up projects  faster and take on more clients.”
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateAccount