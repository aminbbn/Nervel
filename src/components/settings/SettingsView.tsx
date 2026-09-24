import React, { useState } from 'react';
import { getStaggerStyle } from '../../utils/motion';
import { Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [operatorFailurePolicy, setOperatorFailurePolicy] = useState<string>('ask_then_auto');
  const [smsNotification, setSmsNotification] = useState<boolean>(true);
  const [emailNotification, setEmailNotification] = useState<boolean>(true);
  const [phoneNumber, setPhoneNumber] = useState<string>('09123456789');
  const [githubOrg] = useState<string>('parsa-tech');
  const [webhookUrl, setWebhookUrl] = useState<string>('https://api.parsa.ir/nervel-hook');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Header: 22-24px heading */}
      <div style={getStaggerStyle(0)} className="animate-nervel-enter pb-5 border-b border-[#17171A]">
        <h2 className="text-[22px] sm:text-2xl font-bold text-[#F4F4F5] leading-tight">
          تنظیمات حساب و پیکربندی شبکه
        </h2>
        <p className="text-sm text-[#71717A] mt-1.5 leading-relaxed">
          تعیین رفتار پیش‌فرض در شرایط قطعی ورکر، کانال‌های دریافت اعلان و اتصال به مخازن نرم‌افزاری
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8 text-sm">
        
        {/* Section 1: Worker Disconnect Policy - Flat rows, no cards */}
        <section style={getStaggerStyle(1)} className="animate-nervel-enter space-y-4">
          <div>
            <h3 className="text-[17px] sm:text-lg font-semibold text-[#F4F4F5]">
              رفتار پیش‌فرض هنگام قطعی ورکر
            </h3>
            <p className="text-sm text-[#71717A] mt-1 leading-relaxed">
              در صورت عدم دریافت ۳ ضربان وضعیت متوالی (Heartbeat) از کانتینر، سامانه طبق این دستورالعمل اقدام می‌کند:
            </p>
          </div>

          <div className="space-y-1.5">
            {[
              {
                id: 'ask_then_auto',
                title: 'سؤال از مشتری، سپس انتقال خودکار پس از ۵ دقیقه (پیش‌فرض)',
                desc: 'ارسال اعلان فوری؛ در صورت عدم مداخله دستی، اسنپ‌شات کانتینر به ورکر بعدی شبکه منتقل می‌شود.',
              },
              {
                id: 'instant',
                title: 'انتقال فوری خودکار به ورکر بعدی',
                desc: 'بدون معطلی و بلافاصله پس از تایید قطعی ورکر، تسک به ورکر جدید تخصیص داده می‌شود.',
              },
              {
                id: 'wait_forever',
                title: 'انتظار نامحدود تا دستور مشتری',
                desc: 'تسک در وضعیت تعلیق حفظ شده و تا دستور صریح شما منتقل نخواهد شد.',
              },
            ].map((opt) => (
              <label
                key={opt.id}
                className="flex items-start gap-3.5 py-3 px-3 rounded cursor-pointer hover:bg-[#080808] transition-colors"
              >
                <input
                  type="radio"
                  name="policy"
                  value={opt.id}
                  checked={operatorFailurePolicy === opt.id}
                  onChange={() => setOperatorFailurePolicy(opt.id)}
                  className="mt-1 accent-[#7C3AED]"
                />
                <div className="space-y-1">
                  <div className={`font-medium text-base ${operatorFailurePolicy === opt.id ? 'text-[#F4F4F5]' : 'text-[#D4D4D8]'}`}>
                    {opt.title}
                  </div>
                  <div className="text-sm text-[#71717A] leading-relaxed">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="border-b border-[#17171A]" />

        {/* Section 2: Notifications - Flat rows, no cards */}
        <section style={getStaggerStyle(2)} className="animate-nervel-enter space-y-4">
          <div>
            <h3 className="text-[17px] sm:text-lg font-semibold text-[#F4F4F5]">
              کانال‌های اعلان و اطلاع‌رسانی
            </h3>
            <p className="text-sm text-[#71717A] mt-1 leading-relaxed">
              تنظیم شیوه دریافت رخدادهای حساس نظیر استعلام ورکر یا تحویل خروجی
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between py-3 px-3 rounded cursor-pointer hover:bg-[#080808] transition-colors">
              <div>
                <span className="font-medium text-base text-[#F4F4F5] block">پیامک هنگام استعلام ورکر</span>
                <span className="text-sm text-[#71717A] mt-0.5 block">
                  ارسال پیامک فوری در صورتی که کانتینر برای ادامه تسک سوال فنی داشته باشد
                </span>
              </div>
              <input
                type="checkbox"
                checked={smsNotification}
                onChange={(e) => setSmsNotification(e.target.checked)}
                className="h-4.5 w-4.5 accent-[#7C3AED]"
              />
            </label>

            <label className="flex items-center justify-between py-3 px-3 rounded cursor-pointer hover:bg-[#080808] transition-colors">
              <div>
                <span className="font-medium text-base text-[#F4F4F5] block">ایمیل هنگام پایان و تحویل خروجی</span>
                <span className="text-sm text-[#71717A] mt-0.5 block">
                  ارسال خلاصه گزارش کیفی QA، پیوند Pull Request و جزئیات تسویه هزینه
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailNotification}
                onChange={(e) => setEmailNotification(e.target.checked)}
                className="h-4.5 w-4.5 accent-[#7C3AED]"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">
            <div className="space-y-1.5">
              <label className="block text-sm text-[#A1A1AA] font-medium">شماره همراه جهت دریافت پیامک:</label>
              <input
                type="text"
                dir="ltr"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded border border-[#27272A] bg-transparent px-3.5 py-2.5 text-sm text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm text-[#A1A1AA] font-medium">آدرس وب‌هوک رویدادها (اختیاری):</label>
              <input
                type="text"
                dir="ltr"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full rounded border border-[#27272A] bg-transparent px-3.5 py-2.5 text-sm text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-b border-[#17171A]" />

        {/* Section 3: GitHub Integration - Flat, no card */}
        <section style={getStaggerStyle(3)} className="animate-nervel-enter space-y-4">
          <div>
            <h3 className="text-[17px] sm:text-lg font-semibold text-[#F4F4F5]">
              اتصال به GitHub
            </h3>
            <p className="text-sm text-[#71717A] mt-1 leading-relaxed">
              مدیریت دسترسی به سازمان و مخازن جهت ایجاد شاخه‌ها و ثبت خودکار Pull Request
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 px-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-[#D4D4D8] font-medium" dir="ltr">
                github.com/{githubOrg}
              </span>
              <span className="text-[#71717A]">·</span>
              <span className="text-sm text-[#10B981] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                متصل
              </span>
            </div>

            <button
              type="button"
              onClick={() => alert('مدیریت دسترسی‌های اپلیکیشن NERVEL در گیت‌هاب')}
              className="text-sm text-[#A1A1AA] hover:text-[#F4F4F5] text-right underline underline-offset-4"
            >
              مدیریت مجوزها در GitHub
            </button>
          </div>
        </section>

        {/* Action button */}
        <div style={getStaggerStyle(4)} className="animate-nervel-enter flex items-center justify-end gap-4 pt-5 border-t border-[#17171A]">
          {isSaved && (
            <span className="text-sm text-[#10B981] flex items-center gap-1.5 font-medium">
              <Check className="h-4 w-4" />
              تغییرات با موفقیت ذخیره شد
            </span>
          )}
          <button
            type="submit"
            className="rounded bg-[#7C3AED] px-6 py-2.5 text-sm sm:text-base font-medium text-white hover:bg-[#8B5CF6] active:bg-[#6D28D9] transition-colors"
          >
            ذخیره تنظیمات
          </button>
        </div>

      </form>
    </div>
  );
};
