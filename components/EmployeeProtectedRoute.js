"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import LoadingPage from './LoadingPage';

const EmployeeProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('employeeToken');
      const userData = localStorage.getItem('employeeData');
      
      if (token && userData) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Redirect to signin if not on auth pages
        if (!pathname.startsWith('/employee/auth')) {
          router.push('/employee/auth/signin');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated && !pathname.startsWith('/employee/auth')) {
    return null; // Will redirect in useEffect
  }

  return children;
};

export default EmployeeProtectedRoute;
