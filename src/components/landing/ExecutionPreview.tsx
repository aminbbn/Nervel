import React, { useState, useEffect } from 'react';
import { BRAND } from '../../config/brand';
import {
  Check,
  GitPullRequest,
  Clock,
  Layers,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

interface TimelineStep {
  id: number;
  label: string;
  detail?: string;
}

const STEPS: TimelineStep[] = [
  { id: 1, label: 'پروژه دریافت شد', detail: 'اتصال به مخزن shop-web و اعتبارسنجی وابستگی‌ها' },
  { id: 2, label: 'محیط آماده شد', detail: 'بارگذاری کانتینر ایزوله تست و محیط اجرای آزمون' },
  { id: 3, label: 'در حال اعمال تغییرات', detail: 'بازنویسی ماژول احراز هویت OAuth2 و مدیریت توکن‌ها' },
  { id: 4, label: 'اجرای تست‌ها', detail: 'اجرای خودکار آزمون‌های واحد، ساخت و اعتبارسنجی lint' },
  { id: 5, label: 'آماده‌سازی خروجی', detail: 'ایجاد Pull Request و فایل Patch تغییرات' },
];

export const ExecutionPreview: React.FC = () => {
  // Current active step index (0-indexed: 2 means step 3 'در حال اعمال تغییرات')
  const [activeStepIndex, setActiveStepIndex] = useState<number>(2);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(522); // 08:42 start
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Smooth elapsed timer simulation (increments calmly)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Subtle deterministic state progression
  // Every 9 seconds, moves to next step calmly until step 5 finishes and shows deliverable, then smoothly resets
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        // After final step (deliverable prepared), wait then reset smoothly to step 3
        return 2;
      });
    }, 9000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Format elapsed seconds as MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isExecutionCompleted = activeStepIndex === STEPS.length - 1;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full bg-[#0A0A0D] border border-[#222226] rounded-lg p-5 sm:p-6 text-right select-none shadow-xl transition-all"
      dir="rtl"
    >
      {/* Top Header: Task Title & Status */}
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#18181B]">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#71717A] font-latin tabular-nums" dir="ltr">
              TSK-9410
            </span>
            <span className="text-[#3F3F46]">·</span>
            <h3 className="text-base sm:text-[17px] font-bold text-[#F4F4F5] truncate">
              رفع مشکل ورود با گوگل
            </h3>
          </div>
          <p className="text-xs text-[#71717A] leading-relaxed">
            بررسی خطای اعتبارسنجی توکن callback در سرویس احراز هویت
          </p>
        </div>

        {/* Status Pill: Minimal & restrained */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#121216] border border-[#222226] shrink-0">
          {isExecutionCompleted ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
              <span className="text-xs font-medium text-[#D4D4D8]">
                آماده ادغام
              </span>
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
              <span className="text-xs font-medium text-[#D4D4D8]">
                در حال اجرا
              </span>
            </>
          )}
        </div>
      </div>

      {/* Metadata Row: Project, Model, Elapsed Time */}
      <div className="grid grid-cols-3 gap-2 py-3.5 border-b border-[#18181B] text-xs">
        <div>
          <span className="text-[#71717A] block">پروژه:</span>
          <span className="font-latin text-[#D4D4D8] font-medium block mt-0.5 truncate" dir="ltr">
            shop-web
          </span>
        </div>
        <div>
          <span className="text-[#71717A] block">مدل:</span>
          <span className="font-latin text-[#D4D4D8] font-medium block mt-0.5 truncate" dir="ltr">
            {BRAND.defaultModelName}
          </span>
        </div>
        <div>
          <span className="text-[#71717A] block">زمان سپری‌شده:</span>
          <span className="font-latin tabular-nums text-[#D4D4D8] font-medium block mt-0.5" dir="ltr">
            {formatTime(elapsedSeconds)}
          </span>
        </div>
      </div>

      {/* Execution Timeline */}
      <div className="pt-4 space-y-3.5">
        <div className="text-xs font-medium text-[#71717A]">
          مراحل پیشرفت تسک:
        </div>

        <div className="space-y-3">
          {STEPS.map((step, idx) => {
            const isDone = idx < activeStepIndex;
            const isCurrent = idx === activeStepIndex;
            const isPending = idx > activeStepIndex;

            return (
              <div
                key={step.id}
                className="flex items-start gap-3 group transition-colors"
              >
                {/* Status Indicator Icon */}
                <div className="mt-0.5 shrink-0 flex items-center justify-center">
                  {isDone && (
                    <div className="h-4 w-4 rounded-full bg-[#121217] border border-[#27272A] flex items-center justify-center text-[#10B981]">
                      <Check className="h-2.5 w-2.5 stroke-[2.5]" />
                    </div>
                  )}

                  {isCurrent && (
                    <div className="h-4 w-4 rounded-full bg-[#1A1329] border border-[#7C3AED]/60 flex items-center justify-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED]" />
                    </div>
                  )}

                  {isPending && (
                    <div className="h-4 w-4 rounded-full bg-[#0D0D11] border border-[#222226] flex items-center justify-center">
                      <span className="h-1 w-1 rounded-full bg-[#3F3F46]" />
                    </div>
                  )}
                </div>

                {/* Step Label & Detail */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs sm:text-[13px] font-medium leading-snug transition-colors ${
                        isCurrent
                          ? 'text-[#F4F4F5]'
                          : isDone
                          ? 'text-[#A1A1AA]'
                          : 'text-[#52525B]'
                      }`}
                    >
                      {step.label}
                    </span>

                    {isCurrent && (
                      <span className="text-[11px] text-[#7C3AED] font-latin tabular-nums shrink-0" dir="ltr">
                        active
                      </span>
                    )}
                  </div>

                  {step.detail && (
                    <p
                      className={`text-[11px] leading-relaxed mt-0.5 ${
                        isCurrent ? 'text-[#71717A]' : 'text-[#3F3F46]'
                      }`}
                    >
                      {step.detail}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deliverable Output Banner (Appears when final step is active or completed) */}
      <div
        className={`mt-4 pt-3.5 border-t border-[#18181B] flex items-center justify-between text-xs transition-opacity duration-200 ${
          activeStepIndex >= 4 ? 'opacity-100' : 'opacity-60'
        }`}
      >
        <div className="flex items-center gap-2">
          <GitPullRequest className="h-3.5 w-3.5 text-[#7C3AED] shrink-0" />
          <span className="text-[#A1A1AA]">خروجی نهایی:</span>
          <span className="font-latin text-[#F4F4F5] font-medium" dir="ltr">
            PR #49 (ready to merge)
          </span>
        </div>

        <div className="flex items-center gap-1 text-[#71717A] text-[11px] font-latin" dir="ltr">
          <span>+34 -8 lines</span>
        </div>
      </div>
    </div>
  );
};
