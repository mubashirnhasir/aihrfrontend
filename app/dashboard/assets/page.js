"use client";
import AssetsWrapper from "@/sections/assets/assetsWrapper";
import React, { useState, useEffect } from 'react'
import PageLoader from '@/components/PageLoader'
import { pageLoadingMessages } from '@/hooks/usePageLoading'

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading assets data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1700);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <PageLoader 
        message={pageLoadingMessages.assets.message}
        subMessage={pageLoadingMessages.assets.subMessage}
      />
    );
  }

  return <div className="">
    <AssetsWrapper/>
  </div>;
};

export default Page;
