// import User from '@/public/icons/user'
// import React from 'react'

// const Card = ({title, number, icon}) => {
//     const data = [
//         {
//             heading: "Total employees",
//             count: 323
//         },
//         {
//             heading: "Employees on leave",
//             count: 12
//         },
//         {
//             heading: "New Hires",
//             count: 23
//         },
//         {
//             heading: "Employees Reliving",
//             count: 11
//         },
//     ]

//     return (
//         <div className='flex h-full items-start  gap-8 w-full'>
//             {
//                 data.map((data, index) => (
//                     <div key={index} className='p-4 justify-between cursor-pointer hover:shadow-lg transition-all gap-4 rounded-lg items-end w-[240px] flex border border-main bg-white'>
//                         <div className='top'>
//                             <div className='font-medium supporting-text'>{data.heading}</div>
//                             <div className='text-4xl font-semibold'>{data.count}</div>
//                         </div>
//                         <div className="icon border p-2 h-fit text-main shadow-sm w-fit rounded-lg border-main ">
//                             <User color={"blue"} height={26} width={26} />
//                         </div>
//                     </div>
//                 ))
//             }
//         </div>
//     )
// }

// export default Card


"use client";

import User from '@/public/icons/user'
import React, { useState, useEffect } from 'react'
import CardGlobal from '../cardGlobal'
import Arrow from '@/public/icons/arrowleft'
import Dashboard from '@/public/icons/dashboard'
import DocumentFile from '@/public/icons/documentFile'
import { fetchTotalEmployeeCount, fetchAllEmployees, calculateEmployeeStats } from '@/lib/employeeUtils'

const Card = () => {
    const [employeeStats, setEmployeeStats] = useState({
        totalEmployees: 0,
        employeesOnLeave: 0,
        newHires: 0,
        employeesReliving: 0,
        loading: true,        error: null
    });

    // Fetch employee data from the API
    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                // Use Promise.all to fetch employee count and full employee data in parallel
                const [countResponse, employeesResponse] = await Promise.all([
                    fetch('/api/employees/count'),
                    fetch('/api/employees')
                ]);
                
                const countData = await countResponse.json();
                const employees = await employeesResponse.json();
                
                let totalEmployees = 0;
                
                // Use count endpoint if available, otherwise fall back to array length
                if (countResponse.ok && countData.success) {
                    totalEmployees = countData.count;
                } else if (employeesResponse.ok && Array.isArray(employees)) {
                    totalEmployees = employees.length;
                }
                  if (employeesResponse.ok && Array.isArray(employees)) {
                    // Calculate statistics from employee data
                    // Note: totalEmployees is already set from count endpoint above
                    
                    // Calculate employees on leave based on current active leave requests
                    const today = new Date();
                    const employeesOnLeave = employees.filter(emp => {
                        if (!emp.leaveRequests || !Array.isArray(emp.leaveRequests)) return false;
                        
                        return emp.leaveRequests.some(leave => {
                            if (leave.status !== 'approved') return false;
                            
                            const startDate = new Date(leave.startDate);
                            const endDate = new Date(leave.endDate);
                            return today >= startDate && today <= endDate;
                        });
                    }).length;
                    
                    // Calculate new hires (employees who joined in the last 30 days)
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    
                    const newHires = employees.filter(emp => {
                        const joinDate = new Date(emp.joiningDate || emp.createdAt);
                        return joinDate >= thirtyDaysAgo;
                    }).length;
                    
                    // Calculate employees who are no longer active (status !== 'active')
                    const employeesReliving = employees.filter(emp => 
                        emp.status && emp.status !== 'active'
                    ).length;
                    
                    setEmployeeStats({
                        totalEmployees,
                        employeesOnLeave,
                        newHires,
                        employeesReliving,
                        loading: false
                    });                } else {
                    console.error('Invalid employee data received:', employees);
                    // Fallback to default values if API fails
                    setEmployeeStats({
                        totalEmployees: 0,
                        employeesOnLeave: 0,
                        newHires: 0,
                        employeesReliving: 0,
                        loading: false,
                        error: 'Invalid data received from server'
                    });
                }
            } catch (error) {
                console.error('Error fetching employee data:', error);
                // Fallback to default values on error
                setEmployeeStats({
                    totalEmployees: 0,
                    employeesOnLeave: 0,
                    newHires: 0,
                    employeesReliving: 0,
                    loading: false,
                    error: 'Failed to connect to server'
                });
            }
        };

        fetchEmployeeData();
    }, []);    const getDisplayValue = (value) => {
        if (employeeStats.loading) return "Loading...";
        if (employeeStats.error) return "Error";
        return value;
    };

    const data = [
        {
            heading: "Total employees",
            count: getDisplayValue(employeeStats.totalEmployees),
            bg: "bg-blue-100",
            border: "border-blue-500"
        },
        {
            heading: "Employees on leave",
            count: getDisplayValue(employeeStats.employeesOnLeave),
            bg: "bg-yellow-100",
            border: "border-yellow-500"
        },
        {
            heading: "New Hires",
            count: getDisplayValue(employeeStats.newHires),
            bg: "bg-green-100",
            border: "border-green-500"
        },        {
            heading: "Employees Reliving",
            count: getDisplayValue(employeeStats.employeesReliving),
            bg: "bg-red-100",
            border: "border-red-500"
        }
    ];

    const svg = [
        <User key="user" />,
        <Arrow key="arrow" />,
        <Dashboard key="dashboard" />,
        <DocumentFile key="document" />
    ];

    return (
        <div className="space-y-4">
            <div className='flex h-full items-start gap-8 w-full'>
                {
                    data.map((item, index) => (
                        <div
                            key={index}
                        >
                            <CardGlobal
                                title={item.heading}
                                count={item.count}
                                icon={svg[index]}
                                bg={item.bg}
                                border={item.border}
                            />
                        </div>
                    ))
                }
            </div>
            
            {/* Error message display */}
            {employeeStats.error && (
                <div className="text-center">
                    <div className="text-red-600 text-sm mb-2">
                        ⚠️ {employeeStats.error}
                    </div>
                    <button 
                        onClick={() => window.location.reload()}
                        className="text-blue-600 text-sm hover:underline"
                    >
                        Refresh Page
                    </button>
                </div>
            )}
            
            {/* Loading indicator */}
            {employeeStats.loading && (                <div className="text-center text-gray-500 text-sm">
                    <div className="animate-pulse">Fetching employee data...</div>
                </div>
            )}
        </div>
    );
}

export default Card