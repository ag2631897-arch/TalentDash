import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { CompanyHeader } from '@/components/features/CompanyHeader';
import { LiveSalaryTable } from '@/components/features/LiveSalaryTable';
import { LevelDistBar } from '@/components/features/LevelDistBar';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug },
  });
  if (!company) return {};
  return {
    title: `${company.name} Salaries in India — TalentDash`,
    description: `Verified salary data for ${company.name} employees in India.`,
  };
}

export const revalidate = 3600;

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug },
  });

  if (!company) {
    notFound();
  }

  // Get some aggregate stats
  const [totalRecords, locations, levelStats] = await Promise.all([
    prisma.salary.count({ where: { company: { slug } } }),
    prisma.salary.findMany({
      where: { company: { slug } },
      select: { location: true },
      distinct: ['location'],
    }),
    prisma.salary.groupBy({
      by: ['level'],
      where: { company: { slug } },
      _count: { level: true },
      orderBy: { _count: { level: 'desc' } },
    }),
  ]);

  return (
    <div className="min-h-screen bg-transparent">
      <CompanyHeader
        company={{
          ...company,
          created_at: company.created_at.toISOString(),
          updated_at: company.updated_at.toISOString()
        }}
        stats={{
          totalRecords,
          locations: locations.length,
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main Content */}
          <div className="space-y-8">
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  Compensation Records
                </h2>
              </div>
              <Suspense
                fallback={
                  <div className="space-y-4">
                    <div className="h-6 w-64 skeleton rounded" />
                    <div className="h-[600px] skeleton rounded-xl" />
                  </div>
                }
              >
                {/* We pass the fixedCompany filter so it strictly loads this company's records */}
                <LiveSalaryTable fixedCompany={company.slug} />
              </Suspense>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div 
              className="rounded-xl border border-white/[0.07] p-5"
              style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(12px)' }}
            >
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/50">
                Level Distribution
              </h3>
              <div className="space-y-3">
                {levelStats.slice(0, 8).map((stat, i) => (
                  <LevelDistBar
                    key={stat.level}
                    level={stat.level}
                    count={stat._count.level}
                    total={totalRecords}
                    index={i}
                  />
                ))}
              </div>
            </div>
            
            <div 
              className="rounded-xl border border-white/[0.07] p-5"
              style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(12px)' }}
            >
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/50">
                Quick Actions
              </h3>
              <a
                href={`/compare?s1_company=${company.slug}`}
                className="group flex w-full items-center justify-between rounded-lg bg-white/[0.04] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/[0.08]"
              >
                Compare with others
                <svg className="h-4 w-4 text-white/40 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
