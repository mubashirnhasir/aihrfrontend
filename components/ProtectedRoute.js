"use client";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingPage from './LoadingPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated: isAdminAuthenticated, loading: adminLoading } = useAuth();
  const [isEmployeeAuthenticated, setIsEmployeeAuthenticated] = useState(false);
  const [employeeLoading, setEmployeeLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Define route types once
  const isEmployeeRoute = pathname.startsWith('/employee');
  const isAdminRoute = pathname.startsWith('/dashboard');

  // Check employee authentication
  useEffect(() => {
    const checkEmployeeAuth = () => {
      const token = localStorage.getItem('employeeToken');
      const userData = localStorage.getItem('employeeData');
      setIsEmployeeAuthenticated(token && userData);
      setEmployeeLoading(false);
    };

    checkEmployeeAuth();
  }, []);

  useEffect(() => {
    // Only wait for relevant loading to complete
    const shouldWaitForLoading = (isEmployeeRoute && employeeLoading) || (isAdminRoute && adminLoading);
    
    if (!shouldWaitForLoading) {
      // Define public paths
      const adminPublicPaths = ['/signin', '/signup'];
      const employeePublicPaths = ['/employee/auth/signin', '/employee/auth/signup', '/employee/onboarding'];
      const allPublicPaths = [...adminPublicPaths, ...employeePublicPaths];
      
      const isPublicPath = allPublicPaths.some(path => pathname.startsWith(path));

      if (isEmployeeRoute) {
        // Handle employee routes
        if (!isEmployeeAuthenticated && !isPublicPath) {
          router.push('/employee/auth/signin');
        } else if (isEmployeeAuthenticated && (pathname === '/employee/auth/signin' || pathname === '/employee/auth/signup')) {
          router.push('/employee/dashboard');
        }
      } else if (isAdminRoute) {
        // Handle admin routes
        if (!isAdminAuthenticated()) {
          router.push('/signin');
        }
      } else {
        // Handle other routes
        if (!isPublicPath) {
          router.push('/signin'); // Default to admin signin
        }
      }
    }
  }, [isAdminAuthenticated, adminLoading, isEmployeeAuthenticated, employeeLoading, pathname, router, isEmployeeRoute, isAdminRoute]);

  // Show loading spinner only for relevant route types
  if ((isEmployeeRoute && employeeLoading) || (isAdminRoute && adminLoading)) {
    return <LoadingPage />;
  }

  // Allow public pages to render
  const allPublicPaths = ['/signin', '/signup', '/employee/auth/signin', '/employee/auth/signup', '/employee/onboarding'];
  const isPublicPath = allPublicPaths.some(path => pathname.startsWith(path));

  // Check authentication based on route type
  if (isEmployeeRoute && !isEmployeeAuthenticated && !isPublicPath) {
    return null; // Will redirect in useEffect
  }

  if (isAdminRoute && !isAdminAuthenticated() && !isPublicPath) {
    return null; // Will redirect in useEffect
  }

  return children;
};

export default ProtectedRoute;
