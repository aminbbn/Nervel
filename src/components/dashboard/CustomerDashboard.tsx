import React from 'react';
import { useNervel } from '../../context/NervelContext';
import { StatusIndicator } from '../common/StatusIndicator';
import { Button } from '../common/Button';
import { SectionHeader } from '../common/SectionHeader';
import { OperationalList } from '../common/OperationalList';
import { OperationalRow } from '../common/OperationalRow';
import { ActionRequiredRow } from '../common/ActionRequiredRow';
import { MetadataLine } from '../common/MetadataLine';
import { toPersianDigits } from '../../utils/formatters';
import { TaskItem, Project } from '../../types';
import {
  Plus,
  ArrowLeft,
  FolderGit2,
  GitBranch,
  Clock,
  GitPullRequest,
  CheckCircle2,
  FileCode2,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const {
    tasks,
    projects,
    setView,
    navigateToTask,
    navigateToProject,
    setSelectedProjectId,
  } = useNervel();

  // 1. Actionable tasks: tasks requiring customer intervention
  const actionRequiredTasks = tasks.filter(
    (t) =>
      t.actionRequired !== undefined ||
      t.status === 'waiting_for_customer' ||
      t.status === 'reassigning'
  );

  // 2. Active tasks: running, queued, assigning, or validating
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

  // 4. Recent projects (4 projects)
  const recentProjects = projects.slice(0, 4);

  // Helper for human elapsed time
  const getElapsedDisplay = (task: TaskItem) => {
    if (task.status === 'running') return '۳۵ دقیقه پیش';
    if (task.status === 'validating') return '۵۵ دقیقه پیش';
    if (task.status === 'queued') return '۱۰ دقیقه پیش';
    return task.createdAt.split('-')[1]?.trim() || task.createdAt;
  };

  // Helper for project active count
  const getProjectActiveCount = (project: Project) => {
    return tasks.filter(
      (t) =>
        project.repoUrl &&
        t.repoUrl?.toLowerCase() === project.repoUrl.toLowerCase() &&
        t.status !== 'completed' &&
        t.status !== 'cancelled'
    ).length;
  };

  return (
    <div className="w-full space-y-8 sm:space-y-10 animate-nervel-enter">
      
      {/* =========================================================================
          PAGE HEADER: Rebuilt as ONE horizontal composition
          RIGHT: Dashboard title + secondary subtitle
          LEFT: Primary action [ثبت تسک جدید]
          ========================================================================= */}
      <div className="flex flex-row items-center justify-between gap-4 pb-2">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-[26px] font-bold text-[#F4F4F5] tracking-tight">
            داشبورد
          </h1>
          <p className="text-sm text-[#71717A] mt-1 leading-relaxed">
            وضعیت تسک‌ها و پروژه‌های شما
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setSelectedProjectId(null);
            setView('new_task');
          }}
          rightIcon={<Plus className="h-4 w-4" />}
          className="shrink-0 font-medium"
        >
          ثبت تسک جدید
        </Button>
      </div>

      {/* =========================================================================
          SECTION 1 — NEEDS ACTION (Highest Priority)
          Rendered ONLY when items exist. NO large alert boxes or amber backgrounds.
          Restrained rows using consistent 12-column grid.
          ========================================================================= */}
      {actionRequiredTasks.length > 0 && (
        <section className="space-y-2">
          <SectionHeader
            title="نیازمند اقدام شما"
            count={toPersianDigits(actionRequiredTasks.length)}
            semanticDot="bg-[#F59E0B]"
            action={
              <button
                onClick={() => setView('tasks_list')}
                className="hover:text-[#F4F4F5] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>مشاهده همه</span>
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
            }
          />

          <OperationalList>
            {actionRequiredTasks.map((task) => {
              const action = task.actionRequired;
              const isWaitingClarification = task.status === 'waiting_for_customer';
              const explanation =
                action?.description ||
                (isWaitingClarification
                  ? 'ورکر برای ادامه فرآیند کامپایل و تست، نیازمند پاسخ و شفاف‌سازی فنی شماست.'
                  : 'پایش ورکر با قطعی مواجه شده است؛ تایید انتقال تسک به ورکر بعدی شبکه لازم است.');

              const actionLabel =
                action?.actionLabel ||
                (isWaitingClarification ? 'ارسال پاسخ و ادامه اجرا' : 'تایید انتقال ورکر');

              const statusLabel =
                isWaitingClarification ? 'منتظر پاسخ شما' : 'بررسی انتقال ورکر';

              return (
                <ActionRequiredRow
                  key={task.id}
                  title={task.title}
                  explanation={explanation}
                  statusLabel={statusLabel}
                  onClick={() => navigateToTask(task.id)}
                  source={
                    <MetadataLine
                      items={[
                        task.repoUrl && {
                          icon: <FolderGit2 className="h-3.5 w-3.5" />,
                          label: task.repoUrl,
                          isLtr: true,
                        },
                        task.branch && {
                          icon: <GitBranch className="h-3 w-3" />,
                          label: task.branch,
                          isLtr: true,
                        },
                      ]}
                    />
                  }
                  actionButton={
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToTask(task.id);
                      }}
                      leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
                    >
                      {actionLabel}
                    </Button>
                  }
                />
              );
            })}
          </OperationalList>
        </section>
      )}

      {/* =========================================================================
          SECTION 2 — ACTIVE TASKS
          12-column grid row discipline:
          Cols 1–6: Task title + Repo/Branch
          Cols 7–9: Status + Elapsed time
          Cols 10–12: Left-aligned action / chevron
          ========================================================================= */}
      <section className="space-y-2">
        <SectionHeader
          title="در حال اجرا"
          count={toPersianDigits(activeTasks.length)}
          action={
            activeTasks.length > 0 ? (
              <button
                onClick={() => setView('tasks_list')}
                className="hover:text-[#F4F4F5] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>مشاهده همه تسک‌ها</span>
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
            ) : undefined
          }
        />

        {activeTasks.length === 0 ? (
          <div className="py-10 text-center border-y border-[#18181C]">
            <p className="text-sm text-[#71717A]">
              در حال حاضر تسکی در حال اجرا نیست.
            </p>
            <button
              onClick={() => {
                setSelectedProjectId(null);
                setView('new_task');
              }}
              className="mt-2 text-sm text-[#7C3AED] hover:text-[#8B5CF6] font-medium transition-colors cursor-pointer"
            >
              + ثبت تسک جدید
            </button>
          </div>
        ) : (
          <OperationalList>
            {activeTasks.map((task) => (
              <OperationalRow
                key={task.id}
                onClick={() => navigateToTask(task.id)}
                identity={
                  <div className="space-y-1">
                    <h3 className="text-[16px] sm:text-[17px] font-bold text-[#F4F4F5] leading-snug group-hover:text-[#A78BFA] transition-colors">
                      {task.title}
                    </h3>
                    <MetadataLine
                      items={[
                        task.repoUrl && {
                          icon: <FolderGit2 className="h-3.5 w-3.5" />,
                          label: task.repoUrl,
                          isLtr: true,
                        },
                        task.branch && {
                          icon: <GitBranch className="h-3 w-3" />,
                          label: task.branch,
                          isLtr: true,
                        },
                      ]}
                    />
                  </div>
                }
                status={
                  <div className="space-y-1">
                    <StatusIndicator status={task.status} size="md" />
                    <div className="flex items-center gap-1.5 text-xs text-[#71717A] tabular-nums">
                      <Clock className="h-3 w-3 text-[#52525B]" />
                      <span>{getElapsedDisplay(task)}</span>
                    </div>
                  </div>
                }
                action={
                  <div className="flex items-center gap-1.5 text-xs text-[#71717A] group-hover:text-[#F4F4F5] transition-colors">
                    <span>مشاهده وضعیت</span>
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </div>
                }
              />
            ))}
          </OperationalList>
        )}
      </section>

      {/* =========================================================================
          SECTION 3 — RECENTLY COMPLETED
          Uses the exact same 12-column OperationalRow primitive as Active Tasks!
          Green semantic dot only, no colored card backgrounds.
          ========================================================================= */}
      {recentlyCompleted.length > 0 && (
        <section className="space-y-2">
          <SectionHeader
            title="اخیراً تکمیل‌شده"
            count={toPersianDigits(recentlyCompleted.length)}
            action={
              <button
                onClick={() => setView('tasks_list')}
                className="hover:text-[#F4F4F5] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>مشاهده آرشیو</span>
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
            }
          />

          <OperationalList>
            {recentlyCompleted.map((task) => (
              <OperationalRow
                key={task.id}
                onClick={() => navigateToTask(task.id)}
                identity={
                  <div className="space-y-1">
                    <h3 className="text-[16px] sm:text-[17px] font-bold text-[#F4F4F5] leading-snug group-hover:text-[#A78BFA] transition-colors">
                      {task.title}
                    </h3>
                    <MetadataLine
                      items={[
                        task.repoUrl && {
                          icon: <FolderGit2 className="h-3.5 w-3.5" />,
                          label: task.repoUrl,
                          isLtr: true,
                        },
                        task.deliverables?.prUrl && {
                          icon: <GitPullRequest className="h-3.5 w-3.5 text-[#10B981]" />,
                          label: 'Pull Request آماده ادغام',
                        },
                      ]}
                    />
                  </div>
                }
                status={
                  <div className="space-y-1">
                    <StatusIndicator status="completed" label="تکمیل شد" size="md" />
                    <div className="text-xs text-[#71717A] tabular-nums">
                      {task.completedAt || 'امروز، ۱۴:۳۲'}
                    </div>
                  </div>
                }
                action={
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
                }
              />
            ))}
          </OperationalList>
        </section>
      )}

      {/* =========================================================================
          SECTION 4 — RECENT PROJECTS
          Structured 2-column layout on desktop:
          Makes intelligent use of wide viewport without card gallery noise.
          ========================================================================= */}
      <section className="space-y-2">
        <SectionHeader
          title="پروژه‌های اخیر"
          count={toPersianDigits(recentProjects.length)}
          action={
            <button
              onClick={() => setView('projects')}
              className="hover:text-[#F4F4F5] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>همه پروژه‌ها</span>
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
          }
        />

        <div className="border-y border-[#18181C]">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-[#18181C]">
            {/* Split recent projects across two columns */}
            {[
              recentProjects.slice(0, Math.ceil(recentProjects.length / 2)),
              recentProjects.slice(Math.ceil(recentProjects.length / 2)),
            ].map((columnProjects, colIdx) => (
              <div
                key={colIdx}
                className={`divide-y divide-[#18181C] ${
                  colIdx === 0 ? 'lg:pl-6' : 'lg:pr-6'
                }`}
              >
                {columnProjects.map((proj) => {
                  const activeCount = getProjectActiveCount(proj);

                  return (
                    <div
                      key={proj.id}
                      onClick={() => navigateToProject(proj.id)}
                      className="py-4.5 px-3 -mx-3 rounded-md hover:bg-[#0C0C10] transition-colors cursor-pointer flex items-center justify-between gap-4 select-none group"
                    >
                      {/* Project identity */}
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2.5">
                          <FolderGit2 className="h-4 w-4 text-[#71717A] shrink-0 group-hover:text-[#7C3AED] transition-colors" />
                          <h3 className="text-base font-bold text-[#F4F4F5] group-hover:text-[#A78BFA] transition-colors truncate">
                            {proj.name}
                          </h3>
                        </div>

                        <MetadataLine
                          items={[
                            proj.repoUrl
                              ? {
                                  label: proj.repoUrl,
                                  isLtr: true,
                                }
                              : {
                                  icon: <FileCode2 className="h-3 w-3" />,
                                  label: 'سورس مستقیم',
                                },
                            proj.defaultBranch && {
                              icon: <GitBranch className="h-3 w-3" />,
                              label: proj.defaultBranch,
                              isLtr: true,
                            },
                          ]}
                        />
                      </div>

                      {/* Right metadata / quick action */}
                      <div className="flex items-center gap-3 shrink-0">
                        {activeCount > 0 ? (
                          <span className="text-xs text-[#7C3AED] font-medium tabular-nums flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
                            <span>{toPersianDigits(activeCount)} در حال اجرا</span>
                          </span>
                        ) : (
                          <span className="text-xs text-[#52525B] tabular-nums">
                            {proj.lastActivityAt}
                          </span>
                        )}

                        <ArrowLeft className="h-3.5 w-3.5 text-[#52525B] group-hover:text-[#F4F4F5] transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
