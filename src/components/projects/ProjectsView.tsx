import React, { useState } from 'react';
import { useNervel } from '../../context/NervelContext';
import { PageHeader } from '../common/PageHeader';
import { Button } from '../common/Button';
import { CreateProjectModal } from './CreateProjectModal';
import { toPersianDigits } from '../../utils/formatters';
import {
  FolderGit2,
  GitBranch,
  Plus,
  Pin,
  Search,
  Clock,
  ArrowLeft,
  FileArchive,
  FileCode2,
} from 'lucide-react';
import { Project } from '../../types';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    tasks,
    togglePinProject,
    navigateToProject,
    setView,
  } = useNervel();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter projects by search
  const filteredProjects = projects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.repoUrl && p.repoUrl.toLowerCase().includes(q)) ||
      p.instructions.toLowerCase().includes(q)
    );
  });

  // Separate pinned and all projects
  const pinnedProjects = filteredProjects.filter((p) => p.isPinned);
  const unpinnedProjects = filteredProjects.filter((p) => !p.isPinned);

  // Helper to count active and total tasks for a project
  const getProjectTaskStats = (proj: Project) => {
    const projTasks = tasks.filter((t) => {
      if (proj.repoUrl && t.repoUrl) {
        return t.repoUrl.toLowerCase() === proj.repoUrl.toLowerCase();
      }
      return false;
    });

    const activeCount = projTasks.filter(
      (t) => t.status !== 'completed' && t.status !== 'cancelled'
    ).length;

    return {
      activeCount,
      totalCount: projTasks.length,
    };
  };

  const renderProjectRow = (project: Project) => {
    const stats = getProjectTaskStats(project);

    return (
      <div
        key={project.id}
        onClick={() => navigateToProject(project.id)}
        className="p-5 sm:px-6 hover:bg-[#0C0C0F] transition-colors cursor-pointer flex flex-col md:flex-row md:items-center md:justify-between gap-4 select-none"
      >
        {/* Name and Source */}
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-medium text-[#F4F4F5] hover:text-[#7C3AED] transition-colors">
              {project.name}
            </h3>

            {project.sourceType === 'github' ? (
              <span className="text-xs text-[#71717A] px-2 py-0.5 rounded bg-[#121215] border border-[#222226]" dir="ltr">
                GitHub
              </span>
            ) : project.sourceType === 'zip' ? (
              <span className="text-xs text-[#71717A] px-2 py-0.5 rounded bg-[#121215] border border-[#222226]">
                ZIP
              </span>
            ) : (
              <span className="text-xs text-[#71717A] px-2 py-0.5 rounded bg-[#121215] border border-[#222226]">
                فایل مستقیم
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-[13px] text-[#71717A]">
            {project.repoUrl ? (
              <span className="flex items-center gap-1.5 text-[#A1A1AA] font-latin" dir="ltr">
                <FolderGit2 className="h-3.5 w-3.5 text-[#52525B]" />
                <span>{project.repoUrl}</span>
              </span>
            ) : project.zipFilename ? (
              <span className="flex items-center gap-1.5 text-[#A1A1AA] font-latin" dir="ltr">
                <FileArchive className="h-3.5 w-3.5 text-[#52525B]" />
                <span>{project.zipFilename}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[#A1A1AA]">
                <FileCode2 className="h-3.5 w-3.5 text-[#52525B]" />
                <span>فایل‌های سورس</span>
              </span>
            )}

            {project.defaultBranch && (
              <>
                <span className="text-[#3F3F46]">·</span>
                <span className="flex items-center gap-1 font-latin" dir="ltr">
                  <GitBranch className="h-3 w-3 text-[#52525B]" />
                  <span>{project.defaultBranch}</span>
                </span>
              </>
            )}

            <span className="text-[#3F3F46]">·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-[#52525B]" />
              <span>آخرین فعالیت: {project.lastActivityAt}</span>
            </span>
          </div>
        </div>

        {/* Task Counts, Pin & Actions */}
        <div className="flex items-center justify-between md:justify-end gap-5 shrink-0">
          <div className="flex items-center gap-4 text-xs sm:text-sm">
            {stats.activeCount > 0 && (
              <span className="flex items-center gap-1.5 text-[#7C3AED] font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED]" />
                <span className="tabular-nums">{toPersianDigits(stats.activeCount)} در حال اجرا</span>
              </span>
            )}

            <span className="text-[#71717A] tabular-nums">
              {toPersianDigits(stats.totalCount)} تسک کل
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Pin Toggle Control */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                togglePinProject(project.id);
              }}
              title={project.isPinned ? 'حذف از نشان‌شده‌ها' : 'نشان کردن پروژه'}
              className={`p-2 rounded-md transition-colors cursor-pointer ${
                project.isPinned
                  ? 'text-[#7C3AED] bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20'
                  : 'text-[#52525B] hover:text-[#A1A1AA] hover:bg-[#141418]'
              }`}
            >
              <Pin className={`h-4 w-4 ${project.isPinned ? 'fill-current' : ''}`} />
            </button>

            <ArrowLeft className="h-4 w-4 text-[#52525B] hidden sm:block" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-8 animate-nervel-enter">
      
      {/* Page Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'NERVEL' },
          { label: 'پروژه‌ها' },
        ]}
        title="پروژه‌ها"
        description="فضای کاری متمرکز برای نگهداری سورس‌کد، تاریخچه تسک‌ها و دستورالعمل‌های پایدار هر کدبیس"
        actions={
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            rightIcon={<Plus className="h-4 w-4" />}
          >
            پروژه جدید
          </Button>
        }
      />

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جستجو در پروژه‌ها و مخازن..."
          className="w-full h-10 bg-[#09090C] border border-[#222226] hover:border-[#2E2E33] focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] rounded-md pr-9 pl-4 text-sm text-[#F4F4F5] placeholder-[#52525B] transition-colors focus:outline-none"
        />
        <Search className="absolute right-3 top-3 h-4 w-4 text-[#71717A] pointer-events-none" />
      </div>

      {/* Pinned Projects Section (First on Projects page if any) */}
      {pinnedProjects.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 pb-1">
            <Pin className="h-4 w-4 text-[#7C3AED] fill-current" />
            <h2 className="text-lg font-bold text-[#F4F4F5]">
              پروژه‌های نشان‌شده
            </h2>
            <span className="text-xs text-[#71717A] tabular-nums">
              ({toPersianDigits(pinnedProjects.length)})
            </span>
          </div>

          <div className="border border-[#1E1E22] rounded-lg overflow-hidden bg-[#08080A]">
            <div className="divide-y divide-[#18181B]">
              {pinnedProjects.map(renderProjectRow)}
            </div>
          </div>
        </section>
      )}

      {/* All Projects Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#F4F4F5]">
              {pinnedProjects.length > 0 ? 'سایر پروژه‌ها' : 'همه پروژه‌ها'}
            </h2>
            <span className="text-xs text-[#71717A] tabular-nums">
              ({toPersianDigits(unpinnedProjects.length)})
            </span>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="border border-[#18181B] rounded-lg p-12 text-center bg-[#08080A]">
            <p className="text-sm text-[#71717A]">
              پروژه‌ای مطابق با جستجوی شما یافت نشد.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-3 text-sm text-[#7C3AED] hover:text-[#8B5CF6] font-medium transition-colors cursor-pointer"
            >
              + ایجاد پروژه جدید
            </button>
          </div>
        ) : (
          <div className="border border-[#18181B] rounded-lg overflow-hidden bg-[#08080A]">
            <div className="divide-y divide-[#18181B]">
              {unpinnedProjects.map(renderProjectRow)}
            </div>
          </div>
        )}
      </section>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
