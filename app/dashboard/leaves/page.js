"use client";
import LeaveWrapper from '@/sections/leaves/leaveWrapper'
import React, { useState, useEffect } from 'react'
import PageLoader from '@/components/PageLoader'
import { pageLoadingMessages } from '@/hooks/usePageLoading'

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading leave management data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <PageLoader 
        message={pageLoadingMessages.leaves.message}
        subMessage={pageLoadingMessages.leaves.subMessage}
      />
    );
  }

  return (
    <div>
        <LeaveWrapper/>
    </div>
  )
}

export default Page