'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';

interface Company {
  slug: string;
  display: string;
  logoUrl?: string;
  description?: string;
  industry?: string;
  hq?: string;
  headcount?: string;
  website?: string;
}

export function CompanySearchList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanies() {
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
    }
    fetchCompanies();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return companies;
    const q = search.toLowerCase();
    return companies.filter(
      (c) =>
        c.display.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.industry && c.industry.toLowerCase().includes(q))
    );
  }, [companies, search]);

  const industryColor: Record<string, string> = {
    'E-Commerce': 'border-blue-500/30 text-blue-400',
    'E-Commerce / Cloud': 'border-cyan-500/30 text-cyan-400',
    'Technology': 'border-purple-500/30 text-purple-400',
    'IT Services': 'border-green-500/30 text-green-400',
    'Semiconductors': 'border-amber-500/30 text-amber-400',
    'Fintech': 'border-emerald-500/30 text-emerald-400',
    'Quick Commerce': 'border-orange-500/30 text-orange-400',
  };

  return (
    <div>
      {/* Search */}
      <div className="relative mb-8 max-w-md">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies by name, industry, or description…"
          className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-12 pr-4 py-3 text-sm text-white/70 placeholder:text-white/30 focus:ring-2 focus:ring-[#f05555]/40 focus:border-transparent outline-none transition-all"
          style={{ backdropFilter: 'blur(10px)' }}
        />
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 skeleton rounded-xl" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg className="h-12 w-12 text-white/10 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <h3 className="text-lg font-semibold text-white/60" style={{ fontFamily: 'var(--font-display)' }}>No companies found</h3>
          <p className="mt-1 text-sm text-white/30">Try a different search term</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => (
            <Link
              key={c.slug}
              href={`/companies/${c.slug}`}
              className="group rounded-xl p-5 border border-white/[0.07] transition-all duration-300 hover:-translate-y-1 hover:border-[#f05555]/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                animation: 'fadeInUp 0.4s ease forwards',
                animationDelay: `${i * 0.05}s`,
                opacity: 0,
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="h-14 w-14 rounded-xl border border-white/[0.1] overflow-hidden bg-white/[0.06] flex shrink-0 items-center justify-center shadow-sm group-hover:shadow-[0_0_8px_rgba(255,255,255,0.2)] transition-shadow">
                  {c.logoUrl ? (
                    <img src={c.logoUrl} alt={c.display} className="w-full h-full object-contain p-2" />
                  ) : (
                    <span className="text-xl font-bold text-white/60">{c.display.charAt(0)}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white group-hover:text-[#f05555] transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
                    {c.display}
                  </h3>
                  {c.industry && (
                    <span className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${industryColor[c.industry] || 'border-white/20 text-white/40'}`}>
                      {c.industry}
                    </span>
                  )}
                </div>
              </div>
              {c.description && (
                <p className="text-xs text-white/35 leading-relaxed line-clamp-3">
                  {c.description}
                </p>
              )}
              <div className="mt-4 flex items-center gap-3 text-xs text-white/30">
                {c.hq && <span>📍 {c.hq}</span>}
                {c.headcount && <span>👥 {c.headcount}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
