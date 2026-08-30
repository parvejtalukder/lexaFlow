'use client';

import useAuth from '@/hooks/useAuth';
import Loader from '@/templates/loader/Loader';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return <Loader />;
  }

  return user ? children : null;
};

export default PrivateRoute;