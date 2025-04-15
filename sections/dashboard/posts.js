"use client"
import ImageUpload from '@/public/icons/imageUpload'
import ThumbsUp from '@/public/icons/thumbsUp'
import VideoUpload from '@/public/icons/videoUpload'
import React, { useState } from 'react'

const Posts = () => {
    const [count , setCount] = useState(0)
    const [isClicked, setIsClicked] = useState(false)

    const comments = [
        {
            comment:"For always doing your best and having our back!",
            username:"James Gray",
            designation: "Backend Developer",
            heading: "Outstanding Productivity"
        },
    ]

   

    const handleClick = () => {
        if (isClicked) {
            setCount(count - 1);
        } else {
            setCount(count + 1);
        }
        setIsClicked(!isClicked);
    };
    
    

    return (
        <div className='wraped'>
            <div className="comment border border-main rounded-lg p-3 flex h-full flex-col gap-2">
                <div className='flex items-center justify-start gap-4' >
                    <div className='h-10 w-10 rounded-full'><img src="/images/avatar.jpg" alt="" className='h-full w-full object-cover rounded-full' /></div>
                    <div className="input w-full"><input type="text" placeholder='Create Announcements' className='border rounded-lg border-main w-full p-2' /></div>
                </div>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center justify-center gap-4'>
                        <div className='flex items-center justify-center cursor-pointer gap-2'> <ImageUpload /> Photos </div>
                        <div className='flex items-center justify-center cursor-pointer gap-2'> <VideoUpload /> Video </div>
                    </div>
                    <div className='button w-[120px] flex items-center justify-center px-4 py-1 cursor-pointer rounded-lg btnPrimary text-white'>
                        <button>Post</button>
                    </div>
                </div>
                {/* recent announcements */}
                <div className='w-full bg-gray-100 h-[1px]' ></div>
                <div className='font-medium text-gray-600'>Recent Announcements</div>
                {
                    comments.map((data, index)=>(
                        <div key={index} className='profile border border-gray-200 rounded-lg' >
                                <div className="user flex gap-4 items-center p-4">
                                    <div className='w-10 h-10 rounded-full  '><img src="/images/avatar.jpg" className='w-full h-full rounded-full object-cover' alt="Avatar " /></div>
                                    <div>
                                        <div className='font-medium text-lg' >{data.heading}</div>
                                        <div className='flex gap-2 supporting-text '>
                                            <div>{data.username}</div>
                                            <div>{data.designation}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="CommentMain border border-main px-2 flex flex-col mx-2 my-2 py-2 bg-gray-100 rounded-lg ">
                                    <div className="comment text-lg font-medium text-main">{data.comment}</div>
                                    <div className='flex items-center justify-between supporting-text ' >
                                        <div>By - {data.username}</div>
                                        <div onClick={handleClick} className={`flex cursor-pointer items-center justify-center gap-1`} >{count} {isClicked ? <div className='transition-all hover:scale-120'>
                                            <ThumbsUp color={"blue"} fill={"blue"} />
                                        </div> : <ThumbsUp/> }</div>
                                    </div>
                                </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Posts