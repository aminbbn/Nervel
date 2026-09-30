import React, { useState } from 'react';
import { useNervel } from '../../context/NervelContext';
import { toast } from '../../context/ToastContext';
import { formatToman, toPersianDigits } from '../../utils/formatters';
import { X, CreditCard, Check } from 'lucide-react';

const PRESET_AMOUNTS = [
  50000,
  100000,
  250000,
  500000,
  1000000,
];

export const TopUpModal: React.FC = () => {
  const { isTopUpModalOpen, setIsTopUpModalOpen, walletBalance, topUpWallet } = useNervel();
  const [selectedAmount, setSelectedAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successNotice, setSuccessNotice] = useState<boolean>(false);

  if (!isTopUpModalOpen) return null;

  const finalAmount = isCustom ? Number(customAmount) || 0 : selectedAmount;
  const isAmountValid = finalAmount >= 50000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAmountValid) {
      toast.warning('حداقل مبلغ شارژ', 'حداقل مبلغ برای افزایش اعتبار ۵۰٬۰۰۰ تومان است.');
      return;
    }
    if (isProcessing) return;

    setIsProcessing(true);
    setTimeout(() => {
      topUpWallet(finalAmount);
      setIsProcessing(false);
      setSuccessNotice(true);
      setTimeout(() => {
        setSuccessNotice(false);
        setIsTopUpModalOpen(false);
        setIsCustom(false);
        setCustomAmount('');
      }, 500);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div
        className="w-full max-w-lg rounded border border-[#17171A] bg-[#0A0A0C] p-6 text-right animate-nervel-enter space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#17171A]">
          <div className="flex items-center gap-2.5">
            <CreditCard className="h-5 w-5 text-[#7C3AED]" />
            <h3 className="text-base font-bold text-[#F4F4F5]">افزایش اعتبار کیف پول</h3>
          </div>
          <button
            onClick={() => setIsTopUpModalOpen(false)}
            className="rounded p-1 text-[#71717A] hover:text-[#F4F4F5] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Balance Note */}
        <div className="flex items-center justify-between py-2.5 border-b border-[#17171A] text-sm">
          <span className="text-[#71717A]">موجودی آزاد فعلی:</span>
          <span className="tabular-nums font-bold text-base text-[#F4F4F5]">
            {formatToman(walletBalance)}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          
          {/* Preset Buttons */}
          <div className="space-y-2">
            <label className="block text-sm text-[#A1A1AA] font-medium">
              انتخاب مبلغ شارژ (تومان):
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {PRESET_AMOUNTS.map((amt) => {
                const isSelected = !isCustom && selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setIsCustom(false);
                      setSelectedAmount(amt);
                    }}
                    className={`rounded border px-3 py-2 text-sm tabular-nums transition-colors ${
                      isSelected
                        ? 'border-[#7C3AED] bg-[#17171A] text-[#F4F4F5] font-medium'
                        : 'border-[#27272A] bg-transparent text-[#A1A1AA] hover:border-[#3F3F46]'
                    }`}
                  >
                    {toPersianDigits(new Intl.NumberFormat('en-US').format(amt))}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setIsCustom(true)}
                className={`rounded border px-3 py-2 text-sm transition-colors ${
                  isCustom
                    ? 'border-[#7C3AED] bg-[#17171A] text-[#F4F4F5] font-medium'
                    : 'border-[#27272A] bg-transparent text-[#A1A1AA] hover:border-[#3F3F46]'
                }`}
              >
                مبلغ دلخواه
              </button>
            </div>
          </div>

          {/* Custom Input */}
          {isCustom && (
            <div className="space-y-1.5">
              <label className="block text-sm text-[#A1A1AA] font-medium">
                مبلغ مورد نظر را به تومان وارد کنید:
              </label>
              <input
                type="number"
                min="50000"
                step="10000"
                placeholder="حداقل ۵۰٬۰۰۰ تومان"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                autoFocus
                className="w-full rounded border border-[#27272A] bg-transparent px-3.5 py-2.5 tabular-nums text-sm text-[#F4F4F5] focus:border-[#7C3AED] focus:outline-none"
              />
            </div>
          )}

          {/* Fee policy reminder */}
          <div className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
            شارژ به صورت شبیه‌سازی درگاه بانکی ثبت و آنی به موجودی آزاد افزوده می‌شود.
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isAmountValid || isProcessing}
            className={`w-full py-2.5 rounded text-sm sm:text-base font-medium transition-colors flex items-center justify-center gap-2 ${
              !isAmountValid || isProcessing
                ? 'bg-[#17171A] text-[#71717A] cursor-not-allowed'
                : 'bg-[#7C3AED] hover:bg-[#8B5CF6] text-white'
            }`}
          >
            {successNotice ? (
              <>
                <Check className="h-5 w-5" />
                <span>شارژ با موفقیت انجام شد</span>
              </>
            ) : isProcessing ? (
              <span>در حال اتصال به درگاه...</span>
            ) : (
              <span>
                تایید و شارژ {formatToman(finalAmount)}
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
