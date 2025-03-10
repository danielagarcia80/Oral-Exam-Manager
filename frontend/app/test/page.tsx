'use client';

import { signOut, useSession } from 'next-auth/react';

export default function Test() {
  const { data: session } = useSession();

  if (!session) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div>
      <p>Welcome, {session?.user?.email}</p>
      <button type="button" onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  );
}
