// app/compare/page.tsx — Compare Page (Client Component)

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { comparePageMetadata } from '@/lib/seo';
import { CompareWidget } from '@/components/features/CompareWidget';

export const metadata: Metadata = comparePageMetadata();

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Compare Salaries
        </h1>
        <p className="mt-2 text-sm text-white/40">
          Select two salary records to compare side by side. See the difference in base, bonus, stock, and total compensation.
        </p>
      </div>
      <Suspense fallback={<div className="h-64 skeleton rounded-xl" />}>
        <CompareWidget />
      </Suspense>
    </div>
  );
}
