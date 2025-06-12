"use client";
import DashboardWrapper from '@/sections/dashboard/dashboardWrapper'
import React, { useState, useEffect } from 'react'
import PageLoader from '@/components/PageLoader'
import { pageLoadingMessages } from '@/hooks/usePageLoading'

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time and wait for component to be ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <PageLoader 
        message={pageLoadingMessages.dashboard.message}
        subMessage={pageLoadingMessages.dashboard.subMessage}
      />
    );
  }

  return (
    <div>
      <DashboardWrapper />
    </div>
  )
}

export default Page