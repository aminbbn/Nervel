import React, { useState } from 'react';
import { useNervel } from '../../context/NervelContext';
import { toast } from '../../context/ToastContext';
import { NotificationCenter } from './NotificationCenter';
import { WorkspaceSwitcherMenu } from './WorkspaceSwitcherMenu';
import {
  Menu,
  Bell,
  RefreshCw,
} from 'lucide-react';

interface OperatorTopBarProps {
  onToggleMobileMenu: () => void;
}

export const OperatorTopBar: React.FC<OperatorTopBarProps> = ({ onToggleMobileMenu }) => {
  const {
    operatorNode,
    unreadNotificationsCount,
    runDiagnosticPing,
  } = useNervel();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPinging, setIsPinging] = useState(false);

  const isOnline = operatorNode.status === 'online';

  const handlePing = () => {
    setIsPinging(true);
    runDiagnosticPing();
    setTimeout(() => {
      setIsPinging(false);
      toast.info('پایش ضربان ورکر انجام شد', `تاخیر رفت و برگشت: ${operatorNode.latencyMs} میلی‌ثانیه`);
    }, 400);
  };

  return (
    <header className="sticky top-0 z-30 h-[60px] w-full border-b border-[#18181B] bg-[#08080A]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 2xl:px-10 flex items-center justify-between select-none">
      
      {/* Right: Mobile Hamburger & Compact Worker Indicator */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileMenu}
          className="h-9 w-9 flex items-center justify-center rounded-md text-[#71717A] hover:text-[#F4F4F5] hover:bg-[#121215] lg:hidden cursor-pointer shrink-0 transition-colors"
          aria-label="منوی ناوبری اپراتور"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        {/* Compact, unframed Worker indicator: e.g. ● آنلاین · 24ms */}
        <div className="h-9 flex items-center gap-2 text-xs sm:text-sm">
          <span
            className={`h-2 w-2 rounded-full shrink-0 ${
              isOnline ? 'bg-[#10B981]' : 'bg-[#71717A]'
            }`}
          />
          <span className="font-medium text-[#F4F4F5] text-xs">
            {isOnline ? 'آنلاین' : 'آفلاین'}
          </span>
          <span className="text-[#3F3F46]">·</span>
          <button
            onClick={handlePing}
            title="تست تاخیر و پایش ضربان"
            className="inline-flex items-center gap-1 text-xs text-[#71717A] hover:text-[#D4D4D8] font-latin transition-colors cursor-pointer"
            dir="ltr"
          >
            <span className="tabular-nums">{operatorNode.latencyMs}ms</span>
            <RefreshCw
              className={`h-3 w-3 text-[#52525B] ${isPinging ? 'animate-spin text-[#7C3AED]' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Left: Global Utilities (Notifications, Workspace Menu) */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        
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
        <WorkspaceSwitcherMenu currentWorkspace="operator" />

      </div>

    </header>
  );
};
