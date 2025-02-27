'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loading from '@/components/Loading/Loading';
import Roles from '@/components/Roles/Roles';

export default function RolesPage() {
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
    <>
      {session?.user?.email ? (
        <>
          <Roles />
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}
