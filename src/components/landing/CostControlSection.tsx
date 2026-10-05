import React from 'react';
import { BRAND } from '../../config/brand';
import { useScrollReveal } from './useScrollReveal';
import {
  Shield,
  SlidersHorizontal,
  CircleDollarSign,
  Scale,
  Lock,
} from 'lucide-react';

export const CostControlSection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal();
  const { costControl } = BRAND;

  return (
    <section
      id="cost-control"
      ref={ref}
      className="relative w-full py-16 sm:py-20 lg:py-24 border-t border-[#18181B] text-right"
      aria-label="کنترل هزینه و سقف رزرو"
    >
      <div className="space-y-12 sm:space-y-14">
        
        {/* Section Header */}
        <div
          className={`space-y-3 max-w-2xl ${
            isVisible ? 'animate-section-reveal' : 'opacity-0'
          }`}
          style={{ animationDelay: '0ms' }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#F4F4F5] leading-tight tracking-tight">
            {costControl.heading}
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1AA] leading-[1.75]">
            {costControl.description}
          </p>
        </div>

        {/* 3 Cost Principles: Flat Sequence with Subtle Dividers on Desktop (No Giant Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x-reverse md:divide-x md:divide-[#18181B]">
          {costControl.principles.map((item, idx) => {
            const delay = `${(idx + 1) * 33}ms`;

            return (
              <div
                key={item.id}
                className={`space-y-2.5 ${
                  idx === 0
                    ? 'md:pl-8 lg:pl-10'
                    : idx === 1
                    ? 'md:px-8 lg:px-10'
                    : 'md:pr-8 lg:pr-10'
                } ${isVisible ? 'animate-section-reveal' : 'opacity-0'}`}
                style={{ animationDelay: delay }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="font-latin text-xs font-semibold text-[#7C3AED] select-none"
                    dir="ltr"
                  >
                    0{idx + 1}
                  </span>
                  <div className="h-px w-5 bg-[#27272A]" />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#F4F4F5] tracking-tight">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#A1A1AA] leading-[1.7] max-w-sm">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Restrained Example Cost Control Surface + Calm Limit Guarantee */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch ${
            isVisible ? 'animate-section-reveal' : 'opacity-0'
          }`}
          style={{ animationDelay: '100ms' }}
        >
          
          {/* Right in RTL: Calm Reserve Limit Behavior (Trust & Transparency) */}
          <div className="lg:col-span-6 bg-[#09090C] border border-[#1C1C20] rounded-lg p-5 sm:p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#7C3AED]">
                <Lock className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider font-latin" dir="ltr">
                  Execution Budget Ceiling
                </span>
              </div>

              <h4 className="text-base font-bold text-[#F4F4F5] leading-snug">
                رفتار سیستم هنگام رسیدن به سقف رزرو:
              </h4>

              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                {costControl.reserveRule}
              </p>
            </div>

            <div className="pt-3.5 border-t border-[#18181D] flex items-center justify-between text-xs text-[#71717A]">
              <span>بدون غافلگیری در تسویه حساب</span>
              <span className="font-latin text-[#52525B]" dir="ltr">No Overdraft Guarantee</span>
            </div>
          </div>

          {/* Left in RTL: Restrained Conceptual Cost Visualization (No fake pricing/fintech widgets) */}
          <div className="lg:col-span-6 bg-[#0A0A0D] border border-[#222226] rounded-lg p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-4">
            
            {/* Header: Concept Tag */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#18181B]">
              <span className="text-xs font-medium text-[#71717A]">
                الگوی تخصیص و کنترل هزینه تسک:
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#121216] border border-[#222226]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                <span className="text-[11px] font-medium text-[#D4D4D8]">
                  {costControl.preview.tag}
                </span>
              </div>
            </div>

            {/* Conceptual Cost Control Rows */}
            <div className="space-y-3 text-xs">
              
              {/* Row 1: Estimated range */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded bg-[#0D0D11] border border-[#18181D]">
                <span className="text-[#A1A1AA]">{costControl.preview.estimateLabel}:</span>
                <span className="text-[#F4F4F5] font-medium">
                  {costControl.preview.estimateValue}
                </span>
              </div>

              {/* Row 2: Hard reserve limit */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded bg-[#0D0D11] border border-[#18181D]">
                <span className="text-[#A1A1AA]">{costControl.preview.maxReserveLabel}:</span>
                <div className="flex items-center gap-1.5 text-[#F4F4F5] font-medium">
                  <span>{costControl.preview.maxReserveValue}</span>
                  <span className="text-[11px] text-[#7C3AED] font-latin">(Hard Cap)</span>
                </div>
              </div>

              {/* Row 3: Actual settle on real usage */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded bg-[#0D0D11] border border-[#18181D]">
                <span className="text-[#A1A1AA]">{costControl.preview.currentUsageLabel}:</span>
                <span className="text-[#10B981] font-medium">
                  {costControl.preview.currentUsageValue}
                </span>
              </div>

            </div>

            {/* Footnote */}
            <div className="pt-2 text-[11px] text-[#71717A] text-left font-latin" dir="ltr">
              Bounded Execution · Actual Resource Settlement
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
