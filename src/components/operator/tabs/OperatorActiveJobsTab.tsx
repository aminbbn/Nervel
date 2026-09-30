import React, { useState } from 'react';
import { useNervel } from '../../../context/NervelContext';
import { formatToman, toPersianDigits } from '../../../utils/formatters';
import { calculateOperatorPayout } from '../../../services/payoutService';
import {
  Play,
  Server,
  Clock,
  Cpu,
  Layers,
  Shield,
  FileCode,
  Terminal,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export const OperatorActiveJobsTab: React.FC = () => {
  const {
    operatorNode,
    tasks,
    setOperatorTab,
    navigateToTask,
  } = useNervel();

  const [activeLogTab, setActiveLogTab] = useState<'stdout' | 'sandbox_stats' | 'qa_check'>('stdout');

  // Filter tasks running on this worker
  const activeJobs = tasks.filter(
    (t) =>
      t.workerId === operatorNode.workerId &&
      t.status !== 'completed' &&
      t.status !== 'cancelled'
  );

  return (
    <div className="space-y-8 animate-nervel-enter">
      {/* Header and Capacity summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#18181C]">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F4F5]">تسک‌های فعال</h1>
          <p className="text-sm text-[#71717A] mt-1.5">
            کانتینرهای فعال، پایش مصرف حافظه سندباکس و لاگ‌های مستقیم اجرای زمان‌بند
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs sm:text-sm self-start sm:self-auto shrink-0">
          <div className="px-3 py-1.5 rounded bg-[#0D0D11] border border-[#18181C] text-[#A1A1AA]">
            <span>اسلات‌های فعال: </span>
            <span className="text-[#F4F4F5] font-medium tabular-nums">
              {toPersianDigits(activeJobs.length)} از {toPersianDigits(operatorNode.operatorCapacityLimit)}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded bg-[#0D0D11] border border-[#18181C] text-[#10B981] flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            <span>ایزولاسیون فعال</span>
          </div>
        </div>
      </div>

      {activeJobs.length > 0 ? (
        <div className="space-y-6">
          {activeJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-lg bg-[#09090C] border border-[#18181C] overflow-hidden divide-y divide-[#141418]"
            >
              {/* Job Header */}
              <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-medium text-[#7C3AED] bg-[#7C3AED]/10 px-2 py-0.5 rounded border border-[#7C3AED]/20">
                      {job.modelName}
                    </span>
                    <span className="text-xs text-[#71717A] font-latin tabular-nums" dir="ltr">
                      {job.id}
                    </span>
                    <span className="text-xs text-[#52525B]">·</span>
                    <span className="text-xs text-[#10B981] flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                      کانتینر فعال (PID: 49102)
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#F4F4F5] leading-snug">
                    {job.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-[#71717A] flex-wrap">
                    <span>مخزن: <span className="text-[#D4D4D8] font-latin" dir="ltr">{job.repoUrl}</span></span>
                    <span>·</span>
                    <span>شاخه کاری: <span className="text-[#D4D4D8] font-latin" dir="ltr">{job.branch || 'main'}</span></span>
                  </div>
                </div>

                {/* Real Elapsed Time & Payout */}
                <div className="flex items-center gap-5 lg:border-r lg:border-[#18181C] lg:pr-5 shrink-0">
                  <div className="text-right">
                    <span className="text-xs text-[#71717A] block">زمان سپری‌شده:</span>
                    <span className="text-sm font-medium text-[#F4F4F5] tabular-nums block mt-0.5">
                      ۴۸ دقیقه و ۲۲ ثانیه
                    </span>
                    <span className="text-xs text-[#71717A]">بدون تخمین کاذب؛ زمان دقیق اجرا</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#71717A] block">درآمد تخمینی ورکر:</span>
                    <span className="text-sm font-medium text-[#10B981] tabular-nums block mt-0.5">
                      ~{formatToman(calculateOperatorPayout(job))}
                    </span>
                    <span className="text-xs text-[#71717A]">محاسبه پس از تکمیل موفق</span>
                  </div>
                </div>
              </div>

              {/* Resource Metrics Bar */}
              <div className="px-5 py-3 bg-[#060608] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[#71717A] block">استفاده از پردازنده:</span>
                  <span className="text-[#F4F4F5] font-medium tabular-nums mt-0.5 block">
                    ۱.۴ هسته (از سقف ۲)
                  </span>
                </div>
                <div>
                  <span className="text-[#71717A] block">مصرف حافظه رم:</span>
                  <span className="text-[#F4F4F5] font-medium tabular-nums mt-0.5 block">
                    ۱٬۲۴۰ مگابایت / ۴٬۰۹۶ مگابایت
                  </span>
                </div>
                <div>
                  <span className="text-[#71717A] block">توکن‌های مصرفی کانتینر:</span>
                  <span className="text-[#F4F4F5] font-medium tabular-nums mt-0.5 block">
                    {toPersianDigits(
                      (job.tokenStats?.inputTokens || 21500) +
                        (job.tokenStats?.outputTokens || 3200)
                    )} توکن
                  </span>
                </div>
                <div>
                  <span className="text-[#71717A] block">نوع سندباکس:</span>
                  <span className="text-[#A1A1AA] font-latin mt-0.5 block" dir="ltr">
                    gVisor runsc isolation
                  </span>
                </div>
              </div>

              {/* Live Sandbox Console Tab Bar */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[#141418] pb-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveLogTab('stdout')}
                      className={`text-xs px-2.5 py-1 rounded transition-colors cursor-pointer ${
                        activeLogTab === 'stdout'
                          ? 'bg-[#18181D] text-[#F4F4F5] font-medium'
                          : 'text-[#71717A] hover:text-[#A1A1AA]'
                      }`}
                    >
                      خروجی زنده دیمن (STDOUT)
                    </button>
                    <button
                      onClick={() => setActiveLogTab('sandbox_stats')}
                      className={`text-xs px-2.5 py-1 rounded transition-colors cursor-pointer ${
                        activeLogTab === 'sandbox_stats'
                          ? 'bg-[#18181D] text-[#F4F4F5] font-medium'
                          : 'text-[#71717A] hover:text-[#A1A1AA]'
                      }`}
                    >
                      وضعیت داکر و پایش منابع
                    </button>
                    <button
                      onClick={() => setActiveLogTab('qa_check')}
                      className={`text-xs px-2.5 py-1 rounded transition-colors cursor-pointer ${
                        activeLogTab === 'qa_check'
                          ? 'bg-[#18181D] text-[#F4F4F5] font-medium'
                          : 'text-[#71717A] hover:text-[#A1A1AA]'
                      }`}
                    >
                      تست‌های کیفی (QA Layer)
                    </button>
                  </div>

                  <span className="text-xs text-[#71717A] flex items-center gap-1">
                    <Terminal className="h-3.5 w-3.5" />
                    <span>بروزرسانی مستقیم سوکت</span>
                  </span>
                </div>

                {/* Console Output Screen */}
                <div
                  className="rounded bg-[#030304] border border-[#141418] p-4 font-code text-xs text-[#A1A1AA] space-y-1.5 overflow-x-auto max-h-56 leading-relaxed"
                  dir="ltr"
                >
                  {activeLogTab === 'stdout' && (
                    <>
                      <div className="text-[#52525B]">[08:40:00] Initializing worker execution runtime container...</div>
                      <div className="text-[#52525B]">[08:40:15] Git clone completed: branch feat/zarinpal-v4 checkout OK</div>
                      <div>[08:42:00] Codex agent invoking model reasoning stream...</div>
                      <div>[08:45:10] Tool exec: write_file src/gateways/zarinpal.service.ts (+142 lines)</div>
                      <div>[08:52:30] Tool exec: edit_file tests/payment.spec.ts (+68 lines)</div>
                      <div className="text-[#7C3AED]">[09:20:00] Invoking Vitest runner in isolated container sandbox...</div>
                      <div className="text-[#10B981]">[09:28:14] PASS tests/payment.spec.ts (6 tests passed, 0 failed)</div>
                      <div className="text-[#F59E0B]">[09:35:00] QA concurrency stress test running (20 threads concurrent access)...</div>
                    </>
                  )}

                  {activeLogTab === 'sandbox_stats' && (
                    <>
                      <div>Container ID: sbx_c38f921_cinema_seat_locking</div>
                      <div>Runtime: runsc (gVisor sandbox kernel 5.15)</div>
                      <div>Network: bridge (outbound restricted to approved API endpoints only)</div>
                      <div>Filesystem: tmpfs ephemeral mount (destroyed on exit)</div>
                      <div>Memory Limit: 4096 MiB | Current: 1240 MiB | Swap: 0 MiB</div>
                      <div>CPU Quota: 200000 / 100000 (2 cores hard cap)</div>
                    </>
                  )}

                  {activeLogTab === 'qa_check' && (
                    <>
                      <div>[QA-1] Compilation: TypeScript 5.4 check passed (0 errors)</div>
                      <div>[QA-2] Linter: ESLint passed (0 warnings, 0 errors)</div>
                      <div>[QA-3] Concurrency Suite: SELECT ... FOR UPDATE verified on postgres test container</div>
                      <div>[QA-4] Diff sanity: 3 files changed, no unauthorized files touched</div>
                      <div className="text-[#10B981]">[QA-STATUS] Staging build ready for deliverables packaging.</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-lg bg-[#09090C] border border-[#18181C] space-y-3">
          <Server className="h-10 w-10 text-[#52525B] mx-auto" />
          <h3 className="text-base font-bold text-[#F4F4F5]">هیچ تسک فعالی روی این ورکر در حال اجرا نیست</h3>
          <p className="text-xs text-[#71717A] max-w-md mx-auto">
            گره شما آنلاین است و به محض ثبت درخواست جدید توسط مشتریان و احراز شروط مدل و ظرفیت، کار به صورت خودکار به این کانتینر تحویل داده می‌شود.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setOperatorTab('worker')}
              className="text-xs text-[#7C3AED] hover:text-[#9061F9] font-medium"
            >
              بررسی سلامت و مشخصات گره ورکر ←
            </button>
          </div>
        </div>
      )}

      {/* Crucial Architectural Policy Banner: Task Failure vs Worker Failure */}
      <div className="p-5 rounded-lg bg-[#0A0A0D] border border-[#18181C] space-y-3">
        <h3 className="text-base font-bold text-[#F4F4F5] flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#7C3AED]" />
          <span>قوانین تفکیک خطای تسک (Task Failure) از خطای ورکر (Worker Failure)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#71717A] leading-relaxed">
          <div className="p-3.5 rounded bg-[#060608] border border-[#141418] space-y-1.5">
            <span className="text-[#D4D4D8] font-medium block">۱. خطای تسک (Task Failure):</span>
            <p>
              اگر تسک به دلیل نقص سورس‌کد مخزن، عدم پاس شدن تست‌های قبلی مشتری یا ابهام نیازمندی متوقف شود، ورکر مقصر نیست. تا زمانی که ورکر فرآیند را به صورت سالم گزارش کرده و گزارش QA را ثبت کند، هزینه محاسبات بر مبنای توکن‌های مصرف‌شده به حساب اپراتور واریز می‌گردد.
            </p>
          </div>

          <div className="p-3.5 rounded bg-[#060608] border border-[#141418] space-y-1.5">
            <span className="text-[#D4D4D8] font-medium block">۲. خطای ورکر و قطعی گره (Worker Failure):</span>
            <p>
              اگر ورکر به دلیل قطع برق یا اینترنت در ۳ درخواست پایش متوالی (۳ دقیقه) بی‌پاسخ بماند، تسک به حالت بازتخصیص می‌رود. آخرین وضعیت سالم ذخیره می‌شود، اما به دلیل عدم تکمیل فرآیند توسط ورکر، هیچ درآمدی برای تلاش نیمه‌کاره پرداخت نمی‌گردد تا انگیزه سوءاستفاده از بین برود.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
