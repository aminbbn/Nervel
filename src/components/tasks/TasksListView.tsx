import React, { useState } from 'react';
import { useNervel } from '../../context/NervelContext';
import { StatusIndicator } from '../common/StatusIndicator';
import { Button } from '../common/Button';
import { formatToman, toPersianDigits } from '../../utils/formatters';
import { TaskItem, TaskStatus } from '../../types';
import { getAllModels } from '../../services/modelRegistry';
import {
  Plus,
  Search,
  Pin,
  FolderGit2,
  GitBranch,
  Clock,
  ArrowLeft,
  SlidersHorizontal,
  X,
  ChevronDown,
} from 'lucide-react';

type FilterTab =
  | 'all'
  | 'active'
  | 'queued'
  | 'waiting_for_customer'
  | 'completed'
  | 'failed_stopped';

type SortOption = 'newest' | 'oldest' | 'cost_high';

export const TasksListView: React.FC = () => {
  const { tasks, navigateToTask, setView, togglePinTask } = useNervel();

  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedModel, setSelectedModel] = useState<string>('all');

  // Filter tasks based on customer-facing status
  const filterByTab = (task: TaskItem): boolean => {
    switch (activeTab) {
      case 'active':
        return (
          task.status === 'running' ||
          task.status === 'validating' ||
          task.status === 'assigning' ||
          task.status === 'reassigning'
        );
      case 'queued':
        return task.status === 'queued';
      case 'waiting_for_customer':
        return task.status === 'waiting_for_customer';
      case 'completed':
        return task.status === 'completed';
      case 'failed_stopped':
        return task.status === 'cancelled' || task.status === 'failed';
      case 'all':
      default:
        return true;
    }
  };

  const filteredTasks = tasks.filter((task) => {
    // 1. Tab filter
    if (!filterByTab(task)) return false;

    // 2. Search query (title, ID, repo)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchId = task.id.toLowerCase().includes(q);
      const matchRepo = task.repoUrl?.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchId && !matchRepo) return false;
    }

    // 3. Model filter
    if (selectedModel !== 'all' && task.modelId !== selectedModel) {
      return false;
    }

    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'oldest') {
      return a.createdAt.localeCompare(b.createdAt);
    }
    if (sortBy === 'cost_high') {
      const costA = a.actualCost || a.estimatedCost;
      const costB = b.actualCost || b.estimatedCost;
      return costB - costA;
    }
    // Default newest
    return b.createdAt.localeCompare(a.createdAt);
  });

  // Pinned tasks appear above normal tasks
  const pinnedTasks = sortedTasks.filter((t) => t.isPinned);
  const unpinnedTasks = sortedTasks.filter((t) => !t.isPinned);

  const getElapsedOrCompleteTime = (task: TaskItem) => {
    if (task.status === 'completed') {
      return `تکمیل: ${task.completedAt || task.updatedAt}`;
    }
    if (task.status === 'running') return '۳۵ دقیقه پیش';
    if (task.status === 'validating') return '۵۰ دقیقه پیش';
    if (task.status === 'queued') return '۱۰ دقیقه پیش';
    return task.createdAt;
  };

  const renderTaskRow = (task: TaskItem) => {
    return (
      <div
        key={task.id}
        onClick={() => navigateToTask(task.id)}
        className="p-5 sm:px-6 hover:bg-[#0C0C0F] transition-colors cursor-pointer flex flex-col md:flex-row md:items-center md:justify-between gap-4 select-none"
      >
        {/* Main Content: Title, Project/Source */}
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-medium text-[#F4F4F5] hover:text-[#7C3AED] transition-colors leading-snug">
              {task.title}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-[#71717A]">
            {task.repoUrl ? (
              <span className="flex items-center gap-1.5 text-[#A1A1AA] font-latin" dir="ltr">
                <FolderGit2 className="h-4 w-4 text-[#52525B]" />
                <span>{task.repoUrl}</span>
              </span>
            ) : (
              <span className="text-[#A1A1AA]">فایل‌های مستقیم</span>
            )}

            {task.branch && (
              <>
                <span className="text-[#3F3F46]">·</span>
                <span className="flex items-center gap-1 font-latin" dir="ltr">
                  <GitBranch className="h-3.5 w-3.5 text-[#52525B]" />
                  <span>{task.branch}</span>
                </span>
              </>
            )}

            <span className="text-[#3F3F46]">·</span>
            <span className="text-[#71717A] tabular-nums font-latin" dir="ltr">
              {task.id}
            </span>

            {/* Model & Cost as secondary metadata */}
            <span className="text-[#3F3F46] hidden lg:inline">·</span>
            <span className="hidden lg:inline text-[#71717A]">
              مدل: <span className="font-latin">{task.modelName}</span>
            </span>

            <span className="text-[#3F3F46] hidden sm:inline">·</span>
            <span className="hidden sm:inline tabular-nums text-[#8E8E93]">
              {task.actualCost ? formatToman(task.actualCost) : `سقف: ${formatToman(task.reservedCap)}`}
            </span>
          </div>
        </div>

        {/* Status, Time, Pin & Navigation */}
        <div className="flex items-center justify-between md:justify-end gap-5 shrink-0">
          <div className="flex items-center gap-4">
            {/* Customer-facing status */}
            <StatusIndicator status={task.status} size="md" />

            {/* Elapsed/Completion time */}
            <div className="flex items-center gap-1.5 text-sm text-[#71717A]">
              <Clock className="h-4 w-4 text-[#52525B]" />
              <span className="tabular-nums">{getElapsedOrCompleteTime(task)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Pin Toggle Control */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                togglePinTask(task.id);
              }}
              title={task.isPinned ? 'حذف از نشان‌شده‌ها' : 'نشان کردن تسک'}
              className={`p-2.5 rounded-md transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
                task.isPinned
                  ? 'text-[#7C3AED] bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20'
                  : 'text-[#52525B] hover:text-[#A1A1AA] hover:bg-[#141418]'
              }`}
            >
              <Pin className={`h-4.5 w-4.5 ${task.isPinned ? 'fill-current' : ''}`} />
            </button>

            <ArrowLeft className="h-4 w-4 text-[#52525B] hidden sm:block" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-8 animate-nervel-enter">
      
      {/* Top Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#18181B]">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F4F5]">
            تسک‌ها
          </h1>
          <p className="text-sm text-[#71717A] mt-1 leading-relaxed">
            مدیریت، نظارت بر صف، اجرای ورکرها و تحویل کدهای مهندسی
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setView('new_task')}
          rightIcon={<Plus className="h-4.5 w-4.5" />}
          className="self-start sm:self-auto shrink-0"
        >
          تسک جدید
        </Button>
      </div>

      {/* Top Controls: Search Bar & Secondary Filter Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو با عنوان تسک، شناسه یا مخزن پروژه..."
            className="w-full h-11 bg-[#09090C] border border-[#222226] hover:border-[#2E2E33] focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] rounded-md pr-10 pl-9 text-base text-[#F4F4F5] placeholder-[#52525B] transition-colors focus:outline-none"
          />
          <Search className="absolute right-3 top-3.5 h-4.5 w-4.5 text-[#71717A] pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-3 text-[#71717A] hover:text-[#F4F4F5] cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          )}
        </div>

        {/* Secondary Filter Toggle Button */}
        <button
          type="button"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={`min-h-[44px] px-4 rounded-md border text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto ${
            showAdvancedFilters || selectedModel !== 'all' || sortBy !== 'newest'
              ? 'border-[#7C3AED] bg-[#121218] text-[#F4F4F5]'
              : 'border-[#222226] bg-[#09090C] text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#121215]'
          }`}
        >
          <SlidersHorizontal className="h-4.5 w-4.5 text-[#7C3AED]" />
          <span>فیلترهای پیشرفته</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Secondary Filters Dropdown / Strip */}
      {showAdvancedFilters && (
        <div className="p-4 sm:p-5 rounded-lg bg-[#0A0A0D] border border-[#222226] grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm animate-nervel-enter">
          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-[#71717A] mb-2">مرتب‌سازی بر اساس:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full h-11 bg-[#111115] border border-[#27272A] rounded-md px-3.5 text-sm text-[#F4F4F5] focus:outline-none focus:border-[#7C3AED] cursor-pointer"
            >
              <option value="newest">جدیدترین تسک‌ها</option>
              <option value="oldest">قدیمی‌ترین تسک‌ها</option>
              <option value="cost_high">بیشترین هزینه</option>
            </select>
          </div>

          {/* Model Filter */}
          <div>
            <label className="block text-sm font-medium text-[#71717A] mb-2">مدل هوش مصنوعی:</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full h-11 bg-[#111115] border border-[#27272A] rounded-md px-3.5 text-sm text-[#F4F4F5] focus:outline-none focus:border-[#7C3AED] cursor-pointer"
            >
              <option value="all">همه مدل‌ها</option>
              {getAllModels().map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setSortBy('newest');
                setSelectedModel('all');
                setSearchQuery('');
              }}
              className="h-11 px-4 text-sm text-[#A1A1AA] hover:text-[#EF4444] transition-colors cursor-pointer"
            >
              پاک‌سازی همه فیلترها
            </button>
          </div>
        </div>
      )}

      {/* Customer-Facing Primary Filters: همه, فعال, در صف, منتظر شما, تکمیل‌شده, ناموفق / متوقف‌شده */}
      <div className="border-b border-[#18181B] pb-1">
        <nav className="flex space-x-reverse space-x-2 sm:space-x-6 overflow-x-auto no-scrollbar" aria-label="فیلتر وضعیت">
          {[
            { id: 'all', label: 'همه', count: tasks.length },
            {
              id: 'active',
              label: 'فعال',
              count: tasks.filter(
                (t) =>
                  t.status === 'running' ||
                  t.status === 'validating' ||
                  t.status === 'assigning' ||
                  t.status === 'reassigning'
              ).length,
            },
            {
              id: 'queued',
              label: 'در صف',
              count: tasks.filter((t) => t.status === 'queued').length,
            },
            {
              id: 'waiting_for_customer',
              label: 'منتظر شما',
              count: tasks.filter((t) => t.status === 'waiting_for_customer').length,
            },
            {
              id: 'completed',
              label: 'تکمیل‌شده',
              count: tasks.filter((t) => t.status === 'completed').length,
            },
            {
              id: 'failed_stopped',
              label: 'ناموفق / متوقف‌شده',
              count: tasks.filter((t) => t.status === 'cancelled').length,
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as FilterTab)}
                className={`py-3.5 px-1.5 inline-flex items-center gap-2 border-b-2 text-base font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'border-[#7C3AED] text-[#F4F4F5]'
                    : 'border-transparent text-[#71717A] hover:text-[#D4D4D8] hover:border-[#27272A]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`text-xs tabular-nums px-2 py-0.5 rounded ${
                      isActive ? 'bg-[#1C1C22] text-[#D4D4D8]' : 'bg-[#121215] text-[#71717A]'
                    }`}
                  >
                    {toPersianDigits(tab.count)}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Pinned Tasks Section (Above normal tasks) */}
      {pinnedTasks.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 pb-1">
            <Pin className="h-4 w-4 text-[#7C3AED] fill-current" />
            <h2 className="text-lg font-bold text-[#F4F4F5]">
              تسک‌های نشان‌شده
            </h2>
            <span className="text-xs text-[#71717A] tabular-nums">
              ({toPersianDigits(pinnedTasks.length)})
            </span>
          </div>

          <div className="border border-[#1E1E22] rounded-lg overflow-hidden bg-[#08080A]">
            <div className="divide-y divide-[#18181B]">
              {pinnedTasks.map(renderTaskRow)}
            </div>
          </div>
        </section>
      )}

      {/* Main Tasks List */}
      <section className="space-y-3">
        {pinnedTasks.length > 0 && (
          <div className="flex items-center gap-2 pb-1">
            <h2 className="text-lg font-bold text-[#F4F4F5]">
              سایر تسک‌ها
            </h2>
            <span className="text-xs text-[#71717A] tabular-nums">
              ({toPersianDigits(unpinnedTasks.length)})
            </span>
          </div>
        )}

        {filteredTasks.length === 0 ? (
          <div className="border border-[#18181B] rounded-lg p-12 text-center bg-[#08080A]">
            <p className="text-sm text-[#71717A]">
              هیچ تسکی با فیلترهای فعلی یافت نشد.
            </p>
            <button
              onClick={() => {
                setActiveTab('all');
                setSearchQuery('');
                setSelectedModel('all');
              }}
              className="mt-3 text-sm text-[#7C3AED] hover:text-[#8B5CF6] font-medium transition-colors cursor-pointer"
            >
              پاک‌سازی فیلترها و نمایش همه
            </button>
          </div>
        ) : (
          <div className="border border-[#18181B] rounded-lg overflow-hidden bg-[#08080A]">
            <div className="divide-y divide-[#18181B]">
              {unpinnedTasks.map(renderTaskRow)}
            </div>
          </div>
        )}
      </section>

    </div>
  );
};
