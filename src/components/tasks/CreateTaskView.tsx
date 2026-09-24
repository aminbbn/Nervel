import React, { useState } from 'react';
import { useNervel } from '../../context/NervelContext';
import { InputSourceType } from '../../types';
import { formatToman, toPersianDigits } from '../../utils/formatters';
import { getStaggerStyle } from '../../utils/motion';
import {
  FolderArchive,
  Trash2,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

interface ModelOption {
  id: string;
  name: string;
  tagline: string;
  recommended: boolean;
  baseRateMultiplier: number;
}

const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    tagline: 'بهترین عملکرد برای رفکتورینگ عمیق، معماری و منطق پیچیده کد',
    recommended: true,
    baseRateMultiplier: 1.2,
  },
  {
    id: 'o3-mini',
    name: 'o3-mini',
    tagline: 'سرعت و دقت بالا در الگوریتم‌ها، تست‌نویسی و رفع باگ‌های مجزا',
    recommended: false,
    baseRateMultiplier: 0.9,
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    tagline: 'مدل استاندارد برای توسعه روتین و تسک‌های عمومی وب',
    recommended: false,
    baseRateMultiplier: 1.0,
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    tagline: 'مدل متوازن برای تسک‌های استاندارد کدنویسی و بهینه‌سازی',
    recommended: false,
    baseRateMultiplier: 1.0,
  },
];

export const CreateTaskView: React.FC = () => {
  const { walletBalance, createNewTask, setView, setIsTopUpModalOpen } = useNervel();

  const [inputType, setInputType] = useState<InputSourceType>('github');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [branch, setBranch] = useState<string>('main');
  const [targetBranch, setTargetBranch] = useState<string>('feat/nervel-implementation');
  const [zipFileName, setZipFileName] = useState<string>('');
  const [directFiles, setDirectFiles] = useState<string[]>([]);
  const [newDirectFileName, setNewDirectFileName] = useState<string>('');

  const [acceptanceCriteria, setAcceptanceCriteria] = useState<string[]>([
    'تمام تست‌های واحد موجود و جدید پاس شوند',
    'عدم تغییر در API بدون داکیومنت',
  ]);
  const [newCriterion, setNewCriterion] = useState<string>('');

  const [selectedModelId, setSelectedModelId] = useState<string>('claude-3-7-sonnet');
  const [reassignStrategy, setReassignStrategy] = useState<'ask_then_auto' | 'instant' | 'wait_forever'>('ask_then_auto');

  // Estimate calculation
  const selectedModel = AVAILABLE_MODELS.find((m) => m.id === selectedModelId) || AVAILABLE_MODELS[0];
  const baseEstimate = 70000;
  const estimatedCost = Math.round(baseEstimate * selectedModel.baseRateMultiplier);
  const reservedCap = Math.round(estimatedCost * 1.35);
  const hasSufficientBalance = walletBalance >= reservedCap;
  const missingBalance = reservedCap - walletBalance;

  const handleAddCriterion = () => {
    if (newCriterion.trim()) {
      setAcceptanceCriteria([...acceptanceCriteria, newCriterion.trim()]);
      setNewCriterion('');
    }
  };

  const handleRemoveCriterion = (idx: number) => {
    setAcceptanceCriteria(acceptanceCriteria.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    if (!hasSufficientBalance) {
      setIsTopUpModalOpen(true);
      return;
    }

    createNewTask({
      title,
      description,
      acceptanceCriteria,
      inputType,
      repoUrl: inputType === 'github' ? repoUrl || 'parsa-tech/repository' : undefined,
      branch: inputType === 'github' ? branch : undefined,
      targetBranch: inputType === 'github' ? targetBranch : undefined,
      uploadedFiles: inputType === 'zip' ? [zipFileName || 'project-archive.zip'] : directFiles,
      modelId: selectedModel.id,
      modelName: selectedModel.name,
      isSystemRecommended: selectedModel.recommended,
      estimatedCost,
      reservedCap,
      reassignStrategy,
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Header: 22-24px heading */}
      <div style={getStaggerStyle(0)} className="animate-nervel-enter pb-5 border-b border-[#17171A]">
        <button
          onClick={() => setView('dashboard')}
          className="inline-flex items-center gap-2 text-sm text-[#71717A] hover:text-[#F4F4F5] transition-colors mb-3 font-medium"
        >
          <ArrowRight className="h-4 w-4" />
          <span>بازگشت به داشبورد</span>
        </button>
        <h2 className="text-[22px] sm:text-2xl font-bold text-[#F4F4F5] leading-tight">
          ثبت تسک مهندسی جدید در شبکه
        </h2>
        <p className="text-sm text-[#71717A] mt-1.5 leading-relaxed">
          تعریف محدوده کار، شاخه گیت، معیارهای QA و رزرو خودکار سقف اعتبار مورد نیاز
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-sm">
        
        {/* Section 1: Source Code & Repository Input */}
        <section style={getStaggerStyle(1)} className="animate-nervel-enter space-y-4">
          <div>
            <h3 className="text-[17px] sm:text-lg font-semibold text-[#F4F4F5]">
              ۱. منبع کد و ورودی پروژه
            </h3>
            <p className="text-sm text-[#71717A] mt-1 leading-relaxed">
              محیط اجرای ایزوله ورکر کد را مستقیماً از این منبع بارگذاری خواهد کرد
            </p>
          </div>

          {/* Clean segmented options */}
          <div className="flex gap-2.5">
            {[
              { id: 'github', label: 'مخزن GitHub' },
              { id: 'zip', label: 'فایل ZIP' },
              { id: 'direct', label: 'فایل‌های مستقیم' },
            ].map((src) => (
              <button
                key={src.id}
                type="button"
                onClick={() => setInputType(src.id as InputSourceType)}
                className={`px-4 py-2 rounded transition-colors text-sm font-medium ${
                  inputType === src.id
                    ? 'bg-[#17171A] text-[#F4F4F5]'
                    : 'text-[#71717A] hover:text-[#D4D4D8]'
                }`}
              >
                {src.label}
              </button>
            ))}
          </div>

          {/* Conditional Input Fields */}
          {inputType === 'github' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-sm text-[#A1A1AA] font-medium">
                  آدرس مخزن (نام سازمان / نام پروژه):
                </label>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="parsa-tech/payment-gateway-service"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full rounded border border-[#27272A] bg-transparent px-3.5 py-2.5 text-sm text-[#F4F4F5] placeholder-[#52525B] focus:border-[#7C3AED] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm text-[#A1A1AA] font-medium">شاخه کاری (Branch):</label>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="main"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full rounded border border-[#27272A] bg-transparent px-3.5 py-2.5 text-sm text-[#F4F4F5] placeholder-[#52525B] focus:border-[#7C3AED] focus:outline-none"
                />
              </div>
            </div>
          )}

          {inputType === 'zip' && (
            <div className="pt-2">
              <div className="border border-dashed border-[#27272A] rounded p-8 text-center text-sm text-[#71717A]">
                <FolderArchive className="mx-auto h-6 w-6 text-[#71717A]" />
                <span className="block mt-2 font-medium text-[#D4D4D8]">نام یا آدرس فایل فشرده سورس (.zip)</span>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="project-source-v1.zip"
                  value={zipFileName}
                  onChange={(e) => setZipFileName(e.target.value)}
                  className="mt-3 w-80 max-w-full rounded border border-[#27272A] bg-transparent px-3.5 py-2 text-sm text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none"
                />
              </div>
            </div>
          )}

          {inputType === 'direct' && (
            <div className="space-y-3 pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  dir="ltr"
                  placeholder="src/modules/payment/zarinpal.service.ts"
                  value={newDirectFileName}
                  onChange={(e) => setNewDirectFileName(e.target.value)}
                  className="flex-1 rounded border border-[#27272A] bg-transparent px-3.5 py-2.5 text-sm text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newDirectFileName.trim()) {
                      setDirectFiles([...directFiles, newDirectFileName.trim()]);
                      setNewDirectFileName('');
                    }
                  }}
                  className="rounded border border-[#27272A] px-4 py-2 text-sm text-[#F4F4F5] hover:bg-[#121214] font-medium"
                >
                  افزودن
                </button>
              </div>

              {directFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {directFiles.map((file, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 px-3 py-1 text-sm text-[#D4D4D8] bg-[#0E0E10] rounded"
                    >
                      <span dir="ltr">{file}</span>
                      <button
                        type="button"
                        onClick={() => setDirectFiles(directFiles.filter((_, idx) => idx !== i))}
                        className="text-[#71717A] hover:text-[#EF4444]"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Divider */}
        <div className="border-b border-[#17171A]" />

        {/* Section 2: Task Specifications & QA Acceptance Criteria */}
        <section style={getStaggerStyle(2)} className="animate-nervel-enter space-y-4">
          <div>
            <h3 className="text-[17px] sm:text-lg font-semibold text-[#F4F4F5]">
              ۲. شرح تسک و معیارهای تایید خروجی (QA)
            </h3>
            <p className="text-sm text-[#71717A] mt-1 leading-relaxed">
              دستورالعمل مهندسی شفاف برای کانتینر اجرای خودکار
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm text-[#A1A1AA] font-medium">عنوان تسک:</label>
            <input
              type="text"
              placeholder="مثال: پیاده‌سازی کش Redis برای ماژول سفارش‌ها با ابطال رویدادمحور"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded border border-[#27272A] bg-transparent px-3.5 py-2.5 text-base text-[#F4F4F5] placeholder-[#52525B] focus:border-[#7C3AED] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm text-[#A1A1AA] font-medium">شرح جزئیات فنی و نیازمندی‌ها:</label>
            <textarea
              rows={4}
              placeholder="ساختار معماری، فایل‌هایی که باید تغییر کنند، رفتارهای مرزی و استانداردهای کدنویسی..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full rounded border border-[#27272A] bg-transparent px-3.5 py-2.5 text-base text-[#F4F4F5] placeholder-[#52525B] focus:border-[#7C3AED] focus:outline-none leading-relaxed"
            />
          </div>

          {/* Acceptance Criteria */}
          <div className="space-y-2 pt-2">
            <label className="block text-sm text-[#A1A1AA] font-medium">معیارهای پذیرش و تست خودکار (QA Criteria):</label>
            <div className="space-y-1.5">
              {acceptanceCriteria.map((crit, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 px-3 text-sm sm:text-base hover:bg-[#080808] rounded"
                >
                  <span className="text-[#D4D4D8]">• {crit}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCriterion(idx)}
                    className="text-[#71717A] hover:text-[#EF4444] transition-colors p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="معیار تست جدید (مثال: پوشش تست واحد بالای ۸۵٪)"
                value={newCriterion}
                onChange={(e) => setNewCriterion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCriterion();
                  }
                }}
                className="flex-1 rounded border border-[#27272A] bg-transparent px-3.5 py-2 text-sm text-[#F4F4F5] placeholder-[#52525B] focus:border-[#7C3AED] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCriterion}
                className="rounded border border-[#27272A] px-4 py-2 text-sm text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors font-medium"
              >
                افزودن
              </button>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-b border-[#17171A]" />

        {/* Section 3: AI Model Selection - Flat rows */}
        <section style={getStaggerStyle(3)} className="animate-nervel-enter space-y-4">
          <div>
            <h3 className="text-[17px] sm:text-lg font-semibold text-[#F4F4F5]">
              ۳. مدل هوش مصنوعی برای کدنویسی
            </h3>
            <p className="text-sm text-[#71717A] mt-1 leading-relaxed">
              مدل پیشنهادی بر اساس نوع و پیچیدگی تسک انتخاب شده است
            </p>
          </div>

          <div className="space-y-1">
            {AVAILABLE_MODELS.map((model) => {
              const isSelected = model.id === selectedModelId;
              return (
                <label
                  key={model.id}
                  className="flex items-start gap-3.5 py-3 px-3 rounded cursor-pointer hover:bg-[#080808] transition-colors"
                >
                  <input
                    type="radio"
                    name="model"
                    value={model.id}
                    checked={isSelected}
                    onChange={() => setSelectedModelId(model.id)}
                    className="mt-1 accent-[#7C3AED]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-semibold text-base text-[#F4F4F5]" dir="ltr">
                        {model.name}
                      </span>
                      {model.recommended && (
                        <span className="text-xs text-[#7C3AED] font-medium">
                          (پیشنهاد سیستم)
                        </span>
                      )}
                      <span className="text-xs sm:text-sm text-[#71717A] tabular-nums">
                        · ضریب: {toPersianDigits(model.baseRateMultiplier)}x
                      </span>
                    </div>
                    <p className="text-sm text-[#71717A] mt-1 leading-relaxed">
                      {model.tagline}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        {/* Divider */}
        <div className="border-b border-[#17171A]" />

        {/* Section 4: Worker Offline Policy - Flat rows */}
        <section style={getStaggerStyle(4)} className="animate-nervel-enter space-y-4">
          <div>
            <h3 className="text-[17px] sm:text-lg font-semibold text-[#F4F4F5]">
              ۴. رفتار هنگام قطعی اپراتور ورکر
            </h3>
            <p className="text-sm text-[#71717A] mt-1 leading-relaxed">
              در صورت عدم ارسال ضربان وضعیت کانتینر در ۳ پایش متوالی
            </p>
          </div>

          <div className="space-y-1">
            {[
              {
                id: 'ask_then_auto',
                title: 'سؤال از من (پیش‌فرض)',
                desc: 'در صورت عدم پاسخ تا ۵ دقیقه، انتقال خودکار به ورکر بعدی شبکه انجام می‌شود.',
              },
              {
                id: 'instant',
                title: 'انتقال فوری خودکار',
                desc: 'بدون معطلی و بلافاصله کار به ورکر بعدی شبکه واگذار می‌گردد.',
              },
              {
                id: 'wait_forever',
                title: 'انتظار تا تصمیم من',
                desc: 'تسک در حالت تعلیق حفظ شده و تا دستور صریح شما منتقل نمی‌شود.',
              },
            ].map((pol) => (
              <label
                key={pol.id}
                className="flex items-start gap-3.5 py-3 px-3 rounded cursor-pointer hover:bg-[#080808] transition-colors"
              >
                <input
                  type="radio"
                  name="strategy"
                  value={pol.id}
                  checked={reassignStrategy === pol.id}
                  onChange={() => setReassignStrategy(pol.id as any)}
                  className="mt-1 accent-[#7C3AED]"
                />
                <div>
                  <span className="font-medium text-base text-[#F4F4F5]">{pol.title}</span>
                  <p className="text-sm text-[#71717A] mt-1 leading-relaxed">{pol.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="border-b border-[#17171A]" />

        {/* Section 5: Financial Summary & Primary Submission */}
        <div style={getStaggerStyle(5)} className="animate-nervel-enter space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-2">
            <div>
              <span className="text-sm text-[#71717A] block">هزینه تخمینی:</span>
              <span className="tabular-nums font-bold text-[#F4F4F5] text-xl sm:text-2xl mt-1 block">
                {formatToman(estimatedCost)}
              </span>
            </div>

            <div>
              <span className="text-sm text-[#71717A] block">سقف اعتبار رزرو (Cap):</span>
              <span className="tabular-nums font-bold text-[#F4F4F5] text-xl sm:text-2xl mt-1 block">
                {formatToman(reservedCap)}
              </span>
              <span className="text-xs text-[#71717A] block mt-1">مازاد پس از ارزیابی QA عودت می‌گردد</span>
            </div>

            <div>
              <span className="text-sm text-[#71717A] block">موجودی آزاد فعلی شما:</span>
              <span className="tabular-nums font-bold text-xl sm:text-2xl mt-1 block text-[#F4F4F5]">
                {formatToman(walletBalance)}
              </span>
            </div>
          </div>

          {/* Insufficient balance alert - Clean neutral box with subtle red icon */}
          {!hasSufficientBalance && (
            <div className="py-3 px-4 rounded border border-[#27272A] bg-transparent text-sm flex items-center justify-between text-[#D4D4D8]">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="h-4 w-4 text-[#EF4444] shrink-0" />
                <span>
                  موجودی کافی نیست (کسری: {formatToman(missingBalance)}).
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsTopUpModalOpen(true)}
                className="underline underline-offset-4 font-semibold text-[#F4F4F5] hover:text-[#7C3AED] transition-colors"
              >
                شارژ کیف پول ←
              </button>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-[#17171A]">
            <span className="text-sm text-[#71717A]">
              با ثبت تسک، مبلغ سقف رزرو تا زمان خاتمه اجرا مسدود خواهد شد.
            </span>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setView('dashboard')}
                className="px-4 py-2 text-sm text-[#71717A] hover:text-[#F4F4F5] transition-colors"
              >
                انصراف
              </button>

              <button
                type="submit"
                disabled={!title.trim() || !description.trim()}
                className={`rounded px-5 py-2.5 text-sm sm:text-base font-medium text-white transition-colors ${
                  !title.trim() || !description.trim()
                    ? 'bg-[#1C1C1F] text-[#71717A] cursor-not-allowed'
                    : 'bg-[#7C3AED] hover:bg-[#8B5CF6] active:bg-[#6D28D9]'
                }`}
              >
                ثبت و اجرای تسک در کانتینر
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
