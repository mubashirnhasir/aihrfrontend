"use client";

import User from '@/public/icons/user'
import React, { useState, useEffect } from 'react'
import CardGlobal from '../cardGlobal'
import Arrow from '@/public/icons/arrowleft'
import Dashboard from '@/public/icons/dashboard'
import DocumentFile from '@/public/icons/documentFile'
import { fetchAllEmployees, calculateEmployeeStats } from '@/lib/employeeUtils'

const Card = () => {
    const [employeeStats, setEmployeeStats] = useState({
        totalEmployees: 0,
        employeesOnLeave: 0,
        newHires: 0,
        employeesReliving: 0,
        loading: true,
        error: null
    });

    // Fetch employee data from the API
    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                // Fetch employee data for detailed statistics
                const employees = await fetchAllEmployees();
                const stats = calculateEmployeeStats(employees);
                
                setEmployeeStats({
                    ...stats,
                    loading: false,
                    error: null
                });
            } catch (error) {
                console.error('Error fetching employee data:', error);
                setEmployeeStats({
                    totalEmployees: 0,
                    employeesOnLeave: 0,
                    newHires: 0,
                    employeesReliving: 0,
                    loading: false,
                    error: 'Failed to load employee data'
                });
            }
        };

        fetchEmployeeData();
    }, []);

    const getDisplayValue = (value) => {
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
        },
        {
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
            {employeeStats.loading && (
                <div className="text-center text-gray-500 text-sm">
                    <div className="animate-pulse">Fetching employee data...</div>
                </div>
            )}
        </div>
    );
}

export default Card
