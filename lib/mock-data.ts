// lib/mock-data.ts — 65+ seed records matching the integration contract
// Used for static page builds when database is not available

import type { SalaryRecord } from '@/types/salary';

export const mockSalaries: SalaryRecord[] = [
  // ─── Google ───────────────────────────────────────────────────────
  {
    id: 'g001',
    company: 'google', company_display: 'Google', company_slug: 'google',
    role: 'Software Engineer', level: 'L3', location: 'Bengaluru', currency: 'INR',
    experience_years: 2, base_salary: 2500000_00, bonus: 400000_00, stock: 600000_00,
    total_compensation: 3500000_00, source: 'CONTRIBUTOR', confidence_score: 0.95,
    submitted_at: '2025-05-01T10:00:00Z', is_verified: true,
  },
  {
    id: 'g002',
    company: 'google', company_display: 'Google', company_slug: 'google',
    role: 'Software Engineer', level: 'L4', location: 'Bengaluru', currency: 'INR',
    experience_years: 4, base_salary: 3800000_00, bonus: 700000_00, stock: 1200000_00,
    total_compensation: 5700000_00, source: 'CONTRIBUTOR', confidence_score: 0.92,
    submitted_at: '2025-04-20T14:00:00Z', is_verified: true,
  },
  {
    id: 'g003',
    company: 'google', company_display: 'Google', company_slug: 'google',
    role: 'Software Engineer', level: 'L5', location: 'Hyderabad', currency: 'INR',
    experience_years: 8, base_salary: 5500000_00, bonus: 1200000_00, stock: 2500000_00,
    total_compensation: 9200000_00, source: 'CONTRIBUTOR', confidence_score: 0.90,
    submitted_at: '2025-03-15T09:00:00Z', is_verified: true,
  },
  {
    id: 'g004',
    company: 'google', company_display: 'Google', company_slug: 'google',
    role: 'Staff Engineer', level: 'STAFF', location: 'Bengaluru', currency: 'INR',
    experience_years: 12, base_salary: 7500000_00, bonus: 2000000_00, stock: 5000000_00,
    total_compensation: 14500000_00, source: 'CONTRIBUTOR', confidence_score: 0.88,
    submitted_at: '2025-02-10T11:00:00Z', is_verified: true,
  },
  {
    id: 'g005',
    company: 'google', company_display: 'Google', company_slug: 'google',
    role: 'Software Engineer', level: 'L4', location: 'San Francisco', currency: 'USD',
    experience_years: 5, base_salary: 180000_00, bonus: 30000_00, stock: 80000_00,
    total_compensation: 290000_00, source: 'CONTRIBUTOR', confidence_score: 0.95,
    submitted_at: '2025-04-05T08:00:00Z', is_verified: true,
  },
  {
    id: 'g006',
    company: 'google', company_display: 'Google', company_slug: 'google',
    role: 'Product Manager', level: 'L5', location: 'Bengaluru', currency: 'INR',
    experience_years: 7, base_salary: 5000000_00, bonus: 1000000_00, stock: 2000000_00,
    total_compensation: 8000000_00, source: 'CONTRIBUTOR', confidence_score: 0.85,
    submitted_at: '2025-03-20T10:00:00Z', is_verified: false,
  },

  // ─── Amazon ───────────────────────────────────────────────────────
  {
    id: 'a001',
    company: 'amazon', company_display: 'Amazon', company_slug: 'amazon',
    role: 'SDE II', level: 'SDE_II', location: 'Bengaluru', currency: 'INR',
    experience_years: 4, base_salary: 2800000_00, bonus: 0, stock: 1400000_00,
    total_compensation: 4200000_00, source: 'CONTRIBUTOR', confidence_score: 0.93,
    submitted_at: '2025-05-10T09:00:00Z', is_verified: true,
  },
  {
    id: 'a002',
    company: 'amazon', company_display: 'Amazon', company_slug: 'amazon',
    role: 'SDE I', level: 'SDE_I', location: 'Hyderabad', currency: 'INR',
    experience_years: 1, base_salary: 1800000_00, bonus: 200000_00, stock: 300000_00,
    total_compensation: 2300000_00, source: 'CONTRIBUTOR', confidence_score: 0.90,
    submitted_at: '2025-04-28T15:00:00Z', is_verified: true,
  },
  {
    id: 'a003',
    company: 'amazon', company_display: 'Amazon', company_slug: 'amazon',
    role: 'SDE III', level: 'SDE_III', location: 'Bengaluru', currency: 'INR',
    experience_years: 9, base_salary: 4500000_00, bonus: 500000_00, stock: 3000000_00,
    total_compensation: 8000000_00, source: 'CONTRIBUTOR', confidence_score: 0.88,
    submitted_at: '2025-03-12T12:00:00Z', is_verified: true,
  },
  {
    id: 'a004',
    company: 'amazon', company_display: 'Amazon', company_slug: 'amazon',
    role: 'SDE II', level: 'SDE_II', location: 'Mumbai', currency: 'INR',
    experience_years: 5, base_salary: 2900000_00, bonus: 300000_00, stock: 1600000_00,
    total_compensation: 4800000_00, source: 'SCRAPED', confidence_score: 0.70,
    submitted_at: '2025-05-02T07:00:00Z', is_verified: false,
  },
  {
    id: 'a005',
    company: 'amazon', company_display: 'Amazon', company_slug: 'amazon',
    role: 'Principal Engineer', level: 'PRINCIPAL', location: 'San Francisco', currency: 'USD',
    experience_years: 18, base_salary: 250000_00, bonus: 50000_00, stock: 400000_00,
    total_compensation: 700000_00, source: 'CONTRIBUTOR', confidence_score: 0.90,
    submitted_at: '2025-02-20T16:00:00Z', is_verified: true,
  },

  // ─── Meta ─────────────────────────────────────────────────────────
  {
    id: 'm001',
    company: 'meta', company_display: 'Meta', company_slug: 'meta',
    role: 'Software Engineer', level: 'L4', location: 'Bengaluru', currency: 'INR',
    experience_years: 3, base_salary: 3200000_00, bonus: 500000_00, stock: 1800000_00,
    total_compensation: 5500000_00, source: 'CONTRIBUTOR', confidence_score: 0.92,
    submitted_at: '2025-04-18T10:00:00Z', is_verified: true,
  },
  {
    id: 'm002',
    company: 'meta', company_display: 'Meta', company_slug: 'meta',
    role: 'Software Engineer', level: 'L5', location: 'Bengaluru', currency: 'INR',
    experience_years: 7, base_salary: 5200000_00, bonus: 1100000_00, stock: 3500000_00,
    total_compensation: 9800000_00, source: 'CONTRIBUTOR', confidence_score: 0.90,
    submitted_at: '2025-03-25T14:00:00Z', is_verified: true,
  },
  {
    id: 'm003',
    company: 'meta', company_display: 'Meta', company_slug: 'meta',
    role: 'Software Engineer', level: 'L6', location: 'San Francisco', currency: 'USD',
    experience_years: 12, base_salary: 220000_00, bonus: 40000_00, stock: 250000_00,
    total_compensation: 510000_00, source: 'CONTRIBUTOR', confidence_score: 0.88,
    submitted_at: '2025-02-14T09:00:00Z', is_verified: true,
  },
  {
    id: 'm004',
    company: 'meta', company_display: 'Meta', company_slug: 'meta',
    role: 'Data Scientist', level: 'L4', location: 'Hyderabad', currency: 'INR',
    experience_years: 4, base_salary: 3000000_00, bonus: 400000_00, stock: 1500000_00,
    total_compensation: 4900000_00, source: 'CONTRIBUTOR', confidence_score: 0.85,
    submitted_at: '2025-04-10T11:00:00Z', is_verified: false,
  },

  // ─── Microsoft ────────────────────────────────────────────────────
  {
    id: 'ms001',
    company: 'microsoft', company_display: 'Microsoft', company_slug: 'microsoft',
    role: 'Software Engineer', level: 'L4', location: 'Hyderabad', currency: 'INR',
    experience_years: 4, base_salary: 2600000_00, bonus: 500000_00, stock: 800000_00,
    total_compensation: 3900000_00, source: 'CONTRIBUTOR', confidence_score: 0.90,
    submitted_at: '2025-05-05T10:00:00Z', is_verified: true,
  },
  {
    id: 'ms002',
    company: 'microsoft', company_display: 'Microsoft', company_slug: 'microsoft',
    role: 'Software Engineer', level: 'L5', location: 'Bengaluru', currency: 'INR',
    experience_years: 8, base_salary: 4200000_00, bonus: 900000_00, stock: 2000000_00,
    total_compensation: 7100000_00, source: 'CONTRIBUTOR', confidence_score: 0.92,
    submitted_at: '2025-04-15T12:00:00Z', is_verified: true,
  },
  {
    id: 'ms003',
    company: 'microsoft', company_display: 'Microsoft', company_slug: 'microsoft',
    role: 'Principal Engineer', level: 'PRINCIPAL', location: 'Bengaluru', currency: 'INR',
    experience_years: 15, base_salary: 7000000_00, bonus: 2000000_00, stock: 6000000_00,
    total_compensation: 15000000_00, source: 'CONTRIBUTOR', confidence_score: 0.85,
    submitted_at: '2025-01-20T08:00:00Z', is_verified: true,
  },
  {
    id: 'ms004',
    company: 'microsoft', company_display: 'Microsoft', company_slug: 'microsoft',
    role: 'Software Engineer', level: 'L5', location: 'London', currency: 'GBP',
    experience_years: 6, base_salary: 85000_00, bonus: 15000_00, stock: 30000_00,
    total_compensation: 130000_00, source: 'CONTRIBUTOR', confidence_score: 0.88,
    submitted_at: '2025-03-10T14:00:00Z', is_verified: true,
  },

  // ─── Flipkart ─────────────────────────────────────────────────────
  {
    id: 'fk001',
    company: 'flipkart', company_display: 'Flipkart', company_slug: 'flipkart',
    role: 'SDE II', level: 'SDE_II', location: 'Bengaluru', currency: 'INR',
    experience_years: 4, base_salary: 2400000_00, bonus: 300000_00, stock: 800000_00,
    total_compensation: 3500000_00, source: 'CONTRIBUTOR', confidence_score: 0.90,
    submitted_at: '2025-05-08T09:00:00Z', is_verified: true,
  },
  {
    id: 'fk002',
    company: 'flipkart', company_display: 'Flipkart', company_slug: 'flipkart',
    role: 'SDE III', level: 'SDE_III', location: 'Bengaluru', currency: 'INR',
    experience_years: 8, base_salary: 3800000_00, bonus: 600000_00, stock: 2200000_00,
    total_compensation: 6600000_00, source: 'CONTRIBUTOR', confidence_score: 0.88,
    submitted_at: '2025-04-22T11:00:00Z', is_verified: true,
  },
  {
    id: 'fk003',
    company: 'flipkart', company_display: 'Flipkart', company_slug: 'flipkart',
    role: 'SDE I', level: 'SDE_I', location: 'Bengaluru', currency: 'INR',
    experience_years: 1, base_salary: 1600000_00, bonus: 100000_00, stock: 200000_00,
    total_compensation: 1900000_00, source: 'SCRAPED', confidence_score: 0.65,
    submitted_at: '2025-04-01T07:00:00Z', is_verified: false,
  },
  {
    id: 'fk004',
    company: 'flipkart', company_display: 'Flipkart', company_slug: 'flipkart',
    role: 'Staff Engineer', level: 'STAFF', location: 'Bengaluru', currency: 'INR',
    experience_years: 11, base_salary: 5000000_00, bonus: 1000000_00, stock: 4000000_00,
    total_compensation: 10000000_00, source: 'CONTRIBUTOR', confidence_score: 0.85,
    submitted_at: '2025-03-08T15:00:00Z', is_verified: true,
  },

  // ─── Meesho ───────────────────────────────────────────────────────
  {
    id: 'me001',
    company: 'meesho', company_display: 'Meesho', company_slug: 'meesho',
    role: 'SDE II', level: 'SDE_II', location: 'Bengaluru', currency: 'INR',
    experience_years: 3, base_salary: 2200000_00, bonus: 200000_00, stock: 1000000_00,
    total_compensation: 3400000_00, source: 'CONTRIBUTOR', confidence_score: 0.88,
    submitted_at: '2025-05-12T10:00:00Z', is_verified: true,
  },
  {
    id: 'me002',
    company: 'meesho', company_display: 'Meesho', company_slug: 'meesho',
    role: 'SDE III', level: 'SDE_III', location: 'Bengaluru', currency: 'INR',
    experience_years: 6, base_salary: 3200000_00, bonus: 400000_00, stock: 2000000_00,
    total_compensation: 5600000_00, source: 'CONTRIBUTOR', confidence_score: 0.85,
    submitted_at: '2025-04-25T14:00:00Z', is_verified: true,
  },
  {
    id: 'me003',
    company: 'meesho', company_display: 'Meesho', company_slug: 'meesho',
    role: 'SDE I', level: 'SDE_I', location: 'Bengaluru', currency: 'INR',
    experience_years: 1, base_salary: 1500000_00, bonus: 0, stock: 500000_00,
    total_compensation: 2000000_00, source: 'SCRAPED', confidence_score: 0.60,
    submitted_at: '2025-04-02T08:00:00Z', is_verified: false,
  },

  // ─── NVIDIA ───────────────────────────────────────────────────────
  {
    id: 'nv001',
    company: 'nvidia', company_display: 'NVIDIA', company_slug: 'nvidia',
    role: 'Software Engineer', level: 'L4', location: 'Bengaluru', currency: 'INR',
    experience_years: 4, base_salary: 3400000_00, bonus: 600000_00, stock: 2000000_00,
    total_compensation: 6000000_00, source: 'CONTRIBUTOR', confidence_score: 0.92,
    submitted_at: '2025-05-03T10:00:00Z', is_verified: true,
  },
  {
    id: 'nv002',
    company: 'nvidia', company_display: 'NVIDIA', company_slug: 'nvidia',
    role: 'Software Engineer', level: 'L5', location: 'Pune', currency: 'INR',
    experience_years: 8, base_salary: 5000000_00, bonus: 1000000_00, stock: 4000000_00,
    total_compensation: 10000000_00, source: 'CONTRIBUTOR', confidence_score: 0.88,
    submitted_at: '2025-04-12T09:00:00Z', is_verified: true,
  },
  {
    id: 'nv003',
    company: 'nvidia', company_display: 'NVIDIA', company_slug: 'nvidia',
    role: 'Staff Engineer', level: 'STAFF', location: 'San Francisco', currency: 'USD',
    experience_years: 14, base_salary: 220000_00, bonus: 40000_00, stock: 300000_00,
    total_compensation: 560000_00, source: 'CONTRIBUTOR', confidence_score: 0.90,
    submitted_at: '2025-03-05T16:00:00Z', is_verified: true,
  },
  // NVIDIA edge case: very high equity
  {
    id: 'nv004',
    company: 'nvidia', company_display: 'NVIDIA', company_slug: 'nvidia',
    role: 'Principal Engineer', level: 'PRINCIPAL', location: 'San Francisco', currency: 'USD',
    experience_years: 20, base_salary: 280000_00, bonus: 60000_00, stock: 800000_00,
    total_compensation: 1140000_00, source: 'CONTRIBUTOR', confidence_score: 0.85,
    submitted_at: '2025-01-15T10:00:00Z', is_verified: true,
  },

  // ─── TCS ──────────────────────────────────────────────────────────
  {
    id: 'tcs001',
    company: 'tcs', company_display: 'Tata Consultancy Services', company_slug: 'tcs',
    role: 'Software Engineer', level: 'L3', location: 'Mumbai', currency: 'INR',
    experience_years: 2, base_salary: 700000_00, bonus: 50000_00, stock: 0,
    total_compensation: 750000_00, source: 'SCRAPED', confidence_score: 0.70,
    submitted_at: '2025-05-06T11:00:00Z', is_verified: false,
  },
  {
    id: 'tcs002',
    company: 'tcs', company_display: 'Tata Consultancy Services', company_slug: 'tcs',
    role: 'Senior Software Engineer', level: 'L4', location: 'Pune', currency: 'INR',
    experience_years: 5, base_salary: 1200000_00, bonus: 100000_00, stock: 0,
    total_compensation: 1300000_00, source: 'SCRAPED', confidence_score: 0.65,
    submitted_at: '2025-04-30T08:00:00Z', is_verified: false,
  },
  {
    id: 'tcs003',
    company: 'tcs', company_display: 'Tata Consultancy Services', company_slug: 'tcs',
    role: 'Software Engineer', level: 'L3', location: 'Delhi', currency: 'INR',
    experience_years: 1, base_salary: 600000_00, bonus: 30000_00, stock: 0,
    total_compensation: 630000_00, source: 'SCRAPED', confidence_score: 0.60,
    submitted_at: '2025-04-20T09:00:00Z', is_verified: false,
  },
  {
    id: 'tcs004',
    company: 'tcs', company_display: 'Tata Consultancy Services', company_slug: 'tcs',
    role: 'Lead Engineer', level: 'L5', location: 'Bengaluru', currency: 'INR',
    experience_years: 10, base_salary: 1800000_00, bonus: 200000_00, stock: 0,
    total_compensation: 2000000_00, source: 'CONTRIBUTOR', confidence_score: 0.80,
    submitted_at: '2025-03-18T13:00:00Z', is_verified: true,
  },

  // ─── Infosys ──────────────────────────────────────────────────────
  {
    id: 'inf001',
    company: 'infosys', company_display: 'Infosys', company_slug: 'infosys',
    role: 'Software Engineer', level: 'L3', location: 'Bengaluru', currency: 'INR',
    experience_years: 2, base_salary: 800000_00, bonus: 50000_00, stock: 0,
    total_compensation: 850000_00, source: 'SCRAPED', confidence_score: 0.68,
    submitted_at: '2025-05-07T10:00:00Z', is_verified: false,
  },
  {
    id: 'inf002',
    company: 'infosys', company_display: 'Infosys', company_slug: 'infosys',
    role: 'Senior Software Engineer', level: 'L4', location: 'Hyderabad', currency: 'INR',
    experience_years: 5, base_salary: 1400000_00, bonus: 120000_00, stock: 0,
    total_compensation: 1520000_00, source: 'SCRAPED', confidence_score: 0.65,
    submitted_at: '2025-04-25T07:00:00Z', is_verified: false,
  },
  {
    id: 'inf003',
    company: 'infosys', company_display: 'Infosys', company_slug: 'infosys',
    role: 'Lead Engineer', level: 'L5', location: 'Pune', currency: 'INR',
    experience_years: 9, base_salary: 2000000_00, bonus: 200000_00, stock: 100000_00,
    total_compensation: 2300000_00, source: 'CONTRIBUTOR', confidence_score: 0.80,
    submitted_at: '2025-03-28T12:00:00Z', is_verified: true,
  },

  // ─── Wipro ────────────────────────────────────────────────────────
  {
    id: 'wp001',
    company: 'wipro', company_display: 'Wipro', company_slug: 'wipro',
    role: 'Software Engineer', level: 'L3', location: 'Bengaluru', currency: 'INR',
    experience_years: 2, base_salary: 650000_00, bonus: 40000_00, stock: 0,
    total_compensation: 690000_00, source: 'SCRAPED', confidence_score: 0.65,
    submitted_at: '2025-05-09T08:00:00Z', is_verified: false,
  },
  {
    id: 'wp002',
    company: 'wipro', company_display: 'Wipro', company_slug: 'wipro',
    role: 'Senior Software Engineer', level: 'L4', location: 'Mumbai', currency: 'INR',
    experience_years: 5, base_salary: 1100000_00, bonus: 80000_00, stock: 0,
    total_compensation: 1180000_00, source: 'SCRAPED', confidence_score: 0.62,
    submitted_at: '2025-04-18T11:00:00Z', is_verified: false,
  },
  {
    id: 'wp003',
    company: 'wipro', company_display: 'Wipro', company_slug: 'wipro',
    role: 'Technical Lead', level: 'L5', location: 'Hyderabad', currency: 'INR',
    experience_years: 10, base_salary: 1600000_00, bonus: 150000_00, stock: 0,
    total_compensation: 1750000_00, source: 'CONTRIBUTOR', confidence_score: 0.78,
    submitted_at: '2025-03-22T09:00:00Z', is_verified: true,
  },

  // ─── Razorpay ─────────────────────────────────────────────────────
  {
    id: 'rp001',
    company: 'razorpay', company_display: 'Razorpay', company_slug: 'razorpay',
    role: 'SDE II', level: 'SDE_II', location: 'Bengaluru', currency: 'INR',
    experience_years: 3, base_salary: 2200000_00, bonus: 300000_00, stock: 1200000_00,
    total_compensation: 3700000_00, source: 'CONTRIBUTOR', confidence_score: 0.90,
    submitted_at: '2025-05-04T10:00:00Z', is_verified: true,
  },
  {
    id: 'rp002',
    company: 'razorpay', company_display: 'Razorpay', company_slug: 'razorpay',
    role: 'SDE III', level: 'SDE_III', location: 'Bengaluru', currency: 'INR',
    experience_years: 7, base_salary: 3500000_00, bonus: 500000_00, stock: 2500000_00,
    total_compensation: 6500000_00, source: 'CONTRIBUTOR', confidence_score: 0.88,
    submitted_at: '2025-04-14T14:00:00Z', is_verified: true,
  },
  {
    id: 'rp003',
    company: 'razorpay', company_display: 'Razorpay', company_slug: 'razorpay',
    role: 'Staff Engineer', level: 'STAFF', location: 'Bengaluru', currency: 'INR',
    experience_years: 10, base_salary: 4800000_00, bonus: 800000_00, stock: 4000000_00,
    total_compensation: 9600000_00, source: 'CONTRIBUTOR', confidence_score: 0.85,
    submitted_at: '2025-03-02T11:00:00Z', is_verified: true,
  },

  // ─── Zepto ────────────────────────────────────────────────────────
  {
    id: 'zp001',
    company: 'zepto', company_display: 'Zepto', company_slug: 'zepto',
    role: 'SDE I', level: 'SDE_I', location: 'Mumbai', currency: 'INR',
    experience_years: 1, base_salary: 1400000_00, bonus: 100000_00, stock: 600000_00,
    total_compensation: 2100000_00, source: 'CONTRIBUTOR', confidence_score: 0.88,
    submitted_at: '2025-05-11T09:00:00Z', is_verified: true,
  },
  {
    id: 'zp002',
    company: 'zepto', company_display: 'Zepto', company_slug: 'zepto',
    role: 'SDE II', level: 'SDE_II', location: 'Mumbai', currency: 'INR',
    experience_years: 3, base_salary: 2200000_00, bonus: 200000_00, stock: 1500000_00,
    total_compensation: 3900000_00, source: 'CONTRIBUTOR', confidence_score: 0.85,
    submitted_at: '2025-04-28T13:00:00Z', is_verified: true,
  },
  {
    id: 'zp003',
    company: 'zepto', company_display: 'Zepto', company_slug: 'zepto',
    role: 'SDE III', level: 'SDE_III', location: 'Bengaluru', currency: 'INR',
    experience_years: 6, base_salary: 3000000_00, bonus: 400000_00, stock: 2500000_00,
    total_compensation: 5900000_00, source: 'CONTRIBUTOR', confidence_score: 0.82,
    submitted_at: '2025-04-08T10:00:00Z', is_verified: true,
  },

  // ─── Additional records for volume + edge cases ───────────────────

  // Google — more L3 records
  {
    id: 'g007',
    company: 'google', company_display: 'Google', company_slug: 'google',
    role: 'Software Engineer', level: 'L3', location: 'Mumbai', currency: 'INR',
    experience_years: 1, base_salary: 2200000_00, bonus: 300000_00, stock: 500000_00,
    total_compensation: 3000000_00, source: 'CONTRIBUTOR', confidence_score: 0.90,
    submitted_at: '2025-04-08T11:00:00Z', is_verified: true,
  },

  // Amazon — Delhi
  {
    id: 'a006',
    company: 'amazon', company_display: 'Amazon', company_slug: 'amazon',
    role: 'SDE I', level: 'SDE_I', location: 'Delhi', currency: 'INR',
    experience_years: 2, base_salary: 1700000_00, bonus: 100000_00, stock: 200000_00,
    total_compensation: 2000000_00, source: 'SCRAPED', confidence_score: 0.60,
    submitted_at: '2025-04-30T10:00:00Z', is_verified: false,
  },

  // Meta — Pune
  {
    id: 'm005',
    company: 'meta', company_display: 'Meta', company_slug: 'meta',
    role: 'Software Engineer', level: 'L3', location: 'Pune', currency: 'INR',
    experience_years: 2, base_salary: 2800000_00, bonus: 300000_00, stock: 800000_00,
    total_compensation: 3900000_00, source: 'CONTRIBUTOR', confidence_score: 0.88,
    submitted_at: '2025-05-01T09:00:00Z', is_verified: true,
  },

  // Microsoft — Pune
  {
    id: 'ms005',
    company: 'microsoft', company_display: 'Microsoft', company_slug: 'microsoft',
    role: 'Software Engineer', level: 'L3', location: 'Pune', currency: 'INR',
    experience_years: 2, base_salary: 2000000_00, bonus: 300000_00, stock: 400000_00,
    total_compensation: 2700000_00, source: 'CONTRIBUTOR', confidence_score: 0.90,
    submitted_at: '2025-04-20T10:00:00Z', is_verified: true,
  },

  // Edge case: zero bonus AND zero stock — TC = base exactly
  {
    id: 'tcs005',
    company: 'tcs', company_display: 'Tata Consultancy Services', company_slug: 'tcs',
    role: 'Associate Engineer', level: 'L3', location: 'Chennai', currency: 'INR',
    experience_years: 1, base_salary: 450000_00, bonus: 0, stock: 0,
    total_compensation: 450000_00, source: 'SCRAPED', confidence_score: 0.55,
    submitted_at: '2025-05-13T07:00:00Z', is_verified: false,
  },

  // Edge case: very large salary (₹4+ Cr)
  {
    id: 'g008',
    company: 'google', company_display: 'Google', company_slug: 'google',
    role: 'Distinguished Engineer', level: 'PRINCIPAL', location: 'Bengaluru', currency: 'INR',
    experience_years: 22, base_salary: 12000000_00, bonus: 5000000_00, stock: 25000000_00,
    total_compensation: 42000000_00, source: 'CONTRIBUTOR', confidence_score: 0.80,
    submitted_at: '2025-01-05T10:00:00Z', is_verified: true,
  },

  // Edge case: company name > 40 chars (displayed)
  {
    id: 'tcs006',
    company: 'tcs', company_display: 'Tata Consultancy Services', company_slug: 'tcs',
    role: 'Senior Software Engineer', level: 'L4', location: 'Bengaluru', currency: 'INR',
    experience_years: 6, base_salary: 1400000_00, bonus: 150000_00, stock: 0,
    total_compensation: 1550000_00, source: 'CONTRIBUTOR', confidence_score: 0.82,
    submitted_at: '2025-03-15T12:00:00Z', is_verified: true,
  },

  // Flipkart — Mumbai
  {
    id: 'fk005',
    company: 'flipkart', company_display: 'Flipkart', company_slug: 'flipkart',
    role: 'SDE II', level: 'SDE_II', location: 'Mumbai', currency: 'INR',
    experience_years: 5, base_salary: 2600000_00, bonus: 350000_00, stock: 900000_00,
    total_compensation: 3850000_00, source: 'CONTRIBUTOR', confidence_score: 0.88,
    submitted_at: '2025-04-05T11:00:00Z', is_verified: true,
  },

  // Amazon — London
  {
    id: 'a007',
    company: 'amazon', company_display: 'Amazon', company_slug: 'amazon',
    role: 'SDE II', level: 'SDE_II', location: 'London', currency: 'GBP',
    experience_years: 4, base_salary: 70000_00, bonus: 10000_00, stock: 25000_00,
    total_compensation: 105000_00, source: 'CONTRIBUTOR', confidence_score: 0.90,
    submitted_at: '2025-03-20T09:00:00Z', is_verified: true,
  },

  // Meesho — Staff
  {
    id: 'me004',
    company: 'meesho', company_display: 'Meesho', company_slug: 'meesho',
    role: 'Staff Engineer', level: 'STAFF', location: 'Bengaluru', currency: 'INR',
    experience_years: 10, base_salary: 4200000_00, bonus: 600000_00, stock: 3500000_00,
    total_compensation: 8300000_00, source: 'CONTRIBUTOR', confidence_score: 0.82,
    submitted_at: '2025-02-28T14:00:00Z', is_verified: true,
  },

  // Razorpay — SDE I
  {
    id: 'rp004',
    company: 'razorpay', company_display: 'Razorpay', company_slug: 'razorpay',
    role: 'SDE I', level: 'SDE_I', location: 'Bengaluru', currency: 'INR',
    experience_years: 1, base_salary: 1600000_00, bonus: 100000_00, stock: 600000_00,
    total_compensation: 2300000_00, source: 'CONTRIBUTOR', confidence_score: 0.88,
    submitted_at: '2025-04-22T08:00:00Z', is_verified: true,
  },

  // NVIDIA — L3
  {
    id: 'nv005',
    company: 'nvidia', company_display: 'NVIDIA', company_slug: 'nvidia',
    role: 'Software Engineer', level: 'L3', location: 'Bengaluru', currency: 'INR',
    experience_years: 2, base_salary: 2500000_00, bonus: 400000_00, stock: 1000000_00,
    total_compensation: 3900000_00, source: 'CONTRIBUTOR', confidence_score: 0.90,
    submitted_at: '2025-05-01T10:00:00Z', is_verified: true,
  },

  // Additional Google and Amazon records for density
  {
    id: 'g009',
    company: 'google', company_display: 'Google', company_slug: 'google',
    role: 'Software Engineer', level: 'L4', location: 'Pune', currency: 'INR',
    experience_years: 5, base_salary: 3600000_00, bonus: 650000_00, stock: 1100000_00,
    total_compensation: 5350000_00, source: 'CONTRIBUTOR', confidence_score: 0.88,
    submitted_at: '2025-04-02T10:00:00Z', is_verified: true,
  },
  {
    id: 'a008',
    company: 'amazon', company_display: 'Amazon', company_slug: 'amazon',
    role: 'SDE III', level: 'SDE_III', location: 'Hyderabad', currency: 'INR',
    experience_years: 8, base_salary: 4200000_00, bonus: 400000_00, stock: 2800000_00,
    total_compensation: 7400000_00, source: 'CONTRIBUTOR', confidence_score: 0.85,
    submitted_at: '2025-03-10T12:00:00Z', is_verified: true,
  },

  // Wipro — Delhi
  {
    id: 'wp004',
    company: 'wipro', company_display: 'Wipro', company_slug: 'wipro',
    role: 'Software Engineer', level: 'L3', location: 'Delhi', currency: 'INR',
    experience_years: 1, base_salary: 600000_00, bonus: 30000_00, stock: 0,
    total_compensation: 630000_00, source: 'SCRAPED', confidence_score: 0.58,
    submitted_at: '2025-05-10T07:00:00Z', is_verified: false,
  },

  // Infosys — Mumbai
  {
    id: 'inf004',
    company: 'infosys', company_display: 'Infosys', company_slug: 'infosys',
    role: 'Software Engineer', level: 'L3', location: 'Mumbai', currency: 'INR',
    experience_years: 1, base_salary: 750000_00, bonus: 40000_00, stock: 0,
    total_compensation: 790000_00, source: 'SCRAPED', confidence_score: 0.62,
    submitted_at: '2025-04-28T08:00:00Z', is_verified: false,
  },

  // Zepto — L4
  {
    id: 'zp004',
    company: 'zepto', company_display: 'Zepto', company_slug: 'zepto',
    role: 'Engineering Manager', level: 'L5', location: 'Mumbai', currency: 'INR',
    experience_years: 8, base_salary: 3500000_00, bonus: 500000_00, stock: 3000000_00,
    total_compensation: 7000000_00, source: 'CONTRIBUTOR', confidence_score: 0.82,
    submitted_at: '2025-03-25T10:00:00Z', is_verified: true,
  },
];

/**
 * Get all unique companies from mock data
 */
export function getUniqueCompanies(): Array<{ slug: string; display: string }> {
  const seen = new Set<string>();
  const result: Array<{ slug: string; display: string }> = [];
  for (const record of mockSalaries) {
    if (!seen.has(record.company_slug)) {
      seen.add(record.company_slug);
      result.push({ slug: record.company_slug, display: record.company_display });
    }
  }
  return result.sort((a, b) => a.display.localeCompare(b.display));
}

/**
 * Get all unique roles from mock data
 */
export function getUniqueRoles(): string[] {
  return [...new Set(mockSalaries.map(s => s.role))].sort();
}

/**
 * Get all unique locations from mock data
 */
export function getUniqueLocations(): string[] {
  return [...new Set(mockSalaries.map(s => s.location))].sort();
}
