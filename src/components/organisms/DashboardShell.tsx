import type { ReactNode } from 'react';

type DashboardShellProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  alerts?: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
};

export function DashboardShell({ title, subtitle, actions, alerts, sidebar, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-40 bg-slate-50/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{title}</div>
            {subtitle ? <div className="text-gray-500">{subtitle}</div> : null}
          </div>
          <div className="flex items-center gap-3">{actions}</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {alerts ? <div className="mt-4 space-y-2">{alerts}</div> : null}
      </div>

      <div className="mt-6 flex gap-6">
        <aside className="hidden lg:flex lg:flex-col lg:fixed lg:top-[76px] lg:left-6 lg:w-[240px] lg:h-[calc(100vh-76px)] rounded-3xl bg-white border border-gray-200 p-4 shadow-sm">
          {sidebar}
        </aside>

        <main className="w-full lg:pl-[280px] pb-10">
          <div className="lg:hidden mb-6 rounded-3xl bg-white border border-gray-200 p-4 shadow-sm">
            {sidebar}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
