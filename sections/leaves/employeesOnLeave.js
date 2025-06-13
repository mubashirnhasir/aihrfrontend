"use client"
import Search from '@/public/icons/search'
import React, { useEffect, useState } from 'react'
import EmployeeCard from '../attendance/employeeCard'
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const EmployeesOnLeave = () => {
  const [searchText, setSearchText] = useState("")
  const [employeesOnLeave, setEmployeesOnLeave] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeesOnLeave = async () => {
      try {
        const response = await fetch('/api/on-leave-today');
        const data = await response.json();
        
        if (data.success) {
          setEmployeesOnLeave(data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employees on leave:', error);
        setLoading(false);
      }
    };

    fetchEmployeesOnLeave();
    
    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(fetchEmployeesOnLeave, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const filteredEmployees = employeesOnLeave.filter((emp) =>
    emp.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    emp.designation?.toLowerCase().includes(searchText.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchText.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchText.toLowerCase()) ||
    emp.leaveType?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className='contain px-2 relative'>
      <Link
        href={'/dashboard/leaves'}
        className='flex items-center justify-start px-4 py-2 border-b border-gray-200'> 
        <ArrowLeft /> Go Back
      </Link>
      
      <div className="top flex justify-between items-end">
        <div className="text flex flex-col gap-2 px-2">
          <div className='font-semibold text-2xl'>Employees on Leave</div>
          <div className='font-medium supporting-text'>
            Employees currently on leave today ({new Date().toLocaleDateString()})
          </div>
        </div>
        
        <div className='BtnContainer flex gap-2 h-fit '>
          <div className="search flex items-center justify-start border-main rounded-lg w-[300px] ">
            <div className='px-2'><Search /></div>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              type="text" 
              placeholder='Search Employees on Leave...' 
              className='w-full h-full items-center focus:outline-none' 
            />
          </div>
        </div>
      </div>

      <div className='p-2 w-full h-full mt-4'>
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading employees on leave...</div>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">
              {employeesOnLeave.length === 0 
                ? "No employees are on leave today" 
                : "No employees match your search criteria"
              }
            </div>
          </div>
        ) : (
          <div className='flex gap-4 flex-wrap'>
            {filteredEmployees.map((emp, index) => (
              <EmployeeLeaveCard key={emp.employeeId || index} employee={emp} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Custom card component for employees on leave
const EmployeeLeaveCard = ({ employee }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getLeaveTypeColor = (leaveType) => {
    switch (leaveType?.toLowerCase()) {
      case 'sick':
        return 'bg-red-100 text-red-800';
      case 'casual':
        return 'bg-blue-100 text-blue-800';
      case 'annual':
        return 'bg-green-100 text-green-800';
      case 'emergency':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 w-[280px]">
      {/* Status indicator */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-sm font-medium text-red-600">ON LEAVE</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(employee.leaveType)}`}>
          {employee.leaveType?.toUpperCase() || 'LEAVE'}
        </span>
      </div>

      {/* Employee image and basic info */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 mb-3 overflow-hidden">
          {employee.profilePicture ? (
            <img 
              src={employee.profilePicture} 
              alt={employee.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-semibold">
              {employee.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <h3 className="font-semibold text-lg text-center">{employee.name}</h3>
        <p className="text-sm text-gray-600">{employee.designation}</p>
      </div>

      {/* Employee details */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">#</span>
          <span className="text-gray-700">{employee.employeeId?.slice(-6) || 'N/A'}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-500">🏢</span>
          <span className="text-gray-700">{employee.department || 'N/A'}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-500">📧</span>
          <span className="text-gray-700 truncate">{employee.email}</span>
        </div>

        {/* Leave duration */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500">📅</span>
          <span className="text-gray-700">
            {employee.startDate === employee.endDate 
              ? formatDate(employee.startDate)
              : `${formatDate(employee.startDate)} - ${formatDate(employee.endDate)}`
            }
          </span>
        </div>

        {employee.duration && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500">⏰</span>
            <span className="text-gray-700">
              {employee.duration} day{employee.duration > 1 ? 's' : ''}
              {employee.isHalfDay && ' (Half Day)'}
            </span>
          </div>
        )}
      </div>      {/* Action button */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <Link 
          href={`/dashboard/leaves/requests?status=approved&employeeId=${employee.employeeId}`}
          className="text-blue-600 text-sm hover:underline"
        >
          View Leave Details
        </Link>
      </div>
    </div>
  );
};

export default EmployeesOnLeave
