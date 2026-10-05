import React, { useState } from 'react';
import { useNervel } from '../../context/NervelContext';
import { Button } from '../common/Button';
import { SectionHeader } from '../common/SectionHeader';
import { OperationalList } from '../common/OperationalList';
import { OperationalRow } from '../common/OperationalRow';
import { MetadataLine } from '../common/MetadataLine';
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
      <OperationalRow
        key={project.id}
        onClick={() => navigateToProject(project.id)}
        identity={
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h3 className="text-[16px] sm:text-[17px] font-bold text-[#F4F4F5] hover:text-[#7C3AED] transition-colors">
                {project.name}
              </h3>

              {project.sourceType === 'github' ? (
                <span className="text-[11px] text-[#71717A] px-1.5 py-0.2 rounded bg-[#121215] border border-[#222226]" dir="ltr">
                  GitHub
                </span>
              ) : project.sourceType === 'zip' ? (
                <span className="text-[11px] text-[#71717A] px-1.5 py-0.2 rounded bg-[#121215] border border-[#222226]">
                  ZIP
                </span>
              ) : (
                <span className="text-[11px] text-[#71717A] px-1.5 py-0.2 rounded bg-[#121215] border border-[#222226]">
                  فایل مستقیم
                </span>
              )}
            </div>

            <MetadataLine
              items={[
                project.repoUrl
                  ? {
                      icon: <FolderGit2 className="h-3.5 w-3.5" />,
                      label: project.repoUrl,
                      isLtr: true,
                    }
                  : project.zipFilename
                  ? {
                      icon: <FileArchive className="h-3.5 w-3.5" />,
                      label: project.zipFilename,
                      isLtr: true,
                    }
                  : {
                      icon: <FileCode2 className="h-3.5 w-3.5" />,
                      label: 'فایل‌های سورس',
                    },
                project.defaultBranch && {
                  icon: <GitBranch className="h-3 w-3" />,
                  label: project.defaultBranch,
                  isLtr: true,
                },
                {
                  icon: <Clock className="h-3 w-3" />,
                  label: `آخرین فعالیت: ${project.lastActivityAt}`,
                },
              ]}
            />
          </div>
        }
        status={
          <div className="space-y-1">
            {stats.activeCount > 0 ? (
              <span className="flex items-center gap-1.5 text-xs text-[#7C3AED] font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
                <span className="tabular-nums">{toPersianDigits(stats.activeCount)} در حال اجرا</span>
              </span>
            ) : (
              <span className="text-xs text-[#52525B]">تسک فعالی وجود ندارد</span>
            )}

            <div className="text-xs text-[#71717A] tabular-nums">
              {toPersianDigits(stats.totalCount)} تسک در مجموع
            </div>
          </div>
        }
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                togglePinProject(project.id);
              }}
              title={project.isPinned ? 'حذف از نشان‌شده‌ها' : 'نشان کردن پروژه'}
              className={`p-2 rounded transition-colors cursor-pointer flex items-center justify-center ${
                project.isPinned
                  ? 'text-[#7C3AED] bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20'
                  : 'text-[#52525B] hover:text-[#A1A1AA] hover:bg-[#141418]'
              }`}
            >
              <Pin className={`h-4 w-4 ${project.isPinned ? 'fill-current' : ''}`} />
            </button>

            <ArrowLeft className="h-4 w-4 text-[#52525B] group-hover:text-[#F4F4F5] transition-colors" />
          </div>
        }
      />
    );
  };

  return (
    <div className="w-full space-y-8 animate-nervel-enter">
      
      {/* Page Header as ONE horizontal composition */}
      <div className="flex flex-row items-center justify-between gap-4 pb-2 border-b border-[#18181C]">
        <div>
          <h1 className="text-2xl sm:text-[26px] font-bold text-[#F4F4F5]">
            پروژه‌ها
          </h1>
          <p className="text-sm text-[#71717A] mt-1 leading-relaxed">
            فضای کاری متمرکز برای نگهداری سورس‌کد، تاریخچه تسک‌ها و دستورالعمل‌های پایدار هر کدبیس
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          rightIcon={<Plus className="h-4 w-4" />}
          className="shrink-0 font-medium"
        >
          پروژه جدید
        </Button>
      </div>

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

      {/* Pinned Projects Section */}
      {pinnedProjects.length > 0 && (
        <section className="space-y-2">
          <SectionHeader
            title="پروژه‌های نشان‌شده"
            count={toPersianDigits(pinnedProjects.length)}
            semanticDot="bg-[#7C3AED]"
          />

          <OperationalList>
            {pinnedProjects.map(renderProjectRow)}
          </OperationalList>
        </section>
      )}

      {/* All Projects Section */}
      <section className="space-y-2">
        <SectionHeader
          title={pinnedProjects.length > 0 ? 'سایر پروژه‌ها' : 'همه پروژه‌ها'}
          count={toPersianDigits(unpinnedProjects.length)}
        />

        {filteredProjects.length === 0 ? (
          <div className="py-12 text-center border-y border-[#18181C]">
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
          <OperationalList>
            {unpinnedProjects.map(renderProjectRow)}
          </OperationalList>
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
