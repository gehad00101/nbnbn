
'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);
  
  return null;
}
