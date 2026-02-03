import type { CSSProperties, ReactNode } from 'react';

type DashboardShellProps = {
  title: string;
  subtitle?: string;
  logoSrc?: string;
  logoAlt?: string;
  actions?: ReactNode;
  alerts?: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
};

export function DashboardShell({ title, subtitle, logoSrc, logoAlt = 'RME', actions, alerts, sidebar, children }: DashboardShellProps) {
  const headerHeight = '72px';
  return (
    <div className="min-h-screen bg-slate-50" style={{ '--dashboard-header-height': headerHeight } as CSSProperties}>
      <div className="sticky top-0 z-40 bg-slate-50/90 backdrop-blur border-b border-gray-100">
        <div className="w-full px-4 sm:px-6 py-3 lg:py-0 lg:h-[var(--dashboard-header-height)] flex flex-col gap-3 lg:grid lg:grid-cols-[240px_1fr_auto] lg:items-center lg:gap-4">
          <div className="flex items-center justify-between lg:justify-start">
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoSrc} alt={logoAlt} className="h-8 sm:h-9 w-auto" />
            ) : null}
            <div className="flex items-center gap-3 lg:hidden">{actions}</div>
          </div>
          <div className="max-w-5xl lg:mx-auto text-left lg:text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{title}</div>
            {subtitle ? <div className="text-gray-500">{subtitle}</div> : null}
          </div>
          <div className="hidden lg:flex items-center justify-end gap-3">{actions}</div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6">
        {alerts ? <div className="mt-4 space-y-2">{alerts}</div> : null}
      </div>

      <div className="flex gap-6 pt-6 px-4 sm:px-6 min-h-[calc(100vh-var(--dashboard-header-height))] items-stretch">
        <aside className="hidden lg:flex lg:flex-col lg:sticky lg:top-[var(--dashboard-header-height)] lg:w-[240px] self-stretch h-full min-h-[calc(100vh-var(--dashboard-header-height)-24px)] bg-white border-r border-gray-200 px-4 py-5">
          {sidebar}
        </aside>

        <main className="w-full pb-10">
          <div className="lg:hidden mb-6 rounded-3xl bg-white border border-gray-200 p-4 shadow-sm">
            {sidebar}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
