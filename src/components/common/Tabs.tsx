import React from 'react';

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface TabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  className?: string;
  variant?: 'underline' | 'pill';
}

export function Tabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  className = '',
  variant = 'underline',
}: TabsProps<T>) {
  if (variant === 'pill') {
    return (
      <div className={`inline-flex items-center gap-1 p-1 bg-[#09090C] border border-[#1E1E22] rounded-md ${className}`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={`px-3.5 py-1.5 text-sm font-medium rounded transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-[#18181C] text-[#F4F4F5]'
                  : 'text-[#71717A] hover:text-[#D4D4D8]'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`mr-2 text-xs tabular-nums ${isActive ? 'text-[#A1A1AA]' : 'text-[#52525B]'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`border-b border-[#18181B] w-full ${className}`}>
      <nav className="flex space-x-reverse space-x-6 -mb-px overflow-x-auto no-scrollbar" aria-label="تب‌ها">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={`py-3.5 px-1 inline-flex items-center gap-2 border-b-2 text-sm sm:text-[15px] font-medium whitespace-nowrap transition-colors select-none ${
                isActive
                  ? 'border-[#7C3AED] text-[#F4F4F5]'
                  : 'border-transparent text-[#71717A] hover:text-[#D4D4D8] hover:border-[#27272A]'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-xs tabular-nums px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-[#1C1C22] text-[#D4D4D8]' : 'bg-[#121215] text-[#71717A]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
