import React, { useState } from 'react';
import { BRAND } from '../../config/brand';
import { useRouter } from '../../context/RouterContext';
import { X } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  const { navigate } = useRouter();
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);

  const handleLinkClick = (href: string, targetType: string) => {
    if (targetType === 'scroll') {
      const id = href.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (targetType === 'route') {
      navigate(href);
    } else if (targetType === 'info') {
      if (href.includes('terms')) setLegalModal('terms');
      else setLegalModal('privacy');
    }
  };

  return (
    <footer className="w-full border-t border-[#18181B] bg-[#050506] text-xs text-[#71717A] py-12 sm:py-16 select-none">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-10">
        
        {/* Navigation Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-right">
          
          {/* Group 1: Product */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-[#F4F4F5]">
              {BRAND.footer.productGroup.title}
            </h4>
            <ul className="space-y-2">
              {BRAND.footer.productGroup.links.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => handleLinkClick(link.href, link.target)}
                    className="hover:text-[#F4F4F5] transition-colors cursor-pointer text-right"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Group 2: Resources */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-[#F4F4F5]">
              {BRAND.footer.resourcesGroup.title}
            </h4>
            <ul className="space-y-2">
              {BRAND.footer.resourcesGroup.links.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => handleLinkClick(link.href, link.target)}
                    className="hover:text-[#F4F4F5] transition-colors cursor-pointer text-right"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Group 3: Legal */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-[#F4F4F5]">
              {BRAND.footer.legalGroup.title}
            </h4>
            <ul className="space-y-2">
              {BRAND.footer.legalGroup.links.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => handleLinkClick(link.href, link.target)}
                    className="hover:text-[#F4F4F5] transition-colors cursor-pointer text-right"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Group 4: Account */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-[#F4F4F5]">
              {BRAND.footer.accountGroup.title}
            </h4>
            <ul className="space-y-2">
              {BRAND.footer.accountGroup.links.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => handleLinkClick(link.href, link.target)}
                    className="hover:text-[#F4F4F5] transition-colors cursor-pointer text-right"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Sub-Row: Brand Wordmark & Technical Identification */}
        <div className="pt-8 border-t border-[#141418] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div className="flex items-center gap-2 font-latin" dir="ltr">
            <span className="font-bold text-sm text-[#F4F4F5]">{BRAND.name}</span>
            <span>·</span>
            <span className="text-[11px] text-[#52525B]">
              {BRAND.footer.technicalTag}
            </span>
          </div>

          <div className="text-[11px] text-[#52525B]">
            {BRAND.footer.copyright}
          </div>
        </div>

      </div>

      {/* Lightweight Legal Explanatory Modal */}
      {legalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLegalModal(null)}
        >
          <div
            className="w-full max-w-md bg-[#0A0A0D] border border-[#222226] rounded-lg p-5 text-right select-none shadow-2xl space-y-4 animate-hero-reveal"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#18181B]">
              <h3 className="text-sm font-bold text-[#F4F4F5]">
                {legalModal === 'terms' ? 'شرایط استفاده از خدمات' : 'حریم خصوصی و حفاظت از سورس‌کد'}
              </h3>
              <button
                onClick={() => setLegalModal(null)}
                className="p-1 text-[#71717A] hover:text-[#F4F4F5] rounded transition-colors"
                aria-label="بستن"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              {legalModal === 'terms'
                ? 'استفاده از زیرساخت مستلزم رعایت ضوابط کپی‌رایت، مجوزهای نرم‌افزاری معتبر و تعهد به ایمنی محیط‌های اجرای ابری است. تمامی تسک‌ها در کانتینرهای ایزوله و موقت اجرا می‌شوند.'
                : 'کد و فایل‌های پروژه‌ی شما صرفاً در طول مدت اجرای تسک در حافظه و کانتینر اختصاصی قرار می‌گیرند و پس از تحویل نهایی خروجی و انقضای زمانبندی، تمامی ردپاهای محیط موقت به‌صورت خودکار پاکسازی می‌شوند.'}
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setLegalModal(null)}
                className="h-8 px-4 rounded bg-[#18181F] hover:bg-[#22222B] text-xs font-medium text-[#F4F4F5] transition-colors"
              >
                متوجه شدم
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
