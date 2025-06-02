/**
 * Employee Retention Prediction Dashboard Page
 * Main page component for displaying AI-driven predictive analytics
 */
"use client";
import { useState, useEffect } from "react";
import RetentionDashboardWrapper from "../../sections/employee-retention/retentionDashboardWrapper";
import { useState, useEffect } from 'react';
export default function EmployeeRetentionPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading Employee Retention Analytics...</div>
      </div>
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
