import React, { useState, useRef, useEffect } from 'react';
import { useRouter, WorkspaceType } from '../../context/RouterContext';
import { useNervel } from '../../context/NervelContext';
import {
  ChevronDown,
  Check,
  LayoutDashboard,
  Server,
  Settings,
  Wallet,
  Coins,
  LogOut,
  Sliders,
  Radio,
  Globe,
} from 'lucide-react';

interface WorkspaceSwitcherMenuProps {
  currentWorkspace: WorkspaceType;
}

export const WorkspaceSwitcherMenu: React.FC<WorkspaceSwitcherMenuProps> = ({
  currentWorkspace,
}) => {
  const { navigate, switchToWorkspace } = useRouter();
  const { operatorNode } = useNervel();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isCustomer = currentWorkspace === 'customer';

  return (
    <div ref={menuRef} className="relative select-none">
      {/* Account / Workspace Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-9 px-2 rounded-md hover:bg-[#121215] border border-transparent hover:border-[#222226] transition-colors cursor-pointer text-right shrink-0"
        aria-label="منوی حساب و فضای کاری"
        aria-expanded={isOpen}
      >
        {isCustomer ? (
          <div className="h-6 w-6 rounded-full bg-[#18181E] border border-[#27272A] flex items-center justify-center text-xs font-medium text-[#F4F4F5] shrink-0">
            پ
          </div>
        ) : (
          <div className="h-6 w-6 rounded-full bg-[#101018] border border-[#7C3AED]/40 flex items-center justify-center text-xs font-medium text-[#7C3AED] shrink-0">
            <Server className="h-3.5 w-3.5" />
          </div>
        )}

        <span className="hidden sm:inline text-xs font-medium text-[#D4D4D8] leading-none">
          {isCustomer ? 'تیم مهندسی' : 'اپراتور ورکر'}
        </span>

        <ChevronDown
          className={`h-3.5 w-3.5 text-[#71717A] transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-[#F4F4F5]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-11 w-64 bg-[#0D0D11] border border-[#222226] rounded-md shadow-2xl py-2 z-50 text-right animate-nervel-enter">
          {/* Identity Header */}
          <div className="px-4 py-2.5 border-b border-[#18181B]">
            <div className="text-sm font-medium text-[#F4F4F5]">
              {isCustomer ? 'تیم مهندسی پارسا' : 'کنسول اپراتور شبکه'}
            </div>
            <div className="text-xs text-[#71717A] mt-0.5 font-latin" dir="ltr">
              {isCustomer ? 'amin.creating.studio@gmail.com' : `Node: ${operatorNode.workerId}`}
            </div>
          </div>

          {/* Restrained Workspace Switcher Section */}
          <div className="p-2 border-b border-[#18181B] bg-[#09090D]">
            <div className="text-[11px] font-medium text-[#71717A] px-2 py-1 select-none">
              تغییر فضای کاری
            </div>
            <div className="space-y-1 mt-0.5">
              {/* Customer Workspace Option */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  switchToWorkspace('customer');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded transition-colors text-right cursor-pointer ${
                  isCustomer
                    ? 'bg-[#18181E] text-[#F4F4F5] font-medium'
                    : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#121216]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard
                    className={`h-4 w-4 ${isCustomer ? 'text-[#7C3AED]' : 'text-[#71717A]'}`}
                  />
                  <span>فضای مشتری</span>
                </div>
                {isCustomer && (
                  <Check className="h-4 w-4 text-[#10B981] shrink-0" />
                )}
              </button>

              {/* Operator Workspace Option */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  switchToWorkspace('operator');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded transition-colors text-right cursor-pointer ${
                  !isCustomer
                    ? 'bg-[#18181E] text-[#F4F4F5] font-medium'
                    : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#121216]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Server
                    className={`h-4 w-4 ${!isCustomer ? 'text-[#7C3AED]' : 'text-[#71717A]'}`}
                  />
                  <span>فضای اپراتور</span>
                </div>
                {!isCustomer && (
                  <Check className="h-4 w-4 text-[#10B981] shrink-0" />
                )}
              </button>
            </div>
          </div>

          {/* Quick Contextual Links */}
          <div className="py-1.5">
            {isCustomer ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full px-4 py-2 text-sm text-[#D4D4D8] hover:bg-[#14141A] hover:text-[#F4F4F5] text-right flex items-center gap-2.5 cursor-pointer"
                >
                  <Settings className="h-4 w-4 text-[#71717A]" />
                  <span>تنظیمات مشتری</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/wallet');
                  }}
                  className="w-full px-4 py-2 text-sm text-[#D4D4D8] hover:bg-[#14141A] hover:text-[#F4F4F5] text-right flex items-center gap-2.5 cursor-pointer"
                >
                  <Wallet className="h-4 w-4 text-[#71717A]" />
                  <span>کیف پول و تراکنش‌ها</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/operator/worker');
                  }}
                  className="w-full px-4 py-2 text-sm text-[#D4D4D8] hover:bg-[#14141A] hover:text-[#F4F4F5] text-right flex items-center gap-2.5 cursor-pointer"
                >
                  <Radio className="h-4 w-4 text-[#71717A]" />
                  <span>پیکربندی گره (Worker)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/operator/withdrawals');
                  }}
                  className="w-full px-4 py-2 text-sm text-[#D4D4D8] hover:bg-[#14141A] hover:text-[#F4F4F5] text-right flex items-center gap-2.5 cursor-pointer"
                >
                  <Coins className="h-4 w-4 text-[#71717A]" />
                  <span>درآمد و تسویه‌ها</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/operator/settings');
                  }}
                  className="w-full px-4 py-2 text-sm text-[#D4D4D8] hover:bg-[#14141A] hover:text-[#F4F4F5] text-right flex items-center gap-2.5 cursor-pointer"
                >
                  <Sliders className="h-4 w-4 text-[#71717A]" />
                  <span>تنظیمات اپراتور</span>
                </button>
              </>
            )}
          </div>

          {/* Public Landing Link & Logout Section */}
          <div className="border-t border-[#18181B] pt-1.5 space-y-0.5">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/');
              }}
              className="w-full px-4 py-2 text-sm text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#14141A] text-right flex items-center gap-2.5 cursor-pointer transition-colors"
            >
              <Globe className="h-4 w-4 text-[#71717A]" />
              <span>صفحه اصلی (عمومی)</span>
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 text-sm text-[#71717A] hover:text-[#EF4444] hover:bg-[#14141A] text-right flex items-center gap-2.5 cursor-pointer"
            >
              <LogOut className="h-4 w-4 text-[#71717A]" />
              <span>خروج از حساب</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
