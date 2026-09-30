import React, { useState, useRef, useEffect } from 'react';
import { useNervel } from '../../context/NervelContext';
import { formatToman } from '../../utils/formatters';
import { NotificationCenter } from './NotificationCenter';
import { WorkspaceSwitcherMenu } from './WorkspaceSwitcherMenu';
import {
  Menu,
  Search,
  Bell,
  X,
} from 'lucide-react';

interface CustomerTopBarProps {
  onToggleMobileMenu: () => void;
}

export const CustomerTopBar: React.FC<CustomerTopBarProps> = ({ onToggleMobileMenu }) => {
  const {
    walletBalance,
    reservedBalance,
    setIsTopUpModalOpen,
    tasks,
    unreadNotificationsCount,
    navigateToTask,
  } = useNervel();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter tasks for quick search
  const filteredTasks = searchQuery.trim()
    ? tasks.filter(
        (t) =>
          t.title.includes(searchQuery) ||
          t.id.includes(searchQuery) ||
          (t.repoUrl && t.repoUrl.includes(searchQuery))
      )
    : [];

  return (
    <header className="sticky top-0 z-30 h-[60px] w-full border-b border-[#18181B] bg-[#08080A]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 2xl:px-10 flex items-center justify-between select-none">
      
      {/* Right: Mobile Hamburger & Restrained Global Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xs sm:max-w-sm lg:max-w-md">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileMenu}
          className="h-9 w-9 flex items-center justify-center rounded-md text-[#71717A] hover:text-[#F4F4F5] hover:bg-[#121215] lg:hidden cursor-pointer shrink-0 transition-colors"
          aria-label="منوی ناوبری"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        {/* Global Search Box */}
        <div ref={searchRef} className="relative w-full">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="جستجو در تسک‌ها و مخازن..."
              className="w-full h-9 bg-[#0E0E12] border border-[#222226] hover:border-[#2E2E33] focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] rounded-md pr-9 pl-8 text-xs sm:text-sm text-[#F4F4F5] placeholder-[#52525B] transition-colors focus:outline-none"
            />
            <Search className="absolute right-2.5 h-4 w-4 text-[#71717A] pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-2.5 text-[#71717A] hover:text-[#F4F4F5] cursor-pointer"
                aria-label="پاک کردن جستجو"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Quick Search Dropdown Results */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute top-11 right-0 w-full sm:w-96 bg-[#0D0D11] border border-[#222226] rounded-md shadow-2xl p-2 z-50 animate-nervel-enter">
              <div className="text-xs font-medium text-[#71717A] px-2 py-1">
                نتایج تسک‌ها ({filteredTasks.length})
              </div>
              {filteredTasks.length > 0 ? (
                <div className="divide-y divide-[#18181B] max-h-64 overflow-y-auto">
                  {filteredTasks.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        navigateToTask(t.id);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full p-2.5 text-right hover:bg-[#14141A] rounded transition-colors block cursor-pointer group"
                    >
                      <div className="text-sm font-medium text-[#F4F4F5] group-hover:text-[#7C3AED] transition-colors line-clamp-1">
                        {t.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#71717A] mt-1 font-latin" dir="ltr">
                        <span className="tabular-nums">{t.id}</span>
                        {t.repoUrl && <span>· {t.repoUrl}</span>}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs sm:text-sm text-[#71717A]">
                  هیچ موردی مطابق با جستجوی شما یافت نشد
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Left: Global Utilities (Wallet Summary, Notifications, Account/Workspace Menu) */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        
        {/* Compact Text-based Wallet Summary */}
        <div
          onClick={() => setIsTopUpModalOpen(true)}
          role="button"
          tabIndex={0}
          title="مشاهده جزئیات کیف پول و افزایش اعتبار"
          className="hidden sm:flex items-center gap-2 text-xs text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors cursor-pointer py-1 px-2 rounded hover:bg-[#121215]"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[#71717A]">اعتبار</span>
            <span className="tabular-nums font-medium text-[#E4E4E7]" dir="ltr">
              {formatToman(walletBalance)}
            </span>
          </div>

          {reservedBalance > 0 && (
            <>
              <span className="text-[#27272A]">·</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[#71717A]">رزرو</span>
                <span className="tabular-nums text-[#A1A1AA]" dir="ltr">
                  {formatToman(reservedBalance)}
                </span>
              </div>
            </>
          )}

          {walletBalance < 50000 && (
            <span className="mr-1 text-[11px] font-medium text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded">
              موجودی کم
            </span>
          )}
        </div>

        {/* Icon-First Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="h-9 w-9 flex items-center justify-center rounded-md text-[#71717A] hover:text-[#F4F4F5] hover:bg-[#121215] transition-colors relative cursor-pointer"
            aria-label="مرکز اعلانات"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 rounded-full bg-[#7C3AED] text-white text-[10px] font-medium flex items-center justify-center px-1 tabular-nums leading-none">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <NotificationCenter
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        </div>

        {/* Restrained Account & Workspace Switcher Menu */}
        <WorkspaceSwitcherMenu currentWorkspace="customer" />

      </div>

    </header>
  );
};
