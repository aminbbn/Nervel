import React from 'react';
import { BRAND } from '../../config/brand';
import { useRouter } from '../../context/RouterContext';
import { useScrollReveal } from './useScrollReveal';
import {
  Server,
  ArrowLeft,
  Activity,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export const ForOperatorsSection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal();
  const { navigate } = useRouter();
  const { forOperators } = BRAND;

  return (
    <section
      id="operators"
      ref={ref}
      className="relative w-full py-16 sm:py-20 lg:py-24 border-t border-[#18181B] text-right"
      aria-label="برای اپراتورها"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-14 items-start">
        
        {/* Right Column in RTL: Secondary Heading, Structured Sequence & Quiet CTA */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          
          {/* Eyebrow + Heading */}
          <div
            className={`space-y-3 ${
              isVisible ? 'animate-section-reveal' : 'opacity-0'
            }`}
            style={{ animationDelay: '0ms' }}
          >
            <div className="inline-flex items-center gap-1.5 text-xs text-[#71717A] font-medium">
              <Server className="h-3.5 w-3.5 text-[#71717A]" />
              <span>تأمین زیرساخت و ظرفیت اجرا</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#F4F4F5] leading-tight tracking-tight">
              {forOperators.heading}
            </h2>

            <p className="text-sm sm:text-base text-[#A1A1AA] leading-[1.75] max-w-xl">
              {forOperators.description}
            </p>
          </div>

          {/* 3 Value Concepts in Structured Text / Line Sequence (No generic card grid) */}
          <div className="space-y-3 pt-1">
            {forOperators.points.map((point, idx) => {
              const delay = `${(idx + 1) * 33}ms`;

              return (
                <div
                  key={point.id}
                  className={`flex items-start gap-3.5 p-3 rounded-md bg-[#09090C] border border-[#18181D] ${
                    isVisible ? 'animate-section-reveal' : 'opacity-0'
                  }`}
                  style={{ animationDelay: delay }}
                >
                  <div className="mt-0.5 h-6 w-6 rounded bg-[#121217] border border-[#222226] flex items-center justify-center shrink-0">
                    <span
                      className="font-latin text-[11px] font-semibold text-[#71717A]"
                      dir="ltr"
                    >
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-[#F4F4F5]">
                      {point.title}
                    </div>
                    <p className="text-xs text-[#71717A] mt-0.5 leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Secondary Operator CTA: Neutral, quiet, does NOT compete with Customer CTA */}
          <div
            className={`pt-2 ${
              isVisible ? 'animate-section-reveal' : 'opacity-0'
            }`}
            style={{ animationDelay: '100ms' }}
          >
            <button
              onClick={() => navigate('/operator')}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-[#121216] hover:bg-[#1A1A22] border border-[#27272A] hover:border-[#3F3F46] text-[#D4D4D8] hover:text-[#F4F4F5] text-xs sm:text-sm font-medium transition-colors cursor-pointer group"
            >
              <span>{forOperators.cta}</span>
              <ArrowLeft className="h-3.5 w-3.5 text-[#71717A] group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>

        {/* Left Column in RTL: Restrained Operator Node Preview (No gamification, badges, or fake payouts) */}
        <div
          className={`lg:col-span-5 w-full ${
            isVisible ? 'animate-section-reveal' : 'opacity-0'
          }`}
          style={{ animationDelay: '66ms' }}
        >
          <div
            className="w-full bg-[#0A0A0D] border border-[#222226] rounded-lg p-5 sm:p-6 text-right select-none shadow-xl space-y-4"
            dir="rtl"
          >
            {/* Header: Node Name + Online Status */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#18181B]">
              <div className="space-y-0.5">
                <span className="text-[11px] text-[#71717A] font-latin" dir="ltr">
                  NODE-591 / linux-amd64
                </span>
                <div className="text-sm font-bold text-[#F4F4F5]">
                  گره اجرایی اپراتور
                </div>
              </div>

              {/* Online Indicator: small green dot only */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#121216] border border-[#222226]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                <span className="text-xs font-medium text-[#D4D4D8]">
                  {forOperators.preview.workerStatus}
                </span>
              </div>
            </div>

            {/* Structured Rows */}
            <div className="divide-y divide-[#18181B] text-xs">
              
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#71717A]">{forOperators.preview.capacityLabel}:</span>
                <span className="font-latin text-[#D4D4D8] font-medium" dir="ltr">
                  {forOperators.preview.capacityValue}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#71717A]">{forOperators.preview.activeTasksLabel}:</span>
                <span className="text-[#F4F4F5] font-medium">
                  {forOperators.preview.activeTasksValue}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#71717A]">{forOperators.preview.earningsLabel}:</span>
                <span className="text-[#71717A] text-[11px]">
                  {forOperators.preview.earningsValue}
                </span>
              </div>

            </div>

            {/* Isolation Note */}
            <div className="pt-2 border-t border-[#18181B] flex items-center gap-2 text-[11px] text-[#52525B]">
              <Activity className="h-3 w-3 text-[#52525B] shrink-0" />
              <span>اجرای کانتینری ایزوله و مستقل از محیط میزبان</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
