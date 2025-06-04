"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EmployeeAttendanceWrapper from '@/sections/employee/attendance/EmployeeAttendanceWrapper';

export default function EmployeeAttendancePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [attendanceData, setAttendanceData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAttendanceData();
    }, []);

    const fetchAttendanceData = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('employeeToken');
            
            if (!token) {
                router.push('/employee/auth/signin');
                return;
            }

            const response = await fetch('/api/employee/attendance', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('employeeToken');
                router.push('/employee/auth/signin');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch attendance data');
            }

            const data = await response.json();
            setAttendanceData(data);
        } catch (err) {
            console.error('Error fetching attendance:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClockAction = async (action) => {
        try {
            const token = localStorage.getItem('employeeToken');
            const endpoint = action === 'in' ? '/api/employee/clock-in' : '/api/employee/clock-out';
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to clock ${action}`);
            }

            // Refresh attendance data after clock action
            await fetchAttendanceData();
            
            return await response.json();
        } catch (err) {
            console.error(`Error clocking ${action}:`, err);
            throw err;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-600 text-lg mb-4">Error loading attendance data</div>
                    <button 
                        onClick={fetchAttendanceData}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
                <p className="text-gray-600">Track your work hours and attendance records</p>
            </div>
            
            <EmployeeAttendanceWrapper 
                attendanceData={attendanceData}
                onClockAction={handleClockAction}
                onRefresh={fetchAttendanceData}
            />
        </div>
    );
}
