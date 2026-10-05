import React from 'react';
import { BRAND } from '../../config/brand';
import { useScrollReveal } from './useScrollReveal';

export const HowItWorksSection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal();
  const { howItWorks } = BRAND;

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative w-full py-16 sm:py-20 lg:py-24 border-t border-[#18181B] text-right"
      aria-label={howItWorks.title}
    >
      <div className="space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div
          className={`space-y-3 max-w-2xl ${
            isVisible ? 'animate-section-reveal' : 'opacity-0'
          }`}
          style={{ animationDelay: '0ms' }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#F4F4F5] leading-tight tracking-tight">
            {howItWorks.title}
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1AA] leading-[1.75]">
            {howItWorks.supporting}
          </p>
        </div>

        {/* Flat Horizontal Sequence on Desktop, Stacked on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x-reverse md:divide-x md:divide-[#18181B]">
          {howItWorks.steps.map((step, idx) => {
            // duration: 100ms with ~duration/3 overlap (approx 33ms per step)
            const delay = `${(idx + 1) * 33}ms`;

            return (
              <div
                key={step.num}
                className={`space-y-3.5 ${
                  idx === 0
                    ? 'md:pl-8 lg:pl-10'
                    : idx === 1
                    ? 'md:px-8 lg:px-10'
                    : 'md:pr-8 lg:pr-10'
                } ${isVisible ? 'animate-section-reveal' : 'opacity-0'}`}
                style={{ animationDelay: delay }}
              >
                {/* Numeric Monospace Sequence Tag */}
                <div className="flex items-center gap-2">
                  <span
                    className="font-latin text-xs font-semibold tracking-wider text-[#7C3AED] select-none"
                    dir="ltr"
                  >
                    {step.num}
                  </span>
                  <div className="h-px w-6 bg-[#27272A]" />
                </div>

                {/* Step Title */}
                <h3 className="text-lg sm:text-[19px] font-bold text-[#F4F4F5] tracking-tight">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-sm text-[#A1A1AA] leading-[1.7] max-w-sm">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
