import React, { useState, useId } from 'react';
import { useNervel } from '../../context/NervelContext';
import { toast } from '../../context/ToastContext';
import { InputSourceType } from '../../types';
import { formatToman, toPersianDigits } from '../../utils/formatters';
import { Button } from '../common/Button';
import { getAllModels, getModelById } from '../../services/modelRegistry';
import { estimateTaskPricing } from '../../services/pricingService';
import {
  FolderGit2,
  FolderArchive,
  Files,
  GitBranch,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export const CreateTaskView: React.FC = () => {
  const {
    walletBalance,
    createNewTask,
    setView,
    setIsTopUpModalOpen,
    projects,
    selectedProjectId,
    setSelectedProjectId,
  } = useNervel();

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Section 1: Project & Source State
  const [isChangingProject, setIsChangingProject] = useState<boolean>(!selectedProjectId);
  const [selectedProjId, setSelectedProjId] = useState<string>(activeProject?.id || '');
  const [useCustomSource, setUseCustomSource] = useState<boolean>(false);
  const [customSourceType, setCustomSourceType] = useState<InputSourceType>('github');
  const [repoUrl, setRepoUrl] = useState<string>(activeProject?.repoUrl || 'parsa-tech/payment-gateway-service');
  const [branch, setBranch] = useState<string>(activeProject?.defaultBranch || 'main');
  const [zipFileName, setZipFileName] = useState<string>(activeProject?.zipFilename || '');
  const [directFiles, setDirectFiles] = useState<string[]>(['src/index.ts', 'src/services/api.ts']);
  const [newDirectFileName, setNewDirectFileName] = useState<string>('');

  // Section 2: Request State
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [hasAcceptedAmbiguity, setHasAcceptedAmbiguity] = useState<boolean>(false);
  const [customAcceptanceCriteria, setCustomAcceptanceCriteria] = useState<string[]>([
    'تست‌های واحد مربوط به تغییرات پاس شوند',
    'سازگاری با کدهای موجود حفظ شود',
  ]);
  const [newCriterion, setNewCriterion] = useState<string>('');

  // Section 3: Model & Execution State
  const [selectedModelId, setSelectedModelId] = useState<string>('claude-3-7-sonnet');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);

  // Advanced settings fields
  const [targetBranch, setTargetBranch] = useState<string>('feat/nervel-update');
  const [outputPreference, setOutputPreference] = useState<'pr' | 'patch' | 'zip'>('pr');
  const [testCommand, setTestCommand] = useState<string>('npm test');
  const [extraConstraints, setExtraConstraints] = useState<string>('عدم تغییر در فایل‌های مایگریشن دیتابیس بدون هماهنگی');
  const [workerFailurePolicy, setWorkerFailurePolicy] = useState<'ask_then_auto' | 'instant' | 'wait_forever'>('ask_then_auto');

  // ID generators
  const titleInputId = useId();
  const descTextareaId = useId();
  const repoInputId = useId();
  const branchInputId = useId();

  const currentProject = useCustomSource
    ? null
    : projects.find((p) => p.id === selectedProjId) || activeProject;

  const selectedModel = getModelById(selectedModelId);

  // Pricing calculation via isolated Pricing Service (replaces hardcoded formula)
  const { estimatedCost, reservedCap } = estimateTaskPricing(selectedModelId, description.length);
  const hasSufficientBalance = walletBalance >= reservedCap;
  const missingBalance = Math.max(0, reservedCap - walletBalance);

  // Ambiguity Analysis
  const trimmedDesc = description.trim();
  const isPromptTooShort = trimmedDesc.length > 0 && trimmedDesc.length < 35;
  const lacksExpectedResult =
    trimmedDesc.length > 0 &&
    !trimmedDesc.includes('نتیجه') &&
    !trimmedDesc.includes('خروجی') &&
    !trimmedDesc.includes('انتظار') &&
    !trimmedDesc.includes('باید');

  const hasAmbiguityWarning =
    !hasAcceptedAmbiguity && (isPromptTooShort || (trimmedDesc.length >= 35 && lacksExpectedResult));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error('شرح خواسته الزامی است', 'لطفاً شرح خواسته یا باگ مورد نظر برای تسک را وارد کنید.');
      return;
    }

    if (!hasSufficientBalance) {
      toast.warning('موجودی کیف پول کافی نیست', {
        description: `جهت رزرو سقف تسک، مبلغ ${formatToman(missingBalance)} کسری وجود دارد.`,
        action: {
          label: 'افزایش اعتبار',
          onClick: () => setIsTopUpModalOpen(true),
        },
      });
      return;
    }

    const effectiveInputType: InputSourceType = useCustomSource
      ? customSourceType
      : currentProject?.sourceType || 'github';

    const effectiveRepo = useCustomSource
      ? customSourceType === 'github'
        ? repoUrl
        : undefined
      : currentProject?.repoUrl;

    const effectiveBranch = useCustomSource
      ? customSourceType === 'github'
        ? branch
        : undefined
      : currentProject?.defaultBranch || 'main';

    const effectiveUploadedFiles = useCustomSource
      ? customSourceType === 'zip'
        ? [zipFileName || 'project-source.zip']
        : customSourceType === 'direct'
        ? directFiles
        : undefined
      : currentProject?.zipFilename
      ? [currentProject.zipFilename]
      : undefined;

    createNewTask({
      title: title.trim() || description.trim().slice(0, 50),
      description: description.trim(),
      acceptanceCriteria: customAcceptanceCriteria,
      inputType: effectiveInputType,
      repoUrl: effectiveRepo,
      branch: effectiveBranch,
      targetBranch,
      uploadedFiles: effectiveUploadedFiles,
      modelId: selectedModel.id,
      modelName: selectedModel.name,
      isSystemRecommended: selectedModel.recommended,
      estimatedCost,
      reservedCap,
      reassignStrategy: workerFailurePolicy,
      projectId: currentProject?.id,
    });
  };

  const handleAddCriterion = () => {
    if (newCriterion.trim()) {
      setCustomAcceptanceCriteria([...customAcceptanceCriteria, newCriterion.trim()]);
      setNewCriterion('');
    }
  };

  const handleRemoveCriterion = (index: number) => {
    setCustomAcceptanceCriteria(customAcceptanceCriteria.filter((_, idx) => idx !== index));
  };

  return (
    <div className="w-full space-y-8 animate-nervel-enter">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#18181C]">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F4F5]">
            ثبت تسک جدید
          </h1>
          <p className="text-sm text-[#71717A] mt-1.5 leading-relaxed">
            مشخصات تسک مهندسی را وارد کنید؛ زمان‌بند مرکزی ورکر مناسب را برای اجرا انتخاب می‌کند.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setView('dashboard')}
          className="inline-flex items-center gap-1.5 text-xs text-[#71717A] hover:text-[#D4D4D8] transition-colors self-start sm:self-auto cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>انصراف و بازگشت</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* =========================================================================
            AREA 1: پروژه (Project)
            ========================================================================= */}
        <section className="space-y-4 pb-8 border-b border-[#18181C]">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#F4F4F5]">
              ۱. پروژه و سورس‌کد
            </h2>

            {!isChangingProject && currentProject && (
              <button
                type="button"
                onClick={() => setIsChangingProject(true)}
                className="text-xs font-medium text-[#7C3AED] hover:text-[#9055FF] transition-colors cursor-pointer"
              >
                تغییر پروژه
              </button>
            )}
          </div>

          {!isChangingProject && currentProject ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm py-2">
              <div className="flex items-center gap-3">
                <FolderGit2 className="w-4 h-4 text-[#7C3AED] shrink-0" />
                <span className="font-medium text-[#F4F4F5]">{currentProject.name}</span>
                <span className="text-[#3F3F46]">·</span>
                <span className="text-[#A1A1AA] font-latin" dir="ltr">
                  {currentProject.repoUrl || currentProject.zipFilename || 'فایل‌های مستقیم'}
                </span>
                {currentProject.defaultBranch && (
                  <>
                    <span className="text-[#3F3F46]">·</span>
                    <span className="text-[#71717A] font-latin" dir="ltr">{currentProject.defaultBranch}</span>
                  </>
                )}
              </div>

              <span className="text-xs text-[#10B981] flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                محیط آماده
              </span>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setUseCustomSource(false)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer border ${
                    !useCustomSource
                      ? 'bg-[#18181C] text-[#F4F4F5] border-[#2E2E34]'
                      : 'text-[#71717A] hover:text-[#D4D4D8] border-transparent'
                  }`}
                >
                  پروژه‌های متصل ({toPersianDigits(projects.length)})
                </button>
                <button
                  type="button"
                  onClick={() => setUseCustomSource(true)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer border ${
                    useCustomSource
                      ? 'bg-[#18181C] text-[#F4F4F5] border-[#2E2E34]'
                      : 'text-[#71717A] hover:text-[#D4D4D8] border-transparent'
                  }`}
                >
                  منبع جدید
                </button>
              </div>

              {!useCustomSource ? (
                <div className="flex items-center gap-3 max-w-lg">
                  <select
                    value={selectedProjId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedProjId(id);
                      setSelectedProjectId(id);
                      setIsChangingProject(false);
                    }}
                    className="flex-1 h-10 bg-[#09090C] border border-[#27272A] rounded px-3 text-xs sm:text-sm text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none cursor-pointer"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#0C0C0F] text-[#F4F4F5]">
                        {p.name} ({p.repoUrl || 'سورس لوکال'})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsChangingProject(false)}
                    className="text-xs text-[#71717A] hover:text-[#D4D4D8] px-2 py-1 cursor-pointer"
                  >
                    بستن
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  <div className="flex gap-2">
                    {[
                      { id: 'github', label: 'مخزن GitHub', icon: FolderGit2 },
                      { id: 'zip', label: 'فایل ZIP', icon: FolderArchive },
                      { id: 'direct', label: 'فایل‌های مستقیم', icon: Files },
                    ].map((src) => {
                      const IconComp = src.icon;
                      return (
                        <button
                          key={src.id}
                          type="button"
                          onClick={() => setCustomSourceType(src.id as InputSourceType)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer border ${
                            customSourceType === src.id
                              ? 'bg-[#18181C] text-[#F4F4F5] border-[#2E2E34]'
                              : 'text-[#71717A] hover:text-[#D4D4D8] border-transparent'
                          }`}
                        >
                          <IconComp className="w-3.5 h-3.5" />
                          <span>{src.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {customSourceType === 'github' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <input
                          id={repoInputId}
                          type="text"
                          dir="ltr"
                          placeholder="org/repo-name"
                          value={repoUrl}
                          onChange={(e) => setRepoUrl(e.target.value)}
                          className="w-full h-10 rounded border border-[#27272A] bg-[#09090C] px-3 text-xs text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none"
                        />
                      </div>
                      <div>
                        <input
                          id={branchInputId}
                          type="text"
                          dir="ltr"
                          placeholder="main"
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                          className="w-full h-10 rounded border border-[#27272A] bg-[#09090C] px-3 text-xs text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {customSourceType === 'zip' && (
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="archive-source.zip"
                      value={zipFileName}
                      onChange={(e) => setZipFileName(e.target.value)}
                      className="w-full h-10 rounded border border-[#27272A] bg-[#09090C] px-3 text-xs text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none"
                    />
                  )}

                  {customSourceType === 'direct' && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          dir="ltr"
                          placeholder="src/server/index.ts"
                          value={newDirectFileName}
                          onChange={(e) => setNewDirectFileName(e.target.value)}
                          className="flex-1 h-10 rounded border border-[#27272A] bg-[#09090C] px-3 text-xs text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newDirectFileName.trim()) {
                              setDirectFiles([...directFiles, newDirectFileName.trim()]);
                              setNewDirectFileName('');
                            }
                          }}
                          className="h-10 px-3 rounded border border-[#27272A] bg-[#121215] text-xs font-medium text-[#F4F4F5] hover:bg-[#18181D] cursor-pointer"
                        >
                          افزودن
                        </button>
                      </div>

                      {directFiles.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {directFiles.map((file, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs text-[#D4D4D8] bg-[#141418] border border-[#222226] rounded"
                            >
                              <span dir="ltr">{file}</span>
                              <button
                                type="button"
                                onClick={() => setDirectFiles(directFiles.filter((_, i) => i !== idx))}
                                className="text-[#71717A] hover:text-[#EF4444] cursor-pointer"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {/* =========================================================================
            AREA 2: درخواست (Request)
            ========================================================================= */}
        <section className="space-y-4 pb-8 border-b border-[#18181C]">
          <div>
            <h2 className="text-base font-bold text-[#F4F4F5]">
              ۲. دستورالعمل و شرح تغییرات
            </h2>
            <p className="text-xs text-[#71717A] mt-0.5">
              رفتار مدنظر، فایل‌های درگیر و نیازمندی‌های کیفی تسک را مشخص کنید.
            </p>
          </div>

          {/* Title Input */}
          <div className="space-y-1">
            <label htmlFor={titleInputId} className="block text-xs font-medium text-[#A1A1AA]">
              عنوان تسک (کوتاه و فنی):
            </label>
            <input
              id={titleInputId}
              type="text"
              placeholder="مثال: پیاده‌سازی کش Redis برای ماژول تسویه‌حساب"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 bg-[#09090C] border border-[#27272A] focus:border-[#7C3AED] rounded px-3 text-sm text-[#F4F4F5] placeholder-[#52525B] focus:outline-none transition-colors"
            />
          </div>

          {/* Prompt Textarea */}
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <label htmlFor={descTextareaId} className="block text-xs font-medium text-[#A1A1AA]">
                شرح دقیق کار و نتیجه مورد انتظار:
              </label>
              <span className="text-xs text-[#71717A] tabular-nums">
                {toPersianDigits(description.length)} کاراکتر
              </span>
            </div>

            <textarea
              id={descTextareaId}
              rows={5}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (hasAcceptedAmbiguity) setHasAcceptedAmbiguity(false);
              }}
              required
              placeholder="توضیح دهید چه رفتاری مد نظر است، چه فایل‌هایی را در نظر دارید، چه متغیرها یا تست‌هایی باید پوشش داده شوند و چه بخش‌هایی از ساختار فعلی نباید تغییر یابند..."
              className="w-full bg-[#08080A] border border-[#27272A] hover:border-[#38383E] focus:border-[#7C3AED] rounded p-3 text-sm text-[#F4F4F5] placeholder-[#52525B] focus:outline-none transition-colors leading-relaxed min-h-[140px] resize-y"
            />
          </div>

          {/* Ambiguity notice */}
          {hasAmbiguityWarning && (
            <div className="p-3 rounded bg-[#161208] border border-[#382E1E] text-xs space-y-2 text-[#E4D4B8]">
              <div className="flex items-center gap-1.5 text-[#F59E0B] font-medium">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>درخواست نیاز به شفاف‌سازی بیشتر دارد (برای کاهش خطا و زمان اجرا).</span>
              </div>
              <button
                type="button"
                onClick={() => setHasAcceptedAmbiguity(true)}
                className="text-xs text-[#A89270] hover:text-[#E4D4B8] underline transition-colors cursor-pointer"
              >
                ادامه با همین متن
              </button>
            </div>
          )}

          {/* Acceptance Criteria (QA) */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-medium text-[#A1A1AA]">
              معیارهای پذیرش و تست (QA):
            </label>

            <div className="space-y-1.5">
              {customAcceptanceCriteria.map((crit, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5 px-3 bg-[#08080B] border border-[#1E1E22] rounded text-xs text-[#D4D4D8]"
                >
                  <span>• {crit}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCriterion(idx)}
                    className="text-[#71717A] hover:text-[#EF4444] transition-colors p-0.5 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="افزودن معیار جدید (مثال: پوشش تست واحد بالای ۸۰٪)"
                value={newCriterion}
                onChange={(e) => setNewCriterion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCriterion();
                  }
                }}
                className="flex-1 h-9 rounded border border-[#27272A] bg-[#08080B] px-3 text-xs text-[#F4F4F5] placeholder-[#52525B] focus:border-[#7C3AED] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCriterion}
                className="h-9 px-3.5 rounded border border-[#27272A] bg-[#121215] text-xs font-medium text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors cursor-pointer"
              >
                افزودن
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            AREA 3: اجرا و هزینه (Execution & Cost)
            ========================================================================= */}
        <section className="space-y-6">
          <div>
            <h2 className="text-base font-bold text-[#F4F4F5]">
              ۳. اجرا و هزینه
            </h2>
            <p className="text-xs text-[#71717A] mt-0.5">
              انتخاب مدل پردازش، محاسبه اعتبار رزرو و آغاز به کار کانتینر ایزوله
            </p>
          </div>

          {/* Compact Model Selection (Row-based, not giant cards) */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-[#A1A1AA] block">
              انتخاب مدل هوش مصنوعی:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {getAllModels().map((model) => {
                const isSelected = model.id === selectedModelId;
                return (
                  <label
                    key={model.id}
                    className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#12101A] border-[#7C3AED]'
                        : 'bg-[#09090C] border-[#222226] hover:border-[#2E2E33]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectedModel"
                      value={model.id}
                      checked={isSelected}
                      onChange={() => setSelectedModelId(model.id)}
                      className="mt-0.5 accent-[#7C3AED]"
                    />
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs sm:text-sm text-[#F4F4F5] font-latin" dir="ltr">
                          {model.name}
                        </span>
                        {model.recommended && (
                          <span className="text-[10px] text-[#A78BFA] bg-[#7C3AED]/15 px-1.5 py-0.2 rounded border border-[#7C3AED]/30">
                            پیشنهادی
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#71717A] truncate">
                        {model.tagline}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Simple Aligned Pricing Block (No dashboard card, clean metric row) */}
          <div className="py-4 border-y border-[#18181C] grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-[#1A1A1E]">
            <div className="space-y-0.5 pt-2 sm:pt-0">
              <span className="text-xs text-[#71717A] block">هزینه تخمینی:</span>
              <span className="text-xl font-bold text-[#F4F4F5] tabular-nums block">
                {formatToman(estimatedCost)}
              </span>
              <span className="text-xs text-[#52525B] block">بر مبنای پیچیدگی و ضریب مدل</span>
            </div>

            <div className="space-y-0.5 pt-3 sm:pt-0 sm:pr-6">
              <span className="text-xs text-[#71717A] block">سقف اعتبار رزرو:</span>
              <span className="text-xl font-bold text-[#F4F4F5] tabular-nums block">
                {formatToman(reservedCap)}
              </span>
              <span className="text-xs text-[#52525B] block">مسدودی موقت تا ارزیابی تست‌ها</span>
            </div>

            <div className="space-y-0.5 pt-3 sm:pt-0 sm:pr-6">
              <span className="text-xs text-[#71717A] block">موجودی آزاد کیف پول:</span>
              <div className="flex items-baseline justify-between">
                <span className={`text-xl font-bold tabular-nums ${hasSufficientBalance ? 'text-[#F4F4F5]' : 'text-[#EF4444]'}`}>
                  {formatToman(walletBalance)}
                </span>
                {!hasSufficientBalance && (
                  <button
                    type="button"
                    onClick={() => setIsTopUpModalOpen(true)}
                    className="text-xs text-[#7C3AED] hover:underline cursor-pointer"
                  >
                    شارژ حساب
                  </button>
                )}
              </div>
              <span className="text-xs text-[#52525B] block">
                {hasSufficientBalance ? 'اعتبار کافی است' : `کسری: ${formatToman(missingBalance)}`}
              </span>
            </div>
          </div>

          {/* Advanced Settings (Collapsed by default) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="inline-flex items-center gap-1.5 text-xs text-[#71717A] hover:text-[#D4D4D8] transition-colors cursor-pointer"
            >
              <span>تنظیمات پیشرفته (شاخه خروجی، دستور تست، رفتار قطعی ورکر)</span>
              {isAdvancedOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {isAdvancedOpen && (
              <div className="mt-3 p-4 rounded bg-[#09090C] border border-[#18181C] space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[#A1A1AA] block">شاخه گیت هدف (Target Branch):</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={targetBranch}
                      onChange={(e) => setTargetBranch(e.target.value)}
                      className="w-full h-9 rounded border border-[#27272A] bg-[#050506] px-3 text-xs text-[#F4F4F5] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#A1A1AA] block">قالب تحویل خروجی:</label>
                    <select
                      value={outputPreference}
                      onChange={(e) => setOutputPreference(e.target.value as any)}
                      className="w-full h-9 rounded border border-[#27272A] bg-[#050506] px-3 text-xs text-[#F4F4F5] focus:outline-none cursor-pointer"
                    >
                      <option value="pr">ثبت خودکار Pull Request</option>
                      <option value="patch">فایل Patch گیت</option>
                      <option value="zip">آرشیو فشرده ZIP</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[#A1A1AA] block">دستور تست در کانتینر:</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={testCommand}
                      onChange={(e) => setTestCommand(e.target.value)}
                      className="w-full h-9 rounded border border-[#27272A] bg-[#050506] px-3 text-xs text-[#F4F4F5] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#A1A1AA] block">محدودیت‌های خاص:</label>
                    <input
                      type="text"
                      value={extraConstraints}
                      onChange={(e) => setExtraConstraints(e.target.value)}
                      className="w-full h-9 rounded border border-[#27272A] bg-[#050506] px-3 text-xs text-[#F4F4F5] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Submission */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-[#71717A]">
              پس از ثبت، تسک وارد صف زمان‌بند شده و کانتینر اختصاصی راه‌اندازی می‌شود.
            </span>

            <div className="flex items-center gap-3">
              {!hasSufficientBalance && (
                <button
                  type="button"
                  onClick={() => setIsTopUpModalOpen(true)}
                  className="px-3.5 py-2 text-xs font-medium text-[#F4F4F5] bg-[#141418] border border-[#27272A] hover:bg-[#1A1A20] rounded cursor-pointer"
                >
                  افزایش موجودی
                </button>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={!description.trim()}
                className="px-6 py-2.5 font-medium cursor-pointer"
              >
                ثبت و اجرای تسک
              </Button>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
};
