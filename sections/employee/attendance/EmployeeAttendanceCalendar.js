"use client";

import { useState, useEffect } from 'react';

export default function EmployeeAttendanceCalendar({ calendarData, onRefresh }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        
        // Add empty slots for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        
        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        
        return days;
    };

    const getAttendanceForDate = (day) => {
        if (!calendarData || !day) return null;
        
        const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return calendarData[dateKey] || null;
    };

    const getDateStatus = (day) => {
        const attendance = getAttendanceForDate(day);
        if (!attendance) return 'no-data';
        
        if (attendance.status === 'present') {
            if (attendance.isLate) return 'late';
            if (attendance.isEarly) return 'early';
            return 'present';
        } else if (attendance.status === 'absent') {
            return 'absent';
        } else if (attendance.status === 'holiday') {
            return 'holiday';
        } else if (attendance.status === 'leave') {
            return 'leave';
        }
        
        return 'no-data';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return 'bg-green-100 text-green-800 border-green-200';
            case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'early': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'absent': return 'bg-red-100 text-red-800 border-red-200';
            case 'holiday': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'leave': return 'bg-orange-100 text-orange-800 border-orange-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
        setSelectedDate(null);
    };

    const formatTime = (timeString) => {
        if (!timeString) return '--:--';
        return new Date(timeString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatHours = (hours) => {
        if (!hours) return '0h 0m';
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        return `${h}h ${m}m`;
    };

    const days = getDaysInMonth(currentDate);
    const selectedAttendance = selectedDate ? getAttendanceForDate(selectedDate) : null;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => navigateMonth(-1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                            Today
                        </button>
                        <button
                            onClick={() => navigateMonth(1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {daysOfWeek.map(day => (
                        <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => {
                        if (!day) {
                            return <div key={index} className="p-2 h-12"></div>;
                        }

                        const status = getDateStatus(day);
                        const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                        const isSelected = selectedDate === day;

                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDate(day)}
                                className={`
                                    p-2 h-12 text-sm border rounded transition-all duration-200 relative
                                    ${getStatusColor(status)}
                                    ${isSelected ? 'ring-2 ring-blue-500' : ''}
                                    ${isToday ? 'font-bold' : ''}
                                    hover:scale-105
                                `}
                            >
                                {day}
                                {isToday && (
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="mt-6 flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                        <span className="text-gray-700">Present</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
                        <span className="text-gray-700">Late</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                        <span className="text-gray-700">Absent</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div>
                        <span className="text-gray-700">Leave</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded"></div>
                        <span className="text-gray-700">Holiday</span>
                    </div>
                </div>
            </div>

            {/* Selected Date Details */}
            {selectedDate && selectedAttendance && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        {monthNames[currentDate.getMonth()]} {selectedDate}, {currentDate.getFullYear()}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Clock In</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {formatTime(selectedAttendance.clockIn)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Clock Out</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {formatTime(selectedAttendance.clockOut)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Hours</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {formatHours(selectedAttendance.totalHours)}
                            </p>
                        </div>
                    </div>

                    {selectedAttendance.breaks && selectedAttendance.breaks.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-2">Breaks</p>
                            <div className="space-y-1">
                                {selectedAttendance.breaks.map((breakItem, index) => (
                                    <div key={index} className="text-sm bg-gray-50 p-2 rounded flex justify-between">
                                        <span>{formatTime(breakItem.start)} - {formatTime(breakItem.end)}</span>
                                        <span className="font-medium">{formatHours(breakItem.duration)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedAttendance.notes && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">Notes</p>
                            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded mt-1">
                                {selectedAttendance.notes}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
