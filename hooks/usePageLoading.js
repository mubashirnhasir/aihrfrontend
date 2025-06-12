"use client";
import { useState, useEffect } from 'react';

export const usePageLoading = (dependencies = [], minLoadingTime = 1000) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    
    // Check if all dependencies are loaded
    const checkDependencies = () => {
      const allLoaded = dependencies.every(dep => {
        if (Array.isArray(dep)) return dep.length > 0;
        if (typeof dep === 'object') return dep !== null && dep !== undefined;
        return dep !== null && dep !== undefined;
      });

      const elapsedTime = Date.now() - startTime;
      
      if (allLoaded) {
        // Ensure minimum loading time for better UX
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        setTimeout(() => {
          setIsLoading(false);
        }, remainingTime);
      }
    };

    // Initial check
    checkDependencies();
    
    // Set up interval to check dependencies
    const interval = setInterval(checkDependencies, 100);
    
    // Cleanup
    return () => clearInterval(interval);
  }, [dependencies, minLoadingTime]);

  return isLoading;
};

// Define loading messages for different pages
export const pageLoadingMessages = {
  // Admin Dashboard Pages
  dashboard: {
    message: "Loading Dashboard",
    subMessage: "Preparing your overview and analytics..."
  },
  employees: {
    message: "Loading Employee Data",
    subMessage: "Fetching employee profiles and information..."
  },
  attendance: {
    message: "Loading Attendance Records",
    subMessage: "Gathering attendance data and reports..."
  },
  leaves: {
    message: "Loading Leave Management",
    subMessage: "Preparing leave requests and balances..."
  },
  documents: {
    message: "Loading Document Center",
    subMessage: "Organizing files and documents..."
  },
  assets: {
    message: "Loading Asset Management",
    subMessage: "Preparing asset inventory and assignments..."
  },
  retention: {
    message: "Loading Retention Analytics",
    subMessage: "Analyzing employee retention patterns..."
  },
  chatbot: {
    message: "Loading AI Assistant",
    subMessage: "Initializing intelligent support system..."
  },
  
  // Employee Panel Pages
  employeeProfile: {
    message: "Loading Your Profile",
    subMessage: "Retrieving your personal information..."
  },
  employeeDashboard: {
    message: "Loading Your Dashboard",
    subMessage: "Preparing your personalized overview..."
  },
  employeeAttendance: {
    message: "Loading Your Attendance",
    subMessage: "Fetching your attendance records..."
  },
  employeeLeaves: {
    message: "Loading Your Leaves",
    subMessage: "Preparing your leave history and balance..."
  },
  employeeDocuments: {
    message: "Loading Your Documents",
    subMessage: "Organizing your personal files..."
  },
  
  // AI Features
  aiScreening: {
    message: "Loading AI Screening",
    subMessage: "Preparing intelligent recruitment tools..."
  },
  aiJobCreator: {
    message: "Loading Job Creator",
    subMessage: "Initializing AI-powered job description tools..."
  },
  aiEmailGenerator: {
    message: "Loading Email Generator",
    subMessage: "Setting up AI communication assistant..."
  },
  
  // General
  default: {
    message: "Loading Page",
    subMessage: "Please wait while we prepare your content..."
  }
};
