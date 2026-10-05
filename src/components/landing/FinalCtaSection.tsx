import React from 'react';
import { BRAND } from '../../config/brand';
import { useRouter } from '../../context/RouterContext';
import { useScrollReveal } from './useScrollReveal';
import { ArrowLeft } from 'lucide-react';

export const FinalCtaSection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal();
  const { navigate } = useRouter();
  const { finalCta } = BRAND;

  return (
    <section
      ref={ref}
      className="relative w-full py-20 sm:py-24 lg:py-28 border-t border-[#18181B] text-center"
      aria-label="اقدام نهایی"
    >
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Headline */}
        <div
          className={`space-y-3 ${
            isVisible ? 'animate-section-reveal' : 'opacity-0'
          }`}
          style={{ animationDelay: '0ms' }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#F4F4F5] tracking-tight leading-tight">
            {finalCta.headline}
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
            {finalCta.supporting}
          </p>
        </div>

        {/* Single Restrained Primary Action */}
        <div
          className={`pt-2 ${
            isVisible ? 'animate-section-reveal' : 'opacity-0'
          }`}
          style={{ animationDelay: '33ms' }}
        >
          <button
            onClick={() => navigate('/tasks/new')}
            className="inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-7 rounded-md bg-[#7C3AED] hover:bg-[#8B5CF6] active:bg-[#6D28D9] text-white text-sm sm:text-[15px] font-medium transition-colors cursor-pointer shadow-sm group"
          >
            <span>{finalCta.button}</span>
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
