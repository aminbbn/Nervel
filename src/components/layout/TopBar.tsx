import React from 'react';
import { useNervel } from '../../context/NervelContext';
import { formatToman } from '../../utils/formatters';
import { ViewMode } from '../../types';
import { Menu, Plus } from 'lucide-react';

interface TopBarProps {
  onToggleMobileMenu: () => void;
}

const VIEW_TITLES: Record<ViewMode, { title: string; subtitle?: string }> = {
  dashboard: { title: 'داشبورد عملیاتی', subtitle: 'نظارت بر صف، تسک‌های در حال اجرا و تحویل کد' },
  tasks_list: { title: 'فهرست تسک‌های مهندسی', subtitle: 'مدیریت و پیگیری کلیه کارهای ثبت‌شده' },
  new_task: { title: 'ثبت تسک جدید', subtitle: 'تخصیص تسک نرم‌افزاری به ورکر کانتینری ایزوله' },
  task_detail: { title: 'جزئیات و نظارت بر اجرا', subtitle: 'رویدادهای زنده، استعلام‌های ورکر و گزارش QA' },
  wallet: { title: 'کیف پول و دفتر کل مالی', subtitle: 'شفافیت تسویه بر مبنای مصرف واقعی توکن‌ها' },
  activity: { title: 'رویدادها و ممیزی سامانه', subtitle: 'گزارش وقایع زیرساختی و تخصیص‌های شبکه' },
  settings: { title: 'تنظیمات حساب و شبکه', subtitle: 'رفتار قطعی ورکر، کانال‌های اعلان و وب‌هوک' },
  operator: { title: 'کنسول ورکر اپراتور', subtitle: 'وضعیت گره پردازشی، پایداری و تسویه درآمد' },
};

export const TopBar: React.FC<TopBarProps> = ({ onToggleMobileMenu }) => {
  const {
    view,
    setView,
    walletBalance,
    reservedBalance,
    setIsTopUpModalOpen,
    activeRole,
  } = useNervel();

  const currentViewMeta = VIEW_TITLES[view] || { title: 'میز کار NERVEL' };

  return (
    <header className="sticky top-0 z-20 h-16 w-full border-b border-[#17171A] bg-[#020202] px-4 lg:px-8 flex items-center justify-between">
      
      {/* Right: Breadcrumb / Page Title */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger button */}
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 rounded text-[#71717A] hover:text-[#F4F4F5] lg:hidden"
          aria-label="نمایش منوی اصلی"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-baseline gap-2.5">
          <h1 className="text-base sm:text-[17px] font-bold text-[#F4F4F5]">
            {currentViewMeta.title}
          </h1>
          {currentViewMeta.subtitle && (
            <span className="hidden md:inline text-sm text-[#71717A]">
              — {currentViewMeta.subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Left: Compact Utility Strip (Wallet + New Task CTA) */}
      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* Unboxed clean typography for Wallet in top bar */}
        {activeRole === 'customer' && (
          <div className="flex items-center gap-2.5 text-sm">
            <span className="text-sm text-[#71717A]">موجودی:</span>
            <span className="tabular-nums font-semibold text-[#F4F4F5]">
              {formatToman(walletBalance)}
            </span>

            {reservedBalance > 0 && (
              <span className="hidden sm:inline tabular-nums text-xs text-[#71717A]">
                (رزرو: {formatToman(reservedBalance)})
              </span>
            )}

            <button
              onClick={() => setIsTopUpModalOpen(true)}
              className="text-sm font-medium text-[#7C3AED] hover:text-[#8B5CF6] transition-colors pr-1"
            >
              افزایش اعتبار
            </button>
          </div>
        )}

        {/* Primary CTA */}
        {activeRole === 'customer' && view !== 'new_task' && (
          <button
            onClick={() => setView('new_task')}
            className="flex items-center gap-2 rounded bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white hover:bg-[#8B5CF6] active:bg-[#6D28D9] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">ثبت تسک جدید</span>
            <span className="sm:hidden">تسک جدید</span>
          </button>
        )}

        {/* Node status indicator for operator mode */}
        {activeRole === 'operator' && (
          <div className="flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-[#10B981]" />
            <span className="text-[#A1A1AA]">گره آماده پذیرش</span>
          </div>
        )}
      </div>

    </header>
  );
};
