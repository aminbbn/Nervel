import React, { useState } from 'react';
import { useNervel } from '../../context/NervelContext';
import { formatToman, toPersianDigits } from '../../utils/formatters';
import { getStaggerStyle } from '../../utils/motion';
import {
  Power,
  Sliders,
  DollarSign,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const OperatorView: React.FC = () => {
  const {
    operatorNode,
    toggleOperatorStatus,
    setOperatorCapacityLimit,
    requestOperatorWithdrawal,
  } = useNervel();

  const [withdrawAmount, setWithdrawAmount] = useState<string>('500000');
  const [ibanNumber, setIbanNumber] = useState<string>('IR120120000000001234567890');
  const [withdrawSuccess, setWithdrawSuccess] = useState<boolean>(false);
  const [withdrawError, setWithdrawError] = useState<string>('');

  const isOnline = operatorNode.status === 'online';
  const minWithdrawal = 500000;
  const canWithdraw = operatorNode.withdrawableBalanceToman >= minWithdrawal;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    const amt = Number(withdrawAmount);

    if (amt < minWithdrawal) {
      setWithdrawError('حداقل مبلغ قابل تسویه در فاز نخست ۵۰۰٬۰۰۰ تومان است.');
      return;
    }
    if (amt > operatorNode.withdrawableBalanceToman) {
      setWithdrawError('مبلغ درخواستی بیشتر از موجودی قابل برداشت است.');
      return;
    }
    if (!ibanNumber.startsWith('IR') || ibanNumber.length !== 26) {
      setWithdrawError('شماره شبا نامعتبر است (باید با IR شروع شده و ۲۶ رقم باشد).');
      return;
    }

    const ok = requestOperatorWithdrawal(amt, ibanNumber);
    if (ok) {
      setWithdrawSuccess(true);
      setTimeout(() => setWithdrawSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Header: 22-24px heading */}
      <div
        style={getStaggerStyle(0)}
        className="animate-nervel-enter flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#17171A]"
      >
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-[22px] sm:text-2xl font-bold text-[#F4F4F5] leading-tight">
              کنسول ورکر اپراتور (Worker Node)
            </h2>
            <span className="text-sm text-[#71717A]" dir="ltr">
              {operatorNode.workerId}
            </span>
          </div>
          <p className="text-sm text-[#71717A] mt-1.5 leading-relaxed">
            نظارت بر اتصال گره، مدیریت سقف هم‌زمانی و تسویه درآمد حاصل از اجرای تسک‌ها
          </p>
        </div>

        {/* Worker Status Toggle - Restrained with small status dot */}
        <button
          onClick={toggleOperatorStatus}
          className="flex items-center gap-2.5 rounded px-3.5 py-2 text-sm font-medium border border-[#27272A] bg-transparent text-[#F4F4F5] hover:bg-[#0E0E10] transition-colors"
        >
          <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-[#10B981]' : 'bg-[#71717A]'}`} />
          <span>{isOnline ? 'گره آنلاین (پذیرش تسک)' : 'گره آفلاین (توقف)'}</span>
        </button>
      </div>

      {/* Node Metrics - Flat 4-column display */}
      <div
        style={getStaggerStyle(1)}
        className="animate-nervel-enter grid grid-cols-2 sm:grid-cols-4 gap-6 py-2"
      >
        <div className="space-y-1">
          <span className="text-sm text-[#71717A] block">نسخه دیمن ورکر:</span>
          <span className="font-semibold text-lg text-[#F4F4F5] block" dir="ltr">
            {operatorNode.daemonVersion}
          </span>
          <span className="text-xs text-[#52525B] block truncate">
            {operatorNode.os}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-sm text-[#71717A] block">ظرفیت اجرای هم‌زمان:</span>
          <span className="font-bold text-lg text-[#F4F4F5] block tabular-nums">
            {toPersianDigits(operatorNode.currentAssignedCount)} / {toPersianDigits(operatorNode.operatorCapacityLimit)} تسک
          </span>
          <span className="text-xs text-[#52525B] block tabular-nums">
            حداکثر سقف سرور: {toPersianDigits(operatorNode.maxAllowedCapacity)}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-sm text-[#71717A] block">نرخ پایداری (Uptime):</span>
          <span className="font-bold text-lg text-[#F4F4F5] block tabular-nums">
            ٪{toPersianDigits(operatorNode.uptimeRate)}
          </span>
          <span className="text-xs text-[#52525B] block tabular-nums">
            {toPersianDigits(operatorNode.totalJobsExecuted)} تسک تاییدشده
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-sm text-[#71717A] block">پایش ضربان (Heartbeat):</span>
          <span className="text-[#A1A1AA] text-sm block truncate mt-0.5">
            {operatorNode.lastHeartbeat}
          </span>
          <span className="text-xs text-[#52525B] block mt-0.5">
            دوره پایش: ۳۰ ثانیه
          </span>
        </div>
      </div>

      <div className="border-b border-[#17171A]" />

      {/* Main Operations - Flat layout, no nested cards */}
      <div style={getStaggerStyle(2)} className="animate-nervel-enter grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Capacity Limiter Section */}
        <section className="space-y-5">
          <div>
            <h3 className="text-[17px] sm:text-lg font-semibold text-[#F4F4F5] flex items-center gap-2">
              <Sliders className="h-4.5 w-4.5 text-[#71717A]" />
              تنظیم سقف پذیرش تسک‌های هم‌زمان (Concurrency)
            </h3>
            <p className="text-sm text-[#71717A] mt-1.5 leading-relaxed">
              در نسخه اول Nervel، هر ورکر مجاز است حداکثر ۱ یا ۲ کانتینر ایزوله را به صورت موازی اجرا کند تا مصرف منابع و پایداری تضمین گردد.
            </p>
          </div>

          <div className="space-y-2.5">
            {[1, 2].map((cap) => {
              const isSelected = operatorNode.operatorCapacityLimit === cap;
              return (
                <label
                  key={cap}
                  onClick={() => setOperatorCapacityLimit(cap)}
                  className={`flex items-start gap-3.5 p-3.5 rounded cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#17171A]' : 'hover:bg-[#080808]'
                  }`}
                >
                  <input
                    type="radio"
                    name="concurrency"
                    checked={isSelected}
                    onChange={() => setOperatorCapacityLimit(cap)}
                    className="mt-1 accent-[#7C3AED]"
                  />
                  <div>
                    <span className="font-semibold text-base text-[#F4F4F5] tabular-nums">
                      {toPersianDigits(cap)} تسک هم‌زمان
                    </span>
                    <p className="text-sm text-[#71717A] mt-1 leading-relaxed">
                      {cap === 1 ? 'پایدارترین حالت، کمترین فشار سخت‌افزاری' : 'استفاده بهینه از ظرفیت سرور'}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Daemon status log snippet */}
          <div className="pt-5 border-t border-[#17171A] space-y-2.5">
            <span className="text-sm text-[#71717A] block font-medium">
              لاگ دیمن پایشگر سرور:
            </span>
            <div className="p-4 rounded bg-[#020202] border border-[#17171A] font-code text-[12px] text-[#A1A1AA] space-y-1.5 leading-relaxed" dir="ltr">
              <div>[OK] systemd nervel-worker.service active (running)</div>
              <div>[OK] docker sandbox backend healthy (isolation: container)</div>
              <div>[OK] ping dispatch.nervel.net: 24ms</div>
            </div>
          </div>
        </section>

        {/* Earnings & Settlement Section */}
        <section className="space-y-5">
          <div>
            <h3 className="text-[17px] sm:text-lg font-semibold text-[#F4F4F5] flex items-center gap-2">
              <DollarSign className="h-4.5 w-4.5 text-[#71717A]" />
              درآمد ورکر و تسویه بانکی (شبا)
            </h3>
            <p className="text-sm text-[#71717A] mt-1.5 leading-relaxed">
              تسویه کارکرد اپراتور به شماره شبای ثبت‌شده واریز می‌گردد.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 py-2">
            <div className="space-y-1">
              <span className="text-sm text-[#71717A] block">کل درآمد کسب‌شده:</span>
              <span className="tabular-nums text-xl sm:text-2xl font-bold text-[#F4F4F5] block">
                {formatToman(operatorNode.totalEarningsToman)}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-sm text-[#71717A] block">موجودی قابل برداشت:</span>
              <span className="tabular-nums text-xl sm:text-2xl font-bold text-[#F4F4F5] block">
                {formatToman(operatorNode.withdrawableBalanceToman)}
              </span>
            </div>
          </div>

          {/* Withdrawal Request Form */}
          <form onSubmit={handleWithdraw} className="space-y-4 pt-3 border-t border-[#17171A]">
            <div className="space-y-1.5">
              <label className="block text-sm text-[#A1A1AA] font-medium">مبلغ درخواستی تسویه (تومان):</label>
              <input
                type="number"
                min="500000"
                step="50000"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full rounded border border-[#27272A] bg-transparent px-3.5 py-2.5 tabular-nums text-sm text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none"
              />
              <span className="text-xs text-[#52525B]">حداقل ۵۰۰٬۰۰۰ تومان</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm text-[#A1A1AA] font-medium">شماره شبا (IBAN):</label>
              <input
                type="text"
                dir="ltr"
                value={ibanNumber}
                onChange={(e) => setIbanNumber(e.target.value)}
                className="w-full rounded border border-[#27272A] bg-transparent px-3.5 py-2.5 text-sm text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none"
              />
            </div>

            {withdrawError && (
              <div className="p-3 text-sm text-[#F4F4F5] border border-[#27272A] rounded flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-[#EF4444] shrink-0" />
                <span>{withdrawError}</span>
              </div>
            )}

            {withdrawSuccess && (
              <div className="p-3 text-sm text-[#F4F4F5] border border-[#27272A] rounded flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0" />
                <span>درخواست تسویه با موفقیت ثبت شد و در چرخه واریز پایا قرار گرفت.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!canWithdraw}
              className={`w-full py-2.5 rounded text-sm sm:text-base font-medium transition-colors ${
                canWithdraw
                  ? 'bg-[#7C3AED] hover:bg-[#8B5CF6] active:bg-[#6D28D9] text-white'
                  : 'bg-[#17171A] text-[#52525B] cursor-not-allowed'
              }`}
            >
              ثبت درخواست واریز به حساب بانکی
            </button>
          </form>
        </section>

      </div>

    </div>
  );
};
