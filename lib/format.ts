// lib/format.ts — Number formatting utilities (Indian lakh/crore system)

import { CURRENCY_SYMBOLS } from './currency';

/**
 * Format a number in Indian notation (lakh/crore).
 * Input is in smallest currency unit (paise for INR, cents for USD).
 */
export function formatINR(paise: number): string {
  const rupees = paise / 100;
  if (rupees >= 10000000) {
    const crores = rupees / 10000000;
    return `₹${crores % 1 === 0 ? crores.toFixed(0) : crores.toFixed(1)} Cr`;
  }
  if (rupees >= 100000) {
    const lakhs = rupees / 100000;
    return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
  }
  return `₹${rupees.toLocaleString('en-IN')}`;
}

/**
 * Format a number in standard Western notation.
 * Input is in smallest currency unit (cents for USD/GBP/EUR).
 */
export function formatWestern(cents: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  const amount = cents / 100;
  if (amount >= 1000000) {
    return `${symbol}${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(0)}K`;
  }
  return `${symbol}${amount.toLocaleString('en-US')}`;
}

/**
 * Format salary based on currency.
 * Automatically picks Indian vs Western formatting.
 */
export function formatSalary(amount: number, currency: string): string {
  if (amount === 0) return '—';
  if (currency === 'INR') return formatINR(amount);
  return formatWestern(amount, currency);
}

/**
 * Format a delta (difference) with + or - prefix and color class name.
 */
export function formatDelta(
  delta: number,
  currency: string
): { text: string; colorClass: string } {
  if (delta === 0) return { text: '—', colorClass: 'text-muted' };
  const prefix = delta > 0 ? '+' : '';
  const formatted = formatSalary(Math.abs(delta), currency);
  return {
    text: `${prefix}${delta > 0 ? '' : '-'}${formatted}`,
    colorClass: delta > 0 ? 'text-[#008A05]' : 'text-[#D93025]',
  };
}

/**
 * Format experience years for display.
 */
export function formatExperience(years: number): string {
  if (years === 1) return '1 yr';
  return `${years} yrs`;
}
