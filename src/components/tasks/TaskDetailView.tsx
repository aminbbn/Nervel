import React, { useState } from 'react';
import { useNervel } from '../../context/NervelContext';
import { StatusBadge } from '../common/StatusBadge';
import { CodeDiffViewer } from '../common/CodeDiffViewer';
import { TaskStatus } from '../../types';
import { formatToman, toPersianDigits } from '../../utils/formatters';
import { getStaggerStyle } from '../../utils/motion';
import {
  ArrowRight,
  GitBranch,
  Terminal,
  GitPullRequest,
  Download,
  AlertTriangle,
  CheckCircle2,
  Send,
  RefreshCw,
  XCircle,
  FileCode,
  ExternalLink,
  Flag,
} from 'lucide-react';

export const TaskDetailView: React.FC = () => {
  const {
    tasks,
    selectedTaskId,
    setView,
    respondToWaitingWorker,
    triggerReassignNow,
    cancelTask,
    simulateStateTransition,
    fileTaskDispute,
  } = useNervel();

  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'diff'>('overview');
  const [customerAnswer, setCustomerAnswer] = useState<string>('');
  const [isDisputeOpen, setIsDisputeOpen] = useState<boolean>(false);
  const [disputeReason, setDisputeReason] = useState<string>('');
  const [disputeSubmitted, setDisputeSubmitted] = useState<boolean>(false);

  const task = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  if (!task) {
    return (
      <div className="p-12 text-center text-sm text-[#71717A]">
        تسک مورد نظر یافت نشد.
        <button onClick={() => setView('tasks_list')} className="block mx-auto mt-2 text-[#7C3AED]">
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

  const handleManualReassign = () => {
    triggerReassignNow(task.id);
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disputeReason.trim()) {
      fileTaskDispute(task.id, disputeReason.trim());
      setDisputeSubmitted(true);
      setTimeout(() => {
        setIsDisputeOpen(false);
        setDisputeSubmitted(false);
      }, 2500);
    }
  };

  // Pipeline stages
  const STAGES: Array<{ id: TaskStatus; label: string; desc: string }> = [
    { id: 'queued', label: 'صف و تخصیص', desc: 'زمان‌بندی و ایزوله‌سازی کانتینر' },
    { id: 'running', label: 'اجرای کانتینر', desc: 'ویرایش کد و ایجاد تغییرات' },
    { id: 'validating', label: 'ارزیابی کیفی QA', desc: 'اجرای بیلد، تست‌ها و لینتر' },
    { id: 'completed', label: 'تحویل و تسویه', desc: 'ایجاد PR، پچ و آزادسازی مازاد' },
  ];

  const getStageIndex = (st: TaskStatus) => {
    if (st === 'queued' || st === 'assigning') return 0;
    if (st === 'running' || st === 'waiting_for_customer' || st === 'reassigning') return 1;
    if (st === 'validating') return 2;
    if (st === 'completed') return 3;
    return -1;
  };

  const currentStageIdx = getStageIndex(task.status);

  return (
    <div className="space-y-6">
      
      {/* Top Navigation & Status: 22-24px heading */}
      <div style={getStaggerStyle(0)} className="animate-nervel-enter border-b border-[#17171A] pb-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-[#71717A]">
            <button
              onClick={() => setView('tasks_list')}
              className="flex items-center gap-1.5 hover:text-[#F4F4F5] transition-colors font-medium"
            >
              <ArrowRight className="h-4 w-4" />
              <span>فهرست تسک‌ها</span>
            </button>
            <span>/</span>
            <span className="text-[#A1A1AA]" dir="ltr">
              {task.id}
            </span>
          </div>

          {/* Testing State Simulator */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-xs text-[#52525B] px-1">شبیه‌ساز وضعیت:</span>
            {(['running', 'waiting_for_customer', 'reassigning', 'validating', 'completed'] as TaskStatus[]).map(
              (st) => (
                <button
                  key={st}
                  onClick={() => simulateStateTransition(task.id, st)}
                  className={`px-2 py-0.5 rounded text-xs transition-colors ${
                    task.status === st
                      ? 'bg-[#17171A] text-[#F4F4F5] font-medium'
                      : 'text-[#71717A] hover:text-[#A1A1AA]'
                  }`}
                >
                  {st === 'waiting_for_customer'
                    ? 'waiting'
                    : st === 'reassigning'
                    ? 'reassign'
                    : st}
                </button>
              )
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3.5 flex-wrap">
              <h2 className="text-[22px] sm:text-2xl font-bold text-[#F4F4F5] leading-tight">
                {task.title}
              </h2>
              <StatusBadge status={task.status} size="md" />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[#71717A]">
              <span>ثبت‌شده: {task.createdAt}</span>
              {task.repoUrl && (
                <span className="text-[#A1A1AA] flex items-center gap-1.5" dir="ltr">
                  <GitBranch className="h-3.5 w-3.5" />
                  {task.repoUrl}
                </span>
              )}
              <span className="text-[#D4D4D8]" dir="ltr">
                {task.modelName}
              </span>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-3">
            {task.status !== 'completed' && task.status !== 'cancelled' && (
              <button
                onClick={() => cancelTask(task.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#71717A] hover:text-[#EF4444] transition-colors rounded hover:bg-[#160B0B]"
              >
                <XCircle className="h-4 w-4" />
                <span>لغو تسک</span>
              </button>
            )}

            {task.status === 'completed' && (
              <button
                onClick={() => setIsDisputeOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors rounded border border-[#27272A] hover:bg-[#17171A]"
              >
                <Flag className="h-4 w-4" />
                <span>ثبت اعتراض فنی (Dispute)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Execution Pipeline Stage Bar - Flat, unboxed */}
      <div style={getStaggerStyle(1)} className="animate-nervel-enter grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
        {STAGES.map((st, idx) => {
          const isPassed = currentStageIdx > idx;
          const isCurrent = currentStageIdx === idx;

          return (
            <div
              key={st.id}
              className={`py-2.5 px-1 border-b-2 transition-colors ${
                isCurrent
                  ? 'border-[#7C3AED]'
                  : isPassed
                  ? 'border-[#27272A]'
                  : 'border-[#17171A]'
              }`}
            >
              <div className="flex items-center gap-2.5 text-sm">
                <span
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-xs tabular-nums ${
                    isCurrent
                      ? 'bg-[#7C3AED] text-white font-bold'
                      : isPassed
                      ? 'bg-[#17171A] text-[#D4D4D8] font-bold'
                      : 'bg-[#17171A] text-[#71717A]'
                  }`}
                >
                  {isPassed ? '✓' : toPersianDigits(idx + 1)}
                </span>
                <span
                  className={`font-semibold ${
                    isCurrent ? 'text-[#F4F4F5]' : isPassed ? 'text-[#D4D4D8]' : 'text-[#52525B]'
                  }`}
                >
                  {st.label}
                </span>
              </div>
              <p className="text-xs text-[#71717A] mt-1 pr-7 leading-relaxed">{st.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Actionable Banner: Waiting for customer input */}
      {task.status === 'waiting_for_customer' && task.waitingData && (
        <div
          style={getStaggerStyle(2)}
          className="animate-nervel-enter py-4 px-4 rounded border border-[#27272A] bg-transparent text-sm space-y-3.5"
        >
          <div className="flex items-center justify-between text-[#F4F4F5]">
            <div className="flex items-center gap-2 font-medium">
              <AlertTriangle className="h-4 w-4 text-[#F59E0B] shrink-0" />
              <span>ورکر کانتینر برای ادامه به راهنمایی شما نیاز دارد</span>
            </div>
            <span className="text-xs text-[#71717A]">
              مهلت پاسخگویی: {task.waitingData.expiresAt}
            </span>
          </div>

          <div className="text-base text-[#F4F4F5] leading-relaxed pr-6">
            {task.waitingData.question}
          </div>

          <div className="flex gap-2.5 pt-1 pr-6">
            <input
              type="text"
              placeholder="پاسخ یا تصمیم فنی خود را بنویسید..."
              value={customerAnswer}
              onChange={(e) => setCustomerAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendAnswer();
              }}
              className="flex-1 rounded border border-[#27272A] bg-transparent px-3.5 py-2 text-sm text-[#F4F4F5] placeholder-[#71717A] focus:border-[#7C3AED] focus:outline-none"
            />
            <button
              onClick={handleSendAnswer}
              className="flex items-center gap-2 rounded bg-[#7C3AED] hover:bg-[#8B5CF6] px-4 py-2 text-sm font-medium text-white transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>ارسال</span>
            </button>
          </div>
        </div>
      )}

      {/* Actionable Banner: Worker Reassignment */}
      {task.status === 'reassigning' && task.reassignData && (
        <div
          style={getStaggerStyle(2)}
          className="animate-nervel-enter py-4 px-4 rounded border border-[#27272A] bg-transparent text-sm space-y-3"
        >
          <div className="flex items-center justify-between text-[#F4F4F5]">
            <div className="flex items-center gap-2 font-medium">
              <RefreshCw className="h-4 w-4 text-[#71717A] shrink-0 animate-spin" />
              <span>ورکر فعلی پاسخگو نیست (عدم دریافت ۳ ضربان وضعیت)</span>
            </div>
            <span className="text-xs text-[#71717A] tabular-nums">
              انتقال خودکار تا {toPersianDigits(task.reassignData.secondsLeftBeforeAuto)} ثانیه دیگر
            </span>
          </div>

          <p className="text-sm text-[#A1A1AA] leading-relaxed pr-6">
            {task.reassignData.reason}. اسنپ‌شات کانتینر ذخیره شده است.
          </p>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              onClick={handleManualReassign}
              className="rounded bg-[#7C3AED] hover:bg-[#8B5CF6] px-4 py-2 text-sm font-medium text-white transition-colors"
            >
              انتقال فوری به ورکر جدید ←
            </button>
          </div>
        </div>
      )}

      {/* Deliverables Banner (When Task is Completed) */}
      {task.status === 'completed' && task.deliverables && (
        <div
          style={getStaggerStyle(2)}
          className="animate-nervel-enter py-4 px-4 rounded border border-[#27272A] bg-transparent text-sm space-y-3.5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#F4F4F5] font-medium">
              <CheckCircle2 className="h-4.5 w-4.5 text-[#10B981] shrink-0" />
              <span>خروجی نهایی مهندسی با موفقیت تولید شد و از تمام آزمون‌های QA گذشت</span>
            </div>
            <span className="text-xs sm:text-sm text-[#71717A] tabular-nums">
              تسویه مصرف واقعی: {formatToman(task.actualCost || task.estimatedCost)}
            </span>
          </div>

          <div className="flex flex-wrap gap-5 text-sm pt-1 pr-6">
            {task.deliverables.prUrl && (
              <a
                href={task.deliverables.prUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[#D4D4D8] hover:text-[#F4F4F5] hover:underline"
                dir="ltr"
              >
                <GitPullRequest className="h-4 w-4 text-[#71717A]" />
                <span>GitHub Pull Request</span>
                <ExternalLink className="h-3.5 w-3.5 text-[#71717A]" />
              </a>
            )}

            {task.deliverables.patchFilename && (
              <button
                onClick={() => alert(`دانلود پچ گیت: ${task.deliverables?.patchFilename}`)}
                className="flex items-center gap-2 text-[#D4D4D8] hover:text-[#F4F4F5] hover:underline"
                dir="ltr"
              >
                <FileCode className="h-4 w-4 text-[#71717A]" />
                <span>{task.deliverables.patchFilename}</span>
                <Download className="h-3.5 w-3.5 text-[#71717A]" />
              </button>
            )}

            {task.deliverables.zipFilename && (
              <button
                onClick={() => alert(`دانلود سورس کامل: ${task.deliverables?.zipFilename}`)}
                className="flex items-center gap-2 text-[#D4D4D8] hover:text-[#F4F4F5] hover:underline"
                dir="ltr"
              >
                <Download className="h-4 w-4 text-[#71717A]" />
                <span>{task.deliverables.zipFilename}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content Workspace: Tabs Strip */}
      <div style={getStaggerStyle(3)} className="animate-nervel-enter space-y-5">
        <div className="border-b border-[#17171A] flex items-center justify-between text-sm">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 transition-colors border-b-2 font-medium ${
                activeTab === 'overview'
                  ? 'border-[#7C3AED] text-[#F4F4F5]'
                  : 'border-transparent text-[#71717A] hover:text-[#A1A1AA]'
              }`}
            >
              شرح کار و ارزیابی QA
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`pb-3 transition-colors border-b-2 flex items-center gap-2 font-medium ${
                activeTab === 'logs'
                  ? 'border-[#7C3AED] text-[#F4F4F5]'
                  : 'border-transparent text-[#71717A] hover:text-[#A1A1AA]'
              }`}
            >
              <Terminal className="h-4 w-4" />
              <span>لاگ‌های زنده ورکر ({toPersianDigits(task.logs?.length || 0)})</span>
            </button>
            <button
              onClick={() => setActiveTab('diff')}
              className={`pb-3 transition-colors border-b-2 flex items-center gap-2 font-medium ${
                activeTab === 'diff'
                  ? 'border-[#7C3AED] text-[#F4F4F5]'
                  : 'border-transparent text-[#71717A] hover:text-[#A1A1AA]'
              }`}
            >
              <FileCode className="h-4 w-4" />
              <span>بررسی تغییرات کد (Diff)</span>
            </button>
          </div>

          <div className="text-xs text-[#71717A] pb-3">
            ورکر ایزوله: {task.workerId || 'در صف تخصیص'}
          </div>
        </div>

        {/* Tab 1: Overview and QA Report - Flat sections */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Description & Criteria */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2.5">
                <h3 className="text-[17px] sm:text-lg font-semibold text-[#F4F4F5]">
                  شرح تسک و نیازمندی‌ها
                </h3>
                <p className="text-base text-[#D4D4D8] leading-relaxed whitespace-pre-line">
                  {task.description}
                </p>
              </div>

              <div className="space-y-2.5 pt-5 border-t border-[#17171A]">
                <h3 className="text-[17px] sm:text-lg font-semibold text-[#F4F4F5]">
                  معیارهای پذیرش و تست (QA Criteria)
                </h3>
                <div className="space-y-2">
                  {task.acceptanceCriteria.map((c, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-base text-[#D4D4D8]">
                      <span className="text-[#7C3AED]">•</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* QA Report Summary if available */}
              {task.qaReport && (
                <div className="space-y-3.5 pt-5 border-t border-[#17171A]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[17px] sm:text-lg font-semibold text-[#F4F4F5]">
                      گزارش ارزیابی کیفی (QA Layer)
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-[#A1A1AA] font-medium text-sm">
                      <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                      تمام آزمون‌ها پاس شدند
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div>
                      <span className="text-sm text-[#71717A] block">کامپایل / بیلد:</span>
                      <span className="text-sm sm:text-base text-[#F4F4F5] font-medium mt-1 block">PASSED (0 Errors)</span>
                    </div>
                    <div>
                      <span className="text-sm text-[#71717A] block">تست‌های واحد:</span>
                      <span className="text-sm sm:text-base text-[#F4F4F5] font-medium mt-1 block tabular-nums">24 / 24 PASSED</span>
                    </div>
                    <div>
                      <span className="text-sm text-[#71717A] block">اعتبارسنجی Linter:</span>
                      <span className="text-sm sm:text-base text-[#F4F4F5] font-medium mt-1 block">CLEAN (0 Warnings)</span>
                    </div>
                  </div>

                  <p className="text-sm text-[#71717A] leading-relaxed">{task.qaReport.testSummary}</p>
                </div>
              )}
            </div>

            {/* Right 1 Col: Financial & Technical Metadata */}
            <div className="space-y-6">
              {/* Financial Status */}
              <div className="space-y-2.5">
                <h3 className="text-[17px] sm:text-lg font-semibold text-[#F4F4F5]">
                  صورت‌وضعیت مالی تسک
                </h3>

                <div className="space-y-2.5 divide-y divide-[#17171A] text-sm">
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[#71717A]">سقف رزرو اولیه:</span>
                    <span className="tabular-nums font-semibold text-[#F4F4F5] text-base">{formatToman(task.reservedCap)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2.5">
                    <span className="text-[#71717A]">هزینه تخمینی:</span>
                    <span className="tabular-nums text-[#A1A1AA] text-base">{formatToman(task.estimatedCost)}</span>
                  </div>
                  {task.actualCost && (
                    <div className="flex items-center justify-between pt-2.5">
                      <span className="text-[#71717A]">تسویه نهایی واقعی:</span>
                      <span className="tabular-nums font-bold text-base text-[#F4F4F5]">{formatToman(task.actualCost)}</span>
                    </div>
                  )}
                  {task.actualCost && task.reservedCap > task.actualCost && (
                    <div className="flex items-center justify-between pt-2.5">
                      <span className="text-[#71717A]">مازاد عودت‌یافته:</span>
                      <span className="tabular-nums font-semibold text-base text-[#D4D4D8]">
                        {formatToman(task.reservedCap - task.actualCost)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Technical Execution Metadata */}
              <div className="space-y-2.5 pt-5 border-t border-[#17171A]">
                <h3 className="text-[17px] sm:text-lg font-semibold text-[#F4F4F5]">
                  مشخصات فنی و ورکر
                </h3>

                <div className="space-y-2.5 text-sm">
                  <div>
                    <span className="text-[#71717A] block">شناسه ورکر تخصیص‌یافته:</span>
                    <span className="text-[#F4F4F5] font-medium" dir="ltr">
                      {task.workerId || 'هنوز تخصیص داده نشده'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#71717A] block">مدل استنتاج کانتینر:</span>
                    <span className="text-[#F4F4F5] font-medium" dir="ltr">
                      {task.modelName}
                    </span>
                  </div>

                  {task.tokenStats && (
                    <div className="pt-3 border-t border-[#17171A] space-y-1.5">
                      <span className="text-xs text-[#71717A] block">مصرف توکن‌ها:</span>
                      <div className="flex justify-between text-[#A1A1AA] tabular-nums text-xs">
                        <span>Input:</span>
                        <span>{toPersianDigits(task.tokenStats.inputTokens)}</span>
                      </div>
                      <div className="flex justify-between text-[#A1A1AA] tabular-nums text-xs">
                        <span>Cached:</span>
                        <span>{toPersianDigits(task.tokenStats.cachedTokens)}</span>
                      </div>
                      <div className="flex justify-between text-[#A1A1AA] tabular-nums text-xs">
                        <span>Output:</span>
                        <span>{toPersianDigits(task.tokenStats.outputTokens)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Logs (GENUINE terminal output - uses font-code!) */}
        {activeTab === 'logs' && (
          <div className="border border-[#17171A] rounded overflow-hidden">
            <div className="px-5 py-3 border-b border-[#17171A] bg-[#060607] flex items-center justify-between text-sm text-[#71717A]">
              <span>خروجی استاندارد کانتینر ایزوله</span>
              <span>زمان رسمی ورکر</span>
            </div>

            <div className="p-5 font-code text-[13px] space-y-2.5 max-h-96 overflow-y-auto bg-[#020202] leading-relaxed" dir="ltr">
              {task.logs && task.logs.length > 0 ? (
                task.logs.map((log) => {
                  let colorClass = 'text-[#D4D4D8]';
                  if (log.level === 'warn') colorClass = 'text-[#F59E0B]';
                  if (log.level === 'success') colorClass = 'text-[#10B981]';
                  if (log.level === 'step') colorClass = 'text-[#818CF8]';

                  return (
                    <div key={log.id} className="flex items-start gap-3 py-0.5">
                      <span className="text-[#52525B] shrink-0 select-none">[{log.timestamp}]</span>
                      <span className={`shrink-0 uppercase text-xs select-none ${colorClass}`}>
                        {log.level}:
                      </span>
                      <span className={colorClass}>{log.message}</span>
                    </div>
                  );
                })
              ) : (
                <div className="text-[#52525B]">در انتظار لاگ‌های اولیه...</div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Diff Viewer */}
        {activeTab === 'diff' && (
          <div className="space-y-4">
            <CodeDiffViewer files={task.qaReport?.changedFiles || []} />
          </div>
        )}
      </div>

      {/* Technical Dispute Modal */}
      {isDisputeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg border border-[#17171A] bg-[#0A0A0C] rounded p-6 space-y-4 text-sm">
            <div className="flex items-center justify-between border-b border-[#17171A] pb-3">
              <span className="font-bold text-base text-[#F4F4F5]">ثبت اعتراض فنی به خروجی</span>
              <button onClick={() => setIsDisputeOpen(false)} className="text-[#71717A] hover:text-white p-1">
                ✕
              </button>
            </div>

            {disputeSubmitted ? (
              <div className="p-4 text-center space-y-2 text-[#34D399]">
                <CheckCircle2 className="mx-auto h-7 w-7" />
                <p className="text-base font-medium">اعتراض فنی با شماره پرونده DSP-9218 ثبت شد. بازبینی خودکار فعال شد.</p>
              </div>
            ) : (
              <form onSubmit={handleDisputeSubmit} className="space-y-4">
                <p className="text-[#A1A1AA] leading-relaxed text-sm">
                  در صورتی که کدهای تولیدشده با معیارهای پذیرش ثبت‌شده مطابقت ندارد، دلایل فنی را ثبت کنید تا بدون هزینه مجدد به صف اصلاح بازگردد.
                </p>

                <textarea
                  rows={4}
                  placeholder="علت عدم انطباق را شرح دهید..."
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  required
                  className="w-full rounded border border-[#27272A] bg-transparent p-3 text-sm text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none"
                />

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDisputeOpen(false)}
                    className="px-4 py-2 text-sm text-[#71717A] hover:text-white"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-[#7C3AED] text-sm font-medium text-white hover:bg-[#8B5CF6]"
                  >
                    ثبت اعتراض فنی
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
