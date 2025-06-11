"use client";

import { useState } from "react";

export default function EmployeeClockInOut({
  currentStatus,
  todayHours,
  onClockAction,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const handleClockAction = async (action) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      await onClockAction(action);

      // Show success message
      if (action === "in") {
        setSuccessMessage("Successfully clocked in!");
      } else {
        setSuccessMessage("Successfully clocked out!");
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      // Handle specific error messages with friendlier text
      let errorMessage = err.message;

      if (errorMessage === "Already clocked in for today") {
        errorMessage = "You've already clocked in today";
      } else if (errorMessage === "Already clocked out for today") {
        errorMessage = "You've already clocked out today";
      } else if (errorMessage === "Please clock in first") {
        errorMessage = "Clock in first before clocking out";
      }

      setError(errorMessage);

      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has completed their work day (clocked in and out)
  const hasCompletedWorkDay =
    currentStatus?.clockOutTime && currentStatus?.clockInTime;
  const isCurrentlyWorking = currentStatus?.status === "in";

  const formatTime = (timeString) => {
    if (!timeString) return "--:--";
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatHours = (hours) => {
    if (!hours) return "0h 0m";
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
                {new Date().toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
              <div className="text-gray-600">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>{" "}
            {/* Clock In/Out Button or Status Message */}
            {hasCompletedWorkDay ? (
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-gray-300 flex flex-col items-center justify-center mx-auto mb-4">
                  <div className="text-3xl mb-2">✅</div>
                  <div className="text-sm font-medium text-gray-600">
                    Work Day
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Complete
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  You have completed your work day for today!
                </div>
              </div>
            ) : (
              <button
                onClick={() =>
                  handleClockAction(isCurrentlyWorking ? "out" : "in")
                }
                disabled={isLoading}
                className={`
                                    w-32 h-32 rounded-full text-white font-semibold text-lg shadow-lg transition-all duration-200
                                    ${
                                      isCurrentlyWorking
                                        ? "bg-red-500 hover:bg-red-600 active:scale-95"
                                        : "bg-green-500 hover:bg-green-600 active:scale-95"
                                    }
                                    ${
                                      isLoading
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }
                                `}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                ) : (
                  <>
                    <div>{isCurrentlyWorking ? "Clock Out" : "Clock In"}</div>
                    <div className="text-sm opacity-90">
                      {isCurrentlyWorking ? "🔴" : "🟢"}
                    </div>
                  </>
                )}
              </button>
            )}{" "}
            {/* Success Message */}
            {successMessage && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 text-green-700 bg-green-100 px-4 py-3 rounded-lg border border-green-300 text-sm font-medium">
                  <span className="text-lg">✅</span>
                  {successMessage}
                </div>
              </div>
            )}
            {/* Error Message */}
            {error && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 text-amber-700 bg-amber-100 px-4 py-3 rounded-lg border border-amber-300 text-sm font-medium">
                  <span className="text-lg">ℹ️</span>
                  {error}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Today's Stats */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Today's Activity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-blue-600 text-sm font-medium">
                Clock In Time
              </div>
              <div className="text-2xl font-bold text-blue-900 mt-1">
                {formatTime(currentStatus?.clockInTime)}
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-purple-600 text-sm font-medium">
                Hours Worked
              </div>
              <div className="text-2xl font-bold text-purple-900 mt-1">
                {formatHours(todayHours?.worked)}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-green-600 text-sm font-medium">Status</div>
              <div className="text-lg font-bold text-green-900 mt-1 flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    hasCompletedWorkDay
                      ? "bg-blue-500"
                      : isCurrentlyWorking
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                ></span>
                {hasCompletedWorkDay
                  ? "Day Complete"
                  : isCurrentlyWorking
                  ? "Working"
                  : "Not Started"}
              </div>
            </div>
          </div>

          {/* Break Information */}
          {todayHours?.breaks && todayHours.breaks.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-700 mb-2">
                Today's Breaks
              </h4>
              <div className="space-y-2">
                {todayHours.breaks.map((breakItem, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm bg-gray-50 p-2 rounded"
                  >
                    <span>
                      {formatTime(breakItem.start)} -{" "}
                      {formatTime(breakItem.end) || "Ongoing"}
                    </span>
                    <span className="font-medium">
                      {breakItem.duration
                        ? formatHours(breakItem.duration)
                        : "Active"}
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
