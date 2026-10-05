import React, { useState } from 'react';
import { useNervel } from '../../context/NervelContext';
import { PageHeader } from '../common/PageHeader';
import { Button } from '../common/Button';
import { Tabs } from '../common/Tabs';
import { StatusIndicator } from '../common/StatusIndicator';
import { SectionHeader } from '../common/SectionHeader';
import { OperationalList } from '../common/OperationalList';
import { OperationalRow } from '../common/OperationalRow';
import { MetadataLine } from '../common/MetadataLine';
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
          TAB 1: OVERVIEW (نمای کلی) - 2-Column Deliberate Layout
          RIGHT 8 columns: Action Required, Active Tasks, Recent Completed Tasks
          LEFT 4 columns: Project Source, Branch, Architecture Instructions, Stats
          ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start animate-nervel-enter">
          
          {/* RIGHT 8 COLUMNS: Operational Task Flow */}
          <div className="lg:col-span-8 space-y-8">
            {/* Action Required Section */}
            {actionRequiredTasks.length > 0 && (
              <section className="space-y-2">
                <SectionHeader
                  title="نیازمند اقدام در این پروژه"
                  count={toPersianDigits(actionRequiredTasks.length)}
                  semanticDot="bg-[#F59E0B]"
                />

                <OperationalList>
                  {actionRequiredTasks.map((t) => (
                    <OperationalRow
                      key={t.id}
                      onClick={() => navigateToTask(t.id)}
                      identity={
                        <div className="space-y-1">
                          <h3 className="text-[16px] font-bold text-[#F4F4F5] hover:text-[#7C3AED] transition-colors leading-snug">
                            {t.title}
                          </h3>
                          <p className="text-xs text-[#A1A1AA]">
                            {t.status === 'waiting_for_customer'
                              ? 'ورکر منتظر پاسخ و رفع ابهام شماست.'
                              : 'ورکر قبلی قطع شده است؛ نیاز به تایید انتقال ورکر.'}
                          </p>
                        </div>
                      }
                      status={
                        <StatusIndicator status={t.status} size="sm" />
                      }
                      action={
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToTask(t.id);
                          }}
                          leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
                        >
                          بررسی و اقدام
                        </Button>
                      }
                    />
                  ))}
                </OperationalList>
              </section>
            )}

            {/* Active Tasks Section */}
            <section className="space-y-2">
              <SectionHeader
                title="تسک‌های در حال اجرا"
                count={toPersianDigits(activeTasks.length)}
              />

              {activeTasks.length === 0 ? (
                <div className="py-8 text-center border-y border-[#18181C]">
                  <p className="text-sm text-[#71717A]">
                    هیچ تسک فعالی برای این پروژه در حال اجرا نیست.
                  </p>
                  <button
                    onClick={handleCreateTaskForProject}
                    className="mt-2 text-sm text-[#7C3AED] hover:text-[#8B5CF6] font-medium cursor-pointer"
                  >
                    + ثبت اولین تسک
                  </button>
                </div>
              ) : (
                <OperationalList>
                  {activeTasks.map((t) => (
                    <OperationalRow
                      key={t.id}
                      onClick={() => navigateToTask(t.id)}
                      identity={
                        <div className="space-y-1">
                          <h3 className="text-[16px] font-bold text-[#F4F4F5] hover:text-[#7C3AED] transition-colors leading-snug">
                            {t.title}
                          </h3>
                          <MetadataLine
                            items={[
                              { label: `ثبت: ${t.createdAt}` },
                              t.branch && {
                                icon: <GitBranch className="h-3 w-3" />,
                                label: t.branch,
                                isLtr: true,
                              },
                            ]}
                          />
                        </div>
                      }
                      status={
                        <StatusIndicator status={t.status} size="md" />
                      }
                      action={
                        <ArrowLeft className="h-4 w-4 text-[#52525B] group-hover:text-[#F4F4F5] transition-colors" />
                      }
                    />
                  ))}
                </OperationalList>
              )}
            </section>

            {/* Recent Completed Tasks Section */}
            {recentCompletedTasks.length > 0 && (
              <section className="space-y-2">
                <SectionHeader
                  title="تسک‌های تکمیل‌شده اخیر"
                  count={toPersianDigits(recentCompletedTasks.length)}
                  action={
                    <button
                      onClick={() => setActiveTab('tasks')}
                      className="text-xs text-[#71717A] hover:text-[#F4F4F5] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>همه تسک‌ها</span>
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                  }
                />

                <OperationalList>
                  {recentCompletedTasks.map((t) => (
                    <OperationalRow
                      key={t.id}
                      onClick={() => navigateToTask(t.id)}
                      identity={
                        <div className="space-y-1">
                          <h3 className="text-[16px] font-bold text-[#F4F4F5] hover:text-[#7C3AED] transition-colors leading-snug">
                            {t.title}
                          </h3>
                          <MetadataLine
                            items={[
                              t.deliverables?.prUrl && {
                                icon: <GitPullRequest className="h-3 w-3 text-[#10B981]" />,
                                label: 'PR آماده ادغام',
                              },
                              { label: `تکمیل: ${t.completedAt}` },
                            ]}
                          />
                        </div>
                      }
                      status={
                        <StatusIndicator status="completed" label="تکمیل شد" size="md" />
                      }
                      action={
                        <ArrowLeft className="h-4 w-4 text-[#52525B] group-hover:text-[#F4F4F5] transition-colors" />
                      }
                    />
                  ))}
                </OperationalList>
              </section>
            )}
          </div>

          {/* LEFT 4 COLUMNS: Source info, Instructions, Stats & Quick Actions */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
            
            {/* Project Environment & Source Details */}
            <div className="space-y-3 pb-6 border-b border-[#18181C]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#F4F4F5]">
                  مشخصات سورس و محیط
                </h3>
                <span className="text-xs text-[#10B981] flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                  آماده اجرا
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-[#141418]">
                  <span className="text-[#71717A]">مخزن متصل:</span>
                  <span className="text-[#F4F4F5] font-latin font-medium" dir="ltr">
                    {currentProject.repoUrl || 'سورس لوکال'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#141418]">
                  <span className="text-[#71717A]">شاخه پیش‌فرض:</span>
                  <span className="text-[#F4F4F5] font-latin font-medium" dir="ltr">
                    {currentProject.defaultBranch || 'main'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#141418]">
                  <span className="text-[#71717A]">نوع منبع:</span>
                  <span className="text-[#D4D4D8]">
                    {currentProject.sourceType === 'github' ? 'GitHub Cloud' : 'سورس آرشیو'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-[#71717A]">آخرین فعالیت:</span>
                  <span className="text-[#71717A] tabular-nums">
                    {currentProject.lastActivityAt}
                  </span>
                </div>
              </div>
            </div>

            {/* Architecture & Codebase Guidelines Summary */}
            <div className="space-y-3 pb-6 border-b border-[#18181C]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#F4F4F5]">
                  دستورالعمل‌های پایدار
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className="text-xs text-[#7C3AED] hover:text-[#8B5CF6] transition-colors cursor-pointer"
                >
                  ویرایش
                </button>
              </div>

              <p className="text-xs text-[#A1A1AA] leading-relaxed line-clamp-4">
                {currentProject.instructions || 'هیچ دستورالعمل ثابتی ثبت نشده است. می‌توانید قوانین معماری، تست‌ها و محدودیت‌ها را در تنظیمات پروژه اضافه کنید.'}
              </p>
            </div>

            {/* Quick Project CTA */}
            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={handleCreateTaskForProject}
                rightIcon={<Plus className="h-4 w-4" />}
                className="w-full justify-center font-bold"
              >
                ثبت تسک برای این پروژه
              </Button>
            </div>

          </div>

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
            <div className="py-12 text-center border-y border-[#18181B]">
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
            <div className="divide-y divide-[#18181B] border-y border-[#18181B]">
              {projectTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => navigateToTask(t.id)}
                  className="py-4 sm:py-5 -mx-3 px-3 sm:-mx-4 sm:px-4 rounded-md hover:bg-[#0A0A0D] transition-colors cursor-pointer flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-medium text-[#F4F4F5] hover:text-[#7C3AED] transition-colors">
                        {t.title}
                      </span>
                      <StatusIndicator status={t.status} size="sm" />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#71717A]">
                      <span className="tabular-nums font-latin" dir="ltr">{t.id}</span>
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
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: PROJECT SETTINGS & PERSISTENT INSTRUCTIONS
          ========================================================================= */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-8 w-full max-w-3xl animate-nervel-enter">
          
          {isSaved && (
            <div className="p-3.5 rounded-md bg-[#10B981]/10 border border-[#10B981]/30 flex items-center gap-2 text-sm text-[#10B981]">
              <Check className="h-4 w-4 shrink-0" />
              <span>تنظیمات و دستورالعمل‌های پروژه با موفقیت ذخیره شدند.</span>
            </div>
          )}

          {/* Project Metadata */}
          <div className="space-y-4 pb-6 border-b border-[#18181B]">
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
          <div className="space-y-4 pb-6 border-b border-[#18181B]">
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
