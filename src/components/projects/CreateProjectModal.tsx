import React, { useState } from 'react';
import { useNervel } from '../../context/NervelContext';
import { InputSourceType } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import {
  X,
  FolderGit2,
  FileCode2,
  FileArchive,
  Upload,
} from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createProject } = useNervel();

  const [sourceType, setSourceType] = useState<InputSourceType>('github');
  const [name, setName] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [defaultBranch, setDefaultBranch] = useState('main');
  const [zipFilename, setZipFilename] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('لطفاً نام پروژه را وارد کنید.');
      return;
    }

    if (sourceType === 'github' && !repoUrl.trim()) {
      setError('لطفاً آدرس مخزن گیت‌هاب را وارد کنید.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      createProject({
        name: name.trim(),
        sourceType,
        repoUrl: sourceType === 'github' ? repoUrl.trim() : undefined,
        defaultBranch: sourceType === 'github' ? defaultBranch.trim() || 'main' : undefined,
        zipFilename: sourceType === 'zip' ? zipFilename || 'source-archive.zip' : undefined,
        instructions: instructions.trim(),
      });
      setIsSubmitting(false);
      onClose();
    }, 250);
  };

  const handleQuickInstruction = (text: string) => {
    setInstructions((prev) => (prev ? `${prev}\n${text}` : text));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div
        className="w-full max-w-xl rounded-lg border border-[#1E1E22] bg-[#0A0A0D] p-6 text-right animate-nervel-enter space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#18181B]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-[#121216] border border-[#27272A] flex items-center justify-center text-[#7C3AED]">
              <FolderGit2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F4F4F5]">ایجاد پروژه پایدار جدید</h2>
              <p className="text-xs text-[#71717A] mt-0.5">
                فضای کاری دائمی برای ذخیره سورس، تاریخچه تسک‌ها و دستورالعمل‌های اختصاصی
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded p-1.5 text-[#71717A] hover:text-[#F4F4F5] hover:bg-[#141418] transition-colors cursor-pointer"
            aria-label="بستن پنجره"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Source Selection Segment */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#D4D4D8]">
              نوع منبع کدبیس:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSourceType('github')}
                className={`flex items-center justify-center gap-2 p-3 rounded-md border text-sm font-medium transition-colors cursor-pointer ${
                  sourceType === 'github'
                    ? 'border-[#7C3AED] bg-[#121218] text-[#F4F4F5]'
                    : 'border-[#222226] bg-[#070709] text-[#71717A] hover:text-[#A1A1AA]'
                }`}
              >
                <FolderGit2 className="h-4 w-4" />
                <span>مخزن GitHub</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSourceType('zip');
                  if (!zipFilename) setZipFilename('source-code.zip');
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-md border text-sm font-medium transition-colors cursor-pointer ${
                  sourceType === 'zip'
                    ? 'border-[#7C3AED] bg-[#121218] text-[#F4F4F5]'
                    : 'border-[#222226] bg-[#070709] text-[#71717A] hover:text-[#A1A1AA]'
                }`}
              >
                <FileArchive className="h-4 w-4" />
                <span>آرشیو ZIP</span>
              </button>

              <button
                type="button"
                onClick={() => setSourceType('direct')}
                className={`flex items-center justify-center gap-2 p-3 rounded-md border text-sm font-medium transition-colors cursor-pointer ${
                  sourceType === 'direct'
                    ? 'border-[#7C3AED] bg-[#121218] text-[#F4F4F5]'
                    : 'border-[#222226] bg-[#070709] text-[#71717A] hover:text-[#A1A1AA]'
                }`}
              >
                <FileCode2 className="h-4 w-4" />
                <span>فایل‌های مستقیم</span>
              </button>
            </div>
          </div>

          {/* Project Name */}
          <div>
            <Input
              label="نام پروژه"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: سرویس درگاه پرداخت یا API فروشگاه"
              autoFocus
            />
          </div>

          {/* Source Details */}
          {sourceType === 'github' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <Input
                  label="آدرس ریپازیتوری (سازمان/نام مخزن)"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="parsa-tech/payment-service"
                  dir="ltr"
                />
              </div>
              <div>
                <Input
                  label="شاخه پیش‌فرض"
                  value={defaultBranch}
                  onChange={(e) => setDefaultBranch(e.target.value)}
                  placeholder="main"
                  dir="ltr"
                />
              </div>
            </div>
          ) : sourceType === 'zip' ? (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#D4D4D8]">
                فایل آرشیو سورس:
              </label>
              <div className="border border-dashed border-[#2E2E33] hover:border-[#7C3AED] rounded-md p-4 text-center bg-[#070709] transition-colors cursor-pointer">
                <Upload className="h-5 w-5 text-[#71717A] mx-auto mb-1" />
                <span className="text-xs text-[#A1A1AA]" dir="ltr">
                  {zipFilename || 'برای انتخاب فایل ZIP کلیک کنید یا فایل را بکشید'}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#D4D4D8]">
                فایل‌های سورس کد:
              </label>
              <div className="border border-dashed border-[#2E2E33] hover:border-[#7C3AED] rounded-md p-4 text-center bg-[#070709] transition-colors cursor-pointer">
                <FileCode2 className="h-5 w-5 text-[#71717A] mx-auto mb-1" />
                <span className="text-xs text-[#A1A1AA]">
                  فایل‌های مبدا پروژه را جهت آپلود انتخاب کنید
                </span>
              </div>
            </div>
          )}

          {/* Persistent Project Instructions */}
          <div className="space-y-2 pt-2 border-t border-[#18181B]">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-[#D4D4D8]">
                دستورالعمل‌های پایدار پروژه (Project Instructions):
              </label>
              <span className="text-xs text-[#71717A]">
                به تمام تسک‌های آینده اعمال می‌شود
              </span>
            </div>

            <textarea
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="مثال:&#10;- از pnpm به عنوان پکیج منیجر استفاده شود.&#10;- تمام تست‌های واحد با Vitest نوشته و اجرا شوند.&#10;- به فایل‌های درون پوشه /legacy دست زده نشود.&#10;- متغیرهای محیطی از .env.example خوانده شوند."
              className="w-full bg-[#08080B] border border-[#27272A] hover:border-[#38383E] focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] rounded-md p-3 text-sm text-[#F4F4F5] placeholder-[#52525B] focus:outline-none transition-colors leading-relaxed"
            />

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-xs text-[#71717A] ml-1">پیشنهاد سریع:</span>
              {[
                'از pnpm استفاده شود',
                'تست‌ها با Vitest اجرا شوند',
                'پوشه /legacy تغییر نکند',
                'شاخه پیش‌فرض develop است',
              ].map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => handleQuickInstruction(sug)}
                  className="text-xs text-[#A1A1AA] hover:text-[#F4F4F5] bg-[#141418] hover:bg-[#1C1C22] border border-[#27272A] px-2 py-0.5 rounded transition-colors cursor-pointer"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#18181B]">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              انصراف
            </Button>

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              ایجاد و ذخیره پروژه
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
