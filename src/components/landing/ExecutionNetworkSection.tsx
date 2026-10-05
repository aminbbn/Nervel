import React, { useState, useEffect } from 'react';
import { BRAND } from '../../config/brand';
import { useScrollReveal } from './useScrollReveal';
import {
  ArrowLeft,
  ArrowDown,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Clock,
  Layers,
} from 'lucide-react';

export const ExecutionNetworkSection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal();
  const { executionNetwork } = BRAND;

  // Controlled, subtle step progression (quiet cycle with a long 6s pause at completion)
  const [activeStage, setActiveStage] = useState<number>(2); // Default to 'Eligible Worker'
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (!isVisible || isPaused) return;

    const timer = setInterval(() => {
      setActiveStage((prev) => {
        if (prev < executionNetwork.steps.length - 1) {
          return prev + 1;
        }
        // At the final stage (Result), wait before quietly cycling back
        return 0;
      });
    }, 4200);

    return () => clearInterval(timer);
  }, [isVisible, isPaused, executionNetwork.steps.length]);

  return (
    <section
      id="execution-network"
      ref={ref}
      className="relative w-full py-16 sm:py-20 lg:py-24 border-t border-[#18181B] text-right"
      aria-label="شبکه اجرای تسک"
    >
      <div className="space-y-12 sm:space-y-14">
        
        {/* Section Heading & Supporting Copy */}
        <div
          className={`space-y-3 max-w-2xl ${
            isVisible ? 'animate-section-reveal' : 'opacity-0'
          }`}
          style={{ animationDelay: '0ms' }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#F4F4F5] leading-tight tracking-tight">
            {executionNetwork.heading}
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1AA] leading-[1.75]">
            {executionNetwork.description}
          </p>
        </div>

        {/* Minimal Execution Flow Process Diagram */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className={`space-y-3 ${
            isVisible ? 'animate-section-reveal' : 'opacity-0'
          }`}
          style={{ animationDelay: '33ms' }}
        >
          <div className="text-xs font-medium text-[#71717A]">
            جریان انتقال و اجرای تسک (Execution Flow):
          </div>

          {/* Desktop Horizontal / Mobile Vertical Diagram */}
          <div className="bg-[#0A0A0D] border border-[#222226] rounded-lg p-5 sm:p-6 shadow-xl">
            
            {/* Desktop Sequence (Hidden on mobile) */}
            <div className="hidden lg:flex items-center justify-between gap-3" dir="rtl">
              {executionNetwork.steps.map((step, idx) => {
                const isCurrent = idx === activeStage;
                const isPassed = idx < activeStage;
                const isLast = idx === executionNetwork.steps.length - 1;

                return (
                  <React.Fragment key={step.id}>
                    {/* Process Stage Block */}
                    <div
                      onClick={() => setActiveStage(idx)}
                      className={`flex-1 min-w-[130px] p-3 rounded-md border text-center transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#14121F] border-[#7C3AED]/70 shadow-xs'
                          : isPassed
                          ? 'bg-[#0E0E12] border-[#27272A]'
                          : 'bg-[#0A0A0D] border-[#1C1C20] opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-1.5">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isCurrent
                              ? 'bg-[#7C3AED]'
                              : isPassed
                              ? 'bg-[#10B981]'
                              : 'bg-[#3F3F46]'
                          }`}
                        />
                        <span
                          className="font-latin text-[11px] text-[#71717A] tracking-wider"
                          dir="ltr"
                        >
                          {step.titleEn}
                        </span>
                      </div>
                      <div
                        className={`text-xs sm:text-[13px] font-bold truncate ${
                          isCurrent
                            ? 'text-[#F4F4F5]'
                            : isPassed
                            ? 'text-[#D4D4D8]'
                            : 'text-[#71717A]'
                        }`}
                      >
                        {step.titleFa}
                      </div>
                    </div>

                    {/* Clean Directional Connector Arrow */}
                    {!isLast && (
                      <div className="shrink-0 text-[#3F3F46] px-1 select-none">
                        <ArrowLeft className="h-4 w-4" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Mobile Vertical Sequence (Visible on small screens) */}
            <div className="flex lg:hidden flex-col space-y-2.5">
              {executionNetwork.steps.map((step, idx) => {
                const isCurrent = idx === activeStage;
                const isPassed = idx < activeStage;
                const isLast = idx === executionNetwork.steps.length - 1;

                return (
                  <React.Fragment key={step.id}>
                    <div
                      onClick={() => setActiveStage(idx)}
                      className={`p-3 rounded-md border flex items-center justify-between transition-colors ${
                        isCurrent
                          ? 'bg-[#14121F] border-[#7C3AED]/70'
                          : isPassed
                          ? 'bg-[#0E0E12] border-[#27272A]'
                          : 'bg-[#0A0A0D] border-[#1C1C20]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isCurrent
                              ? 'bg-[#7C3AED]'
                              : isPassed
                              ? 'bg-[#10B981]'
                              : 'bg-[#3F3F46]'
                          }`}
                        />
                        <span
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-[#F4F4F5]'
                              : isPassed
                              ? 'text-[#D4D4D8]'
                              : 'text-[#71717A]'
                          }`}
                        >
                          {step.titleFa}
                        </span>
                      </div>
                      <span className="font-latin text-xs text-[#71717A]" dir="ltr">
                        {step.titleEn}
                      </span>
                    </div>

                    {!isLast && (
                      <div className="flex justify-center text-[#3F3F46] py-0.5">
                        <ArrowDown className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Quiet Footer Note below Diagram */}
            <div className="mt-4 pt-3 border-t border-[#18181B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#71717A]">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED]" />
                <span>مسیریابی بر اساس ظرفیت و آمادگی واقعی منابع پردازشی انجام می‌شود.</span>
              </div>
              <div className="text-[11px] text-[#52525B] font-latin" dir="ltr">
                Deterministic Capacity Dispatch
              </div>
            </div>

          </div>
        </div>

        {/* 2-Column Row: Worker Eligibility Criteria & Model Selection Rule */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Right Column in RTL: Worker Eligibility (4 clear criteria) */}
          <div
            className={`lg:col-span-7 bg-[#09090C] border border-[#1C1C20] rounded-lg p-5 sm:p-6 space-y-4 ${
              isVisible ? 'animate-section-reveal' : 'opacity-0'
            }`}
            style={{ animationDelay: '66ms' }}
          >
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#F4F4F5]">
                {executionNetwork.eligibilityTitle}
              </h3>
              <p className="text-xs text-[#71717A]">
                تسک تنها به گره‌هایی تخصیص داده می‌شود که شرایط چهارگانه احراز را برآورده کنند:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {executionNetwork.eligibilityItems.map((criterion, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded bg-[#0D0D11] border border-[#18181D]"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#7C3AED] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#D4D4D8] leading-relaxed">
                    {criterion}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Left Column in RTL: Model Selection Principle (Trust & Consistency Guarantee) */}
          <div
            className={`lg:col-span-5 bg-[#09090C] border border-[#1C1C20] rounded-lg p-5 sm:p-6 flex flex-col justify-between space-y-4 ${
              isVisible ? 'animate-section-reveal' : 'opacity-0'
            }`}
            style={{ animationDelay: '100ms' }}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#7C3AED]">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider font-latin" dir="ltr">
                  Model Integrity Guarantee
                </span>
              </div>

              <h3 className="text-base font-bold text-[#F4F4F5] leading-snug">
                {executionNetwork.modelRule.title}
              </h3>

              <p className="text-xs sm:text-[13px] text-[#A1A1AA] leading-relaxed">
                {executionNetwork.modelRule.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#18181D] flex items-center justify-between text-[11px] text-[#71717A]">
              <span>عدم تغییر مدل یا کاهش کیفیت</span>
              <span className="font-latin text-[#52525B]" dir="ltr">Fixed Model Binding</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
