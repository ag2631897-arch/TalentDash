// app/api/stats/route.ts — Live database stats for real-time dashboard

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [totalRecords, companies, locations, levels] = await Promise.all([
      prisma.salary.count(),
      prisma.company.count(),
      prisma.salary.findMany({ select: { location: true }, distinct: ['location'] }),
      prisma.salary.findMany({ select: { level: true }, distinct: ['level'] }),
    ]);

    return NextResponse.json({
      totalRecords,
      companies,
      cities: locations.length,
      levels: levels.length,
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('GET /api/stats error:', error);
    return NextResponse.json(
      { totalRecords: 0, companies: 0, cities: 0, levels: 0 },
      { status: 500 }
    );
  }
}
