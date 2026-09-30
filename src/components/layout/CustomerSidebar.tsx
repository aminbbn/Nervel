import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { useNervel } from '../../context/NervelContext';
import {
  LayoutDashboard,
  FolderGit2,
  ListOrdered,
  Wallet,
  Settings,
  HelpCircle,
  X,
} from 'lucide-react';
import { toPersianDigits } from '../../utils/formatters';

interface CustomerSidebarProps {
  isOpenOnMobile: boolean;
  onCloseMobile: () => void;
}

export const CustomerSidebar: React.FC<CustomerSidebarProps> = ({
  isOpenOnMobile,
  onCloseMobile,
}) => {
  const { pathname, navigate } = useRouter();
  const { tasks } = useNervel();

  const activeCustomerTasksCount = tasks.filter(
    (t) => t.status !== 'completed' && t.status !== 'cancelled'
  ).length;

  const customerNavItems: Array<{
    path: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    matchPrefix?: boolean;
  }> = [
    { path: '/dashboard', label: 'داشبورد', icon: LayoutDashboard },
    { path: '/projects', label: 'پروژه‌ها', icon: FolderGit2, matchPrefix: true },
    { path: '/tasks', label: 'تسک‌ها', icon: ListOrdered, count: activeCustomerTasksCount, matchPrefix: true },
    { path: '/wallet', label: 'کیف پول', icon: Wallet },
  ];

  const isItemActive = (item: { path: string; matchPrefix?: boolean }) => {
    if (item.matchPrefix) {
      return pathname === item.path || pathname.startsWith(item.path + '/');
    }
    return pathname === item.path;
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpenOnMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
        />
      )}

      {/* Persistent Customer Sidebar on RIGHT in RTL */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 w-64 bg-[#08080A] border-l border-[#18181B] flex flex-col justify-between transition-transform duration-100 ease-out select-none lg:translate-x-0 ${
          isOpenOnMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Brand Header & Customer Navigation */}
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="h-16 border-b border-[#18181B] px-5 flex items-center justify-between">
            <button
              onClick={() => handleNavClick('/dashboard')}
              className="flex items-center gap-3 text-right group cursor-pointer"
            >
              {/* Cloudflare-like minimal geometric mark */}
              <div className="h-7 w-7 bg-[#101014] border border-[#27272A] rounded flex items-center justify-center">
                <div className="h-3 w-3 bg-[#7C3AED] rounded-sm group-hover:scale-110 transition-transform duration-100" />
              </div>

              <div className="flex flex-col text-right">
                <span className="text-base font-bold tracking-wider text-[#F4F4F5]" dir="ltr">
                  NERVEL
                </span>
                <span className="text-xs text-[#71717A] tracking-normal -mt-0.5">
                  سامانه توزیع‌شده برنامه‌نویسی
                </span>
              </div>
            </button>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded text-[#71717A] hover:text-[#F4F4F5] lg:hidden cursor-pointer"
              aria-label="بستن منو"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Primary Customer Navigation List */}
          <nav className="p-3 space-y-1.5" aria-label="ناوبری اصلی مشتری">
            {customerNavItems.map((item) => {
              const active = isItemActive(item);
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 text-base transition-colors rounded-md text-right group cursor-pointer ${
                    active
                      ? 'bg-[#111116] text-[#F4F4F5] font-medium border-r-2 border-[#7C3AED]'
                      : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#0D0D11] font-normal'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                        active ? 'text-[#7C3AED]' : 'text-[#71717A] group-hover:text-[#A1A1AA]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && item.count > 0 && (
                    <span className="tabular-nums text-xs text-[#A1A1AA] px-2 py-0.5 rounded bg-[#17171C]">
                      {toPersianDigits(item.count)}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Subtle Divider before Lower-Priority items */}
            <div className="pt-2 pb-1">
              <div className="border-t border-[#18181B]" />
            </div>

            {/* Lower-priority: Settings */}
            <button
              onClick={() => handleNavClick('/settings')}
              className={`w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 text-base transition-colors rounded-md text-right group cursor-pointer ${
                pathname === '/settings'
                  ? 'bg-[#111116] text-[#F4F4F5] font-medium border-r-2 border-[#7C3AED]'
                  : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#0D0D11] font-normal'
              }`}
            >
              <Settings
                className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                  pathname === '/settings' ? 'text-[#7C3AED]' : 'text-[#71717A] group-hover:text-[#A1A1AA]'
                }`}
              />
              <span>تنظیمات</span>
            </button>
          </nav>
        </div>

        {/* Clean, quiet bottom sidebar footer (all shell noise removed) */}
        <div className="border-t border-[#18181B] p-4 text-xs text-[#71717A]">
          <button
            onClick={() => handleNavClick('/settings')}
            className="flex items-center gap-2 text-[#71717A] hover:text-[#A1A1AA] transition-colors text-xs w-full text-right cursor-pointer"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>راهنما و مستندات API</span>
          </button>
        </div>
      </aside>
    </>
  );
};
