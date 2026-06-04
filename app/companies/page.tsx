import { Suspense } from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { CompanyListClient } from './components/CompanyListClient';

export const metadata: Metadata = {
  title: 'Top Tech Companies in India — TalentDash',
  description: 'Explore verified compensation data across top technology companies in India.',
};

export const revalidate = 3600;

export default async function CompaniesIndexPage() {
  const companies = await prisma.company.findMany({
    orderBy: { name: 'asc' },
    select: { slug: true, name: true },
  });

  return (
    <div className="min-h-screen bg-transparent">
      <div className="bg-[#0f1623]/60 backdrop-blur-xl border-b border-white/[0.06] pt-12 pb-6 relative overflow-hidden">
        {/* Subtle mesh background */}
        <div 
          className="absolute inset-0 opacity-30 mix-blend-screen pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% -20%, rgba(37, 99, 235, 0.15), transparent 70%)',
          }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Companies
          </h1>
          <p className="mt-2 text-sm text-white/50" style={{ fontFamily: 'var(--font-body)' }}>
            Explore verified compensation data across top technology companies.
          </p>
        </div>
      </div>

      <CompanyListClient companies={companies} />
    </div>
  );
}
