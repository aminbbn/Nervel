import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { useNervel } from '../../context/NervelContext';
import {
  LayoutDashboard,
  Play,
  History,
  Server,
  Coins,
  ArrowUpRight,
  Sliders,
  X,
  Cpu,
} from 'lucide-react';
import { toPersianDigits } from '../../utils/formatters';

interface OperatorSidebarProps {
  isOpenOnMobile: boolean;
  onCloseMobile: () => void;
}

export const OperatorSidebar: React.FC<OperatorSidebarProps> = ({
  isOpenOnMobile,
  onCloseMobile,
}) => {
  const { pathname, navigate } = useRouter();
  const { tasks, operatorNode } = useNervel();

  const isOnline = operatorNode.status === 'online';

  const activeOperatorJobsCount = tasks.filter(
    (t) =>
      t.workerId === operatorNode.workerId &&
      t.status !== 'completed' &&
      t.status !== 'cancelled'
  ).length;

  const operatorNavItems: Array<{
    path: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    hasIndicator?: boolean;
    exact?: boolean;
  }> = [
    { path: '/operator', label: 'نمای کلی', icon: LayoutDashboard, exact: true },
    { path: '/operator/jobs', label: 'تسک‌های فعال', icon: Play, count: activeOperatorJobsCount },
    { path: '/operator/history', label: 'تاریخچه', icon: History, count: operatorNode.totalJobsExecuted },
    { path: '/operator/worker', label: 'Worker', icon: Server, hasIndicator: true },
    { path: '/operator/earnings', label: 'درآمد', icon: Coins },
    { path: '/operator/withdrawals', label: 'برداشت‌ها', icon: ArrowUpRight },
  ];

  const isItemActive = (item: { path: string; exact?: boolean }) => {
    if (item.exact) {
      return pathname === item.path;
    }
    return pathname === item.path || pathname.startsWith(item.path + '/');
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

      {/* Persistent Operator Sidebar on RIGHT in RTL */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 w-64 bg-[#08080A] border-l border-[#18181B] flex flex-col justify-between transition-transform duration-100 ease-out select-none lg:translate-x-0 ${
          isOpenOnMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Operator Brand & Navigation */}
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="h-16 border-b border-[#18181B] px-5 flex items-center justify-between">
            <button
              onClick={() => handleNavClick('/operator')}
              className="flex items-center gap-3 text-right group cursor-pointer"
            >
              {/* Operator specialized glyph mark */}
              <div className="h-7 w-7 bg-[#101018] border border-[#7C3AED]/40 rounded flex items-center justify-center">
                <Cpu className="h-3.5 w-3.5 text-[#7C3AED] group-hover:scale-110 transition-transform duration-100" />
              </div>

              <div className="flex flex-col text-right">
                <span className="text-base font-bold tracking-wider text-[#F4F4F5]" dir="ltr">
                  NERVEL
                </span>
                <span className="text-xs text-[#A1A1AA] tracking-normal -mt-0.5">
                  کنسول اپراتور و ورکر
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

          {/* Section Sub-header */}
          <div className="px-5 pt-3 pb-1 text-[11px] font-medium text-[#71717A] uppercase tracking-wider select-none">
            ناوبری گره محاسباتی
          </div>

          {/* Operator Navigation List */}
          <nav className="p-3 space-y-1.5" aria-label="ناوبری اپراتور">
            {operatorNavItems.map((item) => {
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

                  <div className="flex items-center gap-2">
                    {item.hasIndicator && (
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isOnline ? 'bg-[#10B981]' : 'bg-[#71717A]'
                        }`}
                      />
                    )}

                    {item.count !== undefined && item.count > 0 && (
                      <span className="tabular-nums text-xs text-[#A1A1AA] px-2 py-0.5 rounded bg-[#17171C]">
                        {toPersianDigits(item.count)}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Subtle Divider before Lower-Priority items */}
            <div className="pt-2 pb-1">
              <div className="border-t border-[#18181B]" />
            </div>

            {/* Operator Settings */}
            <button
              onClick={() => handleNavClick('/operator/settings')}
              className={`w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 text-base transition-colors rounded-md text-right group cursor-pointer ${
                pathname === '/operator/settings'
                  ? 'bg-[#111116] text-[#F4F4F5] font-medium border-r-2 border-[#7C3AED]'
                  : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#0D0D11] font-normal'
              }`}
            >
              <Sliders
                className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                  pathname === '/operator/settings' ? 'text-[#7C3AED]' : 'text-[#71717A] group-hover:text-[#A1A1AA]'
                }`}
              />
              <span>تنظیمات</span>
            </button>
          </nav>
        </div>

        {/* Operator Bottom Sidebar Footer: Worker Health & Telemetry */}
        <div className="border-t border-[#18181B] p-4 text-xs text-[#71717A] space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    isOnline ? 'bg-[#10B981]' : 'bg-[#71717A]'
                  }`}
                />
                <span className="text-[#D4D4D8] font-latin tabular-nums font-medium text-xs" dir="ltr">
                  {operatorNode.workerId}
                </span>
              </span>
              <span className="text-xs text-[#71717A] tabular-nums" dir="ltr">
                {operatorNode.latencyMs}ms
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#71717A]">
              <span>ظرفیت هم‌زمانی:</span>
              <span className="text-[#F4F4F5] tabular-nums font-medium">
                {toPersianDigits(operatorNode.currentAssignedCount)} / {toPersianDigits(operatorNode.operatorCapacityLimit)} تسک
              </span>
            </div>
          </div>

          {/* Provider Badge */}
          <div className="pt-2 flex items-center justify-between text-xs border-t border-[#141418]">
            <span className="text-xs text-[#71717A] truncate font-latin">
              {operatorNode.activeProvider}
            </span>
            <span className="text-xs text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
              سالم (٪{toPersianDigits(operatorNode.uptimeRate)})
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
