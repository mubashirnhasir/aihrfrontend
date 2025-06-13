"use client";
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`border rounded-lg p-4 shadow-lg ${getStyles()}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose?.(), 300);
              }}
              className="rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
