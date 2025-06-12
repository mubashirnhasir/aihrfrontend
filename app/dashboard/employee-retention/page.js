/**
 * Employee Retention Prediction Dashboard Page
 * Main page component for displaying AI-driven predictive analytics
 */
"use client";
import { useState, useEffect } from "react";
import RetentionDashboardWrapper from "../../../sections/employee-retention/retentionDashboardWrapper";
import PageLoader from '@/components/PageLoader'
import { pageLoadingMessages } from '@/hooks/usePageLoading'

export default function EmployeeRetentionPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading retention analytics data
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Longer loading time for analytics
  }, []);

  if (isLoading) {
    return (
      <PageLoader 
        message={pageLoadingMessages.retention.message}
        subMessage={pageLoadingMessages.retention.subMessage}
      />
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RetentionDashboardWrapper />
    </div>
  );
}
