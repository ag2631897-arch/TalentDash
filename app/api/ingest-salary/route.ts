// app/api/ingest-salary/route.ts — POST endpoint for salary ingestion

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { normaliseCompanyName } from '@/lib/normalise';
import { COMPANY_DISPLAY } from '@/types/company';

const VALID_LEVELS = [
  'L3', 'L4', 'L5', 'L6',
  'SDE_I', 'SDE_II', 'SDE_III',
  'STAFF', 'PRINCIPAL', 'IC4', 'IC5',
] as const;

const VALID_CURRENCIES = ['INR', 'USD', 'GBP', 'EUR'] as const;
const VALID_SOURCES = ['CONTRIBUTOR', 'SCRAPED', 'AI_INFERRED'] as const;

type Level = (typeof VALID_LEVELS)[number];
type Currency = (typeof VALID_CURRENCIES)[number];
type Source = (typeof VALID_SOURCES)[number];

interface IngestBody {
  company: string;
  role: string;
  level_standardized: string;
  location: string;
  currency: string;
  experience_years: number;
  base_salary: number;
  bonus?: number;
  stock?: number;
  total_compensation?: number; // will be stripped and recomputed
  source: string;
  confidence_score: number;
}

function validationError(field: string, message: string) {
  return NextResponse.json(
    { error: true, field, message },
    { status: 400 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body: IngestBody = await request.json();

    // ─── Step 1: Required fields ──────────────────────────────────
    const requiredFields: (keyof IngestBody)[] = [
      'company', 'role', 'level_standardized', 'location',
      'currency', 'experience_years', 'base_salary', 'source', 'confidence_score',
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        return validationError(field, `${field} is required`);
      }
    }

    // ─── Step 2: Type checks ──────────────────────────────────────
    if (typeof body.company !== 'string') {
      return validationError('company', 'company must be a string');
    }
    if (typeof body.role !== 'string') {
      return validationError('role', 'role must be a string');
    }
    if (typeof body.experience_years !== 'number' || !Number.isInteger(body.experience_years)) {
      return validationError('experience_years', 'experience_years must be an integer');
    }
    if (typeof body.base_salary !== 'number') {
      return validationError('base_salary', 'base_salary must be a number');
    }
    if (typeof body.confidence_score !== 'number') {
      return validationError('confidence_score', 'confidence_score must be a number');
    }

    // ─── Step 3: Level enum check ─────────────────────────────────
    if (!VALID_LEVELS.includes(body.level_standardized as Level)) {
      return validationError(
        'level_standardized',
        `level_standardized must be one of: ${VALID_LEVELS.join(', ')}`
      );
    }

    // ─── Step 4: experience_years range ───────────────────────────
    if (body.experience_years <= 0 || body.experience_years > 50) {
      return validationError(
        'experience_years',
        'experience_years must be greater than 0 and at most 50'
      );
    }

    // ─── Step 5: base_salary > 0 ──────────────────────────────────
    if (body.base_salary <= 0) {
      return validationError('base_salary', 'base_salary must be greater than 0');
    }

    // ─── Step 6: confidence_score range ───────────────────────────
    if (body.confidence_score < 0 || body.confidence_score > 1) {
      return validationError(
        'confidence_score',
        'confidence_score must be between 0.0 and 1.0'
      );
    }

    // Validate currency
    if (!VALID_CURRENCIES.includes(body.currency as Currency)) {
      return validationError(
        'currency',
        `currency must be one of: ${VALID_CURRENCIES.join(', ')}`
      );
    }

    // Validate source
    if (!VALID_SOURCES.includes(body.source as Source)) {
      return validationError(
        'source',
        `source must be one of: ${VALID_SOURCES.join(', ')}`
      );
    }

    // ─── Step 7: Normalise company + find or create ───────────────
    const normalizedName = normaliseCompanyName(body.company);
    const slug = normalizedName;
    const displayInfo = COMPANY_DISPLAY[slug];
    const displayName = displayInfo?.name || body.company;

    let company = await prisma.company.findUnique({
      where: { slug },
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: displayName,
          slug,
          normalized_name: normalizedName,
          industry: displayInfo?.industry || null,
          headquarters: displayInfo?.hq || null,
          founded_year: displayInfo?.founded || null,
          headcount_range: displayInfo?.headcount || null,
        },
      });
    }

    // ─── Step 8: Recompute total_compensation ─────────────────────
    const bonus = body.bonus ?? 0;
    const stock = body.stock ?? 0;
    const totalCompensation = body.base_salary + bonus + stock;

    // ─── Step 9: Duplicate check ──────────────────────────────────
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const potentialDuplicates = await prisma.salary.findMany({
      where: {
        company_id: company.id,
        role: body.role,
        level: body.level_standardized as Level,
        location: body.location,
        submitted_at: { gte: fortyEightHoursAgo },
      },
    });

    for (const existing of potentialDuplicates) {
      const existingBase = Number(existing.base_salary);
      const ratio = Math.abs(existingBase - body.base_salary) / existingBase;
      if (ratio < 0.1) {
        return NextResponse.json(
          {
            error: true,
            message: 'Duplicate record detected within 48h window',
          },
          { status: 409 }
        );
      }
    }

    // ─── Step 10: Store ───────────────────────────────────────────
    const salary = await prisma.salary.create({
      data: {
        company_id: company.id,
        role: body.role,
        level: body.level_standardized as Level,
        location: body.location,
        currency: body.currency as Currency,
        experience_years: body.experience_years,
        base_salary: BigInt(body.base_salary),
        bonus: BigInt(bonus),
        stock: BigInt(stock),
        total_compensation: BigInt(totalCompensation),
        source: body.source as Source,
        confidence_score: body.confidence_score,
        is_verified: false,
      },
      include: { company: true },
    });

    // Serialize BigInt values for JSON response
    const serialized = {
      ...salary,
      base_salary: Number(salary.base_salary),
      bonus: Number(salary.bonus),
      stock: Number(salary.stock),
      total_compensation: Number(salary.total_compensation),
      confidence_score: Number(salary.confidence_score),
    };

    return NextResponse.json({ data: serialized }, { status: 201 });
  } catch (error) {
    console.error('Ingest salary error:', error);
    return NextResponse.json(
      { error: true, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
