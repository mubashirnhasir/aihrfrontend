"use client";

import { useState } from 'react';

export default function EmployeeClockInOut({ currentStatus, todayHours, onClockAction }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClockAction = async (action) => {
        try {
            setIsLoading(true);
            setError(null);
            await onClockAction(action);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return '--:--';
        return new Date(timeString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatHours = (hours) => {
        if (!hours) return '0h 0m';
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        return `${h}h ${m}m`;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Clock In/Out Button */}
                <div className="lg:col-span-1">
                    <div className="text-center">
                        <div className="mb-4">
                            <div className="text-2xl font-bold text-gray-900">
                                {new Date().toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                })}
                            </div>
                            <div className="text-gray-600">
                                {new Date().toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>

                        <button
                            onClick={() => handleClockAction(currentStatus?.status === 'in' ? 'out' : 'in')}
                            disabled={isLoading}
                            className={`
                                w-32 h-32 rounded-full text-white font-semibold text-lg shadow-lg transition-all duration-200
                                ${currentStatus?.status === 'in'
                                    ? 'bg-red-500 hover:bg-red-600 active:scale-95'
                                    : 'bg-green-500 hover:bg-green-600 active:scale-95'
                                }
                                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                            ) : (
                                <>
                                    <div>{currentStatus?.status === 'in' ? 'Clock Out' : 'Clock In'}</div>
                                    <div className="text-sm opacity-90">
                                        {currentStatus?.status === 'in' ? '🔴' : '🟢'}
                                    </div>
                                </>
                            )}
                        </button>

                        {error && (
                            <div className="mt-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                {/* Today's Stats */}
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Activity</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="text-blue-600 text-sm font-medium">Clock In Time</div>
                            <div className="text-2xl font-bold text-blue-900 mt-1">
                                {formatTime(currentStatus?.clockInTime)}
                            </div>
                        </div>
                        
                        <div className="bg-purple-50 rounded-lg p-4">
                            <div className="text-purple-600 text-sm font-medium">Hours Worked</div>
                            <div className="text-2xl font-bold text-purple-900 mt-1">
                                {formatHours(todayHours?.worked)}
                            </div>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-4">
                            <div className="text-green-600 text-sm font-medium">Status</div>
                            <div className="text-lg font-bold text-green-900 mt-1 flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${
                                    currentStatus?.status === 'in' ? 'bg-green-500' : 'bg-gray-400'
                                }`}></span>
                                {currentStatus?.status === 'in' ? 'Working' : 'Not Working'}
                            </div>
                        </div>
                    </div>

                    {/* Break Information */}
                    {todayHours?.breaks && todayHours.breaks.length > 0 && (
                        <div className="mt-6">
                            <h4 className="text-md font-medium text-gray-700 mb-2">Today's Breaks</h4>
                            <div className="space-y-2">
                                {todayHours.breaks.map((breakItem, index) => (
                                    <div key={index} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                                        <span>{formatTime(breakItem.start)} - {formatTime(breakItem.end) || 'Ongoing'}</span>
                                        <span className="font-medium">
                                            {breakItem.duration ? formatHours(breakItem.duration) : 'Active'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
