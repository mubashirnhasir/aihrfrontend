"use client";

import { useState } from 'react';

export default function EmployeeAttendanceHistory({ history, onRefresh }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('date-desc');

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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

    const getStatusBadge = (status, isLate = false, isEarly = false) => {
        let statusText = status;
        let colorClass = '';

        switch (status) {
            case 'present':
                if (isLate) {
                    statusText = 'Late';
                    colorClass = 'bg-yellow-100 text-yellow-800';
                } else if (isEarly) {
                    statusText = 'Early';
                    colorClass = 'bg-blue-100 text-blue-800';
                } else {
                    statusText = 'Present';
                    colorClass = 'bg-green-100 text-green-800';
                }
                break;
            case 'absent':
                statusText = 'Absent';
                colorClass = 'bg-red-100 text-red-800';
                break;
            case 'holiday':
                statusText = 'Holiday';
                colorClass = 'bg-purple-100 text-purple-800';
                break;
            case 'leave':
                statusText = 'Leave';
                colorClass = 'bg-orange-100 text-orange-800';
                break;
            default:
                statusText = 'Unknown';
                colorClass = 'bg-gray-100 text-gray-800';
        }

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                {statusText}
            </span>
        );
    };

    // Filter and sort history
    const filteredHistory = history?.filter(record => {
        const matchesSearch = record.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            record.notes?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filterStatus === 'all' || 
                            record.status === filterStatus ||
                            (filterStatus === 'late' && record.isLate) ||
                            (filterStatus === 'early' && record.isEarly);
        
        return matchesSearch && matchesFilter;
    }) || [];

    const sortedHistory = [...filteredHistory].sort((a, b) => {
        switch (sortBy) {
            case 'date-desc':
                return new Date(b.date) - new Date(a.date);
            case 'date-asc':
                return new Date(a.date) - new Date(b.date);
            case 'hours-desc':
                return (b.totalHours || 0) - (a.totalHours || 0);
            case 'hours-asc':
                return (a.totalHours || 0) - (b.totalHours || 0);
            default:
                return 0;
        }
    });

    return (
        <div className="space-y-6">
            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search attendance records..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="present">Present</option>
                            <option value="late">Late</option>
                            <option value="early">Early</option>
                            <option value="absent">Absent</option>
                            <option value="leave">Leave</option>
                            <option value="holiday">Holiday</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="date-desc">Latest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="hours-desc">Most Hours</option>
                            <option value="hours-asc">Least Hours</option>
                        </select>
                    </div>

                    <button
                        onClick={onRefresh}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            {/* Attendance Records */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {sortedHistory.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {sortedHistory.map((record, index) => (
                            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="text-lg font-semibold text-gray-900">
                                                {formatDate(record.date)}
                                            </h4>
                                            {getStatusBadge(record.status, record.isLate, record.isEarly)}
                                        </div>
                                        
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-600">Clock In:</span>
                                                <div className="font-medium text-gray-900">
                                                    {formatTime(record.clockIn)}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Clock Out:</span>
                                                <div className="font-medium text-gray-900">
                                                    {formatTime(record.clockOut)}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Total Hours:</span>
                                                <div className="font-medium text-gray-900">
                                                    {formatHours(record.totalHours)}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Break Time:</span>
                                                <div className="font-medium text-gray-900">
                                                    {formatHours(record.breakTime)}
                                                </div>
                                            </div>
                                        </div>

                                        {record.notes && (
                                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                                <span className="text-sm text-gray-600">Notes: </span>
                                                <span className="text-sm text-gray-900">{record.notes}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Overtime Indicator */}
                                    {record.overtimeHours > 0 && (
                                        <div className="flex-shrink-0">
                                            <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                                                +{formatHours(record.overtimeHours)} OT
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Break Details */}
                                {record.breaks && record.breaks.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="text-sm text-gray-600 mb-2">Breaks taken:</div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {record.breaks.map((breakItem, breakIndex) => (
                                                <div key={breakIndex} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded text-sm">
                                                    <span>{formatTime(breakItem.start)} - {formatTime(breakItem.end)}</span>
                                                    <span className="font-medium text-gray-700">
                                                        {formatHours(breakItem.duration)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📋</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records found</h3>
                        <p className="text-gray-600">
                            {searchTerm || filterStatus !== 'all' 
                                ? 'Try adjusting your search or filter criteria'
                                : 'Your attendance history will appear here once you start clocking in'
                            }
                        </p>
                        {(searchTerm || filterStatus !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterStatus('all');
                                }}
                                className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Summary Stats */}
            {sortedHistory.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{sortedHistory.length}</div>
                            <div className="text-gray-600">Total Records</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {sortedHistory.filter(r => r.status === 'present' && !r.isLate).length}
                            </div>
                            <div className="text-gray-600">On Time</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                                {sortedHistory.filter(r => r.isLate).length}
                            </div>
                            <div className="text-gray-600">Late Arrivals</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {sortedHistory.filter(r => r.status === 'absent').length}
                            </div>
                            <div className="text-gray-600">Absences</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
