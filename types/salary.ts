// types/salary.ts — Integration Contract TypeScript Interface

export type Level =
  | 'L3' | 'L4' | 'L5' | 'L6'
  | 'SDE_I' | 'SDE_II' | 'SDE_III'
  | 'STAFF' | 'PRINCIPAL' | 'IC4' | 'IC5';

export type Currency = 'INR' | 'USD' | 'GBP' | 'EUR';
export type Source = 'CONTRIBUTOR' | 'SCRAPED' | 'AI_INFERRED';

export interface SalaryRecord {
  id: string;
  company: string;           // normalised lowercase
  company_display: string;   // formatted for UI display
  company_slug: string;      // URL-safe slug
  role: string;
  level: Level;
  location: string;
  currency: Currency;
  experience_years: number;
  base_salary: number;       // in smallest currency unit (paise/cents)
  bonus: number;             // 0 if none — never null
  stock: number;             // 0 if none — never null
  total_compensation: number; // ALWAYS computed: base + bonus + stock
  source: Source;
  confidence_score: number;  // 0.0 – 1.0
  submitted_at: string;      // ISO 8601
  is_verified: boolean;
}

export const LEVEL_ORDER: Level[] = [
  'L3', 'SDE_I', 'L4', 'SDE_II', 'L5', 'SDE_III', 'L6', 'STAFF', 'PRINCIPAL', 'IC4', 'IC5',
];

export const LEVEL_DISPLAY: Record<Level, string> = {
  L3: 'L3',
  L4: 'L4',
  L5: 'L5',
  L6: 'L6',
  SDE_I: 'SDE-I',
  SDE_II: 'SDE-II',
  SDE_III: 'SDE-III',
  STAFF: 'Staff',
  PRINCIPAL: 'Principal',
  IC4: 'IC4',
  IC5: 'IC5',
};

export const VALID_LEVELS: Level[] = [
  'L3', 'L4', 'L5', 'L6',
  'SDE_I', 'SDE_II', 'SDE_III',
  'STAFF', 'PRINCIPAL', 'IC4', 'IC5',
];
