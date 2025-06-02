/**
 * Job Description Output Component
 * Displays the generated job description with different view options
 */
"use client";

import { useState } from 'react';

export default function JobDescriptionOutput({ jobDescription, formData }) {
  const [activeView, setActiveView] = useState('structured');
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess('Copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const renderStructuredView = () => (
    <div className="space-y-6">
      {/* Job Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {jobDescription.title}
        </h2>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>📍 {formData.location || 'Location TBD'}</span>
          <span>💼 {formData.employmentType}</span>
          <span>📊 {formData.experienceLevel}</span>
          {formData.salaryRange && <span>💰 {formData.salaryRange}</span>}
          {formData.workModel && <span>🏠 {formData.workModel}</span>}
        </div>
      </div>

      {/* Job Summary */}
      {jobDescription.summary && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <span className="mr-2">✨</span> Job Summary
          </h3>
          <p className="text-gray-700 leading-relaxed">{jobDescription.summary}</p>
        </div>
      )}

      {/* About the Role */}
      {jobDescription.aboutRole && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <span className="mr-2">🎯</span> About the Role
          </h3>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {jobDescription.aboutRole}
          </div>
        </div>
      )}

      {/* Key Responsibilities */}
      {jobDescription.responsibilities && jobDescription.responsibilities.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <span className="mr-2">📋</span> Key Responsibilities
          </h3>
          <ul className="space-y-2">
            {jobDescription.responsibilities.map((responsibility, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                <span className="text-gray-700">{responsibility}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Required Qualifications */}
      {jobDescription.requiredQualifications && jobDescription.requiredQualifications.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <span className="mr-2">✅</span> Required Qualifications
          </h3>
          <ul className="space-y-2">
            {jobDescription.requiredQualifications.map((qualification, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                <span className="text-gray-700">{qualification}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Preferred Qualifications */}
      {jobDescription.preferredQualifications && jobDescription.preferredQualifications.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <span className="mr-2">⭐</span> Preferred Qualifications
          </h3>
          <ul className="space-y-2">
            {jobDescription.preferredQualifications.map((qualification, index) => (
              <li key={index} className="flex items-start">
                <span className="text-yellow-500 mr-2 mt-1">•</span>
                <span className="text-gray-700">{qualification}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Benefits */}
      {jobDescription.benefits && jobDescription.benefits.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <span className="mr-2">🎁</span> What We Offer
          </h3>
          <ul className="space-y-2">
            {jobDescription.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <span className="text-purple-500 mr-2 mt-1">•</span>
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* About Company */}
      {jobDescription.aboutCompany && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <span className="mr-2">🏢</span> About Us
          </h3>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {jobDescription.aboutCompany}
          </div>
        </div>
      )}

      {/* Application Process */}
      {jobDescription.applicationProcess && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <span className="mr-2">📧</span> How to Apply
          </h3>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {jobDescription.applicationProcess}
          </div>
        </div>
      )}
    </div>
  );

  const renderRawView = () => (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">📄</span> Full Job Description
      </h3>
      <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm whitespace-pre-line text-gray-800 leading-relaxed">
        {jobDescription.fullText}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header with View Toggle */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            📄 Generated Job Description
          </h2>
          <button
            onClick={() => handleCopy(jobDescription.fullText)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Full Text
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveView('structured')}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              activeView === 'structured'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 Structured View
          </button>
          <button
            onClick={() => setActiveView('raw')}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              activeView === 'raw'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📝 Raw Text
          </button>
        </div>

        {/* Copy Success Message */}
        {copySuccess && (
          <div className="mt-3 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">
            {copySuccess}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeView === 'structured' ? renderStructuredView() : renderRawView()}
      </div>
    </div>
  );
}
