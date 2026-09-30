import React, { useState } from 'react';
import { useNervel } from '../../context/NervelContext';
import { StatusIndicator } from '../common/StatusIndicator';
import { CodeDiffViewer } from '../common/CodeDiffViewer';
import { Button } from '../common/Button';
import { Tabs } from '../common/Tabs';
import { TaskStatus } from '../../types';
import { formatToman, toPersianDigits } from '../../utils/formatters';
import {
  ArrowLeft,
  FolderGit2,
  GitBranch,
  Terminal,
  GitPullRequest,
  Download,
  AlertTriangle,
  CheckCircle2,
  Send,
  RefreshCw,
  FileCode,
  ExternalLink,
  Flag,
  Clock,
  Pin,
  Cpu,
  Check,
  FileArchive,
} from 'lucide-react';

type DetailTab = 'overview' | 'output' | 'activity' | 'technical';

export const TaskDetailView: React.FC = () => {
  const {
    tasks,
    selectedTaskId,
    setView,
    respondToWaitingWorker,
    triggerReassignNow,
    increaseTaskReserve,
    resolveRepoAccess,
    cancelTask,
    togglePinTask,
    retryPrCreation,
    simulateStateTransition,
    fileTaskDispute,
  } = useNervel();

  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [customerAnswer, setCustomerAnswer] = useState<string>('');
  const [isDisputeOpen, setIsDisputeOpen] = useState<boolean>(false);
  const [disputeReason, setDisputeReason] = useState<string>('');
  const [disputeSubmitted, setDisputeSubmitted] = useState<boolean>(false);
  const [isRetryingPr, setIsRetryingPr] = useState<boolean>(false);

  const task = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  if (!task) {
    return (
      <div className="p-12 text-center text-sm text-[#71717A]">
        تسک مورد نظر یافت نشد.
        <button
          onClick={() => setView('tasks_list')}
          className="block mx-auto mt-2 text-[#7C3AED] hover:underline cursor-pointer"
        >
          بازگشت به فهرست تسک‌ها
        </button>
      </div>
    );
  }

  const handleSendAnswer = () => {
    if (customerAnswer.trim()) {
      respondToWaitingWorker(task.id, customerAnswer.trim());
      setCustomerAnswer('');
    }
  };

  const handleRetryPr = () => {
    setIsRetryingPr(true);
    setTimeout(() => {
      retryPrCreation(task.id);
      setIsRetryingPr(false);
    }, 600);
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disputeReason.trim()) {
      fileTaskDispute(task.id, disputeReason.trim());
      setDisputeSubmitted(true);
      setTimeout(() => {
        setIsDisputeOpen(false);
        setDisputeSubmitted(false);
      }, 2000);
    }
  };

  // Human-readable timeline milestones based on task lifecycle
  const activityMilestones = [
    {
      id: 'm1',
      title: 'پروژه و سورس دریافت شد',
      desc: `کدبیس ${task.repoUrl || 'سورس مستقیم'} با موفقیت خوانده و شاخه ${task.branch || 'main'} شاخص‌گذاری شد.`,
      time: '۱۱:۳۰',
      done: true,
    },
    {
      id: 'm2',
      title: 'محیط اجرای ایزوله آماده شد',
      desc: 'کانتینر ایزوله موقت در ورکر بالا آمد و وابستگی‌های پکیج نصب شدند.',
      time: '۱۱:۳۱',
      done: true,
    },
    {
      id: 'm3',
      title: 'کد در حال بررسی و اعمال است',
      desc: 'عامل نرم‌افزاری در حال پیاده‌سازی منطق تسک بر مبنای معیارهای پذیرش است.',
      time: '۱۱:۳۵',
      done: task.status !== 'queued',
    },
    {
      id: 'm4',
      title: 'تست‌های واحد و ارزیابی کیفی',
      desc: 'اجرای تست‌های خودکار، لینتر و تطبیق ساختار فایل‌ها با دستورالعمل‌های پروژه.',
      time: '۱۱:۵۰',
      done: task.status === 'validating' || task.status === 'completed',
    },
    {
      id: 'm5',
      title: 'خروجی نهایی آماده شد',
      desc: 'بسته تغییرات، Pull Request و فایل Patch ایجاد و اعتبار مازاد آزاد شد.',
      time: task.completedAt || 'در انتظار پایان',
      done: task.status === 'completed',
    },
  ];

  return (
    <div className="w-full space-y-8 animate-nervel-enter">
      
      {/* =========================================================================
          TASK DETAIL HEADER (Always visible regardless of the selected tab)
          Communicates: Title, Project, Overall Status, Elapsed/Completion Time, Cost
          ========================================================================= */}
      <div className="border-b border-[#18181B] pb-6 space-y-4">
        {/* Breadcrumb Trail */}
        <nav className="flex items-center gap-2 text-xs text-[#71717A]" aria-label="مسیر">
          <button
            onClick={() => setView('tasks_list')}
            className="hover:text-[#F4F4F5] transition-colors cursor-pointer"
          >
            تسک‌ها
          </button>
          <span>/</span>
          <span className="text-[#A1A1AA] font-medium font-latin tabular-nums" dir="ltr">{task.id}</span>
        </nav>

        {/* High-level status area */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#F4F4F5] leading-snug">
                {task.title}
              </h1>

              {/* Pin button */}
              <button
                type="button"
                onClick={() => togglePinTask(task.id)}
                title={task.isPinned ? 'حذف از نشان‌شده‌ها' : 'نشان کردن تسک'}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  task.isPinned
                    ? 'text-[#7C3AED] bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20'
                    : 'text-[#52525B] hover:text-[#A1A1AA] hover:bg-[#141418]'
                }`}
              >
                <Pin className={`h-4 w-4 ${task.isPinned ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Project, Branch, Time, Cost strip */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-[13px] text-[#71717A]">
              {task.repoUrl ? (
                <span className="flex items-center gap-1.5 text-[#A1A1AA] font-latin" dir="ltr">
                  <FolderGit2 className="h-3.5 w-3.5 text-[#52525B]" />
                  <span>{task.repoUrl}</span>
                </span>
              ) : (
                <span className="text-[#A1A1AA]">فایل‌های مستقیم</span>
              )}

              {task.branch && (
                <>
                  <span className="text-[#3F3F46]">·</span>
                  <span className="flex items-center gap-1 font-latin" dir="ltr">
                    <GitBranch className="h-3 w-3 text-[#52525B]" />
                    <span>{task.branch}</span>
                  </span>
                </>
              )}

              <span className="text-[#3F3F46]">·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-[#52525B]" />
                <span className="tabular-nums">
                  {task.completedAt ? `تکمیل: ${task.completedAt}` : `ثبت: ${task.createdAt}`}
                </span>
              </span>

              <span className="text-[#3F3F46]">·</span>
              <span className="tabular-nums font-medium text-[#F4F4F5]">
                {task.actualCost
                  ? `هزینه نهایی: ${formatToman(task.actualCost)}`
                  : `سقف مسدود: ${formatToman(task.reservedCap)}`}
              </span>
            </div>
          </div>

          {/* Right Status Indicator & Actions */}
          <div className="flex items-center gap-3 shrink-0 self-start lg:self-auto">
            <div className="px-3.5 py-1.5 rounded-md bg-[#0C0C0F] border border-[#222226]">
              <StatusIndicator status={task.status} size="md" />
            </div>

            {/* Cancel task action if active */}
            {task.status !== 'completed' && task.status !== 'cancelled' && task.status !== 'failed' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => cancelTask(task.id)}
                className="text-[#71717A] hover:text-[#EF4444]"
              >
                لغو تسک
              </Button>
            )}

            {/* If task failed: allow filing dispute or creating new task */}
            {task.status === 'failed' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (task.projectId) {
                    setView('new_task');
                  } else {
                    setView('new_task');
                  }
                }}
              >
                تلاش مجدد در تسک جدید
              </Button>
            )}

            {/* Dispute button if completed or failed */}
            {(task.status === 'completed' || task.status === 'failed') && !task.dispute && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDisputeOpen(true)}
                className="text-[#71717A] hover:text-[#F59E0B]"
                rightIcon={<Flag className="h-3.5 w-3.5" />}
              >
                ثبت اعتراض فنی
              </Button>
            )}
          </div>
        </div>

        {/* =========================================================================
            NEEDS ACTION STRIP (Generalized structure: clarification, increase_reserve, worker_reassignment, repo_access)
            ========================================================================= */}
        {(() => {
          const action = task.actionRequired || (
            task.waitingData
              ? {
                  type: 'clarification' as const,
                  title: 'پاسخ و شفاف‌سازی مشتری مورد نیاز است',
                  description: task.waitingData.question,
                  actionLabel: 'ارسال پاسخ و ادامه اجرا',
                  createdAt: task.waitingData.askedAt,
                  question: task.waitingData.question,
                }
              : task.reassignData
              ? {
                  type: 'worker_reassignment' as const,
                  title: 'تصمیم برای انتقال به ورکر جدید',
                  description: 'ورکر قبلی پاسخگو نبوده و آفلاین شد. اسنپ‌شات آخرین تغییرات شما حفظ شده است.',
                  actionLabel: 'تایید انتقال فوری به ورکر جدید',
                  createdAt: 'هم‌اکنون',
                  secondsLeftBeforeAuto: task.reassignData.secondsLeftBeforeAuto,
                }
              : null
          );

          if (!action) return null;

          return (
            <div className="p-4 sm:p-5 rounded-lg bg-[#0F0D09] border border-[#F59E0B]/30 space-y-3 animate-nervel-enter">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-[#F59E0B]">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{action.title}</span>
                </div>
                {action.secondsLeftBeforeAuto !== undefined && (
                  <span className="text-xs text-[#71717A] tabular-nums">
                    انتقال خودکار ظرف {toPersianDigits(action.secondsLeftBeforeAuto)} ثانیه
                  </span>
                )}
              </div>

              <p className="text-sm text-[#F4F4F5] leading-relaxed">
                {action.description}
              </p>

              {/* Sub-interface based on type */}
              {action.type === 'clarification' && (
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <input
                    type="text"
                    value={customerAnswer}
                    onChange={(e) => setCustomerAnswer(e.target.value)}
                    placeholder="پاسخ یا راهنمایی خود را به ورکر بنویسید..."
                    className="flex-1 h-10 bg-[#161410] border border-[#3E3420] focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] rounded-md px-3.5 text-sm text-[#F4F4F5] placeholder-[#71717A] focus:outline-none transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendAnswer()}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSendAnswer}
                    disabled={!customerAnswer.trim()}
                    rightIcon={<Send className="h-3.5 w-3.5" />}
                  >
                    {action.actionLabel || 'ارسال پاسخ و ادامه اجرا'}
                  </Button>
                </div>
              )}

              {action.type === 'worker_reassignment' && (
                <div className="flex items-center gap-3 pt-1">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => triggerReassignNow(task.id)}
                    rightIcon={<RefreshCw className="h-3.5 w-3.5" />}
                  >
                    {action.actionLabel || 'تایید انتقال فوری به ورکر جدید'}
                  </Button>
                </div>
              )}

              {action.type === 'increase_reserve' && (
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => increaseTaskReserve(task.id, action.requiredReserveAmount || 30000)}
                  >
                    {action.actionLabel || `افزایش اعتبار سقف رزرو (+${formatToman(action.requiredReserveAmount || 30000)})`}
                  </Button>
                </div>
              )}

              {action.type === 'repo_access' && (
                <div className="flex items-center gap-3 pt-1">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => resolveRepoAccess(task.id)}
                    rightIcon={<FolderGit2 className="h-3.5 w-3.5" />}
                  >
                    {action.actionLabel || 'به‌روزرسانی دسترسی مخزن و ادامه اجرا'}
                  </Button>
                </div>
              )}
            </div>
          );
        })()}

        {/* Dispute Confirmation Banner */}
        {task.dispute && (
          <div className="p-4 rounded-md bg-[#121216] border border-[#27272A] text-xs text-[#A1A1AA] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-[#F59E0B]" />
              <span>اعتراض فنی ثبت شده و در حال بررسی توسط تیم کنترل کیفیت است: «{task.dispute.reason}»</span>
            </div>
            <span className="text-[#10B981]">در صف بررسی</span>
          </div>
        )}

        {/* Tabs: نمای کلی, خروجی, فعالیت, جزئیات فنی */}
        <div className="pt-2">
          <Tabs
            activeTab={activeTab}
            onChange={(tabId) => setActiveTab(tabId as DetailTab)}
            tabs={[
              { id: 'overview', label: 'نمای کلی' },
              {
                id: 'output',
                label: 'خروجی',
                count: task.deliverables ? 1 : undefined,
              },
              { id: 'activity', label: 'فعالیت' },
              { id: 'technical', label: 'جزئیات فنی' },
            ]}
          />
        </div>
      </div>

      {/* =========================================================================
          TAB 1: OVERVIEW (نمای کلی - Flattened Document Layout)
          ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 w-full animate-nervel-enter">
          
          {/* Section 1: Current State & Most Recent Event */}
          <div className="space-y-2 pb-6 border-b border-[#18181C]">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#F4F4F5]">
                وضعیت لحظه‌ای تسک
              </h2>
              <StatusIndicator status={task.status} size="sm" />
            </div>

            <p className="text-sm text-[#D4D4D8] leading-relaxed">
              {task.status === 'completed'
                ? 'اجرای تسک با موفقیت پایان یافته، تمام تست‌های واحد پاس شده و پچ تغییرات نهایی ایجاد شد.'
                : task.status === 'failed'
                ? 'اجرای تسک به دلیل خطای غیرقابل جبران در مرحله کامپایل یا تست متوقف شد. هزینه کارکرد واقعی محاسبه و باقیمانده سقف رزرو به کیف پول بازگردانده شده است.'
                : task.status === 'cancelled'
                ? 'اجرای تسک متوقف گردید و مبالغ مازاد رزرو طبق سیاست شفاف آزادسازی گردید.'
                : task.status === 'running'
                ? 'ورکر کانتینری ایزوله در حال اعمال تغییرات روی فایل‌ها و تدوین تست‌های خودکار است.'
                : task.status === 'validating'
                ? 'کدنویسی به پایان رسیده و اسکریپت‌های سنجش بیلد، تایپ‌اسکریپت و تست‌های واحد در حال اجرا هستند.'
                : task.status === 'waiting_for_customer'
                ? 'اجرا موقتاً متوقف شده و منتظر اقدام و پاسخ شما به استعلام فنی ورکر است.'
                : task.status === 'reassigning'
                ? 'پایش ورکر با قطعی مواجه شد؛ در انتظار تایید انتقال به ورکر جایگزین.'
                : 'تسک در صف زمان‌بندی شبکه قرار دارد و به‌زودی به نخستین ورکر آماده واگذار می‌شود.'}
            </p>

            {/* Failure Detail Alert if failed */}
            {task.status === 'failed' && (
              <div className="p-4 rounded-lg bg-[#140A0A] border border-[#EF4444]/30 space-y-2 mt-2">
                <div className="flex items-center gap-2 text-sm font-medium text-[#EF4444]">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>خطای عدم موفقیت در تکمیل تسک (Task Failed)</span>
                </div>
                <p className="text-sm text-[#D4D4D8] leading-relaxed">
                  {task.qaReport?.testSummary || 'اجرای کانتینر تسک پس از تلاش‌های خودکار رفع خطا با شکست مواجه شد.'}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#71717A]">
                  <span>هزینه کارکرد مصرف‌شده تا لحظه خطا: <strong className="text-[#F4F4F5] tabular-nums font-latin">{formatToman(task.actualCost || 0)}</strong></span>
                  <span>·</span>
                  <span>مازاد اعتبار رزرو مستردشده به کیف پول: <strong className="text-[#10B981] tabular-nums font-latin">{formatToman(Math.max(0, task.reservedCap - (task.actualCost || 0)))}</strong></span>
                </div>
              </div>
            )}

            {task.logs.length > 0 && (
              <div className="pt-1 flex items-center gap-2 text-xs text-[#71717A]">
                <Clock className="h-3.5 w-3.5 text-[#52525B]" />
                <span>آخرین رخداد: {task.logs[task.logs.length - 1].message}</span>
              </div>
            )}
          </div>

          {/* Section 2: Request Summary & Acceptance Criteria */}
          <div className="space-y-3 pb-6 border-b border-[#18181C]">
            <h2 className="text-base font-bold text-[#F4F4F5]">
              شرح درخواست و معیارهای پذیرش
            </h2>

            <p className="text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-line">
              {task.description}
            </p>

            {task.acceptanceCriteria.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-medium text-[#71717A] block">
                  معیارهای ارزیابی نهایی (QA):
                </span>
                <ul className="space-y-1 text-xs text-[#D4D4D8] pr-2">
                  {task.acceptanceCriteria.map((crit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#7C3AED] font-bold">•</span>
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Section 3: Execution & Cost Metric Row (Clean typography + dividers) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-2 pb-6 border-b border-[#18181C] divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-[#1A1A1E]">
            <div className="space-y-0.5 pt-2 sm:pt-0">
              <span className="text-xs text-[#71717A] block">مدل پردازشی:</span>
              <span className="text-base font-medium text-[#F4F4F5] font-latin block" dir="ltr">
                {task.modelName}
              </span>
              <span className="text-xs text-[#52525B] block">موتور تخصیص‌یافته به تسک</span>
            </div>

            <div className="space-y-0.5 pt-3 sm:pt-0 sm:pr-6">
              <span className="text-xs text-[#71717A] block">سقف اعتبار رزرو:</span>
              <span className="text-base font-medium text-[#F4F4F5] tabular-nums block">
                {formatToman(task.reservedCap)}
              </span>
              <span className="text-xs text-[#52525B] block">مسدودی موقت حساب</span>
            </div>

            <div className="space-y-0.5 pt-3 sm:pt-0 sm:pr-6">
              <span className="text-xs text-[#71717A] block">هزینه محاسبه‌شده:</span>
              <span className="text-base font-medium text-[#F4F4F5] tabular-nums block">
                {task.actualCost ? formatToman(task.actualCost) : 'بر مبنای مصرف واقعی توکن'}
              </span>
              <span className="text-xs text-[#52525B] block">
                {task.actualCost ? 'تسویه شده' : 'پس از پایان محاسبه می‌شود'}
              </span>
            </div>
          </div>

          {/* Section 4: Output Summary if ready */}
          {task.deliverables && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-sm font-medium text-[#F4F4F5]">
                  <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                  <span>خروجی نهایی آماده است</span>
                </div>
                <p className="text-xs text-[#71717A]">
                  تغییرات کد، فایل Patch و آرشیو کامل در دسترس قرار گرفت.
                </p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveTab('output')}
                leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
              >
                مشاهده و دریافت خروجی
              </Button>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          TAB 2: OUTPUT (خروجی)
          Show:
          - Deliverables: Pull Request, Patch, ZIP
          - Tests & QA Result
          - Changed Files & Code Diff
          - If PR fails: show "PR creation failed" and "Retry" (platform retry without new cost)
          ========================================================================= */}
      {activeTab === 'output' && (
        <div className="space-y-6 w-full animate-nervel-enter">
          
          {/* Deliverables Section */}
          <div className="border border-[#18181B] rounded-lg p-5 bg-[#08080A] space-y-4">
            <h2 className="text-lg font-bold text-[#F4F4F5]">
              بسته‌های تحویلی و خروجی کد
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Pull Request Card */}
              <div className="border border-[#222226] rounded-md p-4 bg-[#0C0C0F] space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#F4F4F5]">
                    <GitPullRequest className="h-4 w-4 text-[#7C3AED]" />
                    <span>Pull Request</span>
                  </div>
                  {task.deliverables?.prFailed && (
                    <span className="text-xs text-[#EF4444]">ناموفق</span>
                  )}
                </div>

                {task.deliverables?.prFailed ? (
                  <div className="space-y-2">
                    <p className="text-xs text-[#EF4444]">
                      ایجاد خودکار PR با خطای دسترسی گیت‌هاب مواجه شد.
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleRetryPr}
                      isLoading={isRetryingPr}
                      className="w-full"
                    >
                      تلاش مجدد ایجاد PR
                    </Button>
                  </div>
                ) : task.deliverables?.prUrl ? (
                  <div className="space-y-2">
                    <span className="text-xs text-[#A1A1AA] font-latin truncate block" dir="ltr">
                      {task.deliverables.prUrl}
                    </span>
                    <a
                      href={task.deliverables.prUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 w-full h-8 text-xs font-medium rounded bg-[#18181D] hover:bg-[#222228] text-[#F4F4F5] transition-colors"
                    >
                      <span>مشاهده در GitHub</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ) : (
                  <span className="text-xs text-[#71717A]">
                    {task.status === 'completed' ? 'ایجاد نشد' : 'پس از تکمیل ساخته می‌شود'}
                  </span>
                )}
              </div>

              {/* Patch File */}
              <div className="border border-[#222226] rounded-md p-4 bg-[#0C0C0F] space-y-2 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-[#F4F4F5]">
                  <FileCode className="h-4 w-4 text-[#7C3AED]" />
                  <span>فایل Git Patch</span>
                </div>
                <span className="text-xs text-[#71717A] font-latin truncate" dir="ltr">
                  {task.deliverables?.patchFilename || `patch_${task.id}.diff`}
                </span>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 w-full h-8 text-xs font-medium rounded bg-[#18181D] hover:bg-[#222228] text-[#F4F4F5] transition-colors cursor-pointer"
                >
                  <Download className="h-3 w-3" />
                  <span>دانلود فایل Patch</span>
                </button>
              </div>

              {/* ZIP Archive */}
              <div className="border border-[#222226] rounded-md p-4 bg-[#0C0C0F] space-y-2 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-[#F4F4F5]">
                  <FileArchive className="h-4 w-4 text-[#7C3AED]" />
                  <span>آرشیو کامل ZIP</span>
                </div>
                <span className="text-xs text-[#71717A] font-latin truncate" dir="ltr">
                  {task.deliverables?.zipFilename || 'deliverables.zip'}
                </span>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 w-full h-8 text-xs font-medium rounded bg-[#18181D] hover:bg-[#222228] text-[#F4F4F5] transition-colors cursor-pointer"
                >
                  <Download className="h-3 w-3" />
                  <span>دانلود بسته ZIP</span>
                </button>
              </div>
            </div>
          </div>

          {/* QA & Verification Results */}
          <div className="border border-[#18181B] rounded-lg p-5 bg-[#08080A] space-y-3">
            <h2 className="text-lg font-bold text-[#F4F4F5]">
              نتایج ارزیابی کیفی و اعتبارسنجی خودکار (QA)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded bg-[#0C0C0F] border border-[#222226] flex items-center justify-between">
                <span className="text-[#71717A]">کامپایل و بیلد:</span>
                {task.qaReport?.buildStatus === 'failed' ? (
                  <span className="text-[#EF4444] font-medium flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    خطا در کامپایل
                  </span>
                ) : (
                  <span className="text-[#10B981] font-medium flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" />
                    تاییدشده
                  </span>
                )}
              </div>

              <div className="p-3 rounded bg-[#0C0C0F] border border-[#222226] flex items-center justify-between">
                <span className="text-[#71717A]">تست‌های خودکار:</span>
                {task.qaReport?.testStatus === 'failed' ? (
                  <span className="text-[#EF4444] font-medium flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    شکست تست
                  </span>
                ) : (
                  <span className="text-[#10B981] font-medium flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" />
                    پاس شدند
                  </span>
                )}
              </div>

              <div className="p-3 rounded bg-[#0C0C0F] border border-[#222226] flex items-center justify-between">
                <span className="text-[#71717A]">بررسی لینتر و تایپ‌ها:</span>
                {task.qaReport?.lintStatus === 'failed' ? (
                  <span className="text-[#EF4444] font-medium flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    خطای سینتکس
                  </span>
                ) : (
                  <span className="text-[#10B981] font-medium flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" />
                    بدون خطا
                  </span>
                )}
              </div>
            </div>

            {task.qaReport?.testSummary && (
              <p className="text-xs text-[#A1A1AA] pt-1">
                {task.qaReport.testSummary}
              </p>
            )}
          </div>

          {/* Changed Files & Code Diff */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#F4F4F5]">
              فایل‌های تغییر‌یافته ({toPersianDigits(task.qaReport?.changedFiles.length || 2)})
            </h2>

            <CodeDiffViewer
              files={
                task.qaReport?.changedFiles || [
                  {
                    filename: 'src/gateways/payment.service.ts',
                    additions: 42,
                    deletions: 4,
                    status: 'modified',
                    diffContent: `@@ -12,4 +12,42 @@ export class PaymentService {
-  async verifyTransaction(txId: string): Promise<boolean> {
-    return true;
-  }
+  async verifyTransaction(txId: string, signature: string): Promise<VerificationResult> {
+    const computedSig = createHmac('sha256', this.secretKey).update(txId).digest('hex');
+    if (computedSig !== signature) {
+      throw new UnauthorizedException('Digital signature mismatch');
+    }
+    return this.zarinpalClient.verify(txId);
+  }`,
                  },
                  {
                    filename: 'tests/payment.spec.ts',
                    additions: 36,
                    deletions: 0,
                    status: 'added',
                  },
                ]
              }
            />
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 3: ACTIVITY (فعالیت)
          Human-readable execution timeline (Not raw logs!)
          ========================================================================= */}
      {activeTab === 'activity' && (
        <div className="w-full space-y-6 animate-nervel-enter">
          <div className="border border-[#18181B] rounded-lg p-6 bg-[#08080A]">
            <h2 className="text-lg font-bold text-[#F4F4F5] mb-6">
              خط زمانی مراحل اجرای تسک
            </h2>

            <div className="relative pl-2 pr-6 border-r-2 border-[#1E1E24] space-y-8">
              {activityMilestones.map((ms, idx) => (
                <div key={ms.id} className="relative">
                  {/* Indicator Dot */}
                  <div
                    className={`absolute -right-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 ${
                      ms.done
                        ? 'bg-[#10B981] border-[#08080A]'
                        : 'bg-[#222226] border-[#08080A]'
                    }`}
                  />

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`text-base font-medium ${
                          ms.done ? 'text-[#F4F4F5]' : 'text-[#71717A]'
                        }`}
                      >
                        {ms.title}
                      </h3>
                      <span className="text-xs text-[#52525B] tabular-nums">
                        {ms.time}
                      </span>
                    </div>

                    <p className="text-xs sm:text-[13px] text-[#A1A1AA] leading-relaxed">
                      {ms.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: TECHNICAL DETAILS (جزئیات فنی)
          For power users:
          - Model & Engine
          - Worker info
          - Token usage
          - Scheduler / logs
          - Repository metadata
          ========================================================================= */}
      {activeTab === 'technical' && (
        <div className="w-full space-y-6 animate-nervel-enter">
          
          {/* Technical Metadata Grid */}
          <div className="border border-[#18181B] rounded-lg p-5 bg-[#08080A] space-y-4">
            <h2 className="text-lg font-bold text-[#F4F4F5] flex items-center gap-2">
              <Cpu className="h-4 w-4 text-[#7C3AED]" />
              <span>مشخصات فنی و زیرساختی اجرا</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded bg-[#0C0C0F] border border-[#222226] space-y-1">
                <span className="text-[#71717A] block">شناسه ورکر پردازشی:</span>
                <span className="text-[#F4F4F5] font-medium font-latin block" dir="ltr">
                  {task.workerId || 'در انتظار تخصیص'}
                </span>
              </div>

              <div className="p-3 rounded bg-[#0C0C0F] border border-[#222226] space-y-1">
                <span className="text-[#71717A] block">هاست‌نیم گره ورکر:</span>
                <span className="text-[#F4F4F5] font-medium font-latin block" dir="ltr">
                  {task.workerHostname || 'node-worker-pending'}
                </span>
              </div>

              <div className="p-3 rounded bg-[#0C0C0F] border border-[#222226] space-y-1">
                <span className="text-[#71717A] block">پلن پردازشی ورکر:</span>
                <span className="text-[#F4F4F5] font-medium block">
                  {task.workerPlan || 'Standard Dedicated Sandbox'}
                </span>
              </div>

              <div className="p-3 rounded bg-[#0C0C0F] border border-[#222226] space-y-1">
                <span className="text-[#71717A] block">استراتژی تخصیص مجدد:</span>
                <span className="text-[#F4F4F5] font-medium block">
                  استعلام و انتقال خودکار
                </span>
              </div>
            </div>

            {/* Token Usage Stats */}
            {task.tokenStats && (
              <div className="pt-3 border-t border-[#141418] space-y-2">
                <span className="text-xs font-medium text-[#71717A] block">
                  آمار مصرف توکن‌ها:
                </span>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded bg-[#0C0C0F] border border-[#222226]">
                    <span className="text-[#71717A] font-latin block">Input Tokens</span>
                    <span className="text-[#F4F4F5] font-medium tabular-nums mt-0.5 block">
                      {toPersianDigits(new Intl.NumberFormat('en-US').format(task.tokenStats.inputTokens))}
                    </span>
                  </div>

                  <div className="p-2.5 rounded bg-[#0C0C0F] border border-[#222226]">
                    <span className="text-[#71717A] font-latin block">Cached Context</span>
                    <span className="text-[#F4F4F5] font-medium tabular-nums mt-0.5 block">
                      {toPersianDigits(new Intl.NumberFormat('en-US').format(task.tokenStats.cachedTokens))}
                    </span>
                  </div>

                  <div className="p-2.5 rounded bg-[#0C0C0F] border border-[#222226]">
                    <span className="text-[#71717A] font-latin block">Output Tokens</span>
                    <span className="text-[#F4F4F5] font-medium tabular-nums mt-0.5 block">
                      {toPersianDigits(new Intl.NumberFormat('en-US').format(task.tokenStats.outputTokens))}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Raw Execution Logs Console */}
          <div className="border border-[#18181B] rounded-lg overflow-hidden bg-[#050507]">
            <div className="px-4 py-3 bg-[#0A0A0E] border-b border-[#18181B] flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-[#F4F4F5]">
                <Terminal className="h-4 w-4 text-[#7C3AED]" />
                <span>لاگ‌های خام ورکر و کانتینر ایزوله</span>
              </div>
              <span className="text-xs text-[#71717A] tabular-nums">
                {task.logs.length} رکورد
              </span>
            </div>

            <div className="p-4 max-h-72 overflow-y-auto font-code text-xs space-y-1.5" dir="ltr">
              {task.logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 leading-relaxed">
                  <span className="text-[#52525B] select-none shrink-0 tabular-nums">
                    [{log.timestamp}]
                  </span>
                  <span
                    className={`font-medium shrink-0 uppercase text-xs px-1 rounded ${
                      log.level === 'warn'
                        ? 'text-[#F59E0B] bg-[#F59E0B]/10'
                        : log.level === 'step'
                        ? 'text-[#7C3AED] bg-[#7C3AED]/10'
                        : log.level === 'success'
                        ? 'text-[#10B981] bg-[#10B981]/10'
                        : 'text-[#71717A] bg-[#17171C]'
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className="text-[#A1A1AA] break-all">{log.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simulator Bar (Protected behind development-only flag) */}
          {Boolean(import.meta.env.DEV && typeof window !== 'undefined' && (window as unknown as { __NERVEL_DEV_SIMULATOR__?: boolean }).__NERVEL_DEV_SIMULATOR__) && (
            <div className="border border-[#1E1E24] rounded-lg p-4 bg-[#08080A] space-y-2">
              <span className="text-xs text-[#71717A] block">
                شبیه‌ساز وضعیت برای تست سناریوها (حالت توسعه):
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { st: 'queued', label: 'صف' },
                  { st: 'running', label: 'در حال اجرا' },
                  { st: 'waiting_for_customer', label: 'منتظر شما' },
                  { st: 'reassigning', label: 'انتقال ورکر' },
                  { st: 'validating', label: 'بررسی QA' },
                  { st: 'completed', label: 'تکمیل شد' },
                  { st: 'failed', label: 'ناموفق' },
                ].map((sim) => (
                  <button
                    key={sim.st}
                    type="button"
                    onClick={() => simulateStateTransition(task.id, sim.st as TaskStatus)}
                    className="px-2.5 py-1 text-xs rounded bg-[#141418] hover:bg-[#1E1E24] border border-[#27272A] text-[#D4D4D8] transition-colors cursor-pointer"
                  >
                    {sim.label}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Dispute Modal Dialog */}
      {isDisputeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div
            className="w-full max-w-lg rounded-lg border border-[#222226] bg-[#0A0A0D] p-6 text-right animate-nervel-enter space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#18181B]">
              <div className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-[#F59E0B]" />
                <h3 className="text-base font-bold text-[#F4F4F5]">ثبت اعتراض فنی به خروجی تسک</h3>
              </div>
              <button
                onClick={() => setIsDisputeOpen(false)}
                className="text-[#71717A] hover:text-[#F4F4F5] p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              در صورتی که خروجی ارائه‌شده با معیارهای پذیرش همخوانی ندارد، دلایل فنی خود را وارد کنید تا مستقیماً توسط کارشناسان ارشد ارزیابی گردد.
            </p>

            <form onSubmit={handleDisputeSubmit} className="space-y-4">
              <textarea
                rows={4}
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="توضیح دلایل عدم انطباق با نیازمندی‌ها..."
                className="w-full bg-[#08080B] border border-[#27272A] rounded-md p-3 text-sm text-[#F4F4F5] focus:outline-none focus:border-[#7C3AED]"
                autoFocus
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsDisputeOpen(false)}
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!disputeReason.trim()}
                >
                  ثبت اعتراض جهت داوری
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
