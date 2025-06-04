"use client";

import { useState } from 'react';
import EmployeeAttendanceStats from './EmployeeAttendanceStats';
import EmployeeAttendanceCalendar from './EmployeeAttendanceCalendar';
import EmployeeAttendanceHistory from './EmployeeAttendanceHistory';
import EmployeeClockInOut from './EmployeeClockInOut';

export default function EmployeeAttendanceWrapper({ attendanceData, onClockAction, onRefresh }) {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'calendar', label: 'Calendar', icon: '📅' },
        { id: 'history', label: 'History', icon: '📋' }
    ];

    return (
        <div className="space-y-6">
            {/* Clock In/Out Section */}
            <EmployeeClockInOut 
                currentStatus={attendanceData?.currentStatus}
                todayHours={attendanceData?.todayHours}
                onClockAction={onClockAction}
            />

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                                ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'overview' && (
                    <EmployeeAttendanceStats 
                        stats={attendanceData?.stats}
                        monthlyData={attendanceData?.monthlyData}
                    />
                )}
                
                {activeTab === 'calendar' && (
                    <EmployeeAttendanceCalendar 
                        calendarData={attendanceData?.calendarData}
                        onRefresh={onRefresh}
                    />
                )}
                
                {activeTab === 'history' && (
                    <EmployeeAttendanceHistory 
                        history={attendanceData?.history}
                        onRefresh={onRefresh}
                    />
                )}
            </div>
        </div>
    );
}
