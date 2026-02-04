'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { Loader2 } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const publicRoutes = ['/login', '/register', '/forgot-password', '/terms', '/privacy'];

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const isPublicRoute = publicRoutes.includes(pathname);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Don't redirect if we're still loading auth state or not mounted
    if (isLoading || !mounted) return;

    // Temporarily allow access without authentication for deployment
    // TODO: Re-enable authentication when ready
    
    // If authenticated and trying to access auth pages
    if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, isLoading, isPublicRoute, pathname, router, mounted]);

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth pages without layout
  if (isPublicRoute) {
    return <div suppressHydrationWarning>{children}</div>;
  }

  // Show protected content (temporarily allow without authentication)
  // if (!isAuthenticated) {
  //   return null; // Will redirect to login
  // }

  // Show authenticated layout
  return (
    <div className="flex h-screen" suppressHydrationWarning>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}