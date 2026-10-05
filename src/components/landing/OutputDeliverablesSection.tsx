import React, { useState } from 'react';
import { BRAND } from '../../config/brand';
import { useScrollReveal } from './useScrollReveal';
import {
  GitPullRequest,
  FileCode2,
  FolderArchive,
  CheckCircle2,
  ExternalLink,
  Download,
  Copy,
  Check,
} from 'lucide-react';

export const OutputDeliverablesSection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal();
  const { output } = BRAND;
  const [copiedAction, setCopiedAction] = useState<string | null>(null);

  const handleCopyMock = (label: string) => {
    setCopiedAction(label);
    setTimeout(() => setCopiedAction(null), 1800);
  };

  const getDeliverableIcon = (id: string) => {
    switch (id) {
      case 'pr':
        return <GitPullRequest className="h-4 w-4 text-[#A1A1AA]" />;
      case 'patch':
        return <FileCode2 className="h-4 w-4 text-[#A1A1AA]" />;
      case 'zip':
        return <FolderArchive className="h-4 w-4 text-[#A1A1AA]" />;
      case 'tests':
        return <CheckCircle2 className="h-4 w-4 text-[#A1A1AA]" />;
      default:
        return <GitPullRequest className="h-4 w-4 text-[#A1A1AA]" />;
    }
  };

  return (
    <section
      id="output"
      ref={ref}
      className="relative w-full py-16 sm:py-20 lg:py-24 border-t border-[#18181B] text-right"
      aria-label="خروجی و تحویل‌پذیرها"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-14 items-start">
        
        {/* Right Column in RTL: Headings, Supporting Copy & Structured Deliverable List */}
        <div className="lg:col-span-6 xl:col-span-6 space-y-6 sm:space-y-8">
          
          {/* Headings */}
          <div
            className={`space-y-3 ${
              isVisible ? 'animate-section-reveal' : 'opacity-0'
            }`}
            style={{ animationDelay: '0ms' }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#F4F4F5] leading-tight tracking-tight">
              <span className="block">{output.headline.line1}</span>
              <span className="block text-[#E4E4E7]">{output.headline.line2}</span>
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1AA] leading-[1.75] max-w-lg">
              {output.description}
            </p>
          </div>

          {/* Deliverables: Minimal structured list with quiet technical framing */}
          <div className="space-y-2.5 pt-1">
            {output.deliverables.map((item, idx) => {
              const delay = `${(idx + 1) * 33}ms`;

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 sm:px-4 sm:py-3 rounded-md bg-[#09090C] border border-[#1C1C20] hover:border-[#27272A] transition-colors ${
                    isVisible ? 'animate-section-reveal' : 'opacity-0'
                  }`}
                  style={{ animationDelay: delay }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-7 w-7 rounded bg-[#121216] border border-[#222226] flex items-center justify-center shrink-0">
                      {getDeliverableIcon(item.id)}
                    </div>
                    <div className="min-w-0">
                      <span className="font-latin text-sm font-semibold text-[#F4F4F5] block truncate" dir="ltr">
                        {item.title}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-[#71717A] text-left shrink-0 pr-2">
                    {item.description}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Left Column in RTL: Realistic Output Surface */}
        <div
          className={`lg:col-span-6 xl:col-span-6 w-full ${
            isVisible ? 'animate-section-reveal' : 'opacity-0'
          }`}
          style={{ animationDelay: '100ms' }}
        >
          {/* Single Restrained Product-Output Surface (No excessive nested layers) */}
          <div
            className="w-full bg-[#0A0A0D] border border-[#222226] rounded-lg p-5 sm:p-6 text-right select-none shadow-xl"
            dir="rtl"
          >
            {/* Header: Task Completed Status & Reference ID */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#18181B]">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#71717A] font-latin tabular-nums" dir="ltr">
                    TSK-8921
                  </span>
                  <span className="text-[#3F3F46]">·</span>
                  <h3 className="text-base sm:text-[17px] font-bold text-[#F4F4F5] truncate">
                    رفع مشکل ورود با گوگل
                  </h3>
                </div>
                <p className="text-xs text-[#71717A]">
                  تغییرات اعمال‌شده بر اساس استانداردهای مخزن و آزمون‌های خودکار اعتبارسنجی شد.
                </p>
              </div>

              {/* Status Indicator: Restrained neutral pill with subtle green dot */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#121216] border border-[#222226] shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                <span className="text-xs font-medium text-[#D4D4D8]">
                  تسک تکمیل شد
                </span>
              </div>
            </div>

            {/* Structured Internal Rows: Result, Tests, Files, Cost */}
            <div className="divide-y divide-[#18181B] text-xs">
              
              {/* Row 1: Deliverable Pull Request */}
              <div className="py-3 flex items-center justify-between gap-2">
                <span className="text-[#71717A]">نتیجه:</span>
                <div className="flex items-center gap-2 font-latin font-medium text-[#F4F4F5]" dir="ltr">
                  <GitPullRequest className="h-3.5 w-3.5 text-[#7C3AED]" />
                  <span>PR #128</span>
                  <span className="text-[#52525B] text-[11px]">(fix/google-oauth)</span>
                </div>
              </div>

              {/* Row 2: Tests & Validation */}
              <div className="py-3 flex items-center justify-between gap-2">
                <span className="text-[#71717A]">تست‌ها:</span>
                <div className="flex items-center gap-2 font-latin text-xs font-medium" dir="ltr">
                  <span className="text-[#10B981] flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 inline" />
                    12 passed
                  </span>
                  <span className="text-[#52525B]">·</span>
                  <span className="text-[#71717A]">0 failed</span>
                </div>
              </div>

              {/* Row 3: Changed Files */}
              <div className="py-3 flex items-center justify-between gap-2">
                <span className="text-[#71717A]">فایل‌های تغییرکرده:</span>
                <div className="flex items-center gap-2 font-latin font-medium text-[#D4D4D8]" dir="ltr">
                  <span>6 files</span>
                  <span className="text-[#10B981] text-[11px]">+48</span>
                  <span className="text-[#EF4444] text-[11px]">-12</span>
                </div>
              </div>

              {/* Row 4: Final Processing Cost (Mock preview value clearly isolated from real pricing logic) */}
              <div className="py-3 flex items-center justify-between gap-2">
                <span className="text-[#71717A]">هزینه پردازش:</span>
                <span className="font-latin tabular-nums text-[#D4D4D8] font-medium" dir="ltr">
                  14,800 Toman
                </span>
              </div>

            </div>

            {/* Deliverable Action Buttons */}
            <div className="pt-4 border-t border-[#18181B] flex flex-wrap items-center gap-2.5">
              
              {/* Primary Action */}
              <button
                type="button"
                onClick={() => handleCopyMock('pr')}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded bg-[#18181F] hover:bg-[#22222B] border border-[#2B2B32] text-xs font-medium text-[#F4F4F5] transition-colors cursor-pointer"
              >
                <GitPullRequest className="h-3.5 w-3.5 text-[#7C3AED]" />
                <span>مشاهده Pull Request</span>
                <ExternalLink className="h-3 w-3 text-[#71717A]" />
              </button>

              {/* Secondary Actions */}
              <button
                type="button"
                onClick={() => handleCopyMock('patch')}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded bg-transparent hover:bg-[#121216] border border-[#222226] text-xs text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors cursor-pointer"
              >
                {copiedAction === 'patch' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#10B981]" />
                    <span className="text-[#10B981]">دانلود شد</span>
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5 text-[#71717A]" />
                    <span>دریافت Patch</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleCopyMock('zip')}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded bg-transparent hover:bg-[#121216] border border-[#222226] text-xs text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors cursor-pointer"
              >
                {copiedAction === 'zip' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#10B981]" />
                    <span className="text-[#10B981]">دانلود شد</span>
                  </>
                ) : (
                  <>
                    <FolderArchive className="h-3.5 w-3.5 text-[#71717A]" />
                    <span>دریافت ZIP</span>
                  </>
                )}
              </button>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
