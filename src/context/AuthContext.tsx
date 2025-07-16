
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { usePathname, useRouter } from 'next/navigation';
import { Spinner } from '@/components/spinner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname === '/login' || pathname === '/register';
    const isLandingPage = pathname === '/';

    if (!user && !isAuthPage && !isLandingPage) {
      router.push('/login');
    } else if (user && (isAuthPage || isLandingPage)) {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isLandingPage = pathname === '/';

  if (!user && !isAuthPage && !isLandingPage) {
    return (
       <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (user && (isAuthPage || isLandingPage)) {
     return (
       <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
