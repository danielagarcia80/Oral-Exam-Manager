'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { App } from '@/components/App/App';
import Loading from '@/components/Loading/Loading';
import Dashboard from '@/components/Dashboard/Dashboard';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return <Loading />;
  }
  return (
    <Dashboard />
  );
}
