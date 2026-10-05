import React, { useState } from 'react';
import { Button } from '../common/Button';
import { getAllModels } from '../../services/modelRegistry';
import { toast } from '../../context/ToastContext';
import {
  Check,
  Building,
  Sliders,
  AlertTriangle,
  Bell,
  Key,
  FolderGit2,
  ExternalLink,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  // Navigation / active section tab
  const [activeSection, setActiveSection] = useState<string>('account');

  // Account state
  const [orgName, setOrgName] = useState<string>('تیم مهندسی پارسا');
  const [contactEmail, setContactEmail] = useState<string>('amin@parsa.tech');
  const [timezone, setTimezone] = useState<string>('Asia/Tehran');

  // Task defaults state
  const [defaultModel, setDefaultModel] = useState<string>('claude-3-7-sonnet');
  const [defaultBranch, setDefaultBranch] = useState<string>('main');
  const [defaultReservedCap, setDefaultReservedCap] = useState<string>('120000');
  const [defaultTestCommand, setDefaultTestCommand] = useState<string>('npm test');
  const [defaultOutputFormat, setDefaultOutputFormat] = useState<string>('pr');

  // Worker failure behavior
  const [workerFailurePolicy, setWorkerFailurePolicy] = useState<string>('ask_then_auto');

  // Notifications state
  const [smsOnWorkerAsk, setSmsOnWorkerAsk] = useState<boolean>(true);
  const [emailOnCompletion, setEmailOnCompletion] = useState<boolean>(true);
  const [actionRequiredAlerts, setActionRequiredAlerts] = useState<boolean>(true);
  const [phoneNumber, setPhoneNumber] = useState<string>('09123456789');
  const [webhookUrl, setWebhookUrl] = useState<string>('https://api.parsa.ir/nervel-events');

  // Security state
  const [apiKey] = useState<string>('nrv_live_9f82a472c10b7194e8');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(true);

  // Save feedback
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    toast.success('تنظیمات حساب کاربری ذخیره شد');
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(apiKey);
    setIsCopied(true);
    toast.info('کلید API در حافظه کپی شد');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const navSections = [
    { id: 'account', label: 'حساب کاربری', icon: Building },
    { id: 'task_defaults', label: 'پیش‌فرض‌های تسک', icon: Sliders },
    { id: 'worker_failure', label: 'رفتار قطعی ورکر', icon: AlertTriangle },
    { id: 'notifications', label: 'اطلاع‌رسانی', icon: Bell },
    { id: 'integrations', label: 'اتصال به GitHub', icon: FolderGit2 },
    { id: 'security', label: 'امنیت و کلیدها', icon: Key },
  ];

  return (
    <div className="w-full space-y-8 animate-nervel-enter">
      {/* Page Header as ONE horizontal composition */}
      <div className="flex flex-row items-center justify-between gap-4 pb-2 border-b border-[#18181C]">
        <div>
          <h1 className="text-2xl sm:text-[26px] font-bold text-[#F4F4F5]">
            تنظیمات
          </h1>
          <p className="text-sm text-[#71717A] mt-1 leading-relaxed">
            پیکربندی هویت سازمان، مقادیر پیش‌فرض تسک‌ها، رفتار زمان‌بند در برابر خطای ورکر و کلیدهای دسترسی API
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs shrink-0 animate-nervel-enter">
            <Check className="h-4 w-4" />
            <span>تنظیمات ذخیره شد</span>
          </div>
        )}
      </div>

      {/* Cloudflare-style Section Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-medium border-b border-[#18181C]">
        {navSections.map((sec) => {
          const IconComp = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-[#7C3AED] text-[#F4F4F5] font-medium'
                  : 'border-transparent text-[#71717A] hover:text-[#D4D4D8]'
              }`}
            >
              <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-[#7C3AED]' : 'text-[#71717A]'}`} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-0 divide-y divide-[#18181C]">
        
        {/* =========================================================================
            SECTION 1: حساب کاربری (ACCOUNT)
            ========================================================================= */}
        {activeSection === 'account' && (
          <>
            {/* Setting: Organization Name */}
            <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 space-y-1">
                <h3 className="text-base font-semibold text-[#F4F4F5]">نام تیم یا سازمان</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">
                  عنوان نمایش‌داده‌شده در گزارش‌ها و اعلانات تسک‌ها.
                </p>
              </div>
              <div className="lg:col-span-6 lg:pr-6">
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full h-10 rounded border border-[#27272A] bg-[#09090C] px-3 text-sm text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none"
                />
              </div>
            </div>

            {/* Setting: Contact Email */}
            <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 space-y-1">
                <h3 className="text-base font-semibold text-[#F4F4F5]">ایمیل ارتباطات فنی</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">
                  ارسال گزارش‌های تحویل کد، نتایج QA و اعلانات مهم سامانه.
                </p>
              </div>
              <div className="lg:col-span-6 lg:pr-6">
                <input
                  type="email"
                  dir="ltr"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full h-10 rounded border border-[#27272A] bg-[#09090C] px-3 text-sm text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none"
                />
              </div>
            </div>

            {/* Setting: Timezone */}
            <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 space-y-1">
                <h3 className="text-base font-semibold text-[#F4F4F5]">منطقه زمانی گزارش‌ها</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">
                  مبنای ثبت زمان رویدادها، خطوط زمانی و لاگ‌های کانتینر.
                </p>
              </div>
              <div className="lg:col-span-6 lg:pr-6">
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full h-10 rounded border border-[#27272A] bg-[#09090C] px-3 text-sm text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none cursor-pointer"
                >
                  <option value="Asia/Tehran">تهران — Asia/Tehran (GMT+3:30)</option>
                  <option value="UTC">هماهنگ جهانی — UTC</option>
                  <option value="Europe/London">لندن — Europe/London</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* =========================================================================
            SECTION 2: پیش‌فرض‌های تسک (TASK DEFAULTS)
            ========================================================================= */}
        {activeSection === 'task_defaults' && (
          <>
            {/* Setting: Default Model */}
            <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 space-y-1">
                <h3 className="text-base font-semibold text-[#F4F4F5]">مدل هوش مصنوعی پیش‌فرض</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">
                  موتور انتخابی خودکار در فرم ثبت تسک‌های جدید.
                </p>
              </div>
              <div className="lg:col-span-6 lg:pr-6">
                <select
                  value={defaultModel}
                  onChange={(e) => setDefaultModel(e.target.value)}
                  className="w-full h-10 rounded border border-[#27272A] bg-[#09090C] px-3 text-sm text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none cursor-pointer"
                >
                  {getAllModels().map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} {m.recommended ? '(پیشنهادی)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Setting: Default Branch */}
            <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 space-y-1">
                <h3 className="text-base font-semibold text-[#F4F4F5]">شاخه کاری پیش‌فرض در مخازن</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">
                  شاخه‌ای که ورکرها به عنوان مبنای کار انتخاب می‌کنند.
                </p>
              </div>
              <div className="lg:col-span-6 lg:pr-6">
                <input
                  type="text"
                  dir="ltr"
                  value={defaultBranch}
                  onChange={(e) => setDefaultBranch(e.target.value)}
                  className="w-full h-10 rounded border border-[#27272A] bg-[#09090C] px-3 text-sm text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none"
                />
              </div>
            </div>

            {/* Setting: Default Output Format */}
            <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 space-y-1">
                <h3 className="text-base font-semibold text-[#F4F4F5]">قالب تحویل خروجی</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">
                  نحوه ارائه بسته نهایی تغییرات کد پس از پاس شدن تست‌ها.
                </p>
              </div>
              <div className="lg:col-span-6 lg:pr-6">
                <select
                  value={defaultOutputFormat}
                  onChange={(e) => setDefaultOutputFormat(e.target.value)}
                  className="w-full h-10 rounded border border-[#27272A] bg-[#09090C] px-3 text-sm text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none cursor-pointer"
                >
                  <option value="pr">ثبت خودکار Pull Request در GitHub</option>
                  <option value="patch">فایل گیت‌پچ (Git Patch)</option>
                  <option value="zip">آرشیو ZIP فایل‌های اصلاح شده</option>
                </select>
              </div>
            </div>

            {/* Setting: Default Test Command */}
            <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 space-y-1">
                <h3 className="text-base font-semibold text-[#F4F4F5]">دستور پیش‌فرض تست کانتینر</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">
                  دستوری که برای سنجش صحت کدها در سندباکس اجرا می‌شود.
                </p>
              </div>
              <div className="lg:col-span-6 lg:pr-6">
                <input
                  type="text"
                  dir="ltr"
                  value={defaultTestCommand}
                  onChange={(e) => setDefaultTestCommand(e.target.value)}
                  className="w-full h-10 rounded border border-[#27272A] bg-[#09090C] px-3 text-sm text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none"
                />
              </div>
            </div>
          </>
        )}

        {/* =========================================================================
            SECTION 3: رفتار قطعی ورکر (WORKER FAILURE)
            ========================================================================= */}
        {activeSection === 'worker_failure' && (
          <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 space-y-1">
              <h3 className="text-base font-semibold text-[#F4F4F5]">پروتکل قطعی ورکر (Worker Failure)</h3>
              <p className="text-sm text-[#71717A] leading-relaxed">
                تعیین رفتار سامانه در صورت عدم پاسخ ورکر در حین اجرای کانتینر تسک.
              </p>
            </div>
            <div className="lg:col-span-6 lg:pr-6 space-y-2.5">
              {[
                {
                  id: 'ask_then_auto',
                  title: 'ابتدا سوال از مشتری (۵ دقیقه مهلت پاسخ)',
                  desc: 'در صورت عدم پاسخ در ۵ دقیقه، تسک خودکار به ورکر بعدی منتقل می‌شود.',
                },
                {
                  id: 'instant',
                  title: 'انتقال فوری خودکار به ورکر بعدی',
                  desc: 'بلافاصله پس از احراز قطعی، تسک بدون وقفه به ورکر بعدی شبکه واگذار می‌شود.',
                },
                {
                  id: 'wait_forever',
                  title: 'تعلیق دائم تا زمان تصمیم صریح',
                  desc: 'تسک معلق مانده و تا تایید دستی مشتری هیچ جابجایی خودکاری رخ نخواهد داد.',
                },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`p-3 rounded border cursor-pointer block transition-colors ${
                    workerFailurePolicy === opt.id
                      ? 'bg-[#12101A] border-[#7C3AED]'
                      : 'bg-[#09090C] border-[#222226] hover:border-[#2E2E33]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs sm:text-sm text-[#F4F4F5]">{opt.title}</span>
                    <input
                      type="radio"
                      name="workerPolicy"
                      value={opt.id}
                      checked={workerFailurePolicy === opt.id}
                      onChange={() => setWorkerFailurePolicy(opt.id)}
                      className="accent-[#7C3AED]"
                    />
                  </div>
                  <p className="text-xs text-[#71717A] mt-1 leading-normal">{opt.desc}</p>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 4: اطلاع‌رسانی (NOTIFICATIONS)
            ========================================================================= */}
        {activeSection === 'notifications' && (
          <>
            {/* Setting: SMS Alert */}
            <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 space-y-1">
                <h3 className="text-base font-semibold text-[#F4F4F5]">پیامک فوری استعلام ورکر</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">
                  ارسال پیامک در صورتی که ورکر برای رفع ابهام تسک نیاز به پاسخ فوری شما داشته باشد.
                </p>
              </div>
              <div className="lg:col-span-6 lg:pr-6 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-[#D4D4D8]">
                  <input
                    type="checkbox"
                    checked={smsOnWorkerAsk}
                    onChange={(e) => setSmsOnWorkerAsk(e.target.checked)}
                    className="accent-[#7C3AED] h-4 w-4 rounded"
                  />
                  <span>فعال‌سازی پیامک استعلامات فوری</span>
                </label>
                {smsOnWorkerAsk && (
                  <input
                    type="tel"
                    dir="ltr"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="09123456789"
                    className="w-full h-10 rounded border border-[#27272A] bg-[#09090C] px-3 text-xs sm:text-sm text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none"
                  />
                )}
              </div>
            </div>

            {/* Setting: Email on Completion */}
            <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 space-y-1">
                <h3 className="text-base font-semibold text-[#F4F4F5]">ایمیل گزارش تکمیل و PR</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">
                  ارسال گزارش ارزیابی QA، تست‌های پاس‌شده و لینک پول‌ریکوئست.
                </p>
              </div>
              <div className="lg:col-span-6 lg:pr-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-[#D4D4D8]">
                  <input
                    type="checkbox"
                    checked={emailOnCompletion}
                    onChange={(e) => setEmailOnCompletion(e.target.checked)}
                    className="accent-[#7C3AED] h-4 w-4 rounded"
                  />
                  <span>ارسال گزارش کامل پس از اتمام موفق تسک</span>
                </label>
              </div>
            </div>

            {/* Setting: Webhook */}
            <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 space-y-1">
                <h3 className="text-base font-semibold text-[#F4F4F5]">آدرس وب‌هوک رویدادها (Webhook)</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">
                  ارسال پیام‌های JSON همگام با وضعیت تسک‌ها به سرور سازمان.
                </p>
              </div>
              <div className="lg:col-span-6 lg:pr-6">
                <input
                  type="url"
                  dir="ltr"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full h-10 rounded border border-[#27272A] bg-[#09090C] px-3 text-xs sm:text-sm text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none"
                />
              </div>
            </div>
          </>
        )}

        {/* =========================================================================
            SECTION 5: اتصال به گیت‌هاب (GITHUB)
            ========================================================================= */}
        {activeSection === 'integrations' && (
          <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 space-y-1">
              <h3 className="text-base font-semibold text-[#F4F4F5]">اتصال به سازمان GitHub</h3>
              <p className="text-sm text-[#71717A] leading-relaxed">
                مجوز خواندن کدها، راه‌اندازی کانتینرهای تست و ثبت خودکار Pull Request.
              </p>
            </div>
            <div className="lg:col-span-6 lg:pr-6 space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm p-3 rounded bg-[#09090C] border border-[#222226]">
                <div className="flex items-center gap-2">
                  <span className="font-latin text-[#F4F4F5] font-medium" dir="ltr">github.com/parsa-tech</span>
                  <span className="text-[#10B981] text-xs">· متصل</span>
                </div>
                <a
                  href="https://github.com/settings/installations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#7C3AED] hover:underline flex items-center gap-1"
                >
                  <span>مدیریت</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 6: امنیت و کلیدها (SECURITY)
            ========================================================================= */}
        {activeSection === 'security' && (
          <>
            {/* Setting: API Key */}
            <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 space-y-1">
                <h3 className="text-base font-semibold text-[#F4F4F5]">کلید دسترسی API (Production Key)</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">
                  کلید امن برای اتوماسیون CI/CD و ثبت مستقیم تسک از ترمینال.
                </p>
              </div>
              <div className="lg:col-span-6 lg:pr-6 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    dir="ltr"
                    readOnly
                    value={apiKey}
                    className="flex-1 h-10 rounded border border-[#27272A] bg-[#09090C] px-3 text-xs font-latin text-[#D4D4D8] focus:outline-none"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleCopyKey}
                    className="shrink-0"
                  >
                    {isCopied ? 'کپی شد' : 'کپی کلید'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Setting: 2FA */}
            <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 space-y-1">
                <h3 className="text-base font-semibold text-[#F4F4F5]">احراز هویت دومرحله‌ای (2FA)</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">
                  الزام ورود با کد تایید پیامکی یا اپلیکیشن احراز هویت.
                </p>
              </div>
              <div className="lg:col-span-6 lg:pr-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-[#D4D4D8]">
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                    className="accent-[#7C3AED] h-4 w-4 rounded"
                  />
                  <span>احراز هویت دومرحله‌ای فعال باشد</span>
                </label>
              </div>
            </div>
          </>
        )}

        {/* Save Bar */}
        <div className="pt-6 flex items-center justify-between">
          <Button
            type="submit"
            variant="primary"
            className="px-6 py-2.5 font-medium cursor-pointer"
          >
            ذخیره تنظیمات
          </Button>

          {isSaved && (
            <span className="text-xs text-[#10B981] flex items-center gap-1.5 animate-nervel-enter">
              <Check className="h-4 w-4" />
              <span>تنظیمات با موفقیت ذخیره شد.</span>
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
