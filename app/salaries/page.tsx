import { Suspense } from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { salariesPageMetadata } from '@/lib/seo';
import { SalaryFilters } from '@/components/features/SalaryFilters';
import { LiveSalaryTable } from '@/components/features/LiveSalaryTable';

export const metadata: Metadata = salariesPageMetadata();

export const revalidate = 3600;

export default async function SalariesPage() {
  const [companies, roles, locations] = await Promise.all([
    prisma.company.findMany({ select: { slug: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.salary.findMany({ select: { role: true }, distinct: ['role'], orderBy: { role: 'asc' } }),
    prisma.salary.findMany({ select: { location: true }, distinct: ['location'], orderBy: { location: 'asc' } }),
  ]);

  return (
    <div className="min-h-screen bg-transparent">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="bg-[#0f1623]/60 backdrop-blur-xl border-b border-white/[0.06] pt-12 pb-6 relative overflow-hidden">
        {/* Subtle mesh background */}
        <div 
          className="absolute inset-0 opacity-30 mix-blend-screen pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% -20%, rgba(240, 85, 85, 0.15), transparent 70%)',
          }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Tech Salaries in India
          </h1>
          <p className="mt-2 text-sm text-white/50" style={{ fontFamily: 'var(--font-body)' }}>
            Explore verified compensation data. Filter by company, role, level, and location.
          </p>
        </div>
      </div>

      {/* ── Sticky Filters ─────────────────────────────────────── */}
      <Suspense fallback={<div className="h-[72px] border-b border-white/[0.06] bg-[#0d1117] animate-pulse" />}>
        <SalaryFilters
          companies={companies.map((c) => ({ slug: c.slug, display: c.name }))}
          roles={roles.map((r) => r.role)}
          locations={locations.map((l) => l.location)}
        />
      </Suspense>

      {/* ── Results Table ──────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={
          <div className="space-y-4">
            <div className="h-6 w-64 skeleton rounded" />
            <div className="h-[600px] skeleton rounded-xl" />
          </div>
        }>
          <LiveSalaryTable />
        </Suspense>
      </div>
    </div>
  );
}
