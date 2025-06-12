"use client";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import LoadingPage from './LoadingPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // Allow access to signin and signup pages
      const publicPaths = ['/signin', '/signup'];
      const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

      if (!isAuthenticated() && !isPublicPath) {
        router.push('/signin');
      } else if (isAuthenticated() && (pathname === '/signin' || pathname === '/signup')) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, loading, pathname, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingPage />;
  }

  // Allow public pages (signin, signup) to render
  const publicPaths = ['/signin', '/signup'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  if (!isAuthenticated() && !isPublicPath) {
    return null; // Will redirect in useEffect
  }

  return children;
};

export default ProtectedRoute;
