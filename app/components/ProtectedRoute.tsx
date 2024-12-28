'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getLocalStorageItem } from '../utils/localStorage';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getLocalStorageItem('token');

    if (!token) {
      router.push('/');
      setIsLoading(false);
    } else if (pathname === '/') {
      router.push('/dashboard');
    } else {
      setIsLoading(false);
    }
  }, [router, pathname]);

  if (isLoading) return <LoadingSpinner />;

  return <>{children}</>;
};

export default ProtectedRoute;