import React from 'react';
import { useNervel } from '../../context/NervelContext';
import { ViewMode } from '../../types';
import {
  LayoutDashboard,
  ListOrdered,
  PlusCircle,
  Wallet,
  Activity,
  Settings,
  Cpu,
  X,
  Server,
} from 'lucide-react';

interface SidebarProps {
  isOpenOnMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenOnMobile, onCloseMobile }) => {
  const {
    view,
    setView,
    activeRole,
    setActiveRole,
    tasks,
  } = useNervel();

  const activeTasksCount = tasks.filter(
    (t) => t.status !== 'completed' && t.status !== 'cancelled'
  ).length;

  const navItems: Array<{
    id: ViewMode;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
  }> = [
    { id: 'dashboard', label: 'داشبورد عملیات', icon: LayoutDashboard },
    { id: 'tasks_list', label: 'تسک‌های مهندسی', icon: ListOrdered, count: activeTasksCount },
    { id: 'new_task', label: 'ثبت تسک جدید', icon: PlusCircle },
    { id: 'wallet', label: 'کیف پول و حسابداری', icon: Wallet },
    { id: 'activity', label: 'رویدادها و ممیزی', icon: Activity },
    { id: 'settings', label: 'تنظیمات سامانه', icon: Settings },
  ];

  const handleNavClick = (id: ViewMode) => {
    if (activeRole !== 'customer') {
      setActiveRole('customer');
    }
    setView(id);
    onCloseMobile();
  };

  const handleOperatorClick = () => {
    setActiveRole('operator');
    setView('operator');
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

      {/* Persistent Sidebar on RIGHT in RTL */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 w-64 bg-[#020202] border-l border-[#17171A] flex flex-col justify-between transition-transform duration-100 ease-out lg:translate-x-0 ${
          isOpenOnMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Brand Header */}
        <div>
          <div className="h-16 border-b border-[#17171A] px-4 flex items-center justify-between">
            <button
              onClick={() => {
                setActiveRole('customer');
                setView('dashboard');
                onCloseMobile();
              }}
              className="flex items-center gap-2.5 text-right group"
            >
              {/* Geometric restrained mark */}
              <div className="h-6 w-6 bg-[#0E0E10] border border-[#27272A] flex items-center justify-center text-white">
                <div className="h-2.5 w-2.5 bg-[#7C3AED]" />
              </div>

              <div className="flex flex-col text-right">
                <span className="text-base font-bold tracking-widest text-[#F4F4F5] font-sans">
                  NERVEL
                </span>
                <span className="text-xs text-[#71717A] tracking-tight -mt-0.5">
                  کنترل‌پنل زیرساخت
                </span>
              </div>
            </button>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded text-[#71717A] hover:text-[#F4F4F5] lg:hidden"
              aria-label="بستن منو"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Role Switcher: Flat Segment */}
          <div className="p-3.5 border-b border-[#17171A]">
            <div className="grid grid-cols-2 rounded bg-[#0A0A0C] p-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveRole('customer');
                  if (view === 'operator') setView('dashboard');
                }}
                className={`py-1.5 px-3 rounded text-center transition-colors font-medium ${
                  activeRole === 'customer'
                    ? 'bg-[#17171A] text-[#F4F4F5]'
                    : 'text-[#71717A] hover:text-[#A1A1AA]'
                }`}
              >
                مشتری
              </button>
              <button
                type="button"
                onClick={handleOperatorClick}
                className={`py-1.5 px-3 rounded text-center transition-colors flex items-center justify-center gap-1.5 font-medium ${
                  activeRole === 'operator'
                    ? 'bg-[#17171A] text-[#F4F4F5]'
                    : 'text-[#71717A] hover:text-[#A1A1AA]'
                }`}
              >
                <Cpu className="h-3.5 w-3.5 text-[#7C3AED]" />
                <span>ورکر شبکه</span>
              </button>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="p-3 space-y-1">
            {activeRole === 'customer' ? (
              <>
                <div className="px-3 pt-2 pb-1.5 text-xs font-semibold text-[#52525B] tracking-wider uppercase select-none">
                  میز کار عملیات
                </div>

                {navItems.map((item) => {
                  const isActive = view === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm transition-colors rounded text-right group ${
                        isActive
                          ? 'bg-[#0E0E10] text-[#F4F4F5] font-semibold border-r-2 border-[#7C3AED]'
                          : 'text-[#8E8E93] hover:text-[#F4F4F5] hover:bg-[#0A0A0C]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                            isActive ? 'text-[#7C3AED]' : 'text-[#71717A] group-hover:text-[#A1A1AA]'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.count !== undefined && item.count > 0 && (
                        <span className="tabular-nums text-xs text-[#A1A1AA] px-2 py-0.5 rounded bg-[#17171A]">
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </>
            ) : (
              <>
                <div className="px-3 pt-2 pb-1.5 text-xs font-semibold text-[#52525B] tracking-wider uppercase select-none">
                  کنسول ورکر
                </div>

                <button
                  onClick={handleOperatorClick}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm bg-[#0E0E10] text-[#F4F4F5] font-semibold border-r-2 border-[#7C3AED] rounded text-right"
                >
                  <Server className="h-4.5 w-4.5 text-[#7C3AED]" />
                  <span>وضعیت و منابع گره ورکر</span>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="border-t border-[#17171A] p-4 text-xs text-[#71717A] space-y-2.5">
          {/* Node connectivity */}
          <div className="flex items-center justify-between px-1">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" />
              <span className="text-[#A1A1AA] text-xs">شبکه فعال</span>
            </span>
            <span className="text-xs text-[#52525B]" dir="ltr">
              v0.3.0
            </span>
          </div>

          {/* Account indicator */}
          <div className="px-1 py-1 flex items-center justify-between text-xs">
            <div className="truncate">
              <span className="block text-[11px] text-[#52525B]">سازمان</span>
              <span className="text-xs text-[#D4D4D8] font-medium truncate block" dir="ltr">
                parsa-tech
              </span>
            </div>
            <span className="text-xs font-semibold text-[#7C3AED]">
              PRO
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
