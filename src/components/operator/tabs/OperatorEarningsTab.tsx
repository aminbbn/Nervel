import React from 'react';
import { useNervel } from '../../../context/NervelContext';
import { formatToman, toPersianDigits } from '../../../utils/formatters';
import { calculateOperatorPayout } from '../../../services/payoutService';
import {
  Coins,
  ArrowUpRight,
  Shield,
  Info,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const OperatorEarningsTab: React.FC = () => {
  const { operatorNode, tasks, setOperatorTab } = useNervel();

  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <div className="space-y-8 animate-nervel-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#18181C]">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F4F5]">درآمد</h1>
          <p className="text-sm text-[#71717A] mt-1.5">
            دفتر کل کارکرد توکن‌ها، ساختار نرخ مدل‌ها و پایش درآمدهای تسویه‌شده و قابل برداشت
          </p>
        </div>

        <button
          onClick={() => setOperatorTab('withdrawals')}
          className="flex items-center gap-2 px-4.5 py-2.5 rounded-md min-h-[44px] text-base font-medium bg-[#7C3AED] hover:bg-[#8B5CF6] text-white transition-colors cursor-pointer self-start sm:self-auto shrink-0"
        >
          <span>تسویه به شماره شبا</span>
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {/* Financial Metrics Cards - Calm, Zero Pill */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-2 border-b border-[#18181C] pb-6">
        <div className="space-y-1">
          <span className="text-xs text-[#71717A] block">کل درآمد کسب‌شده:</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold text-[#F4F4F5] tabular-nums">
              {formatToman(operatorNode.totalEarningsToman)}
            </span>
          </div>
          <span className="text-xs text-[#71717A]">مجموع کل تسک‌های تاییدشده</span>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-[#71717A] block">موجودی قابل برداشت:</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold text-[#10B981] tabular-nums">
              {formatToman(operatorNode.withdrawableBalanceToman)}
            </span>
          </div>
          <span className="text-xs text-[#71717A]">آماده ثبت دستور پایا</span>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-[#71717A] block">تسویه‌شده تا کنون:</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold text-[#F4F4F5] tabular-nums">
              {formatToman(operatorNode.settledEarningsToman)}
            </span>
          </div>
          <span className="text-xs text-[#71717A]">واریز موفق به حساب بانکی</span>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-[#71717A] block">میانگین بازدهی هر تسک:</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold text-[#F4F4F5] tabular-nums">
              ~{formatToman(Math.round(operatorNode.totalEarningsToman / Math.max(1, operatorNode.totalJobsExecuted)))}
            </span>
          </div>
          <span className="text-xs text-[#71717A]">بر اساس {toPersianDigits(operatorNode.totalJobsExecuted)} تسک</span>
        </div>
      </div>

      {/* Official Staging Benchmarking Notice */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#0A0A0D] border border-[#18181C] flex items-start gap-3.5">
        <Info className="h-5 w-5 text-[#7C3AED] shrink-0 mt-0.5" />
        <div className="space-y-1 text-sm leading-relaxed">
          <h4 className="font-bold text-[#F4F4F5]">سیاست نرخ‌گذاری بر مبنای تفکیک توکن‌ها (Token Accounting Model)</h4>
          <p className="text-[#A1A1AA]">
            درآمد اپراتور در NERVEL بر پایه تفکیک سه دسته توکن است: <strong>توکن‌های ورودی (Input)</strong>، <strong>توکن‌های کش‌شده (Cached Input)</strong> و <strong>توکن‌های خروجی و استدلال (Output)</strong>. تسویه‌حساب گره‌ها مستقیماً بر مبنای دفتر کل کارکرد توکن‌ها و منابع اختصاص‌یافته کانتینر محاسبه می‌گردد.
          </p>
        </div>
      </div>

      {/* Integrity & Zero-Gamification Guarantee */}
      <div className="p-5 rounded-lg bg-[#09090C] border border-[#18181C] space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4.5 w-4.5 text-[#10B981]" />
          <h3 className="text-base font-bold text-[#F4F4F5]">تضمین شفافیت مالی و رد هرگونه گیمیفیکیشن</h3>
        </div>

        <p className="text-sm text-[#71717A] leading-relaxed">
          در NERVEL محاسبات مالی کاملاً ریاضی و شفاف است:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#71717A]">
          <div className="p-3.5 rounded bg-[#060608] border border-[#141418] space-y-1">
            <span className="text-[#D4D4D8] font-medium block">اثر سابقه و پایداری ورکر:</span>
            سابقه اجرای موفق و پایداری ۹۹.۸٪ صرفاً اولویت دریافت تسک‌های جدید از زمان‌بند را بالا می‌برد و هرگز در مبلغ پرداختی به ازای توکن ضرب نمی‌شود.
          </div>

          <div className="p-3.5 rounded bg-[#060608] border border-[#141418] space-y-1">
            <span className="text-[#D4D4D8] font-medium block">عدم وجود ضرایب متغیر و بونوس:</span>
            هیچ‌گونه بونوس نمادین، رتبه‌بندی ستاره‌ای یا جریمه‌های سلیقه‌ای در پلتفرم وجود ندارد. هر توکن مصرف‌شده در کانتینر طبق نرخ مصوب دفتر کل پرداخت می‌گردد.
          </div>
        </div>
      </div>

      {/* Ledger of Executed Jobs and Token Usage Breakdown */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-[#F4F4F5]">دفتر کل پرداختی‌های تسک‌های اخیر</h3>
        <div className="divide-y divide-[#141418] border border-[#18181C] rounded-lg bg-[#09090C] overflow-hidden">
          {completedTasks.map((t) => {
            const earnings = calculateOperatorPayout(t);
            return (
              <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#71717A] font-latin tabular-nums font-medium text-xs" dir="ltr">{t.id}</span>
                    <span className="text-[#52525B]">·</span>
                    <span className="font-medium text-[#F4F4F5]">{t.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#71717A] flex-wrap">
                    <span>مدل: <span className="font-latin">{t.modelName}</span></span>
                    <span>·</span>
                    <span>ورودی: {toPersianDigits(t.tokenStats?.inputTokens || 0)}</span>
                    <span>·</span>
                    <span>کش‌شده: {toPersianDigits(t.tokenStats?.cachedTokens || 0)}</span>
                    <span>·</span>
                    <span>خروجی: {toPersianDigits(t.tokenStats?.outputTokens || 0)}</span>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <span className="text-base font-medium text-[#10B981] tabular-nums block">
                    +{formatToman(earnings)}
                  </span>
                  <span className="text-xs text-[#71717A]">ثبت‌شده در تراز</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
