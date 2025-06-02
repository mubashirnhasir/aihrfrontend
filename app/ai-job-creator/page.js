/**
 * AI Job Description Creator Page
 * Main page for creating professional job descriptions using AI
 */
"use client";

import { useState } from 'react';
import JobCreatorForm from '../../sections/ai-job-creator/jobCreatorForm';
import JobDescriptionOutput from '../../sections/ai-job-creator/jobDescriptionOutput';
import SharePanel from '../../sections/ai-job-creator/sharePanel';

export default function AIJobCreatorPage() {
  const [jobDescription, setJobDescription] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleGenerateJobDescription = async (data) => {
    setIsGenerating(true);
    setFormData(data);
    
    try {
      const response = await fetch('/api/ai-job-creator/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate job description');
      }

      const result = await response.json();
      setJobDescription(result.data);
    } catch (error) {
      console.error('Error generating job description:', error);
      alert('Failed to generate job description. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setJobDescription(null);
    setFormData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🤖 AI Job Description Creator
          </h1>
          <p className="text-gray-600">
            Create professional job descriptions for multiple platforms using AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <JobCreatorForm 
              onGenerate={handleGenerateJobDescription}
              isGenerating={isGenerating}
              onReset={handleReset}
              hasJobDescription={!!jobDescription}
            />
          </div>

          {/* Right Column - Output and Share */}
          <div className="space-y-6">
            {jobDescription ? (
              <>
                <JobDescriptionOutput 
                  jobDescription={jobDescription}
                  formData={formData}
                />
                <SharePanel 
                  jobDescription={jobDescription}
                  formData={formData}
                />
              </>
            ) : (
              <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg 
                    className="w-16 h-16 mx-auto" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Job Description Preview
                </h3>
                <p className="text-gray-500">
                  Fill out the form to generate a professional job description
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
