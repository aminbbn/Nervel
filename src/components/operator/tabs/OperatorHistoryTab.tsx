import React, { useState } from 'react';
import { useNervel } from '../../../context/NervelContext';
import { formatToman, toPersianDigits } from '../../../utils/formatters';
import { TaskItem } from '../../../types';
import { getAllModels } from '../../../services/modelRegistry';
import { calculateOperatorPayout } from '../../../services/payoutService';
import {
  History,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  FileCode,
  Layers,
  GitPullRequest,
  Check,
  ChevronDown,
  X,
} from 'lucide-react';

export const OperatorHistoryTab: React.FC = () => {
  const { tasks, operatorNode } = useNervel();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [inspectTask, setInspectTask] = useState<TaskItem | null>(null);

  // Completed tasks
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const filteredTasks = completedTasks.filter((t) => {
    const matchesSearch =
      !searchQuery.trim() ||
      t.title.includes(searchQuery) ||
      t.id.includes(searchQuery) ||
      (t.repoUrl && t.repoUrl.includes(searchQuery));

    const matchesModel =
      selectedModel === 'all' || t.modelId === selectedModel || t.modelName.includes(selectedModel);

    return matchesSearch && matchesModel;
  });

  return (
    <div className="space-y-6 animate-nervel-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#18181C]">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F4F5]">تاریخچه</h1>
          <p className="text-sm text-[#71717A] mt-1.5">
            سوابق تسک‌های تحویل‌شده، وضعیت تست‌های کیفی و درآمد نهایی ثبت‌شده در دفتر کل
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm self-start sm:self-auto shrink-0">
          <span className="text-[#71717A]">مجموع تسک‌های تاییدشده:</span>
          <span className="text-[#F4F4F5] font-medium tabular-nums">
            {toPersianDigits(operatorNode.totalJobsExecuted)} تسک
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در شناسه تسک، عنوان یا مخزن..."
            className="w-full h-11 bg-[#09090C] border border-[#222226] hover:border-[#2E2E33] focus:border-[#7C3AED] rounded-md px-9 text-sm text-[#F4F4F5] placeholder-[#52525B] focus:outline-none"
          />
          <Search className="absolute right-3 top-3.5 h-4 w-4 text-[#71717A]" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-3.5 text-[#71717A] hover:text-[#F4F4F5]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
          <span className="text-sm text-[#71717A] whitespace-nowrap">فیلتر مدل:</span>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="h-11 bg-[#09090C] border border-[#222226] text-sm text-[#F4F4F5] rounded-md px-3.5 py-1.5 focus:border-[#7C3AED] focus:outline-none cursor-pointer"
          >
            <option value="all">همه مدل‌ها</option>
            {getAllModels().map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* History Table - Frameless */}
      <div className="border-y border-[#18181B] overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-[#18181B] text-[#71717A] text-xs">
              <th className="py-3 px-3 font-medium">شناسه و عنوان تسک</th>
              <th className="py-3 px-3 font-medium">مدل استفاده‌شده</th>
              <th className="py-3 px-3 font-medium">زمان تحویل</th>
              <th className="py-3 px-3 font-medium">توکن‌های پردازش‌شده</th>
              <th className="py-3 px-3 font-medium">کنترل کیفیت (QA)</th>
              <th className="py-3 px-3 font-medium text-left">درآمد اپراتور</th>
              <th className="py-3 px-3 font-medium text-center">جزئیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#18181B]">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((t) => {
                const operatorEarnings = calculateOperatorPayout(t);
                const totalTokens =
                  (t.tokenStats?.inputTokens || 0) + (t.tokenStats?.outputTokens || 0);

                return (
                  <tr key={t.id} className="hover:bg-[#0A0A0D] transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="space-y-0.5">
                        <span className="font-medium text-[#F4F4F5] line-clamp-1">
                          {t.title}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-[#71717A]" dir="ltr">
                          <span className="font-latin tabular-nums font-medium">{t.id}</span>
                          {t.repoUrl && <span>· {t.repoUrl}</span>}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="text-[#A1A1AA]">{t.modelName}</span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-[#71717A]">
                      {t.completedAt || '۱۴۰۵/۰۶/۳۰'}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap tabular-nums">
                      <span className="text-[#F4F4F5] font-medium">
                        {toPersianDigits(totalTokens)}
                      </span>
                      <span className="text-xs text-[#71717A] block">
                        ورودی: {toPersianDigits(t.tokenStats?.inputTokens || 0)} · خروجی: {toPersianDigits(t.tokenStats?.outputTokens || 0)}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-[#10B981]">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>تست‌ها پاس شد ({toPersianDigits(t.qaReport?.filesChangedCount || 4)} فایل)</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-left" dir="ltr">
                      <span className="font-medium text-[#10B981] tabular-nums text-base">
                        +{formatToman(operatorEarnings)}
                      </span>
                      <span className="text-xs text-[#71717A] block">تسویه‌شده در تراز</span>
                    </td>

                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => setInspectTask(t)}
                        className="px-3 py-1.5 text-xs text-[#A1A1AA] hover:text-[#F4F4F5] bg-[#141418] hover:bg-[#1E1E24] border border-[#27272A] rounded transition-colors cursor-pointer"
                      >
                        بررسی گزارش
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#71717A]">
                  هیچ تسکی با این مشخصات یافت نشد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Inspect Modal / Slide-over */}
      {inspectTask && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#09090C] border border-[#222226] rounded-lg shadow-2xl p-6 space-y-5 animate-nervel-enter">
            <div className="flex items-start justify-between pb-3 border-b border-[#18181C]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#7C3AED] font-medium">{inspectTask.modelName}</span>
                  <span className="text-xs text-[#71717A] font-latin tabular-nums font-medium" dir="ltr">
                    {inspectTask.id}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#F4F4F5] mt-1">
                  {inspectTask.title}
                </h3>
              </div>

              <button
                onClick={() => setInspectTask(null)}
                className="text-[#71717A] hover:text-[#F4F4F5] p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* QA and Deliverables Report */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded bg-[#060608] border border-[#141418]">
                <div>
                  <span className="text-[#71717A] block">کامپایل:</span>
                  <span className="text-[#10B981] font-medium block mt-0.5">موفق (Passed)</span>
                </div>
                <div>
                  <span className="text-[#71717A] block">تست‌های خودکار:</span>
                  <span className="text-[#10B981] font-medium block mt-0.5">۲۴ از ۲۴ پاس شد</span>
                </div>
                <div>
                  <span className="text-[#71717A] block">لینتر:</span>
                  <span className="text-[#10B981] font-medium block mt-0.5">بدون خطا</span>
                </div>
                <div>
                  <span className="text-[#71717A] block">درآمد واریزشده:</span>
                  <span className="text-[#10B981] font-medium tabular-nums block mt-0.5" dir="ltr">
                    +{formatToman(calculateOperatorPayout(inspectTask))}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-sm font-medium text-[#D4D4D8] block">خروجی Pull Request ثبت‌شده:</span>
                {inspectTask.deliverables?.prUrl ? (
                  <a
                    href={inspectTask.deliverables.prUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded bg-[#0D0D11] border border-[#18181C] text-[#7C3AED] hover:text-[#9061F9] font-latin text-sm flex items-center justify-between transition-colors"
                    dir="ltr"
                  >
                    <span>{inspectTask.deliverables.prUrl}</span>
                    <ExternalLink className="h-4 w-4 shrink-0" />
                  </a>
                ) : (
                  <span className="text-[#71717A]">خروجی به صورت فایل Patch تحویل شده است.</span>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="text-sm font-medium text-[#D4D4D8] block">لاگ خلاصه اعتبارسنجی:</span>
                <div className="p-3.5 rounded bg-[#030304] border border-[#141418] font-code text-xs text-[#A1A1AA] space-y-1.5 leading-relaxed" dir="ltr">
                  <div>[OK] Sandbox container isolated: network disabled after dependency fetch.</div>
                  <div>[OK] Changed files verified: src/modules/orders/orders.repository.ts</div>
                  <div>[OK] Settlement credited to operator account ledger.</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#18181C] flex justify-end">
              <button
                onClick={() => setInspectTask(null)}
                className="h-11 min-h-[44px] px-5 rounded-md bg-[#18181D] hover:bg-[#222228] text-sm font-medium text-[#F4F4F5] transition-colors cursor-pointer"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
