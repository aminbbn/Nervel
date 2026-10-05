import React from 'react';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { HowItWorksSection } from './HowItWorksSection';
import { OutputDeliverablesSection } from './OutputDeliverablesSection';
import { ExecutionNetworkSection } from './ExecutionNetworkSection';
import { CostControlSection } from './CostControlSection';
import { ForOperatorsSection } from './ForOperatorsSection';
import { FinalCtaSection } from './FinalCtaSection';
import { LandingFooter } from './LandingFooter';

export const LandingShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050506] text-[#F4F4F5] flex flex-col font-sans selection:bg-[#7C3AED]/25 selection:text-[#F4F4F5]">
      {/* 1. Minimal Public Header */}
      <LandingHeader />

      {/* 2. Main Public Content Sections */}
      <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Section 0: Hero & Live Execution Preview */}
        <HeroSection />

        {/* Section 1: How It Works (3 Steps) */}
        <HowItWorksSection />

        {/* Section 2: Output Deliverables & Realistic Product Output Surface */}
        <OutputDeliverablesSection />

        {/* Section 3: Execution Network & Worker Eligibility */}
        <ExecutionNetworkSection />

        {/* Section 4: Cost Control & Reserve Ceiling */}
        <CostControlSection />

        {/* Section 5: For Operators */}
        <ForOperatorsSection />

        {/* Section 6: Final Call to Action */}
        <FinalCtaSection />
      </main>

      {/* 3. Minimal Public Footer */}
      <LandingFooter />
    </div>
  );
};
