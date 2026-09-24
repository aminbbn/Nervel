/**
 * Number and currency formatting utilities
 * Persian numerals for consumer and financial presentation
 * Preserves Latin characters for technical identifiers (hashes, repos, IDs)
 */

export function toPersianDigits(num: number | string): string {
  const str = String(num);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/\d/g, (match) => persianDigits[Number(match)]);
}

export function formatToman(amount: number): string {
  // Format with thousands separator
  const formatted = new Intl.NumberFormat('en-US').format(amount);
  return `${toPersianDigits(formatted)} تومان`;
}

export function formatTokenCount(tokens: number): string {
  const formatted = new Intl.NumberFormat('en-US').format(tokens);
  return `${toPersianDigits(formatted)} توکن`;
}

export function formatCompactToman(amount: number): string {
  if (amount >= 1_000_000) {
    const million = (amount / 1_000_000).toFixed(1);
    return `${toPersianDigits(million)} میلیون تومان`;
  }
  if (amount >= 1_000) {
    const thousand = Math.round(amount / 1_000);
    return `${toPersianDigits(thousand)} هزار تومان`;
  }
  return formatToman(amount);
}
