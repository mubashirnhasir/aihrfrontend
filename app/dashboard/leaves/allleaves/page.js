"use client";
import Search from '@/public/icons/search';
import LeaveTable from '@/sections/leaves/leaveTable';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react'; // Optional: replace or remove icon if not using
import Link from 'next/link';

const Page = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const employees = [
    {
      name: "Olivia Rhye",
      handle: "@olivia",
      role: "Product Designer",
      department: "Marketing",
      leaveType: "Vacation",
      duration: "5 days",
      dates: "Dec 24 - Dec 28",
      image: "/images/avatar.jpg",
    },
    {
      name: "Phoenix Baker",
      handle: "@phoenix",
      role: "Product Manager",
      department: "Marketing",
      leaveType: "Vacation",
      duration: "5 days",
      dates: "Dec 24 - Dec 28",
      image: "/images/avatar.jpg",
    },
    {
      name: "Lana Steiner",
      handle: "@lana",
      role: "Frontend Developer",
      department: "Marketing",
      leaveType: "Vacation",
      duration: "5 days",
      dates: "Dec 24 - Dec 28",
      image: "/images/avatar.jpg",
    },
    {
      name: "Demi Wilkinson",
      handle: "@demi",
      role: "Backend Developer",
      department: "Marketing",
      leaveType: "Vacation",
      duration: "5 days",
      dates: "Dec 24 - Dec 28",
      image: "/images/avatar.jpg",
    },
    {
      name: "Candice Wu",
      handle: "@candice",
      role: "Fullstack Developer",
      department: "Marketing",
      leaveType: "Vacation",
      duration: "5 days",
      dates: "Dec 24 - Dec 28",
      image: "/images/avatar.jpg",
    },
    {
      name: "Natali Craig",
      handle: "@natali",
      role: "UX Designer",
      department: "Marketing",
      leaveType: "Vacation",
      duration: "5 days",
      dates: "Dec 24 - Dec 28",
      image: "/images/avatar.jpg",
    },
  ];

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
    emp.handle.toLowerCase().includes(searchText.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchText.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      {/* Back Button */}
      <Link
      href={'/dashboard/leaves'}
       
        className="flex items-center text-blue-600 hover:underline gap-2"
      >
        <ArrowLeft size={18} />
        <span>Back</span>
      </Link>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Employees On Leave</h1>
          <p className="text-sm text-gray-500">All Invoices</p>
        </div>
        <div className="relative w-[300px] flex items-center border border-gray-300 rounded-md">
          <div className="px-2">
            <Search />
          </div>
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            placeholder="Search employee"
            className="w-full py-1 focus:outline-none"
          />
        </div>
      </div>

      <LeaveTable employees={filteredEmployees} />
    </div>
  );
};

export default Page;
