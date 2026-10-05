import React, { useState } from 'react';
import { useNervel } from '../../../context/NervelContext';
import { formatToman, toPersianDigits } from '../../../utils/formatters';
import {
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileText,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const OperatorWithdrawalsTab: React.FC = () => {
  const {
    operatorNode,
    operatorWithdrawals,
    requestOperatorWithdrawal,
  } = useNervel();

  const minWithdrawal = 500000;
  const availableBalance = operatorNode.withdrawableBalanceToman;
  const canWithdraw = availableBalance >= minWithdrawal;

  const [amount, setAmount] = useState<string>('500000');
  const [iban, setIban] = useState<string>('IR120120000000001234567890');
  const [bankName, setBankName] = useState<string>('بانک پاسارگاد');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount < minWithdrawal) {
      setErrorMsg(`حداقل مبلغ قابل برداشت ${formatToman(minWithdrawal)} است.`);
      return;
    }

    if (numericAmount > availableBalance) {
      setErrorMsg('مبلغ درخواستی بیشتر از موجودی قابل برداشت اپراتور است.');
      return;
    }

    const cleanIban = iban.trim().toUpperCase();
    if (!cleanIban.startsWith('IR') || cleanIban.length !== 26) {
      setErrorMsg('شماره شبا باید با IR آغاز شده و دقیقاً ۲۶ کاراکتر باشد.');
      return;
    }

    const ok = requestOperatorWithdrawal(numericAmount, cleanIban, bankName);
    if (ok) {
      setSuccessMsg(`درخواست برداشت ${formatToman(numericAmount)} با موفقیت ثبت شد و در چرخه بررسی دستی ۲۴ ساعته قرار گرفت.`);
      setAmount('500000');
    } else {
      setErrorMsg('خطا در پردازش درخواست برداشت.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-[#10B981]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>واریز شده (پایا)</span>
          </span>
        );
      case 'processing_paya':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-[#3B82F6]">
            <Clock className="h-3.5 w-3.5" />
            <span>در چرخه تسویه پایا</span>
          </span>
        );
      case 'pending_review':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-[#F59E0B]">
            <Clock className="h-3.5 w-3.5" />
            <span>در انتظار بررسی دستی</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-nervel-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#18181C]">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F4F5]">برداشت‌ها</h1>
          <p className="text-sm text-[#71717A] mt-1.5">
            واریز درآمدهای محقق‌شده اپراتور به شماره شبای بانکی در چرخه پایا
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm self-start sm:self-auto shrink-0">
          <span className="text-[#71717A]">موجودی قابل تسویه:</span>
          <span className="text-base font-bold text-[#10B981] tabular-nums">
            {formatToman(availableBalance)}
          </span>
        </div>
      </div>

      {/* Main Section: Request Form & Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="p-5 sm:p-6 rounded-lg bg-[#09090C] border border-[#18181C] space-y-5">
            <h3 className="text-base font-bold text-[#F4F4F5]">ثبت درخواست تسویه جدید به حساب شبا</h3>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              {/* Amount */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#D4D4D8]">مبلغ درخواستی برداشت (تومان):</label>
                  <span className="text-xs text-[#71717A]">
                    موجود: {formatToman(availableBalance)}
                  </span>
                </div>

                <input
                  type="number"
                  min={minWithdrawal}
                  step={50000}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full h-11 bg-[#060608] border border-[#222226] hover:border-[#2E2E33] focus:border-[#7C3AED] rounded-md px-3.5 text-base text-[#F4F4F5] tabular-nums focus:outline-none"
                  placeholder="۵۰۰٬۰۰۰"
                />

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setAmount(String(minWithdrawal))}
                    className="text-xs px-3 py-1.5 rounded bg-[#141418] hover:bg-[#1E1E24] text-[#A1A1AA] border border-[#27272A] cursor-pointer"
                  >
                    حداقل مبلغ ({formatToman(minWithdrawal)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmount(String(availableBalance))}
                    className="text-xs px-3 py-1.5 rounded bg-[#141418] hover:bg-[#1E1E24] text-[#A1A1AA] border border-[#27272A] cursor-pointer"
                  >
                    کل موجودی قابل تسویه
                  </button>
                </div>
              </div>

              {/* IBAN */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#D4D4D8]">شماره شبا (IBAN):</label>
                <div className="relative">
                  <input
                    type="text"
                    dir="ltr"
                    value={iban}
                    onChange={(e) => setIban(e.target.value.toUpperCase())}
                    placeholder="IR120120000000001234567890"
                    className="w-full h-11 bg-[#060608] border border-[#222226] hover:border-[#2E2E33] focus:border-[#7C3AED] rounded-md px-3.5 pr-10 text-sm font-latin font-medium tabular-nums text-[#F4F4F5] focus:outline-none"
                  />
                  <Building2 className="absolute right-3 top-3 h-4.5 w-4.5 text-[#71717A] pointer-events-none" />
                </div>
                <span className="text-xs text-[#71717A]">باید با IR آغاز شده و شامل ۲۴ رقم شماره حساب باشد.</span>
              </div>

              {/* Bank Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#D4D4D8]">نام بانک یا توضیحات حساب:</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="مثال: بانک پاسارگاد - حساب جاری"
                  className="w-full h-11 bg-[#060608] border border-[#222226] hover:border-[#2E2E33] focus:border-[#7C3AED] rounded-md px-3.5 text-base text-[#F4F4F5] focus:outline-none"
                />
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded bg-[#EF4444]/10 border border-[#EF4444]/20 text-xs text-[#EF4444] flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 rounded bg-[#10B981]/10 border border-[#10B981]/20 text-xs text-[#10B981] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!canWithdraw}
                  className={`w-full min-h-[44px] py-2.5 rounded-md text-base font-medium transition-all cursor-pointer ${
                    canWithdraw
                      ? 'bg-[#7C3AED] hover:bg-[#8B5CF6] text-white active:bg-[#6D28D9]'
                      : 'bg-[#18181D] text-[#52525B] cursor-not-allowed border border-[#27272A]'
                  }`}
                >
                  ثبت درخواست تسویه و ارسال به چرخه پایا
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 1 Col: Operational Rules & SLA */}
        <div className="space-y-5">
          <div className="p-5 rounded-lg bg-[#09090C] border border-[#18181C] space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#141418]">
              <ShieldCheck className="h-4.5 w-4.5 text-[#7C3AED]" />
              <h3 className="text-base font-bold text-[#F4F4F5]">قوانین و ضوابط تسویه اپراتور</h3>
            </div>

            <div className="space-y-3 text-xs text-[#71717A] leading-relaxed">
              <div>
                <span className="text-[#D4D4D8] font-medium block">۱. حداقل مبلغ درخواست:</span>
                <p>در فاز کنونی پلتفرم، حداقل مبلغ تسویه ۵۰۰٬۰۰۰ تومان است تا از تراکنش‌های خرد و هزینه‌های بانکی جلوگیری گردد.</p>
              </div>

              <div>
                <span className="text-[#D4D4D8] font-medium block">۲. پردازش دستی در سیکل پایا (حداکثر ۲۴ ساعت):</span>
                <p>کلیه تسویه‌ها به صورت دستی توسط تیم مالی ممیزی شده و در نخستین سیکل پایا بانک مرکزی (ساعت ۰۳:۴۵، ۱۰:۴۵ یا ۱۳:۴۵) واریز می‌شوند.</p>
              </div>

              <div>
                <span className="text-[#D4D4D8] font-medium block">۳. تطابق هویت دارنده شبا:</span>
                <p>شماره شبای ثبت‌شده باید متعلق به اپراتور تاییدشده یا شرکت ثبت‌شده باشد.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History of Requested Withdrawals - Frameless */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-[#F4F4F5]">سوابق درخواست‌های تسویه و کدهای پیگیری</h3>

        <div className="border-y border-[#18181B] overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-[#18181B] text-[#71717A]">
                <th className="py-3 px-3 font-medium">شناسه درخواست</th>
                <th className="py-3 px-3 font-medium">مبلغ تسویه</th>
                <th className="py-3 px-3 font-medium">شماره شبا و بانک</th>
                <th className="py-3 px-3 font-medium">زمان ثبت</th>
                <th className="py-3 px-3 font-medium">وضعیت</th>
                <th className="py-3 px-3 font-medium text-left">کد رهگیری پایا</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18181B]">
              {operatorWithdrawals.map((w) => (
                <tr key={w.id} className="hover:bg-[#0A0A0D] transition-colors">
                  <td className="py-3.5 px-3 font-latin tabular-nums text-sm text-[#A1A1AA]" dir="ltr">
                    {w.id}
                  </td>

                  <td className="py-3.5 px-3 font-medium text-[#F4F4F5] tabular-nums">
                    {formatToman(w.amount)}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="space-y-0.5">
                      <span className="text-[#D4D4D8] font-latin tabular-nums text-xs" dir="ltr">
                        {w.iban}
                      </span>
                      <span className="text-xs text-[#71717A] block">{w.bankName || 'بانک مقصد'}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-[#71717A]">
                    {w.requestedAt}
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {getStatusBadge(w.status)}
                  </td>

                  <td className="py-3.5 px-3 text-left">
                    {w.trackingCode ? (
                      <span className="font-latin tabular-nums text-sm text-[#A1A1AA]" dir="ltr">
                        {w.trackingCode}
                      </span>
                    ) : (
                      <span className="text-xs text-[#71717A]">
                        — (در نوبت صدور)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
