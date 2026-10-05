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

  // Section 1: How It Works
  howItWorks: {
    title: 'چطور کار می‌کند؟',
    supporting: 'از ثبت درخواست تا تحویل خروجی، مسیر اجرا شفاف و قابل پیگیری است.',
    steps: [
      {
        num: '01',
        title: 'تسک را بسپار',
        description: 'پروژه، مخزن، ZIP یا فایل‌ها را انتخاب کن و دقیقاً بگو چه تغییری می‌خواهی.',
      },
      {
        num: '02',
        title: 'اجرا می‌شود',
        description: 'مدل را انتخاب می‌کنی و سیستم تسک را به Worker سازگار و دارای ظرفیت اجرا می‌سپارد.',
      },
      {
        num: '03',
        title: 'خروجی را تحویل بگیر',
        description: 'نتیجه به شکل Pull Request، Patch یا ZIP همراه با وضعیت تست‌ها و بررسی خروجی تحویل می‌شود.',
      },
    ],
  },

  // Section 2: Output & Deliverables
  output: {
    headline: {
      line1: 'فقط جواب نمی‌گیری.',
      line2: 'خروجی قابل استفاده تحویل می‌گیری.',
    },
    description:
      'نتیجه‌ی هر تسک می‌تواند مستقیماً وارد جریان توسعه‌ی شما شود؛ از Pull Request تا فایل Patch و خروجی کامل پروژه.',
    deliverables: [
      {
        id: 'pr',
        title: 'Pull Request',
        description: 'آماده برای بررسی و Merge',
      },
      {
        id: 'patch',
        title: 'Patch',
        description: 'تغییرات قابل اعمال روی پروژه',
      },
      {
        id: 'zip',
        title: 'ZIP',
        description: 'نسخه کامل خروجی',
      },
      {
        id: 'tests',
        title: 'Tests & QA',
        description: 'وضعیت تست‌ها و بررسی نتیجه',
      },
    ],
  },

  // Section 3: Execution Network
  executionNetwork: {
    heading: 'تسک به جایی می‌رود که ظرفیت اجرای آن وجود دارد.',
    description:
      'مدل را انتخاب می‌کنی. سیستم بین Workerهای آماده، سازگار و دارای ظرفیت، اجرای مناسب را پیدا می‌کند و تسک را برای اجرا ارسال می‌کند.',
    steps: [
      { id: 'task', titleFa: 'تسک', titleEn: 'Task' },
      { id: 'scheduler', titleFa: 'زمان‌بند', titleEn: 'Scheduler' },
      { id: 'worker', titleFa: 'Worker واجد شرایط', titleEn: 'Eligible Worker' },
      { id: 'execution', titleFa: 'اجرا', titleEn: 'Execution' },
      { id: 'result', titleFa: 'خروجی', titleEn: 'Result' },
    ],
    eligibilityTitle: 'معیارهای واجد شرایط بودن Worker:',
    eligibilityItems: [
      'پشتیبانی سخت‌افزاری و نرم‌افزاری از مدل انتخابی',
      'آنلاین بودن، پایداری و سلامت کامل گره',
      'داشتن اسلات پردازش آزاد بدون تداخل',
      'ظرفیت اجرای باقی‌مانده‌ی کافی در حساب ارائه‌دهنده',
    ],
    modelRule: {
      title: 'مدلی که انتخاب می‌کنی بدون اجازه تغییر نمی‌کند.',
      description: 'اگر Worker مناسب همان مدل در دسترس نباشد، تسک در صف می‌ماند تا ظرفیت مناسب پیدا شود.',
    },
  },

  // Section 4: Cost Control & Reserve Ceiling
  costControl: {
    heading: 'قبل از اجرا، سقف هزینه دست خودت است.',
    description:
      'پیش از اجرای تسک، هزینه تخمینی و حداکثر مبلغ قابل مصرف را می‌بینی. هزینه نهایی بر اساس مصرف واقعی محاسبه می‌شود و اجرا بدون اجازه از سقفی که تعیین شده عبور نمی‌کند.',
    principles: [
      {
        id: 'estimate',
        title: 'تخمین هزینه',
        description: 'قبل از شروع، محدوده تقریبی هزینه را می‌بینی.',
      },
      {
        id: 'reserve',
        title: 'حداکثر رزرو',
        description: 'بیش از سقفی که مشخص شده مصرف نمی‌شود.',
      },
      {
        id: 'actual',
        title: 'هزینه نهایی',
        description: 'فقط بر اساس مصرف واقعی تسویه می‌شود.',
      },
    ],
    reserveRule:
      'اگر اجرا به سقف رزرو برسد، تسک متوقف می‌شود و برای ادامه از شما تأیید می‌گیرد.',
    preview: {
      tag: 'کنترل خودکار بودجه',
      estimateLabel: 'هزینه تخمینی',
      estimateValue: 'محدوده مشخص قبل از شروع',
      maxReserveLabel: 'حداکثر رزرو مجاز',
      maxReserveValue: 'سقف قطعی تعیین‌شده',
      currentUsageLabel: 'مصرف پردازشی فعلی',
      currentUsageValue: 'تسویه دقیق بر اساس مصرف واقعی',
      ceilingGuarantee: 'تضمین عدم تجاوز از سقف رزرو بدون تایید کاربر',
    },
  },

  // Section 5: For Operators
  forOperators: {
    heading: 'ظرفیت اجرایی‌ات را در اختیار شبکه بگذار.',
    description:
      'Worker را متصل کن، ظرفیت اجرای حساب‌های پشتیبانی‌شده را در اختیار شبکه قرار بده و بر اساس اجرای واقعی تسک‌ها درآمد داشته باش.',
    points: [
      {
        id: 'connect',
        title: 'Worker را متصل کن',
        description: 'اتصال سریع گره با کانتینرهای ایزوله و اجرای امن',
      },
      {
        id: 'capacity',
        title: 'ظرفیت در دسترس را مشخص کن',
        description: 'تنظیم دقیق اسلات‌های قابل اختصاص بدون افت توان سیستم',
      },
      {
        id: 'earnings',
        title: 'از اجرای تسک‌ها درآمد بگیر',
        description: 'تسویه شفاف بر پایه تسک‌های موفق و پردازش ثبت‌شده',
      },
    ],
    cta: 'ورود به فضای اپراتور',
    preview: {
      workerLabel: 'وضعیت Worker',
      workerStatus: 'آنلاین',
      capacityLabel: 'ظرفیت اسلات‌ها',
      capacityValue: '۳ / ۵',
      activeTasksLabel: 'تسک‌های فعال',
      activeTasksValue: '۲ تسک',
      earningsLabel: 'درآمد قابل برداشت',
      earningsValue: 'تسویه بر اساس کارکرد واقعی',
    },
  },

  // Section 6: Final Call to Action
  finalCta: {
    headline: 'یک تسک واقعی بسپار.',
    supporting: 'پروژه را بده، مدل را انتخاب کن و نتیجه قابل استفاده تحویل بگیر.',
    button: 'شروع یک تسک',
  },

  // Footer Navigation & Legal
  footer: {
    productGroup: {
      title: 'محصول',
      links: [
        { label: 'محصول', href: '#how-it-works', target: 'scroll' },
        { label: 'تحویل‌پذیرها', href: '#output', target: 'scroll' },
        { label: 'شبکه اجرا', href: '#execution-network', target: 'scroll' },
        { label: 'برای اپراتورها', href: '/operator', target: 'route' },
      ],
    },
    resourcesGroup: {
      title: 'منابع',
      links: [
        { label: 'مستندات فنی', href: '/settings', target: 'route' },
        { label: 'راهنمای اجرا', href: '#how-it-works', target: 'scroll' },
      ],
    },
    legalGroup: {
      title: 'حقوقی',
      links: [
        { label: 'شرایط استفاده', href: '#terms', target: 'info' },
        { label: 'حریم خصوصی و داده‌ها', href: '#privacy', target: 'info' },
      ],
    },
    accountGroup: {
      title: 'حساب',
      links: [
        { label: 'ورود به پنل مشتری', href: '/dashboard', target: 'route' },
        { label: 'فضای اپراتور', href: '/operator', target: 'route' },
      ],
    },
    copyright: 'تمامی حقوق و استانداردها محفوظ است · ۱۴۰۵',
    technicalTag: 'Infrastructure Task Execution Engine',
  },
} as const;

export type BrandConfig = typeof BRAND;
