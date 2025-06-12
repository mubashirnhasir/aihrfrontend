"use client";
import DocumentWrapper from "@/sections/documents/documentWrapper";
import React, { useState, useEffect } from 'react'
import PageLoader from '@/components/PageLoader'
import { pageLoadingMessages } from '@/hooks/usePageLoading'

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading documents
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <PageLoader 
        message={pageLoadingMessages.documents.message}
        subMessage={pageLoadingMessages.documents.subMessage}
      />
    );
  }

  return (
    <div>
      <DocumentWrapper />
    </div>
  );
};

export default Page;