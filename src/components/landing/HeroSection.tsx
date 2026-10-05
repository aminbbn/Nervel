import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { BRAND } from '../../config/brand';
import { ExecutionPreview } from './ExecutionPreview';
import {
  ArrowLeft,
  HelpCircle,
  X,
  CheckCircle2,
  Terminal,
  GitBranch,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { navigate } = useRouter();
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);

  return (
    <section className="relative w-full pt-10 sm:pt-14 lg:pt-18 pb-14 sm:pb-20">
      
      {/* 2-Column Responsive Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-14 items-start">
        
        {/* Right Column in RTL: Copy & Actions */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-6 sm:space-y-7 text-right">
          
          {/* 1. Eyebrow context */}
          <div
            className="animate-hero-reveal inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121217] border border-[#222226] text-xs text-[#A1A1AA]"
            style={{ animationDelay: '0ms' }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED]" />
            <span className="font-medium text-[#D4D4D8]">{BRAND.tagline}</span>
          </div>

          {/* 2. Primary Headline */}
          <h1
            className="animate-hero-reveal text-[34px] sm:text-[42px] lg:text-[48px] xl:text-[52px] font-bold text-[#F4F4F5] leading-[1.25] tracking-tight"
            style={{ animationDelay: '50ms' }}
          >
            <span className="block">{BRAND.headline.line1}</span>
            <span className="block text-[#E4E4E7]">{BRAND.headline.line2}</span>
          </h1>

          {/* 3. Supporting Text */}
          <p
            className="animate-hero-reveal text-[16px] sm:text-[17px] lg:text-[18px] text-[#A1A1AA] leading-[1.75] max-w-xl"
            style={{ animationDelay: '100ms' }}
          >
            {BRAND.description}
          </p>

          {/* 4. Action Buttons */}
          <div
            className="animate-hero-reveal flex flex-wrap items-center gap-3.5 pt-2"
            style={{ animationDelay: '150ms' }}
          >
            {/* Primary CTA */}
            <button
              onClick={() => navigate('/tasks/new')}
              className="inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-6 rounded-md bg-[#7C3AED] hover:bg-[#8B5CF6] active:bg-[#6D28D9] text-white text-[15px] sm:text-[16px] font-medium transition-colors cursor-pointer shadow-sm group"
            >
              <span>{BRAND.cta.startTask}</span>
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </button>

            {/* Secondary CTA: Visually quiet */}
            <button
              onClick={() => {
                const el = document.getElementById('how-it-works');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setShowHowItWorksModal(true);
                }
              }}
              className="inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-5 rounded-md bg-transparent hover:bg-[#121216] border border-[#27272A] hover:border-[#3F3F46] text-[#D4D4D8] text-[14px] sm:text-[15px] font-medium transition-colors cursor-pointer"
            >
              <HelpCircle className="h-4 w-4 text-[#71717A]" />
              <span>{BRAND.cta.howItWorks}</span>
            </button>
          </div>

          {/* Core Guarantees Minimal Micro-Row */}
          <div
            className="animate-hero-reveal pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#71717A]"
            style={{ animationDelay: '180ms' }}
          >
            <div className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-[#52525B]" />
              <span>ایزولاسیون کامل مخزن</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-[#52525B]" />
              <span>اجرای واقعی در کانتینر</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-[#52525B]" />
              <span>تحویل در قالب PR یا Patch</span>
            </div>
          </div>

        </div>

        {/* Left Column in RTL: Execution Preview */}
        <div
          className="lg:col-span-6 xl:col-span-5 w-full animate-hero-reveal"
          style={{ animationDelay: '200ms' }}
        >
          <ExecutionPreview />
        </div>

      </div>

      {/* How It Works Minimal Explanatory Modal */}
      {showHowItWorksModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowHowItWorksModal(false)}
        >
          <div
            className="w-full max-w-lg bg-[#0A0A0D] border border-[#222226] rounded-lg p-6 text-right select-none shadow-2xl space-y-5 animate-hero-reveal"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-[#18181B]">
              <h3 className="text-base font-bold text-[#F4F4F5]">
                {BRAND.name} چگونه کار می‌کند؟
              </h3>
              <button
                onClick={() => setShowHowItWorksModal(false)}
                className="p-1 text-[#71717A] hover:text-[#F4F4F5] rounded transition-colors cursor-pointer"
                aria-label="بستن"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded bg-[#0E0E12] border border-[#1A1A1E] space-y-1">
                <div className="flex items-center gap-2 font-medium text-[#F4F4F5]">
                  <span className="text-[#7C3AED] font-bold font-latin">۱.</span>
                  <span>ارسال شرح تسک و اتصال سورس‌کد</span>
                </div>
                <p className="text-xs text-[#71717A] pr-4 leading-relaxed">
                  مخزن گیت‌هاب، آرشیو فشرده یا فایل‌های مستقیم را متصل کرده و نیاز یا باگ نرم‌افزاری را مشخص می‌کنید.
                </p>
              </div>

              <div className="p-3.5 rounded bg-[#0E0E12] border border-[#1A1A1E] space-y-1">
                <div className="flex items-center gap-2 font-medium text-[#F4F4F5]">
                  <span className="text-[#7C3AED] font-bold font-latin">۲.</span>
                  <span>زمان‌بندی و اجرای ایزوله در شبکه ورکرها</span>
                </div>
                <p className="text-xs text-[#71717A] pr-4 leading-relaxed">
                  سیستم تسک را به ورکر دارای ظرفیت مناسب می‌سپارد؛ مدل انتخابی تغییرات را در کانتینر ایزوله تست اعمال می‌کند.
                </p>
              </div>

              <div className="p-3.5 rounded bg-[#0E0E12] border border-[#1A1A1E] space-y-1">
                <div className="flex items-center gap-2 font-medium text-[#F4F4F5]">
                  <span className="text-[#7C3AED] font-bold font-latin">۳.</span>
                  <span>اجرای تست‌های اعتبارسنجی و تحویل خروجی</span>
                </div>
                <p className="text-xs text-[#71717A] pr-4 leading-relaxed">
                  تست‌های واحد، بیلد و لایسن‌ها خودکار بررسی شده و خروجی نهایی به شکل Pull Request یا Patch تحویل داده می‌شود.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setShowHowItWorksModal(false);
                  navigate('/tasks/new');
                }}
                className="h-10 px-5 rounded bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs sm:text-sm font-medium transition-colors"
              >
                {BRAND.cta.startTask}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
