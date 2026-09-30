import React, { useState } from 'react';
import { useNervel } from '../../context/NervelContext';
import { formatToman, toPersianDigits } from '../../utils/formatters';
import { Button } from '../common/Button';
import {
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  Search,
} from 'lucide-react';

export const WalletView: React.FC = () => {
  const {
    walletBalance,
    reservedBalance,
    transactions,
    setIsTopUpModalOpen,
    navigateToTask,
  } = useNervel();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const totalBalance = walletBalance + reservedBalance;

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    // Type filtering
    if (activeTab === 'reservations' && tx.type !== 'reserve' && tx.type !== 'release') return false;
    if (activeTab === 'charges' && tx.type !== 'charge' && tx.type !== 'settlement') return false;
    if (activeTab === 'refunds' && tx.type !== 'refund') return false;
    if (activeTab === 'topups' && tx.type !== 'topup') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = tx.title.toLowerCase().includes(q);
      const matchId = tx.id.toLowerCase().includes(q);
      const matchTask = tx.taskId?.toLowerCase().includes(q) || false;
      return matchTitle || matchId || matchTask;
    }

    return true;
  });

  return (
    <div className="w-full space-y-8 animate-nervel-enter">
      {/* Page Header with Top-Up Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#18181C]">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F4F5]">
            کیف پول
          </h1>
          <p className="text-sm text-[#71717A] mt-1.5 leading-relaxed">
            مدیریت موجودی آزاد، سقف‌های مسدود در تسک‌ها و تاریخچه تراکنش‌ها
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsTopUpModalOpen(true)}
          rightIcon={<Plus className="w-4 h-4" />}
          className="self-start sm:self-auto font-medium shrink-0"
        >
          افزایش اعتبار
        </Button>
      </div>

      {/* Clean Metric Row (No giant cards, subtle vertical dividers, white values) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-2 border-b border-[#18181C] pb-6 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-[#1A1A1E]">
        {/* Available Balance */}
        <div className="space-y-1 pt-3 sm:pt-0">
          <span className="text-xs text-[#71717A] block">موجودی در دسترس:</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#F4F4F5] tabular-nums">
              {formatToman(walletBalance)}
            </span>
          </div>
          <span className="text-xs text-[#52525B] block pt-0.5">
            اعتبار آزاد برای تخصیص به تسک‌های جدید
          </span>
        </div>

        {/* Reserved Balance */}
        <div className="space-y-1 pt-4 sm:pt-0 sm:pr-6">
          <span className="text-xs text-[#71717A] block">سقف مسدود در تسک‌ها:</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#F4F4F5] tabular-nums">
              {formatToman(reservedBalance)}
            </span>
          </div>
          <span className="text-xs text-[#52525B] block pt-0.5">
            تضمین موقت اجرای کانتینرها تا تکمیل و تست
          </span>
        </div>

        {/* Total Balance */}
        <div className="space-y-1 pt-4 sm:pt-0 sm:pr-6">
          <span className="text-xs text-[#71717A] block">مجموع دارایی حساب:</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#A1A1AA] tabular-nums">
              {formatToman(totalBalance)}
            </span>
          </div>
          <span className="text-xs text-[#52525B] block pt-0.5">
            مجموع موجودی آزاد و مبالغ رزرو شده
          </span>
        </div>
      </div>

      {/* Ledger & Transactions Section (One Structural List/Table) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-[#F4F4F5]">
            تراکنش‌های حساب
          </h2>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="جستجو در تراکنش‌ها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 bg-[#09090C] border border-[#27272A] hover:border-[#38383E] focus:border-[#7C3AED] rounded-md pr-8 pl-3 text-xs text-[#F4F4F5] placeholder-[#52525B] focus:outline-none transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-[#71717A] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-medium border-b border-[#18181C]">
          {[
            { id: 'all', label: 'همه' },
            { id: 'reservations', label: 'رزرو و آزادسازی' },
            { id: 'charges', label: 'تسویه مصرف' },
            { id: 'refunds', label: 'عودت وجه' },
            { id: 'topups', label: 'شارژ حساب' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#7C3AED] text-[#F4F4F5] font-medium'
                    : 'border-transparent text-[#71717A] hover:text-[#D4D4D8]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Transactions Table */}
        <div className="border border-[#18181C] rounded-lg overflow-hidden bg-[#08080A]">
          {filteredTransactions.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#71717A] space-y-2">
              <FileText className="w-6 h-6 mx-auto text-[#3F3F46]" />
              <p>هیچ تراکنشی با این مشخصات یافت نشد.</p>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#141418] bg-[#0A0A0D] text-xs font-medium text-[#71717A]">
                <div className="col-span-2">شناسه و نوع</div>
                <div className="col-span-5">شرح رویداد مالی</div>
                <div className="col-span-2">زمان ثبت</div>
                <div className="col-span-3 text-left">مبلغ (تومان)</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-[#141418]">
                {filteredTransactions.map((tx) => {
                  const isPositive = tx.amount > 0;

                  let typeLabel = 'تراکنش';
                  if (tx.type === 'topup') typeLabel = 'شارژ حساب';
                  else if (tx.type === 'reserve') typeLabel = 'رزرو سقف تسک';
                  else if (tx.type === 'release') typeLabel = 'آزادسازی سقف';
                  else if (tx.type === 'charge' || tx.type === 'settlement') typeLabel = 'تسویه مصرف';
                  else if (tx.type === 'refund') typeLabel = 'عودت وجه';

                  return (
                    <div
                      key={tx.id}
                      className="flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 px-5 py-3.5 hover:bg-[#0C0C0F] transition-colors text-xs items-start sm:items-center"
                    >
                      {/* Col 1: Type & ID */}
                      <div className="col-span-2 flex items-center gap-2">
                        <span className="w-5 h-5 rounded flex items-center justify-center shrink-0 text-[#71717A]">
                          {isPositive ? (
                            <ArrowDownLeft className="w-3.5 h-3.5 text-[#10B981]" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#71717A]" />
                          )}
                        </span>
                        <div>
                          <span className="text-[11px] font-latin tabular-nums text-[#71717A] block" dir="ltr">
                            {tx.id}
                          </span>
                          <span className="text-xs font-medium text-[#D4D4D8]">
                            {typeLabel}
                          </span>
                        </div>
                      </div>

                      {/* Col 2: Title & Task Link */}
                      <div className="col-span-5 min-w-0 space-y-0.5">
                        <div className="text-[#F4F4F5] font-medium truncate">
                          {tx.title}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap text-[11px] text-[#71717A]">
                          {tx.taskId && (
                            <button
                              type="button"
                              onClick={() => navigateToTask(tx.taskId!)}
                              className="inline-flex items-center gap-1 text-[#7C3AED] hover:underline cursor-pointer"
                            >
                              <span>تسک:</span>
                              <span className="font-latin tabular-nums" dir="ltr">{tx.taskId}</span>
                            </button>
                          )}
                          {tx.trackingCode && (
                            <span className="inline-flex items-center gap-1 text-[#71717A]">
                              <span>رهگیری:</span>
                              <span className="font-latin tabular-nums" dir="ltr">{tx.trackingCode}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Col 3: Date */}
                      <div className="col-span-2 text-xs text-[#71717A] whitespace-nowrap">
                        {tx.date}
                      </div>

                      {/* Col 4: Amount */}
                      <div className="col-span-3 text-left w-full sm:w-auto">
                        <span className="tabular-nums font-medium text-sm text-[#F4F4F5]">
                          {isPositive ? '+' : ''}
                          {toPersianDigits(new Intl.NumberFormat('en-US').format(tx.amount))}
                        </span>
                        <span className="text-xs text-[#71717A] mr-1">تومان</span>
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
