import React, { useState } from 'react';
import { useNervel } from '../../context/NervelContext';
import { StatusBadge } from '../common/StatusBadge';
import { formatToman } from '../../utils/formatters';
import { getStaggerStyle } from '../../utils/motion';
import { Plus, Search, GitBranch } from 'lucide-react';

export const TasksListView: React.FC = () => {
  const { tasks, navigateToTask, setView } = useNervel();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === 'active') {
      if (task.status === 'completed' || task.status === 'cancelled') return false;
    } else if (filterStatus !== 'all' && task.status !== filterStatus) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchId = task.id.toLowerCase().includes(q);
      const matchRepo = task.repoUrl?.toLowerCase().includes(q) || false;
      return matchTitle || matchId || matchRepo;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header and Action: 22-24px heading */}
      <div
        style={getStaggerStyle(0)}
        className="animate-nervel-enter flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#17171A]"
      >
        <div>
          <h2 className="text-[22px] sm:text-2xl font-bold text-[#F4F4F5] leading-tight">
            فهرست تسک‌های مهندسی
          </h2>
          <p className="text-sm text-[#71717A] mt-1.5 leading-relaxed">
            مدیریت، پیگیری وضعیت اجرا و دریافت خروجی کارهای ثبت‌شده در شبکه ورکرها
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

      {/* Filter and Search Bar: 13-14px text */}
      <div
        style={getStaggerStyle(1)}
        className="animate-nervel-enter flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
      >
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'همه تسک‌ها' },
            { id: 'active', label: 'در حال اجرا / صف' },
            { id: 'waiting_for_customer', label: 'منتظر پاسخ' },
            { id: 'completed', label: 'تکمیل‌شده' },
            { id: 'cancelled', label: 'لغوشده' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-1.5 rounded text-sm transition-colors whitespace-nowrap font-medium ${
                filterStatus === tab.id
                  ? 'bg-[#17171A] text-[#F4F4F5]'
                  : 'text-[#71717A] hover:text-[#D4D4D8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="جستجو با شناسه، عنوان یا مخزن..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded border border-[#27272A] bg-transparent px-3.5 py-2 pl-9 text-sm text-[#F4F4F5] placeholder-[#52525B] focus:border-[#7C3AED] focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#52525B]" />
        </div>
      </div>

      {/* Tasks Table: 16px body, 13-14px secondary */}
      <div style={getStaggerStyle(2)} className="animate-nervel-enter border border-[#17171A] rounded overflow-hidden">
        
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-sm text-[#71717A]">
            هیچ تسکی با شرایط انتخاب‌شده یافت نشد.
          </div>
        ) : (
          <div>
            {/* Table Header on Desktop */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#17171A] bg-[#060607] text-sm text-[#71717A]">
              <div className="col-span-3">شناسه و وضعیت</div>
              <div className="col-span-4">عنوان تسک</div>
              <div className="col-span-2">مدل و ورودی</div>
              <div className="col-span-2">سقف رزرو / هزینه</div>
              <div className="col-span-1 text-left">عملیات</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#17171A]">
              {filteredTasks.map((task) => (
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

                  {/* Col 2: Title & Details */}
                  <div className="col-span-4 min-w-0">
                    <div className="font-medium text-base text-[#F4F4F5] truncate leading-snug">
                      {task.title}
                    </div>
                    <div className="text-xs sm:text-[13px] text-[#71717A] flex items-center gap-2 mt-1">
                      <span>{task.createdAt}</span>
                      {task.workerId && (
                        <span className="hidden sm:inline" dir="ltr">
                          · {task.workerId}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Col 3: Model & Repo */}
                  <div className="col-span-2 text-xs sm:text-[13px] text-[#A1A1AA] truncate">
                    <div className="text-[#D4D4D8]" dir="ltr">
                      {task.modelName}
                    </div>
                    {task.repoUrl ? (
                      <div className="text-[#71717A] truncate flex items-center gap-1.5 mt-0.5" dir="ltr">
                        <GitBranch className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{task.repoUrl}</span>
                      </div>
                    ) : (
                      <div className="text-[#71717A] mt-0.5">فایل‌های مستقیم</div>
                    )}
                  </div>

                  {/* Col 4: Cap & Cost */}
                  <div className="col-span-2">
                    <span className="tabular-nums text-sm font-semibold text-[#F4F4F5]">
                      {formatToman(task.actualCost || task.reservedCap)}
                    </span>
                    <span className="block text-xs text-[#71717A] mt-0.5">
                      {task.actualCost ? 'تسویه نهایی' : 'سقف مسدود'}
                    </span>
                  </div>

                  {/* Col 5: Actions */}
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
      </div>

    </div>
  );
};
