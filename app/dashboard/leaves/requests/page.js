"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLeaveRequests from '@/sections/admin/leaves/AdminLeaveRequests';
import PageLoader from '@/components/PageLoader';
import ToastProvider from '@/components/ui/ToastProvider';

export default function LeaveRequestsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <PageLoader 
        message="Loading Leave Requests"
        subMessage="Fetching pending approval requests..."
      />
    );
  }
  return (
    <ToastProvider>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Leave Request Management</h1>
            <p className="text-gray-600 mt-2">
              Review and manage employee leave requests
            </p>
          </div>
          
          <AdminLeaveRequests />
        </div>
      </div>
    </ToastProvider>
  );
}
