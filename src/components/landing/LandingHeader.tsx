import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { BRAND } from '../../config/brand';
import { Menu, X, ArrowLeft } from 'lucide-react';

export const LandingHeader: React.FC = () => {
  const { navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (target: string) => {
    setMobileMenuOpen(false);
    if (target === 'operators') {
      const el = document.getElementById('operators');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/operator');
      }
    } else if (target === 'login') {
      navigate('/dashboard');
    } else if (target === 'new_task') {
      navigate('/tasks/new');
    } else if (target === 'product') {
      const el = document.getElementById('how-it-works');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (target === 'docs') {
      const el = document.getElementById('execution-network');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Smooth scroll to top (hero)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full border-b border-[#18181B] bg-[#050506]/95 backdrop-blur-md sticky top-0 z-40 select-none">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between">
        
        {/* Right side in RTL: Brand & Restrained Nav */}
        <div className="flex items-center gap-8 sm:gap-10">
          {/* Brand Logo / Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-right cursor-pointer group focus:outline-none"
            aria-label={BRAND.name}
          >
            {/* Geometric technical mark */}
            <div className="h-6 w-6 rounded bg-[#121217] border border-[#27272A] flex items-center justify-center text-[#7C3AED] group-hover:border-[#7C3AED]/50 transition-colors">
              <span className="font-bold text-xs font-latin">N</span>
            </div>
            <span className="font-latin text-base font-bold tracking-tight text-[#F4F4F5] group-hover:text-white transition-colors">
              {BRAND.name}
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-[15px]" aria-label="ناوبری اصلی">
            <button
              onClick={() => handleNavClick('product')}
              className="text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors cursor-pointer"
            >
              {BRAND.nav.product}
            </button>
            <button
              onClick={() => handleNavClick('operators')}
              className="text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors cursor-pointer"
            >
              {BRAND.nav.forOperators}
            </button>
            <button
              onClick={() => handleNavClick('docs')}
              className="text-[#71717A] hover:text-[#A1A1AA] transition-colors cursor-pointer"
            >
              {BRAND.nav.docs}
            </button>
          </nav>
        </div>

        {/* Left side in RTL: Login & Primary CTA */}
        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={() => handleNavClick('login')}
            className="text-[14px] text-[#A1A1AA] hover:text-[#F4F4F5] px-3 py-1.5 transition-colors cursor-pointer"
          >
            {BRAND.cta.login}
          </button>

          <button
            onClick={() => handleNavClick('new_task')}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-[#7C3AED] hover:bg-[#8B5CF6] active:bg-[#6D28D9] text-white text-[14px] font-medium transition-colors cursor-pointer shadow-xs"
          >
            <span>{BRAND.cta.startTask}</span>
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => handleNavClick('new_task')}
            className="h-8 px-3 rounded bg-[#7C3AED] text-white text-xs font-medium cursor-pointer"
          >
            {BRAND.cta.startTask}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md text-[#71717A] hover:text-[#F4F4F5] hover:bg-[#121215] cursor-pointer"
            aria-label="منوی سایت"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-[#18181B] bg-[#09090C] px-4 py-4 space-y-3 animate-hero-reveal">
          <nav className="flex flex-col space-y-2 text-sm text-right">
            <button
              onClick={() => handleNavClick('product')}
              className="p-2 text-[#A1A1AA] hover:text-[#F4F4F5] rounded text-right transition-colors"
            >
              {BRAND.nav.product}
            </button>
            <button
              onClick={() => handleNavClick('operators')}
              className="p-2 text-[#A1A1AA] hover:text-[#F4F4F5] rounded text-right transition-colors"
            >
              {BRAND.nav.forOperators}
            </button>
            <button
              onClick={() => handleNavClick('docs')}
              className="p-2 text-[#71717A] hover:text-[#A1A1AA] rounded text-right transition-colors"
            >
              {BRAND.nav.docs}
            </button>
          </nav>

          <div className="pt-2 border-t border-[#18181B] flex items-center justify-between">
            <button
              onClick={() => handleNavClick('login')}
              className="text-sm text-[#A1A1AA] hover:text-[#F4F4F5] p-2"
            >
              {BRAND.cta.login}
            </button>
            <button
              onClick={() => handleNavClick('new_task')}
              className="h-9 px-4 rounded bg-[#7C3AED] text-white text-xs font-medium"
            >
              {BRAND.cta.startTask}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
