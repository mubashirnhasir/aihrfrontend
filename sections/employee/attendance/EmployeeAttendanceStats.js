"use client";

export default function EmployeeAttendanceStats({ stats, monthlyData }) {
    const formatHours = (hours) => {
        if (!hours) return '0h 0m';
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        return `${h}h ${m}m`;
    };

    const calculatePercentage = (value, total) => {
        if (!total) return 0;
        return Math.round((value / total) * 100);
    };

    return (
        <div className="space-y-6">
            {/* Monthly Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Days Worked</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.daysWorked || 0}</p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 text-xl">📅</span>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center text-sm">
                            <span className="text-green-600">
                                {calculatePercentage(stats?.daysWorked, stats?.workingDays)}%
                            </span>
                            <span className="text-gray-600 ml-1">of working days</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Hours</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatHours(stats?.totalHours)}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 text-xl">⏰</span>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center text-sm">
                            <span className="text-green-600">
                                {formatHours(stats?.averageHours)} 
                            </span>
                            <span className="text-gray-600 ml-1">avg per day</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">On Time</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.onTimeCount || 0}</p>
                        </div>
                        <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-purple-600 text-xl">✅</span>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center text-sm">
                            <span className="text-green-600">
                                {calculatePercentage(stats?.onTimeCount, stats?.daysWorked)}%
                            </span>
                            <span className="text-gray-600 ml-1">punctuality</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Overtime</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatHours(stats?.overtimeHours)}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <span className="text-orange-600 text-xl">🔥</span>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center text-sm">
                            <span className="text-gray-600">
                                {stats?.overtimeDays || 0} days
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Weekly Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Hours</h3>
                
                {monthlyData?.weeklyHours ? (
                    <div className="space-y-4">
                        {monthlyData.weeklyHours.map((week, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm font-medium text-gray-700 w-16">
                                        Week {index + 1}
                                    </span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-3 w-48">
                                        <div 
                                            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                            style={{ 
                                                width: `${Math.min((week.hours / 40) * 100, 100)}%` 
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 ml-4">
                                    {formatHours(week.hours)}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <span className="text-4xl mb-4 block">📊</span>
                        <p>Weekly data will appear here once you have attendance records</p>
                    </div>
                )}
            </div>

            {/* Attendance Pattern */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Pattern</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Average Clock In Time</h4>
                        <div className="text-2xl font-bold text-blue-600">
                            {stats?.averageClockIn || '9:00 AM'}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            {stats?.earlyDays || 0} early arrivals this month
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Average Clock Out Time</h4>
                        <div className="text-2xl font-bold text-red-600">
                            {stats?.averageClockOut || '6:00 PM'}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            {stats?.lateDays || 0} late departures this month
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
