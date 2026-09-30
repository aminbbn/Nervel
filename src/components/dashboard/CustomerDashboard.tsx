import React from 'react';
import { useNervel } from '../../context/NervelContext';
import { StatusIndicator } from '../common/StatusIndicator';
import { Button } from '../common/Button';
import { toPersianDigits } from '../../utils/formatters';
import { TaskItem } from '../../types';
import {
  Plus,
  ArrowLeft,
  FolderGit2,
  GitBranch,
  Clock,
  GitPullRequest,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { tasks, projects, setView, navigateToTask, navigateToProject, setSelectedProjectId } = useNervel();

  // 1. Is anything waiting for me?
  // Actionable tasks: tasks requiring customer action (clarification, reserve increase, reassignment, repo access)
  const actionRequiredTasks = tasks.filter(
    (t) =>
      t.actionRequired !== undefined ||
      t.status === 'waiting_for_customer' ||
      t.status === 'reassigning'
  );

  // 2. What is currently running?
  // Active tasks: running, queued, assigning, or validating (excluding completed, failed, cancelled & actionable)
  const activeTasks = tasks.filter(
    (t) =>
      t.status !== 'completed' &&
      t.status !== 'failed' &&
      t.status !== 'cancelled' &&
      t.status !== 'waiting_for_customer' &&
      t.status !== 'reassigning' &&
      !t.actionRequired
  );

  // 3. What recently finished?
  const recentlyCompleted = tasks
    .filter((t) => t.status === 'completed')
    .slice(0, 3);

  // 4. Recent projects from context (lightweight 4 projects)
  const recentProjects = projects.slice(0, 4);

  // Helper for human elapsed time
  const getElapsedDisplay = (task: TaskItem) => {
    if (task.status === 'running') return '۳۵ دقیقه پیش';
    if (task.status === 'validating') return '۵۵ دقیقه پیش';
    if (task.status === 'queued') return '۱۰ دقیقه پیش';
    return task.createdAt.split('-')[1]?.trim() || task.createdAt;
  };

  return (
    <div className="w-full space-y-8 animate-nervel-enter">
      
      {/* =========================================================================
          Top Area: Page Title + Primary CTA (ثبت تسک جدید)
          No KPI cards, no charts, no vanity metrics, no large wallet cards.
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#18181B]">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F4F5]">
            داشبورد
          </h1>
          <p className="text-sm text-[#71717A] mt-1 leading-relaxed">
            مرکز کنترل و نظارت بر چرخه اجرای تسک‌های مهندسی نرم‌افزار
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setSelectedProjectId(null);
            setView('new_task');
          }}
          rightIcon={<Plus className="h-4 w-4" />}
          className="self-start sm:self-auto shrink-0"
        >
          ثبت تسک جدید
        </Button>
      </div>

      {/* =========================================================================
          QUESTION 1: Is anything waiting for me?
          Section: نیازمند اقدام شما
          Displayed ONLY if items require action. If none, hidden entirely.
          No huge warning cards — clean structured rows with title, explanation, action button.
          ========================================================================= */}
      {actionRequiredTasks.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
              <h2 className="text-lg font-bold text-[#F4F4F5]">
                نیازمند اقدام شما
              </h2>
              <span className="text-xs text-[#71717A] tabular-nums">
                ({toPersianDigits(actionRequiredTasks.length)})
              </span>
            </div>
          </div>

          <div className="border border-[#222226] rounded-lg overflow-hidden bg-[#0A0A0D]">
            <div className="divide-y divide-[#18181B]">
              {actionRequiredTasks.map((task) => {
                const action = task.actionRequired;
                const isWaitingClarification = task.status === 'waiting_for_customer';
                const explanation =
                  action?.description ||
                  (isWaitingClarification
                    ? 'ورکر برای ادامه فرآیند کامپایل و تست، نیازمند پاسخ و شفاف‌سازی فنی شماست.'
                    : 'پایش ورکر با قطعی مواجه شده است؛ تصمیم برای انتقال فوری به ورکر جدید لازم است.');

                const actionLabel =
                  action?.actionLabel ||
                  (isWaitingClarification ? 'پاسخ به استعلام' : 'تایید انتقال ورکر');

                return (
                  <div
                    key={task.id}
                    className="p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#0E0E12] transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-base font-medium text-[#F4F4F5]">
                          {task.title}
                        </span>
                        <StatusIndicator status={task.status} size="sm" />
                      </div>

                      <p className="text-sm text-[#A1A1AA] leading-relaxed">
                        {explanation}
                      </p>

                      {task.repoUrl && (
                        <div className="text-xs text-[#71717A] font-latin flex items-center gap-1.5 pt-0.5" dir="ltr">
                          <FolderGit2 className="h-3.5 w-3.5 text-[#52525B]" />
                          <span>{task.repoUrl}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigateToTask(task.id)}
                        leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
                      >
                        {actionLabel}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          QUESTION 2: What is currently running?
          Section: در حال اجرا
          Spacious, structured rows prioritizing:
          - title
          - project
          - customer-facing status
          - elapsed time
          (No worker ID, heartbeat, token counts, or internal clutter)
          ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#F4F4F5]">
              در حال اجرا
            </h2>
            <span className="text-xs text-[#71717A] tabular-nums">
              ({toPersianDigits(activeTasks.length)})
            </span>
          </div>

          {activeTasks.length > 0 && (
            <button
              onClick={() => setView('tasks_list')}
              className="text-sm text-[#71717A] hover:text-[#F4F4F5] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>مشاهده همه تسک‌ها</span>
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {activeTasks.length === 0 ? (
          <div className="border border-[#18181B] rounded-lg p-10 text-center bg-[#08080A]">
            <p className="text-base text-[#71717A]">
              در حال حاضر تسکی در حال اجرا نیست.
            </p>
            <button
              onClick={() => setView('new_task')}
              className="mt-3 text-base text-[#7C3AED] hover:text-[#8B5CF6] font-medium transition-colors cursor-pointer"
            >
              + ثبت تسک جدید
            </button>
          </div>
        ) : (
          <div className="border border-[#18181B] rounded-lg overflow-hidden bg-[#08080A]">
            <div className="divide-y divide-[#18181B]">
              {activeTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => navigateToTask(task.id)}
                  className="p-5 sm:px-6 hover:bg-[#0C0C0F] transition-colors cursor-pointer flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  {/* Task Title & Project */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <h3 className="text-base font-medium text-[#F4F4F5] leading-snug">
                      {task.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-[#71717A]">
                      {task.repoUrl && (
                        <span className="flex items-center gap-1.5 text-[#A1A1AA] font-latin" dir="ltr">
                          <FolderGit2 className="h-3.5 w-3.5 text-[#52525B]" />
                          <span>{task.repoUrl}</span>
                        </span>
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
                    </div>
                  </div>

                  {/* Status & Elapsed Time (Prioritized) */}
                  <div className="flex items-center gap-6 shrink-0 justify-between md:justify-end">
                    <div className="flex items-center gap-4">
                      {/* Customer-facing status */}
                      <StatusIndicator status={task.status} size="md" />

                      {/* Elapsed time */}
                      <div className="flex items-center gap-1 text-sm text-[#71717A]">
                        <Clock className="h-3.5 w-3.5 text-[#52525B]" />
                        <span className="tabular-nums">{getElapsedDisplay(task)}</span>
                      </div>
                    </div>

                    <ArrowLeft className="h-4 w-4 text-[#52525B] group-hover:text-[#F4F4F5] hidden sm:block" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          QUESTION 3: What recently finished?
          Section: اخیراً تکمیل‌شده
          Small number of recent completed tasks with clear deliverable & status
          ========================================================================= */}
      {recentlyCompleted.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#F4F4F5]">
                اخیراً تکمیل‌شده
              </h2>
              <span className="text-xs text-[#71717A] tabular-nums">
                ({toPersianDigits(recentlyCompleted.length)})
              </span>
            </div>

            <button
              onClick={() => setView('tasks_list')}
              className="text-sm text-[#71717A] hover:text-[#F4F4F5] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>مشاهده آرشیو</span>
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="border border-[#18181B] rounded-lg overflow-hidden bg-[#08080A]">
            <div className="divide-y divide-[#18181B]">
              {recentlyCompleted.map((task) => (
                <div
                  key={task.id}
                  onClick={() => navigateToTask(task.id)}
                  className="p-5 sm:px-6 hover:bg-[#0C0C0F] transition-colors cursor-pointer flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <h3 className="text-base font-medium text-[#F4F4F5] leading-snug">
                      {task.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-[#71717A]">
                      {task.repoUrl && (
                        <span className="text-[#A1A1AA] font-latin" dir="ltr">
                          {task.repoUrl}
                        </span>
                      )}

                      {task.deliverables?.prUrl && (
                        <>
                          <span className="text-[#3F3F46]">·</span>
                          <span className="flex items-center gap-1 text-[#A1A1AA]">
                            <GitPullRequest className="h-3.5 w-3.5 text-[#71717A]" />
                            <span>PR آماده ادغام</span>
                          </span>
                        </>
                      )}

                      {task.completedAt && (
                        <>
                          <span className="text-[#3F3F46]">·</span>
                          <span className="tabular-nums">تکمیل: {task.completedAt}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <StatusIndicator status="completed" label="تکمیل شد" size="md" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToTask(task.id);
                      }}
                      leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
                    >
                      مشاهده خروجی
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          RECENT PROJECTS
          Lightweight lower section for quick project access
          ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#F4F4F5]">
              پروژه‌های اخیر
            </h2>
            <span className="text-xs text-[#71717A] tabular-nums">
              ({toPersianDigits(recentProjects.length)})
            </span>
          </div>

          <button
            onClick={() => setView('projects')}
            className="text-sm text-[#71717A] hover:text-[#F4F4F5] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>همه پروژه‌ها</span>
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="border border-[#18181B] rounded-lg overflow-hidden bg-[#08080A]">
          <div className="divide-y divide-[#18181B]">
            {recentProjects.map((proj) => {
              const activeCount = tasks.filter(
                (t) =>
                  proj.repoUrl &&
                  t.repoUrl?.toLowerCase() === proj.repoUrl.toLowerCase() &&
                  t.status !== 'completed' &&
                  t.status !== 'cancelled'
              ).length;

              return (
                <div
                  key={proj.id}
                  onClick={() => navigateToProject(proj.id)}
                  className="p-4 sm:px-6 hover:bg-[#0C0C0F] transition-colors cursor-pointer flex items-center justify-between gap-4 select-none"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <FolderGit2 className="h-4 w-4 text-[#71717A] shrink-0" />
                    <div className="min-w-0">
                      <div className="text-base font-medium text-[#F4F4F5] truncate hover:text-[#7C3AED] transition-colors">
                        {proj.name}
                      </div>
                      {proj.repoUrl ? (
                        <div className="text-xs text-[#71717A] font-latin truncate mt-0.5" dir="ltr">
                          {proj.repoUrl}
                        </div>
                      ) : (
                        <div className="text-xs text-[#71717A] truncate mt-0.5">
                          سورس آرشیو
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {activeCount > 0 && (
                      <span className="hidden sm:inline text-xs text-[#A1A1AA] tabular-nums">
                        {toPersianDigits(activeCount)} تسک فعال
                      </span>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setView('new_task');
                      }}
                      rightIcon={<Plus className="h-3.5 w-3.5" />}
                    >
                      ثبت تسک
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};
