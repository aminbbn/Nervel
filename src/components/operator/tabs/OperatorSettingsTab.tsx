import React, { useState } from 'react';
import { useNervel } from '../../../context/NervelContext';
import { toast } from '../../../context/ToastContext';
import { toPersianDigits } from '../../../utils/formatters';
import {
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';

export const OperatorSettingsTab: React.FC = () => {
  const {
    operatorNode,
    setOperatorCapacityLimit,
  } = useNervel();

  const [voluntaryCap, setVoluntaryCap] = useState<number>(operatorNode.operatorCapacityLimit);
  const [providerKey, setProviderKey] = useState<string>('cdx_live_9981240185901284');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [isolationType, setIsolationType] = useState<string>('gvisor');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const systemMax = operatorNode.maxAllowedCapacity; // 5

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setOperatorCapacityLimit(voluntaryCap);
    setSavedSuccess(true);
    toast.success('تنظیمات ورکر با موفقیت ذخیره شد');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 animate-nervel-enter w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#18181C]">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F4F5]">تنظیمات اپراتور</h1>
          <p className="text-sm text-[#71717A] mt-1.5">
            پیکربندی سقف هم‌زمانی داوطلبانه، دسترسی پرووایدر کدنویسی و پارامترهای سندباکس ایزوله
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs self-start sm:self-auto shrink-0">
            <Check className="h-4 w-4" />
            <span>تنظیمات ذخیره شد</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-0 divide-y divide-[#18181C]">
        {/* Setting 1: Concurrency (Cloudflare-like row layout) */}
        <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 space-y-1.5">
            <h2 className="text-base font-semibold text-[#F4F4F5]">
              سقف هم‌زمانی کانتینرها (Concurrency Limit)
            </h2>
            <p className="text-sm text-[#71717A] leading-relaxed">
              حداکثر تعداد کانتینرهایی که این گره به‌طور هم‌زمان از زمان‌بند مرکزی برای پردازش تسک‌ها قبول می‌کند.
            </p>
            <div className="text-xs text-[#52525B] pt-1">
              <span>سقف فعلی مجاز سیستم بر مبنای منابع و پایداری: </span>
              <span className="text-[#A1A1AA] font-medium tabular-nums">{toPersianDigits(systemMax)} کانتینر</span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-3 lg:pr-6">
            <div className="flex items-center justify-between text-xs text-[#71717A]">
              <span>سقف فعلی سیستم: <strong className="text-[#F4F4F5] tabular-nums">{toPersianDigits(systemMax)}</strong></span>
              <span>ظرفیت انتخابی شما: <strong className="text-[#7C3AED] tabular-nums">{toPersianDigits(voluntaryCap)} تسک هم‌زمان</strong></span>
            </div>

            {/* Compact segment buttons */}
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((num) => {
                const isSelected = voluntaryCap === num;
                return (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setVoluntaryCap(num)}
                    className={`h-10 min-h-[40px] rounded text-sm font-medium transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-sm'
                        : 'bg-[#09090C] text-[#A1A1AA] border-[#222226] hover:bg-[#141418] hover:text-[#F4F4F5]'
                    }`}
                  >
                    {toPersianDigits(num)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Setting 2: Coding Provider Token */}
        <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 space-y-1.5">
            <h2 className="text-base font-semibold text-[#F4F4F5]">
              توکن دسترسی پرووایدر کدنویسی (Coding Provider)
            </h2>
            <p className="text-sm text-[#71717A] leading-relaxed">
              کلید اعتبارسنجی ارائه‌دهنده سرویس (مانند OpenAI Codex). این کلید در حافظه رم امن دیمن محلی نگهداری شده و هرگز به کانتینر تسک منتقل نمی‌شود.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#10B981] pt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
              <span>پرووایدر فعال: Codex Enterprise (سهمیه ۸۸٪)</span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-2 lg:pr-6">
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={providerKey}
                onChange={(e) => setProviderKey(e.target.value)}
                className="w-full h-10 min-h-[40px] bg-[#09090C] border border-[#222226] rounded px-3.5 pl-10 text-sm font-latin text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none transition-colors"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute left-3 top-2.5 text-[#71717A] hover:text-[#D4D4D8] cursor-pointer"
                title={showKey ? 'پنهان‌سازی' : 'نمایش کلید'}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-[#52525B]">
              برای تغییر پرووایدر به Claude یا Ollama لوکال، مستندات دیمن ورکر را مطالعه کنید.
            </p>
          </div>
        </div>

        {/* Setting 3: Sandbox Runtime Isolation */}
        <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 space-y-1.5">
            <h2 className="text-base font-semibold text-[#F4F4F5]">
              معماری ایزولاسیون سندباکس
            </h2>
            <p className="text-sm text-[#71717A] leading-relaxed">
              روش جداسازی امن کانتینرهای اجرای کد از سیستم‌عامل و هسته لینوکس هاست شما.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-2.5 lg:pr-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setIsolationType('gvisor')}
                className={`p-3 rounded border cursor-pointer transition-colors ${
                  isolationType === 'gvisor'
                    ? 'bg-[#121217] border-[#7C3AED]'
                    : 'bg-[#09090C] border-[#222226] hover:border-[#2E2E33]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs sm:text-sm text-[#F4F4F5]">gVisor runsc</span>
                  <input
                    type="radio"
                    name="isolation"
                    checked={isolationType === 'gvisor'}
                    onChange={() => setIsolationType('gvisor')}
                    className="accent-[#7C3AED]"
                  />
                </div>
                <p className="text-xs text-[#71717A] mt-1 leading-normal">
                  شبیه‌سازی کرنل در فضای کاربر (پیشنهادی پلتفرم)
                </p>
              </label>

              <label
                onClick={() => setIsolationType('runc')}
                className={`p-3 rounded border cursor-pointer transition-colors ${
                  isolationType === 'runc'
                    ? 'bg-[#121217] border-[#7C3AED]'
                    : 'bg-[#09090C] border-[#222226] hover:border-[#2E2E33]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs sm:text-sm text-[#F4F4F5]">Docker runc</span>
                  <input
                    type="radio"
                    name="isolation"
                    checked={isolationType === 'runc'}
                    onChange={() => setIsolationType('runc')}
                    className="accent-[#7C3AED]"
                  />
                </div>
                <p className="text-xs text-[#71717A] mt-1 leading-normal">
                  ایزولاسیون بر پایه namespaces و cgroups
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* Setting 4: Container Resource Allocation */}
        <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 space-y-1.5">
            <h2 className="text-base font-semibold text-[#F4F4F5]">
              سهمیه سخت‌افزاری کانتینرها
            </h2>
            <p className="text-sm text-[#71717A] leading-relaxed">
              حداکثر سهم منابع حافظه رم و پردازنده تخصیص‌یافته به هر کانتینر اجرای تسک.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-2 lg:pr-6">
            <div className="flex items-center gap-3 text-xs">
              <div className="px-3.5 py-2 rounded bg-[#09090C] border border-[#222226] text-[#D4D4D8] flex-1">
                <span className="text-[#71717A] block">سقف رم هر کانتینر:</span>
                <span className="font-medium text-[#F4F4F5] mt-0.5 block tabular-nums">۴٬۰۹۶ مگابایت (۴GB)</span>
              </div>
              <div className="px-3.5 py-2 rounded bg-[#09090C] border border-[#222226] text-[#D4D4D8] flex-1">
                <span className="text-[#71717A] block">سهم پردازنده:</span>
                <span className="font-medium text-[#F4F4F5] mt-0.5 block tabular-nums">۲ هسته اختصاصی CPU</span>
              </div>
            </div>
            <p className="text-xs text-[#52525B]">
              تخصیص منابع به‌طور خودکار توسط Docker daemon بر اساس سهمیه تعیین‌شده اعمال می‌شود.
            </p>
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-6 flex items-center justify-between">
          <button
            type="submit"
            className="px-5 py-2 rounded text-sm font-medium bg-[#7C3AED] hover:bg-[#8B5CF6] text-white transition-colors cursor-pointer"
          >
            ذخیره تنظیمات
          </button>

          {savedSuccess && (
            <span className="text-xs text-[#10B981] flex items-center gap-1.5 animate-nervel-enter">
              <Check className="h-4 w-4" />
              <span>تغییرات در دیمن ورکر با موفقیت اعمال شد.</span>
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
