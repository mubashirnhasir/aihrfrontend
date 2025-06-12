"use client";

import Arrow from '@/public/icons/arrowleft'
import Dashboard from '@/public/icons/dashboard'
import DocumentFile from '@/public/icons/documentFile'
import { User } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import CardGlobal from '../cardGlobal'

const LeaveCard = () => {
    const [leaveStats, setLeaveStats] = useState({
        employeesOnLeave: 0,
        requestsToApprove: 0,
        approvedLeavesThisMonth: 0,
        rejectedLeavesThisMonth: 0,
        loading: true,
        error: null
    });

    // Fetch leave data from the API
    useEffect(() => {
        const fetchLeaveData = async () => {
            try {
                const response = await fetch('/api/employees');
                const employees = await response.json();
                
                if (response.ok && Array.isArray(employees)) {
                    // Calculate leave statistics from employee data
                    const today = new Date();
                    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    
                    let employeesOnLeave = 0;
                    let requestsToApprove = 0;
                    let approvedLeavesThisMonth = 0;
                    let rejectedLeavesThisMonth = 0;
                    
                    employees.forEach(emp => {
                        if (emp.leaveRequests && Array.isArray(emp.leaveRequests)) {
                            emp.leaveRequests.forEach(leave => {
                                const leaveStartDate = new Date(leave.startDate);
                                const leaveEndDate = new Date(leave.endDate);
                                const leaveCreatedDate = new Date(leave.createdAt || leave.startDate);
                                
                                // Check if employee is currently on leave
                                if (leave.status === 'approved' && 
                                    today >= leaveStartDate && today <= leaveEndDate) {
                                    employeesOnLeave++;
                                }
                                
                                // Check for pending requests
                                if (leave.status === 'pending') {
                                    requestsToApprove++;
                                }
                                
                                // Check for approved leaves this month
                                if (leave.status === 'approved' && 
                                    leaveCreatedDate >= firstDayOfMonth) {
                                    approvedLeavesThisMonth++;
                                }
                                
                                // Check for rejected leaves this month
                                if (leave.status === 'rejected' && 
                                    leaveCreatedDate >= firstDayOfMonth) {
                                    rejectedLeavesThisMonth++;
                                }
                            });
                        }
                    });
                    
                    setLeaveStats({
                        employeesOnLeave,
                        requestsToApprove,
                        approvedLeavesThisMonth,
                        rejectedLeavesThisMonth,
                        loading: false,
                        error: null
                    });
                } else {
                    throw new Error('Failed to fetch employee data');
                }
            } catch (error) {
                console.error('Error fetching leave data:', error);
                setLeaveStats({
                    employeesOnLeave: 0,
                    requestsToApprove: 0,
                    approvedLeavesThisMonth: 0,
                    rejectedLeavesThisMonth: 0,
                    loading: false,
                    error: 'Failed to load leave data'
                });
            }
        };

        fetchLeaveData();
    }, []);

    const getDisplayValue = (value) => {
        if (leaveStats.loading) return "Loading...";
        if (leaveStats.error) return "Error";
        return value;
    };

    const data = [
        {
          heading: "Employees on Leave",
          count: getDisplayValue(leaveStats.employeesOnLeave),
          bg: "bg-blue-100",
          border: "border-blue-500"
        },
        {
          heading: "Requests to Approve",
          count: getDisplayValue(leaveStats.requestsToApprove),
          bg: "bg-yellow-100",
          border: "border-yellow-500"
        },
        {
          heading: "Approved Leaves this month",
          count: getDisplayValue(leaveStats.approvedLeavesThisMonth),
          bg: "bg-green-100",
          border: "border-green-500"
        },
        {
          heading: "Rejected Leave this Month",
          count: getDisplayValue(leaveStats.rejectedLeavesThisMonth),
          bg: "bg-red-100",
          border: "border-red-500"
        }
      ];
      

    const svg = [
        <User />,
        <Arrow />,
        <Dashboard />,
        <DocumentFile />
    ]
    
  return (
    <div className="space-y-4">
        <div className='flex h-full items-start  gap-8 w-full'>
            {
                data.map((data, index) => (
                    <div
                        key={index}
                    >
                        <CardGlobal
                            title={data.heading}
                            count={data.count}
                            icon={svg[index]}
                            bg={data.bg}
                            border={data.border}
                        />
                    </div>
                ))
            }
        </div>
        
        {/* Error message display */}
        {leaveStats.error && (
            <div className="text-center">
                <div className="text-red-600 text-sm mb-2">
                    ⚠️ {leaveStats.error}
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
        {leaveStats.loading && (
            <div className="text-center text-gray-500 text-sm">
                <div className="animate-pulse">Fetching leave data...</div>
            </div>
        )}
    </div>
  )
}

export default LeaveCard