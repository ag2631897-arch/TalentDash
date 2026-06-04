'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface Company {
  slug: string;
  display: string;
  logoUrl?: string;
}

export function LiveCompanyList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = useCallback(async () => {
    try {
      const res = await fetch('/api/companies', { cache: 'no-store' });
      if (res.ok) {
        const { data } = await res.json();
        setCompanies(data);
      }
    } catch (e) {
      console.error('Failed to fetch companies:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
    const interval = setInterval(fetchCompanies, 15000);
    return () => clearInterval(interval);
  }, [fetchCompanies]);

  if (loading) {
    return (
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-16 skeleton rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {companies.map((c, i) => (
        <Link
          key={c.slug}
          href={`/companies/${c.slug}`}
          className="group flex items-center gap-3 rounded-xl p-3 border border-white/[0.07] transition-all duration-300 hover:-translate-y-1 hover:border-[#f05555]/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(12px)',
            animationDelay: `${i * 0.06}s`,
          }}
        >
          <span className="flex h-10 w-10 shrink-0 overflow-hidden items-center justify-center rounded-lg bg-white/[0.06] text-sm font-bold text-white group-hover:shadow-[0_0_8px_rgba(255,255,255,0.2)] transition-shadow">
            {c.logoUrl ? (
              <img src={c.logoUrl} alt={c.display} className="w-full h-full object-cover" />
            ) : (
              c.display.charAt(0)
            )}
          </span>
          <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors truncate">{c.display}</span>
        </Link>
      ))}
    </div>
  );
}
