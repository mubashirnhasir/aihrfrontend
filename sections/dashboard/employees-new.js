"use client";
import ArrowUpRight from '@/public/icons/arrowUpRight';
import Search from '@/public/icons/search';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Show only first 10 employees
  const displayedEmployees = employees.slice(0, 10);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/employees');
      const result = await response.json();
      
      if (response.ok && result.success !== false) {
        setEmployees(result.data || result || []);
      } else {
        setError(result.message || 'Failed to fetch employees');
        setEmployees([]);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Network error occurred');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };
  const handleViewAll = () => {
    // Navigate to the existing all employees page
    router.push('/dashboard/attendance/allemployees');
  };

  const handleSearch = () => {
    // Navigate to all employees page where search functionality exists
    router.push('/dashboard/attendance/allemployees');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <div className="text-red-500 text-lg font-medium">Error loading employees</div>
          <div className="text-gray-400 text-sm">{error}</div>
          <button
            onClick={fetchEmployees}
            className="mt-2 text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
          >
            ↻ Retry
          </button>
        </div>
      );
    }

    if (displayedEmployees.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <div className="text-gray-500 text-lg font-medium">No employees found</div>
          <div className="text-gray-400 text-sm">No employee data available</div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {displayedEmployees.map((emp, index) => (
          <div
            key={emp._id || emp.employeeId || index}
            className="w-full flex justify-between px-2 border border-main rounded-lg py-2"
          >
            <div className="left flex items-center justify-center gap-2">
              <div className="profile h-10 w-10 overflow-hidden bg-gray-200 rounded-full">
                <img
                  src={emp.profilePicture || "/images/avatar.jpg"}
                  className="h-full rounded-full w-full object-cover"
                  alt={`${emp.name} Avatar`}
                  onError={(e) => {
                    e.target.src = "/images/avatar.jpg";
                  }}
                />
              </div>
              <div className="flex flex-col">
                <div className="font-semibold text-xl text-main tracking-wide">
                  {emp.name}
                </div>
                <div className="supporting-text font-medium">
                  {emp.designation || emp.position || 'Not specified'}
                </div>
              </div>
            </div>
            <div className="right flex flex-col gap-2 items-end">
              <div className="badge border-main px-2 py-1 gap-2 flex items-center justify-center rounded-lg placeholder-text font-medium text-sm bg-white whitespace-nowrap">
                <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                <div>{emp.department || 'General'}</div>
              </div>
              <div 
                className="link supporting-text cursor-pointer hover:text-main transition-colors"
                onClick={() => {
                  // Navigate to employee profile or handle view profile
                  console.log('View profile for:', emp.name);
                  // You can implement navigation to employee profile page here
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
    <div>
      <div className="border rounded-lg border-main p-2 h-[400px] overflow-hidden gap-1 flex flex-col">
        <div className="headings flex flex-col gap-1 p-2">
          <div className="w-full flex justify-between items-center">
            <div>
              <div className="text-xl font-semibold flex items-center gap-2">
                Employees
                {error && (
                  <button
                    onClick={fetchEmployees}
                    className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                    title="Retry loading data"
                  >
                    ↻ Retry
                  </button>
                )}
              </div>
              <div className="subhead">
                {loading ? "Loading..." : `${employees.length} Employee${employees.length !== 1 ? 's' : ''}`}
                {employees.length > 10 && ` (Showing first 10)`}
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div 
                className="flex items-center justify-center cursor-pointer hover:text-main transition-colors"
                onClick={handleViewAll}
                title={`View all ${employees.length} employees`}
              >
                View all <ArrowUpRight />
              </div>
              <div 
                className="p-2 rounded-lg bg-gray-100 w-fit cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={handleSearch}
                title="Search employees"
              >
                <Search />
              </div>
            </div>
          </div>
          <div className="bg-gray-200 w-full h-[1px] rounded-full shadow-xl"></div>
        </div>
        <div className="h-full overflow-y-scroll custom-scrollbar py-2">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Employees;
