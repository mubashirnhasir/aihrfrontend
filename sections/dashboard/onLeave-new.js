import React, { useState, useEffect } from "react";

const OnLeave = ({ cardText, subText }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOnLeaveToday();
  }, []);

  const fetchOnLeaveToday = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/on-leave-today');
      const result = await response.json();
      
      if (result.success) {
        setData(result.data || []);
      } else {
        setError(result.error || 'Failed to fetch leave data');
        setData(result.data || []); // Use fallback data if available
      }
    } catch (err) {
      console.error('Error fetching on leave data:', err);
      setError('Network error occurred');
      // Set fallback data for offline/error scenarios
      setData([
        {
          name: "Service Unavailable",
          leavePeriod: "Please try again later",
          leaveType: "System Error",
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main"></div>
        </div>
      );
    }

    if (data.length === 0 && !error) {
      return (
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <div className="text-gray-500 text-lg font-medium">No one is on leave today</div>
          <div className="text-gray-400 text-sm">All employees are present</div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {data.map((employee, index) => (
          <div
            key={employee.id || index}
            className="w-full flex justify-between px-2 border border-main rounded-lg py-2"
          >
            <div className="left flex items-center justify-center gap-2">
              <div className="profile h-10 w-10 overflow-hidden bg-gray-200 rounded-full">
                <img
                  src={employee.profilePicture || "/images/avatar.jpg"}
                  className="h-full rounded-full w-full object-cover"
                  alt={`${employee.name} Avatar`}
                  onError={(e) => {
                    e.target.src = "/images/avatar.jpg";
                  }}
                />
              </div>
              <div className="flex flex-col">
                <div className="font-semibold text-xl text-main tracking-wide">
                  {employee.name}
                </div>
                <div className="text-red-500 font-medium">
                  {employee.leavePeriod || employee.leave}
                </div>
                {employee.department && (
                  <div className="text-gray-500 text-xs">
                    {employee.department}
                  </div>
                )}
              </div>
            </div>
            <div className="right flex flex-col gap-2 items-end">
              <div className="badge border-main px-2 py-1 rounded-lg placeholder-text text-sm bg-white whitespace-nowrap">
                {employee.leaveType}
              </div>
              <div 
                className="link font-medium supporting-text cursor-pointer hover:text-main transition-colors"
                onClick={() => {
                  if (employee.email) {
                    console.log('View profile for:', employee.email);
                    // Add profile view logic here
                  }
                }}
              >
                View Profile
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="border rounded-lg border-main p-2 h-[450px] overflow-hidden gap-1 flex flex-col">
      <div className="headings flex flex-col gap-1 p-2">
        <div className="text-xl font-semibold flex items-center gap-2">
          {cardText || "On Leave Today"}
          {error && (
            <button
              onClick={fetchOnLeaveToday}
              className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition-colors"
              title="Retry loading data"
            >
              ↻ Retry
            </button>
          )}
        </div>
        <div className="subhead">
          {subText || (loading ? "Loading..." : `${data.length} People On Leave`)}
          {error && !loading && (
            <span className="text-red-500 text-sm ml-2">
              ({error})
            </span>
          )}
        </div>
        <div className="bg-gray-200 w-full h-[1px] rounded-full shadow-xl"></div>
      </div>
      <div className="h-full overflow-y-scroll custom-scrollbar py-2">
        {renderContent()}
      </div>
    </div>
  );
};

export default OnLeave;
