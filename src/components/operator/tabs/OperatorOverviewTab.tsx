import React, { useState } from 'react';
import { useNervel } from '../../../context/NervelContext';
import { useRouter } from '../../../context/RouterContext';
import { formatToman, toPersianDigits } from '../../../utils/formatters';
import {
  Play,
  ArrowUpRight,
  Check,
} from 'lucide-react';

export const OperatorOverviewTab: React.FC = () => {
  const {
    operatorNode,
    tasks,
    operatorWithdrawals,
    toggleOperatorStatus,
    navigateToTask,
  } = useNervel();

  const { navigate } = useRouter();
  const isOnline = operatorNode.status === 'online';
  const [showLogs, setShowLogs] = useState(false);

  // Find active task executing on this worker
  const activeJob = tasks.find(
    (t) =>
      t.workerId === operatorNode.workerId &&
      t.status !== 'completed' &&
      t.status !== 'cancelled'
  );

  // Recent completed tasks (last 4)
  const completedJobs = tasks
    .filter((t) => t.status === 'completed')
    .slice(0, 4);

  const latestWithdrawal = operatorWithdrawals[0];

  return (
    <div className="space-y-8 animate-nervel-enter">
      {/* 1. Page Header with Contextual Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#18181C]">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F4F5]">
            نمای کلی
          </h1>
          <p className="text-sm text-[#71717A] mt-1.5 leading-relaxed">
            وضعیت پردازش کانتینرها، ظرفیت زمان‌بند مرکزی و عملکرد عملیاتی گره
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
          <button
            onClick={toggleOperatorStatus}
            className={`px-3.5 py-2 text-sm font-medium rounded transition-colors cursor-pointer border ${
              isOnline
                ? 'border-[#27272A] text-[#D4D4D8] hover:bg-[#18181D]'
                : 'border-[#7C3AED] bg-[#7C3AED] text-white hover:bg-[#6D28D9]'
            }`}
          >
            {isOnline ? 'توقف موقت ورکر' : 'فعال‌سازی ورکر'}
          </button>
        </div>
      </div>

      {/* 2. Simple Metric Row (No cards, typography + vertical dividers, white values) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-2 border-b border-[#18181C] pb-6 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-[#1A1A1E]">
        {/* Concurrency */}
        <div className="space-y-1 pt-3 sm:pt-0">
          <span className="text-xs text-[#71717A] block">ظرفیت اجرای هم‌زمان:</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#F4F4F5] tabular-nums">
              {toPersianDigits(operatorNode.currentAssignedCount)} / {toPersianDigits(operatorNode.operatorCapacityLimit)}
            </span>
            <span className="text-xs text-[#71717A]">تسک فعال</span>
          </div>
          <span className="text-xs text-[#52525B] block tabular-nums">
            سقف سیستم: {toPersianDigits(operatorNode.maxAllowedCapacity)}
          </span>
        </div>

        {/* Completed Jobs */}
        <div className="space-y-1 pt-4 sm:pt-0 sm:pr-6">
          <span className="text-xs text-[#71717A] block">تسک‌های انجام‌شده:</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#F4F4F5] tabular-nums">
              {toPersianDigits(operatorNode.totalJobsExecuted)}
            </span>
            <span className="text-xs text-[#71717A]">موفق</span>
          </div>
          <span className="text-xs text-[#52525B] block tabular-nums">
            پایداری: ٪{toPersianDigits(operatorNode.uptimeRate)}
          </span>
        </div>

        {/* Withdrawable Earnings (White numbers, no neon color) */}
        <div className="space-y-1 pt-4 sm:pt-0 sm:pr-6">
          <span className="text-xs text-[#71717A] block">درآمد قابل تسویه:</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#F4F4F5] tabular-nums">
              {formatToman(operatorNode.withdrawableBalanceToman)}
            </span>
          </div>
          <button
            onClick={() => navigate('/operator/withdrawals')}
            className="text-xs text-[#7C3AED] hover:text-[#9061F9] transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <span>تسویه به شبا</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>

        {/* Connectivity & Provider */}
        <div className="space-y-1 pt-4 sm:pt-0 sm:pr-6">
          <span className="text-xs text-[#71717A] block">پرووایدر و اتصال:</span>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-[#F4F4F5]">
              {operatorNode.activeProvider}
            </span>
            <span className="text-xs text-[#71717A] tabular-nums font-latin" dir="ltr">
              {operatorNode.latencyMs}ms
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#71717A]">
            <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-[#10B981]' : 'bg-[#71717A]'}`} />
            <span>{isOnline ? 'آنلاین و آماده' : 'آفلاین'}</span>
            <span>· سهمیه {toPersianDigits(operatorNode.remainingProviderQuotaPercent)}٪</span>
          </div>
        </div>
      </div>

      {/* 3. Active Job (One primary structured surface) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#F4F4F5] flex items-center gap-2">
            <Play className="h-4 w-4 text-[#7C3AED]" />
            <span>تسک در حال اجرای کنونی</span>
          </h2>
          {activeJob && (
            <button
              onClick={() => navigate('/operator/jobs')}
              className="text-xs text-[#71717A] hover:text-[#D4D4D8] transition-colors cursor-pointer"
            >
              کنسول کامل تسک‌ها ←
            </button>
          )}
        </div>

        {activeJob ? (
          <div className="rounded-lg bg-[#09090C] border border-[#18181C] p-5 space-y-4">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#141418]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#71717A]">
                  <span className="font-latin tabular-nums text-[#A1A1AA]" dir="ltr">
                    {activeJob.id}
                  </span>
                  <span>·</span>
                  <span className="text-[#D4D4D8] font-medium">{activeJob.modelName}</span>
                  {activeJob.repoUrl && (
                    <>
                      <span>·</span>
                      <span className="font-latin truncate max-w-xs text-[#71717A]" dir="ltr">
                        {activeJob.repoUrl}
                      </span>
                    </>
                  )}
                </div>
                <h3 className="text-base font-medium text-[#F4F4F5] leading-snug">
                  {activeJob.title}
                </h3>
              </div>

              {/* Execution phase indicator */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1.5 text-xs text-[#F59E0B]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                  <span>مرحله اجرا: ارزیابی و تست سندباکس</span>
                </span>
                <span className="text-xs text-[#71717A] tabular-nums mr-2">
                  (زمان: ۵۵ دقیقه)
                </span>
              </div>
            </div>

            {/* Short Latest Event Preview (No large terminal by default) */}
            <div className="flex items-center justify-between text-xs py-1 text-[#A1A1AA]">
              <div className="flex items-center gap-2 truncate">
                <span className="text-[#71717A] shrink-0">آخرین رخداد:</span>
                <span className="font-latin text-[#D4D4D8] truncate" dir="ltr">
                  [STEP] QA concurrency tests: 20 threads simulated against DB lock — zero violations
                </span>
              </div>

              <button
                onClick={() => setShowLogs(!showLogs)}
                className="shrink-0 text-xs text-[#7C3AED] hover:text-[#9061F9] transition-colors cursor-pointer mr-4"
              >
                {showLogs ? 'بستن لاگ' : 'مشاهده خروجی زنده'}
              </button>
            </div>

            {/* Collapsible detailed log preview */}
            {showLogs && (
              <div className="p-3 rounded bg-[#040405] border border-[#141418] text-xs font-code text-[#A1A1AA] space-y-1 leading-relaxed animate-nervel-enter" dir="ltr">
                <div className="text-[#10B981]">[OK] Docker container sandbox running (sbx_c38f921)</div>
                <div>[INFO] QA concurrency tests: 20 threads simulated against DB lock</div>
                <div className="text-[#71717A]">[STEP] Verifying zero race-condition violations...</div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 rounded-lg bg-[#09090C] border border-[#18181C] text-center space-y-1">
            <p className="text-sm text-[#A1A1AA]">در حال حاضر تسکی در این گره در حال اجرا نیست</p>
            <p className="text-xs text-[#52525B]">
              گره متصل و آماده پذیرش است. به محض انتساب تسک توسط زمان‌بند، اجرای کانتینر آغاز می‌شود.
            </p>
          </div>
        )}
      </div>

      {/* 4. Two-Column Operational Layout: Recent Tasks + Routing Eligibility */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Tasks (Left 2 cols, simple row list, no nested cards) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#F4F4F5]">تسک‌های اخیراً پردازش‌شده</h2>
            <button
              onClick={() => navigate('/operator/history')}
              className="text-xs text-[#71717A] hover:text-[#D4D4D8] transition-colors cursor-pointer"
            >
              مشاهده تاریخچه کامل ←
            </button>
          </div>

          <div className="border border-[#18181C] rounded-lg bg-[#09090C] divide-y divide-[#141418] overflow-hidden">
            {completedJobs.map((t) => (
              <div
                key={t.id}
                onClick={() => navigateToTask(t.id)}
                className="p-3.5 flex items-center justify-between gap-4 text-xs hover:bg-[#0E0E12] transition-colors cursor-pointer select-none"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#71717A] font-latin tabular-nums" dir="ltr">
                      {t.id}
                    </span>
                    <span className="text-[#3F3F46]">·</span>
                    <span className="text-[#F4F4F5] truncate font-medium">{t.title}</span>
                  </div>
                  <div className="text-xs text-[#71717A] flex items-center gap-2">
                    <span>مدل: {t.modelName}</span>
                    <span>·</span>
                    <span>تکمیل: {t.completedAt || 'دیروز'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-[#71717A]">موفق</span>
                  <Check className="h-3.5 w-3.5 text-[#10B981]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Routing Eligibility & Compact Settlement Summary */}
        <div className="space-y-6">
          {/* Routing Eligibility (Simple flat list with semantic green indicators, no card inside card) */}
          <div className="rounded-lg bg-[#09090C] border border-[#18181C] p-5 space-y-4">
            <div className="pb-3 border-b border-[#141418]">
              <h2 className="text-sm font-bold text-[#F4F4F5]">صلاحیت در زمان‌بند مرکزی</h2>
              <p className="text-xs text-[#71717A] mt-0.5">
                شروط لازم برای دریافت خودکار تسک از شبکه
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#D4D4D8]">سلامت دیمن و لایونس</span>
                <span className="inline-flex items-center gap-1 text-[#10B981]">
                  <Check className="h-3.5 w-3.5" />
                  <span>پایدار</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#D4D4D8]">اسلات هم‌زمانی خالی</span>
                <span className="inline-flex items-center gap-1 text-[#10B981]">
                  <Check className="h-3.5 w-3.5" />
                  <span>{toPersianDigits(operatorNode.operatorCapacityLimit - operatorNode.currentAssignedCount)} اسلات آزاد</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#D4D4D8]">سهمیه پرووایدر فعال</span>
                <span className="inline-flex items-center gap-1 text-[#10B981]">
                  <Check className="h-3.5 w-3.5" />
                  <span>٪{toPersianDigits(operatorNode.remainingProviderQuotaPercent)} موجود</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#D4D4D8]">انطباق مدل‌های درخواستی</span>
                <span className="inline-flex items-center gap-1 text-[#10B981]">
                  <Check className="h-3.5 w-3.5" />
                  <span>فعال</span>
                </span>
              </div>
            </div>
          </div>

          {/* Compact Settlement Summary (Row/link, not a huge separate telemetry card) */}
          <div className="rounded-lg bg-[#09090C] border border-[#18181C] p-4 text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[#71717A]">آخرین تسویه:</span>
              <span className="text-[#F4F4F5] font-medium tabular-nums">
                {latestWithdrawal ? formatToman(latestWithdrawal.amount) : 'موردی ثبت نشده'}
              </span>
            </div>

            {latestWithdrawal && (
              <div className="flex items-center justify-between text-[#71717A]">
                <span>وضعیت انتقال:</span>
                <span className="text-[#10B981]">واریز شده (پایا)</span>
              </div>
            )}

            <div className="pt-2 border-t border-[#141418]">
              <button
                onClick={() => navigate('/operator/withdrawals')}
                className="text-xs text-[#7C3AED] hover:text-[#9061F9] font-medium transition-colors w-full text-right flex items-center justify-between cursor-pointer"
              >
                <span>مشاهده تمام برداشت‌ها</span>
                <span>←</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
