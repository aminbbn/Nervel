import React, { useState } from 'react';
import { useNervel } from '../../context/NervelContext';
import { formatToman, toPersianDigits } from '../../utils/formatters';
import { getStaggerStyle } from '../../utils/motion';
import { Plus, ArrowDownLeft, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const WalletView: React.FC = () => {
  const { walletBalance, reservedBalance, transactions, setIsTopUpModalOpen, navigateToTask } = useNervel();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTx = transactions.filter((tx) => {
    if (filterType === 'all') return true;
    return tx.type === filterType;
  });

  const totalBalance = walletBalance + reservedBalance;

  return (
    <div className="space-y-8">
      
      {/* Header: 22-24px heading */}
      <div
        style={getStaggerStyle(0)}
        className="animate-nervel-enter flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#17171A]"
      >
        <div>
          <h2 className="text-[22px] sm:text-2xl font-bold text-[#F4F4F5] leading-tight">
            کیف پول و دفتر کل مالی
          </h2>
          <p className="text-sm text-[#71717A] mt-1.5 leading-relaxed">
            دفتر کل شفاف، ثبت رزرو سقف اعتبار تسک‌ها و بازگشت خودکار مازاد پس از تسویه نهایی
          </p>
        </div>

        <button
          onClick={() => setIsTopUpModalOpen(true)}
          className="flex items-center gap-2 rounded bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white hover:bg-[#8B5CF6] active:bg-[#6D28D9] transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>افزایش اعتبار کیف پول</span>
        </button>
      </div>

      {/* Financial Balances: Flat 3-column metrics with 24-28px values */}
      <div
        style={getStaggerStyle(1)}
        className="animate-nervel-enter grid grid-cols-1 sm:grid-cols-3 gap-6 py-2"
      >
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm text-[#71717A]">
            <span>موجودی در دسترس (قابل تخصیص)</span>
            <span className="text-xs text-[#52525B]">تومان</span>
          </div>
          <div className="tabular-nums text-2xl sm:text-3xl font-bold text-[#F4F4F5]">
            {formatToman(walletBalance)}
          </div>
          <span className="text-xs sm:text-sm text-[#71717A] block leading-relaxed">
            آماده برای رزرو سقف تسک‌های جدید
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm text-[#71717A]">
            <span>اعتبار در حال رزرو</span>
            <span className="text-xs text-[#52525B]">تومان</span>
          </div>
          <div className="tabular-nums text-2xl sm:text-3xl font-bold text-[#F4F4F5]">
            {formatToman(reservedBalance)}
          </div>
          <span className="text-xs sm:text-sm text-[#71717A] block leading-relaxed">
            مسدود برای تسک‌های در حال اجرا در کانتینرها
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm text-[#71717A]">
            <span>کل دارایی حساب کاربری</span>
            <span className="text-xs text-[#52525B]">تومان</span>
          </div>
          <div className="tabular-nums text-2xl sm:text-3xl font-bold text-[#D4D4D8]">
            {formatToman(totalBalance)}
          </div>
          <span className="text-xs sm:text-sm text-[#71717A] block leading-relaxed">
            حداقل تراکنش شارژ: ۵۰٬۰۰۰ تومان
          </span>
        </div>
      </div>

      {/* Operational Policy Note - Neutral restrained */}
      <div
        style={getStaggerStyle(2)}
        className="animate-nervel-enter text-sm text-[#71717A] flex items-center gap-3 py-3 px-4 border border-[#17171A] rounded leading-relaxed"
      >
        <ShieldCheck className="h-5 w-5 text-[#71717A] shrink-0" />
        <span>
          <strong className="text-[#D4D4D8] font-medium">سیاست مالی Nervel: </strong>
          هنگام ثبت تسک، سقف اعتبار رزرو می‌شود. پس از تکمیل و پاس‌شدن آزمون‌های QA، صرفاً هزینه مصرف واقعی کسر شده و مابقی سقف بلافاصله به موجودی آزاد عودت می‌گردد.
        </span>
      </div>

      {/* Transactions Section */}
      <div style={getStaggerStyle(3)} className="animate-nervel-enter space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-[17px] sm:text-lg font-semibold text-[#F4F4F5]">
            دفتر کل تراکنش‌ها ({toPersianDigits(filteredTx.length)})
          </h3>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'all', label: 'همه' },
              { id: 'topup', label: 'شارژ' },
              { id: 'reserve', label: 'رزرو تسک' },
              { id: 'settlement', label: 'تسویه نهایی' },
              { id: 'refund', label: 'بازگشت مازاد' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3.5 py-1.5 rounded text-sm transition-colors whitespace-nowrap font-medium ${
                  filterType === tab.id
                    ? 'bg-[#17171A] text-[#F4F4F5]'
                    : 'text-[#71717A] hover:text-[#D4D4D8]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table - Flat borders, no monospace */}
        <div className="border border-[#17171A] rounded overflow-hidden">
          {filteredTx.length === 0 ? (
            <div className="p-12 text-center text-sm text-[#71717A]">
              تراکنشی در این دسته‌بندی ثبت نشده است.
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#17171A] bg-[#060607] text-sm text-[#71717A]">
                <div className="col-span-2">شناسه و نوع</div>
                <div className="col-span-4">شرح تراکنش و تسک</div>
                <div className="col-span-3">زمان ثبت</div>
                <div className="col-span-3 text-left">مبلغ (تومان)</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-[#17171A]">
                {filteredTx.map((tx) => {
                  const isPositive = tx.amount > 0;
                  return (
                    <div
                      key={tx.id}
                      className="flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 px-5 py-4 hover:bg-[#080808] transition-colors text-sm items-start sm:items-center"
                    >
                      {/* Col 1: Type */}
                      <div className="col-span-2 flex items-center gap-2.5">
                        <span className="h-5 w-5 rounded flex items-center justify-center shrink-0 text-[#71717A]">
                          {isPositive ? (
                            <ArrowDownLeft className="h-4 w-4" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4" />
                          )}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs text-[#71717A]" dir="ltr">
                            {tx.id}
                          </span>
                          <span className="text-xs text-[#A1A1AA] font-medium">
                            {tx.type === 'topup'
                              ? 'شارژ حساب'
                              : tx.type === 'reserve'
                              ? 'رزرو اعتبار'
                              : tx.type === 'settlement'
                              ? 'تسویه مصرف'
                              : 'آزادسازی مازاد'}
                          </span>
                        </div>
                      </div>

                      {/* Col 2: Description & Task */}
                      <div className="col-span-4 min-w-0">
                        <div className="text-[#F4F4F5] font-medium truncate">{tx.title}</div>
                        {tx.taskId && (
                          <button
                            onClick={() => navigateToTask(tx.taskId!)}
                            className="text-xs sm:text-sm text-[#7C3AED] hover:underline block mt-0.5"
                            dir="ltr"
                          >
                            تسک: {tx.taskId}
                          </button>
                        )}
                        {tx.trackingCode && (
                          <span className="text-xs text-[#52525B] block mt-0.5" dir="ltr">
                            کد رهگیری: {tx.trackingCode}
                          </span>
                        )}
                      </div>

                      {/* Col 3: Date */}
                      <div className="col-span-3 text-xs sm:text-sm text-[#71717A]">{tx.date}</div>

                      {/* Col 4: Amount */}
                      <div className="col-span-3 text-left w-full sm:w-auto">
                        <span
                          className="tabular-nums text-base font-semibold text-[#F4F4F5]"
                          dir="ltr"
                        >
                          {isPositive ? '+' : ''}
                          {formatToman(tx.amount)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
