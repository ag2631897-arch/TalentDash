// lib/currency.ts — Currency conversion configuration

/** Conversion rates to INR (base currency) */
export const CONVERSION_RATES: Record<string, number> = {
  INR: 1,
  USD: 83.50,    // 1 USD = 83.50 INR
  GBP: 106.00,   // 1 GBP = 106.00 INR
  EUR: 91.00,    // 1 EUR = 91.00 INR
  AUD: 55.20,    // 1 AUD = 55.20 INR
  CAD: 61.10,    // 1 CAD = 61.10 INR
  SGD: 62.00,    // 1 SGD = 62.00 INR
  AED: 22.73,    // 1 AED = 22.73 INR
  JPY: 0.53,     // 1 JPY = 0.53 INR
};

/** Currency symbols */
export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  GBP: '£',
  EUR: '€',
  AUD: 'A$',
  CAD: 'C$',
  SGD: 'S$',
  AED: 'د.إ',
  JPY: '¥',
};

/**
 * Convert an amount from one currency to another.
 * Amounts are in smallest units (paise for INR, cents for USD, etc.)
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) return amount;

  const fromRate = CONVERSION_RATES[fromCurrency];
  const toRate = CONVERSION_RATES[toCurrency];

  if (!fromRate || !toRate) return amount;

  // Convert to INR first (base), then to target
  const inINR = amount * fromRate;
  const converted = inINR / toRate;

  return Math.round(converted);
}
