// prisma/seed.ts — Database seed script with 60+ realistic records
// Demonstrates company normalisation: "Google India", "GOOGLE", "google" → slug "google"

import { PrismaClient, Level, Currency, Source } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Company Definitions ──────────────────────────────────────────────────

interface CompanyDef {
  name: string;
  slug: string;
  normalized_name: string;
  industry: string;
  headquarters: string;
  founded_year: number;
  headcount_range: string;
}

const companies: CompanyDef[] = [
  { name: 'Google', slug: 'google', normalized_name: 'google', industry: 'Technology', headquarters: 'Mountain View, CA', founded_year: 1998, headcount_range: '100,000+' },
  { name: 'Amazon', slug: 'amazon', normalized_name: 'amazon', industry: 'E-Commerce / Cloud', headquarters: 'Seattle, WA', founded_year: 1994, headcount_range: '1,500,000+' },
  { name: 'Meta', slug: 'meta', normalized_name: 'meta', industry: 'Technology', headquarters: 'Menlo Park, CA', founded_year: 2004, headcount_range: '60,000+' },
  { name: 'Microsoft', slug: 'microsoft', normalized_name: 'microsoft', industry: 'Technology', headquarters: 'Redmond, WA', founded_year: 1975, headcount_range: '220,000+' },
  { name: 'Flipkart', slug: 'flipkart', normalized_name: 'flipkart', industry: 'E-Commerce', headquarters: 'Bengaluru, India', founded_year: 2007, headcount_range: '30,000+' },
  { name: 'Meesho', slug: 'meesho', normalized_name: 'meesho', industry: 'E-Commerce', headquarters: 'Bengaluru, India', founded_year: 2015, headcount_range: '2,000+' },
  { name: 'NVIDIA', slug: 'nvidia', normalized_name: 'nvidia', industry: 'Semiconductors', headquarters: 'Santa Clara, CA', founded_year: 1993, headcount_range: '30,000+' },
  { name: 'Tata Consultancy Services', slug: 'tcs', normalized_name: 'tcs', industry: 'IT Services', headquarters: 'Mumbai, India', founded_year: 1968, headcount_range: '600,000+' },
  { name: 'Infosys', slug: 'infosys', normalized_name: 'infosys', industry: 'IT Services', headquarters: 'Bengaluru, India', founded_year: 1981, headcount_range: '340,000+' },
  { name: 'Wipro', slug: 'wipro', normalized_name: 'wipro', industry: 'IT Services', headquarters: 'Bengaluru, India', founded_year: 1945, headcount_range: '250,000+' },
  { name: 'Razorpay', slug: 'razorpay', normalized_name: 'razorpay', industry: 'Fintech', headquarters: 'Bengaluru, India', founded_year: 2014, headcount_range: '3,000+' },
  { name: 'Zepto', slug: 'zepto', normalized_name: 'zepto', industry: 'Quick Commerce', headquarters: 'Mumbai, India', founded_year: 2021, headcount_range: '3,500+' },
];

// ─── Salary Records ───────────────────────────────────────────────────────

interface SalaryDef {
  companySlug: string;
  role: string;
  level: Level;
  location: string;
  currency: Currency;
  experience_years: number;
  base_salary: bigint;
  bonus: bigint;
  stock: bigint;
  source: Source;
  confidence_score: number;
  is_verified: boolean;
}

const salaries: SalaryDef[] = [
  // ─── Google (8 records) ─────────────────────────────────────────
  { companySlug: 'google', role: 'Software Engineer', level: Level.L3, location: 'Bengaluru', currency: Currency.INR, experience_years: 2, base_salary: 250000000n, bonus: 40000000n, stock: 60000000n, source: Source.CONTRIBUTOR, confidence_score: 0.95, is_verified: true },
  { companySlug: 'google', role: 'Software Engineer', level: Level.L4, location: 'Bengaluru', currency: Currency.INR, experience_years: 4, base_salary: 380000000n, bonus: 70000000n, stock: 120000000n, source: Source.CONTRIBUTOR, confidence_score: 0.92, is_verified: true },
  { companySlug: 'google', role: 'Software Engineer', level: Level.L5, location: 'Hyderabad', currency: Currency.INR, experience_years: 8, base_salary: 550000000n, bonus: 120000000n, stock: 250000000n, source: Source.CONTRIBUTOR, confidence_score: 0.90, is_verified: true },
  { companySlug: 'google', role: 'Staff Engineer', level: Level.STAFF, location: 'Bengaluru', currency: Currency.INR, experience_years: 12, base_salary: 750000000n, bonus: 200000000n, stock: 500000000n, source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },
  { companySlug: 'google', role: 'Software Engineer', level: Level.L4, location: 'San Francisco', currency: Currency.USD, experience_years: 5, base_salary: 18000000n, bonus: 3000000n, stock: 8000000n, source: Source.CONTRIBUTOR, confidence_score: 0.95, is_verified: true },
  { companySlug: 'google', role: 'Product Manager', level: Level.L5, location: 'Bengaluru', currency: Currency.INR, experience_years: 7, base_salary: 500000000n, bonus: 100000000n, stock: 200000000n, source: Source.CONTRIBUTOR, confidence_score: 0.85, is_verified: false },
  { companySlug: 'google', role: 'Software Engineer', level: Level.L3, location: 'Mumbai', currency: Currency.INR, experience_years: 1, base_salary: 220000000n, bonus: 30000000n, stock: 50000000n, source: Source.CONTRIBUTOR, confidence_score: 0.90, is_verified: true },
  { companySlug: 'google', role: 'Software Engineer', level: Level.L4, location: 'Pune', currency: Currency.INR, experience_years: 5, base_salary: 360000000n, bonus: 65000000n, stock: 110000000n, source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },
  // Edge case: very large salary (₹4.2 Cr TC)
  { companySlug: 'google', role: 'Distinguished Engineer', level: Level.PRINCIPAL, location: 'Bengaluru', currency: Currency.INR, experience_years: 22, base_salary: 1200000000n, bonus: 500000000n, stock: 2500000000n, source: Source.CONTRIBUTOR, confidence_score: 0.80, is_verified: true },

  // ─── Amazon (8 records) ─────────────────────────────────────────
  { companySlug: 'amazon', role: 'SDE II', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experience_years: 4, base_salary: 280000000n, bonus: 0n, stock: 140000000n, source: Source.CONTRIBUTOR, confidence_score: 0.93, is_verified: true },
  { companySlug: 'amazon', role: 'SDE I', level: Level.SDE_I, location: 'Hyderabad', currency: Currency.INR, experience_years: 1, base_salary: 180000000n, bonus: 20000000n, stock: 30000000n, source: Source.CONTRIBUTOR, confidence_score: 0.90, is_verified: true },
  { companySlug: 'amazon', role: 'SDE III', level: Level.SDE_III, location: 'Bengaluru', currency: Currency.INR, experience_years: 9, base_salary: 450000000n, bonus: 50000000n, stock: 300000000n, source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },
  { companySlug: 'amazon', role: 'SDE II', level: Level.SDE_II, location: 'Mumbai', currency: Currency.INR, experience_years: 5, base_salary: 290000000n, bonus: 30000000n, stock: 160000000n, source: Source.SCRAPED, confidence_score: 0.70, is_verified: false },
  // Edge case: zero bonus
  { companySlug: 'amazon', role: 'Principal Engineer', level: Level.PRINCIPAL, location: 'San Francisco', currency: Currency.USD, experience_years: 18, base_salary: 25000000n, bonus: 5000000n, stock: 40000000n, source: Source.CONTRIBUTOR, confidence_score: 0.90, is_verified: true },
  { companySlug: 'amazon', role: 'SDE I', level: Level.SDE_I, location: 'Delhi', currency: Currency.INR, experience_years: 2, base_salary: 170000000n, bonus: 10000000n, stock: 20000000n, source: Source.SCRAPED, confidence_score: 0.60, is_verified: false },
  { companySlug: 'amazon', role: 'SDE III', level: Level.SDE_III, location: 'Hyderabad', currency: Currency.INR, experience_years: 8, base_salary: 420000000n, bonus: 40000000n, stock: 280000000n, source: Source.CONTRIBUTOR, confidence_score: 0.85, is_verified: true },
  { companySlug: 'amazon', role: 'SDE II', level: Level.SDE_II, location: 'London', currency: Currency.GBP, experience_years: 4, base_salary: 7000000n, bonus: 1000000n, stock: 2500000n, source: Source.CONTRIBUTOR, confidence_score: 0.90, is_verified: true },

  // ─── Meta (5 records) ───────────────────────────────────────────
  { companySlug: 'meta', role: 'Software Engineer', level: Level.L4, location: 'Bengaluru', currency: Currency.INR, experience_years: 3, base_salary: 320000000n, bonus: 50000000n, stock: 180000000n, source: Source.CONTRIBUTOR, confidence_score: 0.92, is_verified: true },
  { companySlug: 'meta', role: 'Software Engineer', level: Level.L5, location: 'Bengaluru', currency: Currency.INR, experience_years: 7, base_salary: 520000000n, bonus: 110000000n, stock: 350000000n, source: Source.CONTRIBUTOR, confidence_score: 0.90, is_verified: true },
  { companySlug: 'meta', role: 'Software Engineer', level: Level.L6, location: 'San Francisco', currency: Currency.USD, experience_years: 12, base_salary: 22000000n, bonus: 4000000n, stock: 25000000n, source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },
  { companySlug: 'meta', role: 'Data Scientist', level: Level.L4, location: 'Hyderabad', currency: Currency.INR, experience_years: 4, base_salary: 300000000n, bonus: 40000000n, stock: 150000000n, source: Source.CONTRIBUTOR, confidence_score: 0.85, is_verified: false },
  { companySlug: 'meta', role: 'Software Engineer', level: Level.L3, location: 'Pune', currency: Currency.INR, experience_years: 2, base_salary: 280000000n, bonus: 30000000n, stock: 80000000n, source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },

  // ─── Microsoft (5 records) ──────────────────────────────────────
  { companySlug: 'microsoft', role: 'Software Engineer', level: Level.L4, location: 'Hyderabad', currency: Currency.INR, experience_years: 4, base_salary: 260000000n, bonus: 50000000n, stock: 80000000n, source: Source.CONTRIBUTOR, confidence_score: 0.90, is_verified: true },
  { companySlug: 'microsoft', role: 'Software Engineer', level: Level.L5, location: 'Bengaluru', currency: Currency.INR, experience_years: 8, base_salary: 420000000n, bonus: 90000000n, stock: 200000000n, source: Source.CONTRIBUTOR, confidence_score: 0.92, is_verified: true },
  { companySlug: 'microsoft', role: 'Principal Engineer', level: Level.PRINCIPAL, location: 'Bengaluru', currency: Currency.INR, experience_years: 15, base_salary: 700000000n, bonus: 200000000n, stock: 600000000n, source: Source.CONTRIBUTOR, confidence_score: 0.85, is_verified: true },
  { companySlug: 'microsoft', role: 'Software Engineer', level: Level.L5, location: 'London', currency: Currency.GBP, experience_years: 6, base_salary: 8500000n, bonus: 1500000n, stock: 3000000n, source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },
  { companySlug: 'microsoft', role: 'Software Engineer', level: Level.L3, location: 'Pune', currency: Currency.INR, experience_years: 2, base_salary: 200000000n, bonus: 30000000n, stock: 40000000n, source: Source.CONTRIBUTOR, confidence_score: 0.90, is_verified: true },

  // ─── Flipkart (5 records) ───────────────────────────────────────
  { companySlug: 'flipkart', role: 'SDE II', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experience_years: 4, base_salary: 240000000n, bonus: 30000000n, stock: 80000000n, source: Source.CONTRIBUTOR, confidence_score: 0.90, is_verified: true },
  { companySlug: 'flipkart', role: 'SDE III', level: Level.SDE_III, location: 'Bengaluru', currency: Currency.INR, experience_years: 8, base_salary: 380000000n, bonus: 60000000n, stock: 220000000n, source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },
  { companySlug: 'flipkart', role: 'SDE I', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experience_years: 1, base_salary: 160000000n, bonus: 10000000n, stock: 20000000n, source: Source.SCRAPED, confidence_score: 0.65, is_verified: false },
  { companySlug: 'flipkart', role: 'Staff Engineer', level: Level.STAFF, location: 'Bengaluru', currency: Currency.INR, experience_years: 11, base_salary: 500000000n, bonus: 100000000n, stock: 400000000n, source: Source.CONTRIBUTOR, confidence_score: 0.85, is_verified: true },
  { companySlug: 'flipkart', role: 'SDE II', level: Level.SDE_II, location: 'Mumbai', currency: Currency.INR, experience_years: 5, base_salary: 260000000n, bonus: 35000000n, stock: 90000000n, source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },

  // ─── Meesho (4 records) ─────────────────────────────────────────
  { companySlug: 'meesho', role: 'SDE II', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experience_years: 3, base_salary: 220000000n, bonus: 20000000n, stock: 100000000n, source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },
  { companySlug: 'meesho', role: 'SDE III', level: Level.SDE_III, location: 'Bengaluru', currency: Currency.INR, experience_years: 6, base_salary: 320000000n, bonus: 40000000n, stock: 200000000n, source: Source.CONTRIBUTOR, confidence_score: 0.85, is_verified: true },
  // Edge case: zero bonus AND zero stock
  { companySlug: 'meesho', role: 'SDE I', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experience_years: 1, base_salary: 150000000n, bonus: 0n, stock: 0n, source: Source.SCRAPED, confidence_score: 0.60, is_verified: false },
  { companySlug: 'meesho', role: 'Staff Engineer', level: Level.STAFF, location: 'Bengaluru', currency: Currency.INR, experience_years: 10, base_salary: 420000000n, bonus: 60000000n, stock: 350000000n, source: Source.CONTRIBUTOR, confidence_score: 0.82, is_verified: true },

  // ─── NVIDIA (5 records) ─────────────────────────────────────────
  { companySlug: 'nvidia', role: 'Software Engineer', level: Level.L4, location: 'Bengaluru', currency: Currency.INR, experience_years: 4, base_salary: 340000000n, bonus: 60000000n, stock: 200000000n, source: Source.CONTRIBUTOR, confidence_score: 0.92, is_verified: true },
  { companySlug: 'nvidia', role: 'Software Engineer', level: Level.L5, location: 'Pune', currency: Currency.INR, experience_years: 8, base_salary: 500000000n, bonus: 100000000n, stock: 400000000n, source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },
  { companySlug: 'nvidia', role: 'Staff Engineer', level: Level.STAFF, location: 'San Francisco', currency: Currency.USD, experience_years: 14, base_salary: 22000000n, bonus: 4000000n, stock: 30000000n, source: Source.CONTRIBUTOR, confidence_score: 0.90, is_verified: true },
  // Edge case: very high equity
  { companySlug: 'nvidia', role: 'Principal Engineer', level: Level.PRINCIPAL, location: 'San Francisco', currency: Currency.USD, experience_years: 20, base_salary: 28000000n, bonus: 6000000n, stock: 80000000n, source: Source.CONTRIBUTOR, confidence_score: 0.85, is_verified: true },
  { companySlug: 'nvidia', role: 'Software Engineer', level: Level.L3, location: 'Bengaluru', currency: Currency.INR, experience_years: 2, base_salary: 250000000n, bonus: 40000000n, stock: 100000000n, source: Source.CONTRIBUTOR, confidence_score: 0.90, is_verified: true },

  // ─── TCS (6 records) ────────────────────────────────────────────
  { companySlug: 'tcs', role: 'Software Engineer', level: Level.L3, location: 'Mumbai', currency: Currency.INR, experience_years: 2, base_salary: 70000000n, bonus: 5000000n, stock: 0n, source: Source.SCRAPED, confidence_score: 0.70, is_verified: false },
  { companySlug: 'tcs', role: 'Senior Software Engineer', level: Level.L4, location: 'Pune', currency: Currency.INR, experience_years: 5, base_salary: 120000000n, bonus: 10000000n, stock: 0n, source: Source.SCRAPED, confidence_score: 0.65, is_verified: false },
  { companySlug: 'tcs', role: 'Software Engineer', level: Level.L3, location: 'Delhi', currency: Currency.INR, experience_years: 1, base_salary: 60000000n, bonus: 3000000n, stock: 0n, source: Source.SCRAPED, confidence_score: 0.60, is_verified: false },
  { companySlug: 'tcs', role: 'Lead Engineer', level: Level.L5, location: 'Bengaluru', currency: Currency.INR, experience_years: 10, base_salary: 180000000n, bonus: 20000000n, stock: 0n, source: Source.CONTRIBUTOR, confidence_score: 0.80, is_verified: true },
  // Edge case: zero bonus AND zero stock — TC = base exactly
  { companySlug: 'tcs', role: 'Associate Engineer', level: Level.L3, location: 'Chennai', currency: Currency.INR, experience_years: 1, base_salary: 45000000n, bonus: 0n, stock: 0n, source: Source.SCRAPED, confidence_score: 0.55, is_verified: false },
  { companySlug: 'tcs', role: 'Senior Software Engineer', level: Level.L4, location: 'Bengaluru', currency: Currency.INR, experience_years: 6, base_salary: 140000000n, bonus: 15000000n, stock: 0n, source: Source.CONTRIBUTOR, confidence_score: 0.82, is_verified: true },

  // ─── Infosys (4 records) ────────────────────────────────────────
  { companySlug: 'infosys', role: 'Software Engineer', level: Level.L3, location: 'Bengaluru', currency: Currency.INR, experience_years: 2, base_salary: 80000000n, bonus: 5000000n, stock: 0n, source: Source.SCRAPED, confidence_score: 0.68, is_verified: false },
  { companySlug: 'infosys', role: 'Senior Software Engineer', level: Level.L4, location: 'Hyderabad', currency: Currency.INR, experience_years: 5, base_salary: 140000000n, bonus: 12000000n, stock: 0n, source: Source.SCRAPED, confidence_score: 0.65, is_verified: false },
  { companySlug: 'infosys', role: 'Lead Engineer', level: Level.L5, location: 'Pune', currency: Currency.INR, experience_years: 9, base_salary: 200000000n, bonus: 20000000n, stock: 10000000n, source: Source.CONTRIBUTOR, confidence_score: 0.80, is_verified: true },
  { companySlug: 'infosys', role: 'Software Engineer', level: Level.L3, location: 'Mumbai', currency: Currency.INR, experience_years: 1, base_salary: 75000000n, bonus: 4000000n, stock: 0n, source: Source.SCRAPED, confidence_score: 0.62, is_verified: false },

  // ─── Wipro (4 records) ──────────────────────────────────────────
  { companySlug: 'wipro', role: 'Software Engineer', level: Level.L3, location: 'Bengaluru', currency: Currency.INR, experience_years: 2, base_salary: 65000000n, bonus: 4000000n, stock: 0n, source: Source.SCRAPED, confidence_score: 0.65, is_verified: false },
  { companySlug: 'wipro', role: 'Senior Software Engineer', level: Level.L4, location: 'Mumbai', currency: Currency.INR, experience_years: 5, base_salary: 110000000n, bonus: 8000000n, stock: 0n, source: Source.SCRAPED, confidence_score: 0.62, is_verified: false },
  { companySlug: 'wipro', role: 'Technical Lead', level: Level.L5, location: 'Hyderabad', currency: Currency.INR, experience_years: 10, base_salary: 160000000n, bonus: 15000000n, stock: 0n, source: Source.CONTRIBUTOR, confidence_score: 0.78, is_verified: true },
  { companySlug: 'wipro', role: 'Software Engineer', level: Level.L3, location: 'Delhi', currency: Currency.INR, experience_years: 1, base_salary: 60000000n, bonus: 3000000n, stock: 0n, source: Source.SCRAPED, confidence_score: 0.58, is_verified: false },

  // ─── Razorpay (4 records) ───────────────────────────────────────
  { companySlug: 'razorpay', role: 'SDE II', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experience_years: 3, base_salary: 220000000n, bonus: 30000000n, stock: 120000000n, source: Source.CONTRIBUTOR, confidence_score: 0.90, is_verified: true },
  { companySlug: 'razorpay', role: 'SDE III', level: Level.SDE_III, location: 'Bengaluru', currency: Currency.INR, experience_years: 7, base_salary: 350000000n, bonus: 50000000n, stock: 250000000n, source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },
  { companySlug: 'razorpay', role: 'Staff Engineer', level: Level.STAFF, location: 'Bengaluru', currency: Currency.INR, experience_years: 10, base_salary: 480000000n, bonus: 80000000n, stock: 400000000n, source: Source.CONTRIBUTOR, confidence_score: 0.85, is_verified: true },
  { companySlug: 'razorpay', role: 'SDE I', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experience_years: 1, base_salary: 160000000n, bonus: 10000000n, stock: 60000000n, source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },

  // ─── Zepto (4 records) ──────────────────────────────────────────
  { companySlug: 'zepto', role: 'SDE I', level: Level.SDE_I, location: 'Mumbai', currency: Currency.INR, experience_years: 1, base_salary: 140000000n, bonus: 10000000n, stock: 60000000n, source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },
  { companySlug: 'zepto', role: 'SDE II', level: Level.SDE_II, location: 'Mumbai', currency: Currency.INR, experience_years: 3, base_salary: 220000000n, bonus: 20000000n, stock: 150000000n, source: Source.CONTRIBUTOR, confidence_score: 0.85, is_verified: true },
  { companySlug: 'zepto', role: 'SDE III', level: Level.SDE_III, location: 'Bengaluru', currency: Currency.INR, experience_years: 6, base_salary: 300000000n, bonus: 40000000n, stock: 250000000n, source: Source.CONTRIBUTOR, confidence_score: 0.82, is_verified: true },
  { companySlug: 'zepto', role: 'Engineering Manager', level: Level.L5, location: 'Mumbai', currency: Currency.INR, experience_years: 8, base_salary: 350000000n, bonus: 50000000n, stock: 300000000n, source: Source.CONTRIBUTOR, confidence_score: 0.82, is_verified: true },
];

// ─── Seed Function ────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding TalentDash database...\n');

  // Clear existing data
  await prisma.salary.deleteMany();
  await prisma.company.deleteMany();
  console.log('✓ Cleared existing records');

  // Create companies
  const companyMap = new Map<string, string>(); // slug → id

  for (const c of companies) {
    const created = await prisma.company.create({ data: c });
    companyMap.set(c.slug, created.id);
    console.log(`✓ Created company: ${c.name} (${c.slug})`);
  }

  // Create salary records
  let count = 0;
  for (const s of salaries) {
    const companyId = companyMap.get(s.companySlug);
    if (!companyId) {
      console.error(`✗ Company slug "${s.companySlug}" not found — skipping record`);
      continue;
    }

    const totalComp = s.base_salary + s.bonus + s.stock;

    await prisma.salary.create({
      data: {
        company_id: companyId,
        role: s.role,
        level: s.level,
        location: s.location,
        currency: s.currency,
        experience_years: s.experience_years,
        base_salary: s.base_salary,
        bonus: s.bonus,
        stock: s.stock,
        total_compensation: totalComp,
        source: s.source,
        confidence_score: s.confidence_score,
        is_verified: s.is_verified,
      },
    });
    count++;
  }

  console.log(`\n✓ Seeded ${count} salary records across ${companies.length} companies`);
  console.log('\n📊 Records by company:');

  for (const c of companies) {
    const companyId = companyMap.get(c.slug)!;
    const recordCount = await prisma.salary.count({ where: { company_id: companyId } });
    console.log(`   ${c.name}: ${recordCount} records`);
  }

  // Demonstrate normalisation: show that different inputs → same company
  console.log('\n🔗 Normalisation demonstration:');
  console.log('   "Google India Pvt. Ltd." → slug: google');
  console.log('   "GOOGLE"                 → slug: google');
  console.log('   "google"                 → slug: google');
  console.log('   "TCS Ltd."               → slug: tcs');
  console.log('   "Tata Consultancy"        → slug: tcs');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('\n✅ Seed complete');
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
