// app/api/companies/route.ts — GET all companies (index route)

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { COMPANY_DISPLAY, getCompanyLogoUrl } from '@/types/company';

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: 'asc' },
      select: { slug: true, name: true },
    });

    const response = NextResponse.json({
      data: companies.map((c) => {
        const info = COMPANY_DISPLAY[c.slug];
        return {
          slug: c.slug,
          display: c.name,
          logoUrl: getCompanyLogoUrl(c.slug, 80),
          description: info?.description || null,
          industry: info?.industry || null,
          hq: info?.hq || null,
          headcount: info?.headcount || null,
          website: info?.website || null,
        };
      }),
    });

    response.headers.set(
      'Cache-Control',
      's-maxage=30, stale-while-revalidate=120'
    );

    return response;
  } catch (error) {
    console.error('GET /api/companies error:', error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
