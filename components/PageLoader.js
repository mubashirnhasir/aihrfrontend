import React from 'react';

const PageLoader = ({ message = "Loading...", subMessage = "" }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        {/* Animated Logo/Spinner */}
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600"></div>
          <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-gray-200"></div>
          <div className="absolute inset-2 rounded-full h-16 w-16 border-t-4 border-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Synapt HR</h2>
          <p className="text-lg font-medium text-blue-600 mb-1">{message}</p>
          {subMessage && (
            <p className="text-sm text-gray-500">{subMessage}</p>
          )}
        </div>
        
        {/* Animated Dots */}
        <div className="flex space-x-1">
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
