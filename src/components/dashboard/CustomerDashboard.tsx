import React from 'react';
import { useNervel } from '../../context/NervelContext';
import { StatusBadge } from '../common/StatusBadge';
import { formatToman, toPersianDigits } from '../../utils/formatters';
import { getStaggerStyle } from '../../utils/motion';
import {
  Plus,
  AlertTriangle,
  GitPullRequest,
  CheckCircle2,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const {
    tasks,
    walletBalance,
    reservedBalance,
    setView,
    navigateToTask,
  } = useNervel();

  const activeTasks = tasks.filter(
    (t) => t.status !== 'completed' && t.status !== 'cancelled'
  );
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  // Urgent actions: tasks waiting for customer response or undergoing worker reassignment
  const urgentTasks = tasks.filter(
    (t) => t.status === 'waiting_for_customer' || t.status === 'reassigning'
  );

  return (
    <div className="space-y-8">
      
      {/* Page Header: 22-24px primary page heading */}
      <div
        style={getStaggerStyle(0)}
        className="animate-nervel-enter flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#17171A]"
      >
        <div>
          <h2 className="text-[22px] sm:text-2xl font-bold text-[#F4F4F5] leading-tight">
            میز کار و کنترل اجرای تسک‌ها
          </h2>
          <p className="text-sm text-[#71717A] mt-1.5 leading-relaxed">
            نظارت بر صف تخصیص، اجرای کانتینرها در شبکه و تحویل خروجی‌های تاییدشده کیفی
          </p>
        </div>

        <button
          onClick={() => setView('new_task')}
          className="flex items-center gap-2 rounded bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white hover:bg-[#8B5CF6] active:bg-[#6D28D9] transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>ثبت تسک جدید</span>
        </button>
      </div>

      {/* Urgent Attention Alert: Restrained neutral box with subtle amber status icon */}
      {urgentTasks.length > 0 && (
        <div
          style={getStaggerStyle(1)}
          className="animate-nervel-enter py-3.5 px-4 rounded border border-[#27272A] bg-transparent text-sm space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-[#F4F4F5] font-medium text-sm">
              <AlertTriangle className="h-4 w-4 text-[#F59E0B] shrink-0" />
              <span>اقدام ضروری مشتری مورد نیاز است ({toPersianDigits(urgentTasks.length)} مورد)</span>
            </div>
            <span className="text-xs text-[#71717A]">
              عدم پاسخگویی موجب تعلیق یا انتقال تسک می‌شود
            </span>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#17171A]">
            {urgentTasks.map((t) => (
              <div
                key={t.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 py-1 text-sm"
              >
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs text-[#71717A]" dir="ltr">
                    {t.id}
                  </span>
                  <span className="text-[#F4F4F5] font-medium">{t.title}</span>
                  <span className="text-xs text-[#71717A]">
                    ({t.status === 'waiting_for_customer' ? 'استعلام فنی ورکر' : 'قطعی ورکر قبلی'})
                  </span>
                </div>

                <button
                  onClick={() => navigateToTask(t.id)}
                  className="self-end sm:self-auto text-sm font-medium text-[#F4F4F5] hover:text-[#7C3AED] underline underline-offset-4 transition-colors"
                >
                  {t.status === 'waiting_for_customer' ? 'پاسخ به سوال و ادامه اجرا ←' : 'بررسی انتقال ورکر ←'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Operational Stats: Unboxed metrics with 24-28px values, neutral numbers */}
      <div
        style={getStaggerStyle(2)}
        className="animate-nervel-enter grid grid-cols-2 sm:grid-cols-4 gap-6 py-2"
      >
        <div className="space-y-1.5">
          <span className="text-sm text-[#71717A] block">تسک‌های در حال اجرا</span>
          <span className="tabular-nums text-2xl sm:text-3xl font-bold text-[#F4F4F5] block">
            {toPersianDigits(activeTasks.length)}
          </span>
        </div>

        <div className="space-y-1.5">
          <span className="text-sm text-[#71717A] block">تکمیل و تاییدشده QA</span>
          <span className="tabular-nums text-2xl sm:text-3xl font-bold text-[#F4F4F5] block">
            {toPersianDigits(completedTasks.length)}
          </span>
        </div>

        <div className="space-y-1.5">
          <span className="text-sm text-[#71717A] block">اعتبار در حال رزرو</span>
          <span className="tabular-nums text-2xl sm:text-3xl font-bold text-[#F4F4F5] block">
            {formatToman(reservedBalance)}
          </span>
        </div>

        <div className="space-y-1.5">
          <span className="text-sm text-[#71717A] block">موجودی آزاد کیف پول</span>
          <span className="tabular-nums text-2xl sm:text-3xl font-bold text-[#F4F4F5] block">
            {formatToman(walletBalance)}
          </span>
        </div>
      </div>

      {/* Section 1: Active Tasks */}
      <section style={getStaggerStyle(3)} className="animate-nervel-enter space-y-4">
        {/* Section Heading: 17-18px */}
        <div className="flex items-center justify-between pb-2 border-b border-[#17171A]">
          <div className="flex items-center gap-2">
            <h3 className="text-[17px] sm:text-lg font-semibold text-[#F4F4F5]">
              تسک‌های فعال و در صف
            </h3>
            <span className="tabular-nums text-sm text-[#71717A]">
              ({toPersianDigits(activeTasks.length)})
            </span>
          </div>

          {activeTasks.length > 0 && (
            <button
              onClick={() => setView('tasks_list')}
              className="text-sm text-[#71717A] hover:text-[#F4F4F5] transition-colors"
            >
              مشاهده تمام تسک‌ها ←
            </button>
          )}
        </div>

        {activeTasks.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#71717A]">
            تسک فعالی در صف یا در حال اجرا وجود ندارد.
            <button
              onClick={() => setView('new_task')}
              className="block mx-auto mt-2 text-sm text-[#7C3AED] hover:underline"
            >
              + ثبت تسک جدید
            </button>
          </div>
        ) : (
          <div className="border border-[#17171A] rounded overflow-hidden">
            {/* Table Header: 13-14px */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#17171A] bg-[#060607] text-sm text-[#71717A]">
              <div className="col-span-3">شناسه و وضعیت</div>
              <div className="col-span-4">عنوان تسک</div>
              <div className="col-span-2">مدل و ورودی</div>
              <div className="col-span-2">سقف رزرو</div>
              <div className="col-span-1 text-left">عملیات</div>
            </div>

            {/* Table Rows: 16px body, 13-14px secondary, generous row height */}
            <div className="divide-y divide-[#17171A]">
              {activeTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => navigateToTask(task.id)}
                  className="flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-4 px-5 py-4 hover:bg-[#080808] transition-colors cursor-pointer text-sm items-start lg:items-center"
                >
                  {/* Col 1: ID & Status */}
                  <div className="col-span-3 flex flex-row lg:flex-col items-center lg:items-start gap-2.5 lg:gap-1.5">
                    <span className="text-xs text-[#71717A]" dir="ltr">
                      {task.id}
                    </span>
                    <StatusBadge status={task.status} size="sm" />
                  </div>

                  {/* Col 2: Title & Details: 16px title */}
                  <div className="col-span-4 min-w-0">
                    <div className="font-medium text-base text-[#F4F4F5] truncate leading-snug">
                      {task.title}
                    </div>
                    <div className="text-xs sm:text-[13px] text-[#71717A] flex items-center gap-2 mt-1">
                      <span>ثبت: {task.createdAt}</span>
                      {task.workerId && (
                        <span className="hidden sm:inline" dir="ltr">
                          · {task.workerId}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Col 3: Model & Source */}
                  <div className="col-span-2 text-xs sm:text-[13px] text-[#A1A1AA] truncate">
                    <div className="text-[#D4D4D8]" dir="ltr">
                      {task.modelName}
                    </div>
                    {task.repoUrl ? (
                      <div className="text-[#71717A] truncate mt-0.5" dir="ltr">
                        {task.repoUrl}
                      </div>
                    ) : (
                      <div className="text-[#71717A] mt-0.5">فایل‌های مستقیم</div>
                    )}
                  </div>

                  {/* Col 4: Reserved Cap */}
                  <div className="col-span-2">
                    <span className="tabular-nums text-sm font-semibold text-[#F4F4F5]">
                      {formatToman(task.reservedCap)}
                    </span>
                    <span className="block text-xs text-[#71717A] mt-0.5">سقف مسدود</span>
                  </div>

                  {/* Col 5: Action */}
                  <div className="col-span-1 flex items-center justify-end w-full lg:w-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToTask(task.id);
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors rounded hover:bg-[#17171A]"
                    >
                      جزئیات ←
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Section 2: Recently Completed Work */}
      <section style={getStaggerStyle(4)} className="animate-nervel-enter space-y-4">
        {/* Section Heading: 17-18px */}
        <div className="flex items-center justify-between pb-2 border-b border-[#17171A]">
          <div className="flex items-center gap-2">
            <h3 className="text-[17px] sm:text-lg font-semibold text-[#F4F4F5]">
              کارهای تکمیل‌شده اخیر و خروجی‌ها
            </h3>
            <span className="tabular-nums text-sm text-[#71717A]">
              ({toPersianDigits(completedTasks.length)})
            </span>
          </div>
        </div>

        <div className="border border-[#17171A] rounded overflow-hidden">
          <div className="divide-y divide-[#17171A]">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => navigateToTask(task.id)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-[#080808] transition-colors cursor-pointer text-sm"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs text-[#71717A]" dir="ltr">
                      {task.id}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#A1A1AA]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                      تایید کیفی QA
                    </span>
                    <span className="text-xs text-[#52525B]">·</span>
                    <span className="text-xs text-[#71717A]">{task.completedAt}</span>
                  </div>

                  <div className="font-medium text-base text-[#F4F4F5] truncate leading-snug">
                    {task.title}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-[13px] text-[#71717A]">
                    {task.deliverables?.prUrl && (
                      <span className="flex items-center gap-1 text-[#A1A1AA]" dir="ltr">
                        <GitPullRequest className="h-3.5 w-3.5 text-[#71717A]" />
                        PR #184
                      </span>
                    )}
                    {task.qaReport && (
                      <span>
                        {toPersianDigits(task.qaReport.filesChangedCount)} فایل تغییر‌یافته
                      </span>
                    )}
                    <span className="tabular-nums font-medium text-[#D4D4D8]">
                      تسویه نهایی: {formatToman(task.actualCost || task.estimatedCost)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToTask(task.id);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors rounded hover:bg-[#17171A]"
                  >
                    دریافت خروجی و لاگ ←
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
