"use client"
import DocumentFile from '@/public/icons/documentFile'
import React, { useState } from 'react'

const Documents = () => {
    const [data, setData] = useState([
        {
            document: "HR Document 2024",
            status: "Viewed"
        },
        {
            document: "Project Proposal Q1 2024",
            status: "Viewed"
        },
        {
            document: "Marketing Strategy Overview",
            status: "Viewed"
        },
        {
            document: "Sales Report July 2024",
            status: "Viewed"
        },
        {
            document: "Budget Allocation for 2024",
            status: "Viewed"
        },
    ]);

    const handleOpen = (index) => {
        const newData = [...data];
        newData[index].status = "Read";
        setData(newData);
    };

    return (
        <div>
            <div className='border rounded-lg border-main p-2 h-[400px] overflow-hidden gap-1 flex flex-col'>
                <div className='headings flex flex-col gap-1 p-2'>
                    <div className='text-xl font-semibold'>Documents</div>
                    <div className='bg-gray-200 w-full h-[1px] rounded-full shadow-xl'></div>
                </div>
                <div className='mids flex gap-4 items-start'>
                        <div className='bg-yellow-100 rounded-lg w-fit px-4 py-6'>
                                <div><DocumentFile/></div>
                                <div className='font-semibold text-lg text-yellow-600'>Unread Files</div>
                                <div className='font-medium text-gray-600'>4 Documents</div>
                        </div>
                        <div className='bg-green-100 rounded-lg w-fit  px-4 py-6'>
                                <div><DocumentFile/></div>
                                <div className='font-semibold text-lg text-green-600'>Unread Files</div>
                                <div className='font-medium text-gray-600'>4 Documents</div>
                        </div>
                </div>
                <div className='h-full overflow-y-scroll py-2'>
                    <div className='flex flex-col gap-2 px-2'>
                        <div className='font-medium text-gray-700'>Latest Documents</div>
                        <div className='flex flex-col gap-2'>
                            {
                                data.map((doc, index) => (
                                    <div
                                        onClick={() => handleOpen(index)}
                                        key={index}
                                        className='w-full flex cursor-pointer justify-between px-2 border border-main rounded-lg py-2'>
                                        <div className="left flex items-center justify-between gap-2">
                                            <div><DocumentFile /></div>
                                            <div className='font-medium text-md text-gray-600 tracking-wide'>{doc.document}</div>
                                        </div>
                                        <div className='text-gray-500 font-medium'>
                                            {doc.status === "Read" ? "Read" : "Unread"}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Documents;
