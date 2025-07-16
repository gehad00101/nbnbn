
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    if(loading) {
        return (
             <div className="flex h-screen w-screen items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (user) {
        router.push('/dashboard');
        return null;
    }

  return <>{children}</>
}
