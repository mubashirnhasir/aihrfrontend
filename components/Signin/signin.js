"use client"

import Link from 'next/link'
import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

const Signin = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    
    const { login } = useAuth()

    const handleButtonSubmit = async () => {
        if (!email || !password) {
            setError("Please fill in all fields")
            return
        }

        setLoading(true)
        setError("")

        try {
            const result = await login(email, password)
            
            if (!result.success) {
                setError(result.error)
            }
        } catch (error) {
            setError("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleButtonSubmit()
        }
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
                    
                    {/* Sample Credentials Display */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="text-sm font-semibold text-blue-800 mb-2">Sample Admin Credentials:</div>
                        <div className="text-sm text-blue-700">
                            <div><strong>Email:</strong> admin@synapthr.com</div>
                            <div><strong>Password:</strong> admin123</div>
                        </div>
                    </div>

                    <div className="inputs flex flex-col gap-4">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div className='flex flex-col gap-2'>
                            <div className='label font-medium text-lg'>Email</div>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyPress={handleKeyPress}
                                type="email" 
                                placeholder='admin@synapthr.com' 
                                className='border text-lg border-[#D0D5DD] px-4 py-2 rounded-lg input-shadow bg-white' 
                                disabled={loading}
                            />
                        </div>

                        {/* Password */}
                        <div className='flex flex-col gap-2'>
                            <div className='label font-medium text-lg'>Password</div>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                type="password" 
                                placeholder='Enter your password' 
                                className='border text-lg border-[#D0D5DD] px-4 py-2 rounded-lg input-shadow bg-white' 
                                disabled={loading}
                            />
                        </div>

                        <div className='flex justify-end primary-text font-semibold cursor-pointer'>Forgot Password</div>
                        <button
                            onClick={handleButtonSubmit}
                            disabled={loading}
                            className={`tracking-wide text-white font-semibold text-lg rounded-lg py-3 px-4 transition-colors ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'btnPrimary hover:bg-blue-700'
                            }`}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                    <div className='subhead supporting-text text-lg'>
                        Don't have an account ? 
                        <Link href={"/signup"} className='primary-text text-lg font-semibold ml-1'>
                            Create Here 
                        </Link> 
                    </div>
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