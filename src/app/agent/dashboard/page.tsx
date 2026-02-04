'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { SidebarNav } from '@/components/molecules/SidebarNav';
import { DashboardShell } from '@/components/organisms/DashboardShell';
import { AssignQrFlow } from '@/components/organisms/AssignQrFlow';
import { clearAdminToken, getAdminRole, getAdminToken } from '@/lib/adminAuth';

export default function AgentDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeSection, setActiveSection] = useState<'assign'>('assign');

  useEffect(() => {
    const role = getAdminRole();
    const t = getAdminToken();
    if (!t || role !== 'AGENT') {
      router.replace('/agent/login');
      setAuthChecked(true);
      return;
    }
    setToken(t);
    setAuthChecked(true);
  }, [router]);

  const handleLogout = () => {
    clearAdminToken();
    router.replace('/agent/login');
  };

  if (!authChecked || !token) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  const IconAssign = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 7h10M5 12h10M5 17h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M17 16l2 2 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <DashboardShell
      title="Agent Dashboard"
      subtitle="Assign QR codes to onboard businesses."
      logoSrc="/RME3.png"
      logoAlt="RME"
      actions={
        <Button onClick={handleLogout} className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl">
          Logout
        </Button>
      }
      alerts={null}
      sidebar={
        <SidebarNav
          items={[
            {
              id: 'assign',
              label: 'Assign QR Codes',
              icon: <IconAssign />,
              active: activeSection === 'assign',
              onClick: () => setActiveSection('assign'),
            },
          ]}
        />
      }
    >
      <section className="space-y-6">
        <AssignQrFlow authToken={token} />
      </section>
    </DashboardShell>
  );
}