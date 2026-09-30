/**
 * Centralized Brand & Product Configuration
 * 
 * IMPORTANT:
 * The product name is NOT final yet.
 * Do not hardcode "NERVEL" throughout the landing page.
 * Always import and use these centralized brand constants across all public landing components.
 */

export const BRAND = {
  // Temporary product brand identifier
  name: 'NERVEL',
  // Localized transliteration
  nameFa: 'نِروِل',
  // Short product tagline
  tagline: 'زیرساخت اجرای خودکار تسک‌های نرم‌افزاری',
  // Temporary representative model name for execution preview
  defaultModelName: 'Claude 3.7 Sonnet',
  defaultModelId: 'claude-3-7-sonnet',
  
  // Header navigation items
  nav: {
    product: 'محصول',
    forOperators: 'برای اپراتورها',
    docs: 'مستندات',
  },

  // Hero headline
  headline: {
    line1: 'تسک نرم‌افزاری‌ات را بسپار.',
    line2: 'اجراشده تحویل بگیر.',
  },

  // Hero supporting explanation
  description:
    'پروژه، فایل یا مخزن را بده. مدل را انتخاب کن. سیستم تسک را به ظرفیت مناسب می‌سپارد، اجرا را کنترل می‌کند و خروجی را به شکل PR، Patch یا ZIP تحویل می‌دهد.',

  // Calls to action
  cta: {
    startTask: 'شروع یک تسک',
    howItWorks: 'چطور کار می‌کند؟',
    login: 'ورود',
  },
} as const;

export type BrandConfig = typeof BRAND;
