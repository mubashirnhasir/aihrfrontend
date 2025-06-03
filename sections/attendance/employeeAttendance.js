"use client"
import Search from '@/public/icons/search'
import React, { useEffect, useState } from 'react'
import EmployeeCard from './employeeCard'
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import AddEmployeeModal from './addEmployee';

const EmployeeAttendance = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);







  const handlePopOpen = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    fetch("/api/employees")
      .then(res => res.json())
      .then(data => {
        setEmployees(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);


  const filteredEmployees = employees.filter((emp) =>
    emp.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    emp.designation?.toLowerCase().includes(searchText.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchText.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchText.toLowerCase())
  );


  console.log("lalalal", employees)

  return (
    <div className='contain px-2 relative'>
      <Link
        href={'/dashboard/attendance'}
        className='flex items-center justify-start px-4 py-2 border-b border-gray-200'> <ArrowLeft /> Go Back</Link>
      <div className="top flex justify-between items-end">
        <div className="text flex flex-col gap-2 px-2">
          <div className='font-semibold text-2xl'>All Employees</div>
          <div className='font-medium supporting-text'>All Employees in your organization</div>
        </div>
        <div className='BtnContainer flex gap-2 h-fit '>
          <div className="search flex items-center justify-start border-main rounded-lg  w-[300px] ">
            <div className='px-2'><Search /></div>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              type="text" placeholder='Search All Employees Here...' className='w-full h-full items-center focus:outline-none' />
          </div>
          <div onClick={() => handlePopOpen()} className="btn btnPrimary text-white font-medium px-4 py-2 rounded-md cursor-pointer">Add new Employee</div>
        </div>
      </div>

      <div className='p-2 w-full h-full mt-4 flex gap-4 flex-wrap'>
        {filteredEmployees.map((emp, index) => (
          <EmployeeCard key={emp._id || index} employee={emp} />
        ))}


      </div>
      {
        isOpen && (
          <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm '>
            <AddEmployeeModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              onSave={async (data) => {
                try {
                  const res = await fetch("/api/employees", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                  });

                  if (res.ok) {
                    setIsOpen(false);
                    const updated = await fetch("/api/employees").then(res => res.json());
                    setEmployees(updated);
                  }
                } catch (err) {
                  console.error("Error adding employee:", err);
                }
              }}

            />
          </div>
        )
      }

    </div>
  )
}

export default EmployeeAttendance
