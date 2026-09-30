import React from 'react';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { BRAND } from '../../config/brand';

export const LandingShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050506] text-[#F4F4F5] flex flex-col font-sans selection:bg-[#7C3AED]/25 selection:text-[#F4F4F5]">
      {/* 1. Minimal Public Header */}
      <LandingHeader />

      {/* 2. Main Public Content Area */}
      <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <HeroSection />
      </main>

      {/* 3. Minimal Public Subtle Footer Line */}
      <footer className="w-full border-t border-[#141418] py-6 text-xs text-[#52525B] select-none">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
          <div className="flex items-center gap-2 font-latin" dir="ltr">
            <span className="font-medium text-[#71717A]">{BRAND.name}</span>
            <span>·</span>
            <span>Software Task Execution Infrastructure</span>
          </div>
          <div className="text-[11px] text-[#52525B]">
            تمامی حقوق و استانداردها محفوظ است · ۱۴۰۵
          </div>
        </div>
      </footer>
    </div>
  );
};
