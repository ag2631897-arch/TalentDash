// lib/normalise.ts — Company name normalisation (mirrors Python pipeline logic)

/**
 * Alias lookup table for company name normalisation.
 * Maps cleaned (but not aliased) names to their canonical slug.
 */
const ALIASES: Record<string, string> = {
  'tata consultancy services': 'tcs',
  'tata consultancy': 'tcs',
  'tcs': 'tcs',
  'amazon web services': 'amazon',
  'aws': 'amazon',
  'amazon': 'amazon',
  'google': 'google',
  'google india': 'google',
  'alphabet': 'google',
  'meta platforms': 'meta',
  'facebook': 'meta',
  'meta': 'meta',
  'microsoft': 'microsoft',
  'flipkart': 'flipkart',
  'flipkart internet': 'flipkart',
  'meesho': 'meesho',
  'nvidia': 'nvidia',
  'infosys': 'infosys',
  'infosys bpo': 'infosys',
  'wipro': 'wipro',
  'wipro technologies': 'wipro',
  'razorpay': 'razorpay',
  'zepto': 'zepto',
};

/**
 * Normalise a raw company name to its canonical slug.
 *
 * Two-layer approach:
 * 1. Programmatic: lowercase, trim, strip legal suffixes
 * 2. Alias lookup for known variants
 *
 * Examples:
 *   "Google India Pvt. Ltd."  → "google"
 *   "TCS Ltd."                → "tcs"
 *   "amazon.com"              → "amazon"
 *   "Flipkart Internet Pvt Ltd" → "flipkart"
 *   "Infosys BPO"             → "infosys"
 */
export function normaliseCompanyName(raw: string): string {
  // Layer 1: Programmatic rules
  let s = raw.toLowerCase().trim();

  // Strip legal suffixes and common noise words
  s = s.replace(
    /\b(pvt\.?|ltd\.?|inc\.?|llc\.?|corp\.?|private|limited|technologies|india|\.com|co\.?|corporation|services)\b/gi,
    ''
  );

  // Strip remaining punctuation
  s = s.replace(/[^a-z0-9\s]/g, '');

  // Collapse multiple spaces to single space and trim
  s = s.replace(/\s+/g, ' ').trim();

  // Layer 2: Alias lookup
  return ALIASES[s] || s.replace(/\s+/g, '-');
}

/**
 * Generate a URL-safe slug from a company name.
 */
export function generateSlug(name: string): string {
  return normaliseCompanyName(name);
}
