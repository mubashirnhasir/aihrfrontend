/**
 * AI Screening Interview Page
 * Main page component for AI-powered candidate screening interviews
 */
"use client";
import { useState, useEffect } from "react";
import ScreeningInterviewWrapper from "../../sections/ai-screening/screeningInterviewWrapper";

export default function AIScreeningPage() {
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <div className="ml-4 text-lg text-gray-600">Loading AI Screening Interview...</div>
      </div>
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
