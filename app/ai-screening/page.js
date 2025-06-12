/**
 * AI Screening Interview Page
 * Main page component for AI-powered candidate screening interviews
 */
"use client";
import { useState, useEffect } from "react";
import ScreeningInterviewWrapper from "../../sections/ai-screening/screeningInterviewWrapper";
import PageLoader from '@/components/PageLoader'
import { pageLoadingMessages } from '@/hooks/usePageLoading'

export default function AIScreeningPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading AI screening tools
    setTimeout(() => {
      setIsLoading(false);
    }, 1800);
  }, []);
  if (isLoading) {
    return (
      <PageLoader 
        message={pageLoadingMessages.aiScreening.message}
        subMessage={pageLoadingMessages.aiScreening.subMessage}
      />
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-center">
          <div className="text-2xl mb-2">⚠️</div>
          <div>Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ScreeningInterviewWrapper />
    </div>
  );
}
