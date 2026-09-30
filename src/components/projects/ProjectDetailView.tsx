import React, { useState } from 'react';
import { useNervel } from '../../context/NervelContext';
import { PageHeader } from '../common/PageHeader';
import { Button } from '../common/Button';
import { Tabs } from '../common/Tabs';
import { StatusIndicator } from '../common/StatusIndicator';
import { toPersianDigits, formatToman } from '../../utils/formatters';
import {
  FolderGit2,
  GitBranch,
  Plus,
  Pin,
  Clock,
  ArrowLeft,
  ArrowRight,
  FileCode2,
  FileArchive,
  Save,
  Check,
  AlertTriangle,
  GitPullRequest,
  CheckCircle2,
  Terminal,
  Settings,
  ListOrdered,
  LayoutDashboard,
} from 'lucide-react';
import { Project, TaskItem } from '../../types';

export const ProjectDetailView: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    tasks,
    togglePinProject,
    updateProjectInstructions,
    updateProjectSettings,
    navigateToTask,
    setView,
  } = useNervel();

  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'settings'>('overview');

  // Find active project
  const currentProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Local state for editable instructions in settings tab
  const [instructionsDraft, setInstructionsDraft] = useState(
    currentProject?.instructions || ''
  );
  const [nameDraft, setNameDraft] = useState(currentProject?.name || '');
  const [branchDraft, setBranchDraft] = useState(currentProject?.defaultBranch || 'main');
  const [isSaved, setIsSaved] = useState(false);

  if (!currentProject) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-[#71717A]">پروژه مورد نظر یافت نشد.</p>
        <Button
          variant="secondary"
          onClick={() => setView('projects')}
          className="mt-4"
        >
          بازگشت به فهرست پروژه‌ها
        </Button>
      </div>
    );
  }

  // Filter tasks belonging to this project
  const projectTasks = tasks.filter((t) => {
    if (currentProject.repoUrl && t.repoUrl) {
      return t.repoUrl.toLowerCase() === currentProject.repoUrl.toLowerCase();
    }
    return false;
  });

  // Tasks requiring action
  const actionRequiredTasks = projectTasks.filter(
    (t) => t.status === 'waiting_for_customer' || t.status === 'reassigning'
  );

  // Active running / queued tasks
  const activeTasks = projectTasks.filter(
    (t) =>
      t.status !== 'completed' &&
      t.status !== 'cancelled' &&
      t.status !== 'waiting_for_customer' &&
      t.status !== 'reassigning'
  );

  // Recent completed tasks
  const recentCompletedTasks = projectTasks.filter((t) => t.status === 'completed');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateProjectInstructions(currentProject.id, instructionsDraft);
    updateProjectSettings(currentProject.id, {
      name: nameDraft.trim() || currentProject.name,
      defaultBranch: branchDraft.trim() || currentProject.defaultBranch,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCreateTaskForProject = () => {
    setView('new_task');
  };

  return (
    <div className="w-full space-y-8 animate-nervel-enter">
      
      {/* Page Header */}
      <div className="border-b border-[#18181B] pb-6">
        {/* Breadcrumb Trail */}
        <nav className="flex items-center gap-1.5 text-xs text-[#71717A] mb-3" aria-label="مسیر">
          <button
            onClick={() => setView('projects')}
            className="hover:text-[#F4F4F5] transition-colors cursor-pointer"
          >
            پروژه‌ها
          </button>
          <span>/</span>
          <span className="text-[#A1A1AA] font-medium">{currentProject.name}</span>
        </nav>

        {/* Project Header Info + Main Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#F4F4F5]">
                {currentProject.name}
              </h1>

              {/* Pin button */}
              <button
                type="button"
                onClick={() => togglePinProject(currentProject.id)}
                title={currentProject.isPinned ? 'حذف از نشان‌شده‌ها' : 'نشان کردن پروژه'}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  currentProject.isPinned
                    ? 'text-[#7C3AED] bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20'
                    : 'text-[#52525B] hover:text-[#A1A1AA] hover:bg-[#141418]'
                }`}
              >
                <Pin className={`h-4 w-4 ${currentProject.isPinned ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Source & Branch Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-[13px] text-[#71717A]">
              {currentProject.repoUrl ? (
                <span className="flex items-center gap-1.5 text-[#A1A1AA] font-latin" dir="ltr">
                  <FolderGit2 className="h-3.5 w-3.5 text-[#52525B]" />
                  <span>{currentProject.repoUrl}</span>
                </span>
              ) : currentProject.zipFilename ? (
                <span className="flex items-center gap-1.5 text-[#A1A1AA] font-latin" dir="ltr">
                  <FileArchive className="h-3.5 w-3.5 text-[#52525B]" />
                  <span>{currentProject.zipFilename}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[#A1A1AA]">
                  <FileCode2 className="h-3.5 w-3.5 text-[#52525B]" />
                  <span>فایل‌های مستقیم</span>
                </span>
              )}

              {currentProject.defaultBranch && (
                <>
                  <span className="text-[#3F3F46]">·</span>
                  <span className="flex items-center gap-1 font-latin" dir="ltr">
                    <GitBranch className="h-3 w-3 text-[#52525B]" />
                    <span>{currentProject.defaultBranch}</span>
                  </span>
                </>
              )}

              <span className="text-[#3F3F46]">·</span>
              <span className="tabular-nums">ایجاد: {currentProject.createdAt}</span>
            </div>
          </div>

          {/* Primary Action: تسک جدید */}
          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
            <Button
              variant="primary"
              onClick={handleCreateTaskForProject}
              rightIcon={<Plus className="h-4 w-4" />}
            >
              تسک جدید
            </Button>
          </div>
        </div>

        {/* Tab Navigation: Overview, Tasks, Settings */}
        <div className="mt-6">
          <Tabs
            activeTab={activeTab}
            onChange={(tabId) => setActiveTab(tabId as any)}
            tabs={[
              { id: 'overview', label: 'نمای کلی' },
              { id: 'tasks', label: 'تسک‌ها', count: projectTasks.length },
              { id: 'settings', label: 'تنظیمات و دستورالعمل‌ها' },
            ]}
          />
        </div>
      </div>

      {/* =========================================================================
          TAB 1: OVERVIEW (نمای کلی)
          - tasks requiring action
          - active tasks
          - recent tasks
          - source information
          - latest relevant activity
          ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-nervel-enter">
          
          {/* Action Required Section */}
          {actionRequiredTasks.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                <h2 className="text-lg font-bold text-[#F4F4F5]">
                  نیازمند اقدام در این پروژه
                </h2>
                <span className="text-xs text-[#71717A] tabular-nums">
                  ({toPersianDigits(actionRequiredTasks.length)})
                </span>
              </div>

              <div className="border border-[#222226] rounded-lg overflow-hidden bg-[#0A0A0D]">
                <div className="divide-y divide-[#18181B]">
                  {actionRequiredTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#0E0E12] transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base font-medium text-[#F4F4F5]">{t.title}</span>
                          <StatusIndicator status={t.status} size="sm" />
                        </div>
                        <p className="text-xs text-[#A1A1AA]">
                          {t.status === 'waiting_for_customer'
                            ? 'ورکر منتظر پاسخ شماست.'
                            : 'ورکر قبلی قطع شده است؛ نیاز به تایید انتقال ورکر.'}
                        </p>
                      </div>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigateToTask(t.id)}
                        leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
                      >
                        بررسی و اقدام
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Active Tasks Section */}
          <section className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#F4F4F5]">تسک‌های در حال اجرا</h2>
                <span className="text-xs text-[#71717A] tabular-nums">
                  ({toPersianDigits(activeTasks.length)})
                </span>
              </div>
            </div>

            {activeTasks.length === 0 ? (
              <div className="border border-[#18181B] rounded-lg p-8 text-center bg-[#08080A]">
                <p className="text-sm text-[#71717A]">
                  هیچ تسک فعالی برای این پروژه در حال اجرا نیست.
                </p>
                <button
                  onClick={handleCreateTaskForProject}
                  className="mt-2 text-sm text-[#7C3AED] hover:text-[#8B5CF6] font-medium cursor-pointer"
                >
                  + ایجاد اولین تسک
                </button>
              </div>
            ) : (
              <div className="border border-[#18181B] rounded-lg overflow-hidden bg-[#08080A]">
                <div className="divide-y divide-[#18181B]">
                  {activeTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => navigateToTask(t.id)}
                      className="p-5 hover:bg-[#0C0C0F] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="text-base font-medium text-[#F4F4F5] truncate">
                          {t.title}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#71717A]">
                          <span className="tabular-nums">ثبت: {t.createdAt}</span>
                          {t.branch && <span dir="ltr">شاخه: {t.branch}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <StatusIndicator status={t.status} size="md" />
                        <ArrowLeft className="h-4 w-4 text-[#52525B]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Flattened Source Metadata & Instructions */}
          <div className="py-2 border-y border-[#18181C] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <span className="text-[#71717A] block">مخزن متصل:</span>
                  <span className="text-sm font-medium text-[#F4F4F5] font-latin" dir="ltr">
                    {currentProject.repoUrl || 'آرشیو لوکال'}
                  </span>
                </div>

                <div>
                  <span className="text-[#71717A] block">شاخه پیش‌فرض:</span>
                  <span className="text-sm font-medium text-[#F4F4F5] font-latin" dir="ltr">
                    {currentProject.defaultBranch || 'main'}
                  </span>
                </div>

                <div>
                  <span className="text-[#71717A] block">نوع منبع:</span>
                  <span className="text-sm font-medium text-[#D4D4D8]">
                    {currentProject.sourceType === 'github' ? 'GitHub Cloud' : 'سورس آرشیو'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#10B981]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                <span>همگام با گیت و آماده</span>
              </div>
            </div>

            {/* Persistent Instructions (Simple row/summary, no card) */}
            <div className="pt-3 border-t border-[#141418] flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
              <div className="space-y-1 min-w-0">
                <span className="text-xs font-medium text-[#71717A] block">دستورالعمل‌های پایدار پروژه:</span>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  {currentProject.instructions || 'هیچ دستورالعمل ثابتی ثبت نشده است. می‌توانید قوانین معماری و نحوه تست‌ها را در بخش تنظیمات اضافه کنید.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className="text-xs text-[#7C3AED] hover:text-[#8B5CF6] transition-colors cursor-pointer shrink-0"
              >
                ویرایش دستورالعمل‌ها ←
              </button>
            </div>
          </div>

          {/* Recent Completed Tasks */}
          {recentCompletedTasks.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#F4F4F5]">تسک‌های تکمیل‌شده اخیر</h2>
                  <span className="text-xs text-[#71717A] tabular-nums">
                    ({toPersianDigits(recentCompletedTasks.length)})
                  </span>
                </div>
              </div>

              <div className="border border-[#18181B] rounded-lg overflow-hidden bg-[#08080A]">
                <div className="divide-y divide-[#18181B]">
                  {recentCompletedTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => navigateToTask(t.id)}
                      className="p-5 hover:bg-[#0C0C0F] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="text-base font-medium text-[#F4F4F5] truncate">
                          {t.title}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#71717A]">
                          {t.deliverables?.prUrl && (
                            <span className="flex items-center gap-1 text-[#A1A1AA]" dir="ltr">
                              <GitPullRequest className="h-3 w-3" />
                              <span>PR آماده ادغام</span>
                            </span>
                          )}
                          <span className="tabular-nums">تکمیل: {t.completedAt}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <StatusIndicator status="completed" label="تکمیل شد" size="md" />
                        <ArrowLeft className="h-4 w-4 text-[#52525B]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

        </div>
      )}

      {/* =========================================================================
          TAB 2: TASKS (تمام تسک‌های پروژه)
          ========================================================================= */}
      {activeTab === 'tasks' && (
        <div className="space-y-4 animate-nervel-enter">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-lg font-bold text-[#F4F4F5]">
              تاریخچه کارهای انجام‌شده و فعال
            </h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCreateTaskForProject}
              rightIcon={<Plus className="h-3.5 w-3.5" />}
            >
              تسک جدید
            </Button>
          </div>

          {projectTasks.length === 0 ? (
            <div className="border border-[#18181B] rounded-lg p-12 text-center bg-[#08080A]">
              <p className="text-sm text-[#71717A]">
                هنوز هیچ تسکی برای این پروژه ثبت نشده است.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={handleCreateTaskForProject}
                className="mt-4"
              >
                ثبت اولین تسک
              </Button>
            </div>
          ) : (
            <div className="border border-[#18181B] rounded-lg overflow-hidden bg-[#08080A]">
              <div className="divide-y divide-[#18181B]">
                {projectTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => navigateToTask(t.id)}
                    className="p-5 hover:bg-[#0C0C0F] transition-colors cursor-pointer flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-medium text-[#F4F4F5]">
                          {t.title}
                        </span>
                        <StatusIndicator status={t.status} size="sm" />
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#71717A]">
                        <span className="tabular-nums" dir="ltr">{t.id}</span>
                        <span>·</span>
                        <span>مدل: {t.modelName}</span>
                        <span>·</span>
                        <span className="tabular-nums">تاریخ: {t.createdAt}</span>
                        {t.actualCost && (
                          <>
                            <span>·</span>
                            <span className="tabular-nums">هزینه: {formatToman(t.actualCost)}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToTask(t.id);
                        }}
                        leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
                      >
                        مشاهده جزئیات
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: PROJECT SETTINGS & PERSISTENT INSTRUCTIONS
          ========================================================================= */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 w-full max-w-3xl animate-nervel-enter">
          
          {isSaved && (
            <div className="p-3.5 rounded-md bg-[#10B981]/10 border border-[#10B981]/30 flex items-center gap-2 text-sm text-[#10B981]">
              <Check className="h-4 w-4 shrink-0" />
              <span>تنظیمات و دستورالعمل‌های پروژه با موفقیت ذخیره شدند.</span>
            </div>
          )}

          {/* Project Metadata */}
          <div className="border border-[#18181B] rounded-lg p-6 bg-[#08080A] space-y-4">
            <h3 className="text-base font-bold text-[#F4F4F5]">مشخصات پروژه</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#D4D4D8] mb-1.5">
                  نام پروژه:
                </label>
                <input
                  type="text"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  className="w-full h-11 bg-[#09090C] border border-[#27272A] focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] rounded-md px-3.5 text-sm text-[#F4F4F5] focus:outline-none transition-colors"
                />
              </div>

              {currentProject.sourceType === 'github' && (
                <div>
                  <label className="block text-sm font-medium text-[#D4D4D8] mb-1.5">
                    شاخه پیش‌فرض:
                  </label>
                  <input
                    type="text"
                    value={branchDraft}
                    onChange={(e) => setBranchDraft(e.target.value)}
                    dir="ltr"
                    className="w-full h-11 bg-[#09090C] border border-[#27272A] focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] rounded-md px-3.5 text-sm font-latin text-[#F4F4F5] focus:outline-none transition-colors"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Persistent Project Instructions (Primary Requirement) */}
          <div className="border border-[#18181B] rounded-lg p-6 bg-[#08080A] space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#F4F4F5] flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#7C3AED]" />
                <span>دستورالعمل‌های پایدار پروژه (Persistent Project Instructions)</span>
              </h3>
              <p className="text-xs text-[#71717A] mt-1 leading-relaxed">
                این دستورالعمل‌ها به صورت خودکار به تمام تسک‌های آینده این پروژه ضمیمه و به ورکرها ابلاغ خواهند شد.
              </p>
            </div>

            <textarea
              rows={6}
              value={instructionsDraft}
              onChange={(e) => setInstructionsDraft(e.target.value)}
              placeholder="مثال:&#10;- از pnpm به عنوان پکیج منیجر استفاده شود.&#10;- تمام تست‌ها با Vitest اجرا شوند.&#10;- پوشه /legacy نباید دستکاری شود.&#10;- شاخه پیش‌فرض develop است."
              className="w-full bg-[#09090C] border border-[#27272A] hover:border-[#38383E] focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] rounded-md p-3.5 text-sm text-[#F4F4F5] focus:outline-none leading-relaxed transition-colors"
            />

            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="text-[#71717A]">قوانین نمونه:</span>
              {[
                'استفاده از pnpm',
                'اجرای تست با vitest',
                'عدم تغییر پوشه /legacy',
                'شاخه پیش‌فرض develop است',
              ].map((text) => (
                <button
                  key={text}
                  type="button"
                  onClick={() =>
                    setInstructionsDraft((prev) =>
                      prev ? `${prev}\n- ${text}` : `- ${text}`
                    )
                  }
                  className="text-xs text-[#A1A1AA] hover:text-[#F4F4F5] bg-[#141418] hover:bg-[#1E1E24] border border-[#27272A] px-2.5 py-1 rounded transition-colors cursor-pointer"
                >
                  + {text}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              rightIcon={<Save className="h-4 w-4" />}
            >
              ذخیره تغییرات و دستورالعمل‌ها
            </Button>
          </div>
        </form>
      )}

    </div>
  );
};
