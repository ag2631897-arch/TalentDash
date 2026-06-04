// app/api/salaries/route.ts — GET endpoint for salary listing with filters + pagination

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // ─── Parse query parameters ───────────────────────────────────
    const company = searchParams.get('company');
    const role = searchParams.get('role');
    const level = searchParams.get('level');
    const location = searchParams.get('location');
    const currency = searchParams.get('currency');
    const sort = searchParams.get('sort') || 'total_comp_desc';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const rawLimit = parseInt(searchParams.get('limit') || '25', 10);
    const limit = Math.min(Math.max(1, rawLimit), 100); // Cap at 100

    // ─── Build WHERE clause ───────────────────────────────────────
    const where: Prisma.SalaryWhereInput = {};

    if (company) {
      where.company = {
        OR: [
          { name: { contains: company, mode: 'insensitive' } },
          { slug: { contains: company, mode: 'insensitive' } },
          { normalized_name: { contains: company, mode: 'insensitive' } },
        ],
      };
    }

    if (role) {
      where.role = { contains: role, mode: 'insensitive' };
    }

    if (level) {
      const levelsArray = level.split(',') as import('@prisma/client').Level[];
      where.level = { in: levelsArray };
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (currency) {
      where.currency = currency as Prisma.EnumCurrencyFilter['equals'];
    }

    // ─── Build ORDER BY ───────────────────────────────────────────
    let orderBy: Prisma.SalaryOrderByWithRelationInput;
    switch (sort) {
      case 'total_comp_asc':
        orderBy = { total_compensation: 'asc' };
        break;
      case 'date_desc':
        orderBy = { submitted_at: 'desc' };
        break;
      case 'total_comp_desc':
      default:
        orderBy = { total_compensation: 'desc' };
        break;
    }

    // ─── Execute query ────────────────────────────────────────────
    const [salaries, total] = await Promise.all([
      prisma.salary.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: { company: true },
      }),
      prisma.salary.count({ where }),
    ]);

    // ─── Serialize BigInt values ──────────────────────────────────
    const data = salaries.map((s) => ({
      id: s.id,
      company: s.company.normalized_name,
      company_display: s.company.name,
      company_slug: s.company.slug,
      role: s.role,
      level: s.level,
      location: s.location,
      currency: s.currency,
      experience_years: s.experience_years,
      base_salary: Number(s.base_salary),
      bonus: Number(s.bonus),
      stock: Number(s.stock),
      total_compensation: Number(s.total_compensation),
      source: s.source,
      confidence_score: Number(s.confidence_score),
      submitted_at: s.submitted_at.toISOString(),
      is_verified: s.is_verified,
    }));

    const totalPages = Math.ceil(total / limit);

    const response = NextResponse.json({
      data,
      meta: { total, page, limit, totalPages },
    });

    // ─── Cache headers ────────────────────────────────────────────
    response.headers.set(
      'Cache-Control',
      's-maxage=300, stale-while-revalidate=3600'
    );

    return response;
  } catch (error) {
    console.error('GET /api/salaries error:', error);
    return NextResponse.json(
      { error: true, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
