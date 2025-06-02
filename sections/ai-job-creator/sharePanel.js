/**
 * Share Panel Component
 * Handles sharing job descriptions across different platforms
 */
"use client";

import { useState } from 'react';

export default function SharePanel({ jobDescription, formData }) {
  const [activeTab, setActiveTab] = useState('website');
  const [copySuccess, setCopySuccess] = useState('');

  const platforms = [
    {
      id: 'website',
      name: 'Website',
      icon: '🌐',
      description: 'Full detailed version for your careers page'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      description: 'Professional network optimized'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: '🐦',
      description: 'Tweet thread format'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📸',
      description: 'Visual and engaging format'
    }
  ];

  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(`Copied ${platforms.find(p => p.id === activeTab)?.name} version!`);
      setTimeout(() => setCopySuccess(''), 3000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(''), 3000);
    }
  };

  const handleShare = (platform) => {
    const content = jobDescription.platforms[platform];
    const encodedContent = encodeURIComponent(content);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(formData.jobTitle)}&summary=${encodedContent}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedContent}`;
        break;
      case 'instagram':
        // Instagram doesn't have direct URL sharing, so we'll copy to clipboard
        handleCopy(content);
        return;
      default:
        handleCopy(content);
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const getCurrentContent = () => {
    return jobDescription.platforms[activeTab] || jobDescription.fullText;
  };

  const renderPlatformPreview = () => {
    const content = getCurrentContent();
    
    switch (activeTab) {
      case 'website':
        return (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-md shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {formData.jobTitle}
                </h3>
                <div className="text-sm text-gray-600 mb-3">
                  {formData.department} • {formData.experienceLevel} • {formData.location}
                </div>
                <div className="text-gray-700 text-sm whitespace-pre-line line-clamp-6">
                  {content.slice(0, 500)}...
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'linkedin':
        return (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="bg-white p-4 rounded-md shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  CO
                </div>
                <div className="ml-3">
                  <div className="font-medium text-gray-900">Your Company</div>
                  <div className="text-sm text-gray-500">Now</div>
                </div>
              </div>
              <div className="text-gray-700 text-sm whitespace-pre-line">
                {content}
              </div>
            </div>
          </div>
        );
        
      case 'twitter':
        return (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="space-y-3">
              {content.split('\n\n').map((tweet, index) => (
                <div key={index} className="bg-white p-3 rounded-md shadow-sm border">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                      CO
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">Your Company</span>
                        <span className="ml-1 text-gray-500">@yourcompany</span>
                        <span className="ml-2 text-gray-500 text-sm">· now</span>
                      </div>
                      <div className="text-gray-700 text-sm mt-1">
                        {tweet}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'instagram':
        return (
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-lg">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-3 border-b flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                  CO
                </div>
                <span className="ml-2 font-medium text-gray-900">yourcompany</span>
              </div>
              <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <div className="text-white text-center p-6">
                  <h3 className="text-xl font-bold mb-2">We're Hiring!</h3>
                  <p className="text-lg">{formData.jobTitle}</p>
                  <p className="text-sm opacity-90 mt-2">{formData.department}</p>
                </div>
              </div>
              <div className="p-3">
                <div className="text-sm text-gray-700">
                  {content.slice(0, 200)}...
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {content}
            </pre>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          📤 Share Across Platforms
        </h2>
        <p className="text-gray-600 text-sm">
          Choose a platform to see the optimized version and share
        </p>
      </div>

      {/* Platform Tabs */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex flex-wrap gap-2">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => setActiveTab(platform.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === platform.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'
              }`}
            >
              <span>{platform.icon}</span>
              <span>{platform.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Platform Description */}
      <div className="px-6 py-3 bg-blue-50 border-b">
        <p className="text-sm text-blue-800">
          {platforms.find(p => p.id === activeTab)?.description}
        </p>
      </div>

      {/* Content Preview */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Preview for {platforms.find(p => p.id === activeTab)?.name}
          </h3>
          {renderPlatformPreview()}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={() => handleCopy(getCurrentContent())}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Text
          </button>

          {activeTab !== 'website' && (
            <button
              onClick={() => handleShare(activeTab)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share on {platforms.find(p => p.id === activeTab)?.name}
            </button>
          )}

          {activeTab === 'website' && (
            <button
              onClick={() => {
                const blob = new Blob([getCurrentContent()], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${formData.jobTitle.replace(/\s+/g, '_')}_job_description.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download File
            </button>
          )}
        </div>

        {/* Copy Success Message */}
        {copySuccess && (
          <div className="mt-3 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">
            {copySuccess}
          </div>
        )}
      </div>

      {/* Raw Content for Debugging */}
      <div className="px-6 pb-6">
        <details className="group">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            View raw content for {platforms.find(p => p.id === activeTab)?.name}
          </summary>
          <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono text-gray-600 whitespace-pre-wrap max-h-40 overflow-y-auto">
            {getCurrentContent()}
          </div>
        </details>
      </div>
    </div>
  );
}
