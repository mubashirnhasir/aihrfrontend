"use client";
import React, { useState, useEffect } from 'react';
import PageLoader from '@/components/PageLoader';
import { pageLoadingMessages } from '@/hooks/usePageLoading';

const PageWrapper = ({ 
  children, 
  pageKey = 'default', 
  loadingTime = 1500,
  dependencies = [],
  customMessage = null,
  customSubMessage = null
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    
    const checkDependencies = () => {
      // Check if all dependencies are loaded
      const allLoaded = dependencies.length === 0 || dependencies.every(dep => {
        if (Array.isArray(dep)) return dep.length > 0;
        if (typeof dep === 'object') return dep !== null && dep !== undefined;
        return dep !== null && dep !== undefined;
      });

      const elapsedTime = Date.now() - startTime;
      
      if (allLoaded || dependencies.length === 0) {
        // Ensure minimum loading time for better UX
        const remainingTime = Math.max(0, loadingTime - elapsedTime);
        
        setTimeout(() => {
          setIsLoading(false);
        }, remainingTime);
      }
    };

    // Initial check
    checkDependencies();
    
    // Set up interval to check dependencies if any exist
    let interval;
    if (dependencies.length > 0) {
      interval = setInterval(checkDependencies, 100);
    }
    
    // Cleanup
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [dependencies, loadingTime]);

  if (isLoading) {
    const loadingConfig = pageLoadingMessages[pageKey] || pageLoadingMessages.default;
    
    return (
      <PageLoader 
        message={customMessage || loadingConfig.message}
        subMessage={customSubMessage || loadingConfig.subMessage}
      />
    );
  }

  return children;
};

export default PageWrapper;
