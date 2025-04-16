"use client"
import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import Search from '@/public/icons/search';

const EmployeeTable = () => {
    const [searchText, setSearchText] = useState("")

    const employees = [
        {
            name: "Olivia Rhye",
            email: "olivia@mail.com",
            role: "Product Designer",
            department: "Marketing",
            joined: "Dec 24 - Dec 28",
            image: "/images/avatar.jpg",
        },
        {
            name: "Phoenix Baker",
            email: "phoenix@mail.com",
            role: "Product Manager",
            department: "Marketing",
            joined: "Dec 24 - Dec 28",
            image: "/images/avatar.jpg",
        },
        {
            name: "Lana Steiner",
            email: "lana@mail.com",
            role: "Frontend Developer",
            department: "Marketing",
            joined: "Dec 24 - Dec 28",
            image: "/images/avatar.jpg",
        },
        {
            name: "Demi Wilkinson",
            email: "demi@mail.com",
            role: "Backend Developer",
            department: "Engineering",
            joined: "Dec 24 - Dec 28",
            image: "/images/avatar.jpg",
        },
        {
            name: "Drew Cano",
            email: "drew@mail.com",
            role: "UX Copywriter",
            department: "Marketing",
            joined: "Dec 24 - Dec 28",
            image: "/images/avatar.jpg",
        },
        {
            name: "Drew Cano",
            email: "drew@mail.com",
            role: "UX Copywriter",
            department: "Marketing",
            joined: "Dec 24 - Dec 28",
            image: "/images/avatar.jpg",
        }, {
            name: "Drew Cano",
            email: "drew@mail.com",
            role: "UX Copywriter",
            department: "Marketing",
            joined: "Dec 24 - Dec 28",
            image: "/images/avatar.jpg",
        },
    ];


    const filteredEmployees = employees.filter((emp)=>
    emp.name.toLowerCase().includes(searchText.toLowerCase()) || 
    emp.email.toLowerCase().includes(searchText.toLowerCase()) || 
    emp.role.toLowerCase().includes(searchText.toLowerCase()) || 
    emp.department.toLowerCase().includes(searchText.toLowerCase()) 
    )


    return (
        <div className='rounded-lg h-fit w-full'>
            <div className='flex justify-between items-center px-2'>
               <div>
               <div className='text-2xl font-semibold'>All Employees</div>
               <div className=' font-medium supporting-text'>All Employees</div>
               </div>
                <div className='BtnContainer flex gap-2 h-fit '>
                    <div className="search flex items-center justify-start border-main rounded-lg  w-[300px] ">
                        <div className='px-2'><Search /></div>
                        <input
                        value={searchText}
                        onChange={(e)=> setSearchText(e.target.value)}
                        type="text" placeholder='Search All Employees Here...' className='w-full h-full items-center focus:outline-none' />
                    </div>
                    <div className="btn btnPrimary text-white font-medium px-4 py-2 rounded-md cursor-pointer">Add new Employee</div>
                </div>
            </div>
            <div className=' relative mt-4 flex h-[600px] w-full flex-col rounded-md'>
                <div className="sticky text-lg font-medium left-0 top-0 flex text-gray-700 w-full rounded-t-md border border-gray-200 bg-gray-100 px-3 py-2 text-[12px] ">
                    <div className="w-[25%] text-start">Employee</div>
                    <div className="w-[20%] text-start">Role</div>
                    <div className="w-[20%] text-start">Department</div>
                    <div className="w-[20%] text-start">Date of Joining</div>
                    <div className="w-[15%] text-start">Actions</div>
                </div>

                <div className='flex w-full flex-col overflow-y-auto rounded-b-md border border-t-0 border-gray-200 bg-main text-[14px]'>
                    {filteredEmployees.map((emp, index) => (
                        <div
                            key={index}
                            className='flex w-full px-3 py-4 border-b border-gray-200 items-center'
                        >
                            {/* Employee Name + Avatar */}
                            <div className="w-[25%]">
                                <div className="profile flex gap-4 items-center">
                                    <div className='h-10 w-10 rounded-full overflow-hidden'>
                                        <img src={emp.image} className='h-full w-full object-cover' alt="profile" />
                                    </div>
                                    <div>
                                        <div className='text-base font-medium'>{emp.name}</div>
                                        <div className='supporting-text  text-gray-500 text-sm'>{emp.email}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Role */}
                            <div className="w-[20%]">
                                <div className='supporting-text '>{emp.role}</div>
                            </div>

                            {/* Department */}
                            <div className="w-[20%]">
                                <div className='supporting-text '>{emp.department}</div>
                            </div>

                            {/* Date of Joining */}
                            <div className="w-[20%]">
                                <div className='supporting-text '>{emp.joined}</div>
                            </div>

                            {/* Actions */}
                            <div className="w-[15%]">
                                <div className='flex gap-8 items-center'>
                                    <button className='text-primary primary-text cursor-pointer text-sm font-medium'>View Details</button>
                                    <div className='p-1 rounded-md bg-gray-100 border border-gray-300 cursor-pointer'>
                                        <Pencil size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmployeeTable;
