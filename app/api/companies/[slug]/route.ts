// app/api/companies/[slug]/route.ts — GET endpoint for company details

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // ─── Find company ─────────────────────────────────────────────
    const company = await prisma.company.findUnique({
      where: { slug },
    });

    if (!company) {
      return NextResponse.json(
        { error: true, message: 'Company not found' },
        { status: 404 }
      );
    }

    // ─── Get all salaries for this company ────────────────────────
    const salaries = await prisma.salary.findMany({
      where: { company_id: company.id },
      orderBy: { total_compensation: 'desc' },
    });

    // ─── Compute true statistical median ──────────────────────────
    const tcValues = salaries
      .map((s) => Number(s.total_compensation))
      .sort((a, b) => a - b);

    let medianTotalCompensation = 0;
    if (tcValues.length > 0) {
      const mid = Math.floor(tcValues.length / 2);
      medianTotalCompensation =
        tcValues.length % 2 === 0
          ? Math.round((tcValues[mid - 1] + tcValues[mid]) / 2)
          : tcValues[mid];
    }

    // ─── Compute level distribution ───────────────────────────────
    const levelDistribution: Record<string, number> = {};
    for (const salary of salaries) {
      levelDistribution[salary.level] =
        (levelDistribution[salary.level] || 0) + 1;
    }

    // ─── Serialize ────────────────────────────────────────────────
    const serializedSalaries = salaries.map((s) => ({
      id: s.id,
      company: company.normalized_name,
      company_display: company.name,
      company_slug: company.slug,
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

    const response = NextResponse.json({
      company: {
        id: company.id,
        name: company.name,
        slug: company.slug,
        industry: company.industry,
        headquarters: company.headquarters,
        founded_year: company.founded_year,
        headcount_range: company.headcount_range,
      },
      salaries: serializedSalaries,
      median_total_compensation: medianTotalCompensation,
      level_distribution: levelDistribution,
    });

    // ─── Cache headers ────────────────────────────────────────────
    response.headers.set(
      'Cache-Control',
      's-maxage=3600, stale-while-revalidate=86400'
    );

    return response;
  } catch (error) {
    console.error('GET /api/companies/:slug error:', error);
    return NextResponse.json(
      { error: true, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
