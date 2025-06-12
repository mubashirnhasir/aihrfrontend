"use client";
import AttendanceWrapper from '@/sections/attendance/attendanceWrapper'
import React, { useState, useEffect } from 'react'
import PageLoader from '@/components/PageLoader'
import { pageLoadingMessages } from '@/hooks/usePageLoading'

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading attendance data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <PageLoader 
        message={pageLoadingMessages.attendance.message}
        subMessage={pageLoadingMessages.attendance.subMessage}
      />
    );
  }

  return (
    <div>
        <AttendanceWrapper/>
    </div>
  )
}

export default Page