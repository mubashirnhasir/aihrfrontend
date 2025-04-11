"use client"
import React from 'react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp" // Correct import
import Mail from '../icons/mail'
import Link from 'next/link'
import Arrow from '../icons/arrowleft'

const ValidateEmail = () => {


    const handleClick = () => {
        console.log("Bro You clicked me...");

    }

    return (
        <div className='h-screen w-full flex flex-col gap-4 items-center justify-center'>
            <div className='flex justify-center flex-col gap-8'>
                <div className='toptext flex flex-col gap-2 items-center justify-center'>
                    <div className='p-3 w-fit border border-main rounded-lg bg-white'><Mail /></div>
                    <div className="text-2xl font-semibold">Check your email</div>
                    <div className='flex flex-col items-center justify-center'>
                        <div className='placeholder-text '>We have sent you a verification link to</div>
                        <div className='placeholder-text font-semibold'>mubashirnhasir@mail.com</div>
                    </div>
                </div>
                <div className="w-full flex justify-center max-w-sm">
                    <InputOTP maxLength={4} className="mb-6">
                        <InputOTPGroup className="gap-4">
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>
                <div
                    onClick={handleClick}
                    className='btnPrimary py-3 text-white text-medium font-semibold rounded-lg w-full flex justify-center px-4 tracking-wide'>Verify email</div>
                <div className='supporting-text'>Didn’t receive the email? <Link href={'/signup'} className=" font-semibold text-medium primary-text">Click to resend</Link></div>
                <Link href={'/signup'} className='text-main flex  items-center justify-center gap-2'>
                    <div>
                        <Arrow />
                    </div>
                   <div className='font-semibold text-lg'> Back to Sign up</div>
                </Link>
            </div>
        </div>
    )
}

export default ValidateEmail
