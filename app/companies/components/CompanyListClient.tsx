"use client";

import { useState } from 'react';
import Link from 'next/link';
import { getCompanyLogoUrl } from '@/types/company';

import { COMPANY_DISPLAY } from '@/types/company';

interface Company {
  slug: string;
  name: string;
}

interface CompanyListClientProps {
  companies: Company[];
}

export function CompanyListClient({ companies }: CompanyListClientProps) {
  const [search, setSearch] = useState('');

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-md">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies..."
            className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-10 pr-4 py-3 text-white/90 placeholder:text-white/30 focus:ring-2 focus:ring-[#f05555]/40 focus:border-transparent outline-none transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 cursor-pointer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </div>

      {filteredCompanies.length === 0 ? (
        <div className="py-20 text-center rounded-xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-md">
          <h3 className="text-lg font-medium text-white/70">No companies found</h3>
          <p className="mt-1 text-sm text-white/40">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((c, i) => {
            const logoUrl = getCompanyLogoUrl(c.slug);
            const info = COMPANY_DISPLAY[c.slug];
            const description = info?.description || "A leading technology company.";
            const applyUrl = info?.careersUrl || "#";

            return (
              <div
                key={c.slug}
                className="group flex flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] overflow-hidden relative"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
                  animationDelay: `${i * 0.05}s`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  opacity: 0,
                }}
              >
                {/* Optional glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <Link href={`/companies/${c.slug}`} className="flex items-start gap-4 mb-4">
                  <div className="flex h-16 w-16 shrink-0 overflow-hidden items-center justify-center rounded-2xl bg-white/[0.08] text-xl font-bold text-white shadow-inner shadow-white/10 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-shadow">
                    {logoUrl ? (
                      <img src={logoUrl} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      c.name.charAt(0)
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-white/90 group-hover:text-white transition-colors">
                      {c.name}
                    </h3>
                    <span className="text-sm font-medium text-[#f05555]">
                      {info?.industry || "Technology"}
                    </span>
                  </div>
                </Link>

                <p className="text-sm text-white/50 leading-relaxed mb-6 line-clamp-3 flex-grow">
                  {description}
                </p>

                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/[0.05]">
                  <Link
                    href={`/companies/${c.slug}`}
                    className="flex-1 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white px-4 py-2.5 text-sm font-medium text-center transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                  >
                    View Salaries
                  </Link>
                  <a
                    href={applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-xl bg-[#f05555] hover:bg-[#e04545] text-white px-4 py-2.5 text-sm font-medium text-center transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
