'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AgentIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/agent/login');
  }, [router]);

  return null;
}
