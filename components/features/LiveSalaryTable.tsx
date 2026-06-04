'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import type { SalaryRecord } from '@/types/salary';
import { SalaryTable } from '@/components/features/SalaryTable';
import { Pagination } from '@/components/features/Pagination';

export function LiveSalaryTable({ fixedCompany }: { fixedCompany?: string }) {
  const searchParams = useSearchParams();
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 0 });
  const [companyCount, setCompanyCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const currency = searchParams.get('currency') || 'INR';

  const fetchSalaries = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      
      const company = fixedCompany || searchParams.get('company');
      const role = searchParams.get('role');
      const levels = searchParams.get('levels');
      const location = searchParams.get('location');
      const sort = searchParams.get('sort') || 'total_comp_desc';
      const page = searchParams.get('page') || '1';
      
      if (company) params.set('company', company);
      if (role) params.set('role', role);
      if (levels) params.set('level', levels); // API expects 'level'
      if (location) params.set('location', location);
      params.set('sort', sort);
      params.set('page', page);
      params.set('limit', '25');

      const res = await fetch(`/api/salaries?${params.toString()}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setSalaries(json.data);
        setMeta(json.meta);
        setCompanyCount(json.meta.companyCount || 0);
      }
    } catch (e) {
      console.error('Failed to fetch salaries:', e);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchSalaries();
    const interval = setInterval(fetchSalaries, 15000);
    return () => clearInterval(interval);
  }, [fetchSalaries]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-64 skeleton rounded" />
        <div className="h-[600px] skeleton rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-white/90" style={{ fontFamily: 'var(--font-display)' }}>
          {meta.total === 0 ? 'No results found' : (
            <>
              Found <span className="font-bold text-white">{meta.total}</span> compensation records 
              {companyCount > 0 && <> across <span className="font-bold text-white">{companyCount}</span> companies</>}
            </>
          )}
        </h2>
        {/* Polling Indicator */}
        <div className="flex items-center gap-1.5 text-[10px] text-white/30 uppercase tracking-widest font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-[#008A05] animate-pulse" />
          Live
        </div>
      </div>
      
      {salaries.length > 0 ? (
        <>
          <SalaryTable salaries={salaries} currency={currency} />
          {meta.totalPages > 1 && (
            <div className="mt-8">
              <Pagination currentPage={meta.page} totalPages={meta.totalPages} />
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-xl border border-white/[0.05] bg-white/[0.02]">
          <svg className="h-12 w-12 text-white/10 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-medium text-white/70">No matching records found</h3>
          <p className="mt-1 text-sm text-white/40">Try adjusting your filters or search criteria.</p>
        </div>
      )}
    </div>
  );
}
