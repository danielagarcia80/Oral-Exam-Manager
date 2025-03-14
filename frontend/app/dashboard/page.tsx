'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import Loading from '@/components/Loading/Loading';
import { App } from '@/components/App/App';
import DashBoard from '@/components/DashBoard/DashBaord';

export default function Dashboard() {

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
        <App>
            <DashBoard />
        </App>
    );
}