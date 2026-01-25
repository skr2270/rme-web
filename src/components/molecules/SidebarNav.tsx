import type { ReactNode } from 'react';

export type SidebarNavItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
};

type SidebarNavProps = {
  items: SidebarNavItem[];
  title?: string;
};

export function SidebarNav({ items, title = 'NAVIGATION' }: SidebarNavProps) {
  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-gray-500 px-3">{title}</div>
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={item.onClick}
            className={
              item.active
                ? 'w-full text-left px-4 py-3 rounded-2xl bg-violet-600 text-white font-semibold flex items-center gap-2'
                : 'w-full text-left px-4 py-3 rounded-2xl text-gray-700 hover:bg-gray-100 flex items-center gap-2'
            }
          >
            {item.icon ? <span className="text-inherit">{item.icon}</span> : null}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
