import React from 'react';

const LoadingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-2 border-gray-200"></div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Synapt HR</h2>
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
