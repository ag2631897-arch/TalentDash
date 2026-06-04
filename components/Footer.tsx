'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export function Footer() {
  const [stats, setStats] = useState({ totalRecords: 0, companies: 0, cities: 0 });
  const [visible, setVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch { /* ignore */ }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`relative border-t border-white/[0.06] transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={{
        backdropFilter: 'blur(20px)',
        background: 'rgba(13,17,23,0.8)',
        borderImage: 'linear-gradient(90deg, transparent, rgba(240,85,85,0.5), transparent) 1',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Column 1 — Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#f05555] text-white text-xs font-black">TD</span>
              <span>Talent<span className="text-[#f05555]">Dash</span></span>
            </Link>
            <p className="mt-3 text-sm text-white/40" style={{ fontFamily: 'var(--font-body)' }}>
              Career intelligence for India&apos;s tech professionals.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-white/40">
              <span className="h-1.5 w-1.5 rounded-full bg-[#008A05] animate-pulse" />
              Data updated in real-time
            </div>
            <p className="mt-4 text-xs text-white/30">
              © {new Date().getFullYear()} TalentDash. All rights reserved.
            </p>
          </div>

          {/* Column 2 — Explore */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-white/40 mb-4">Explore</h3>
            <ul className="space-y-3">
              {[
                { href: '/salaries', label: 'Salary Data' },
                { href: '/companies', label: 'Top Companies' },
                { href: '/compare', label: 'Compare Offers' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group flex items-center text-sm text-white/50 hover:text-[#f05555] transition-colors">
                    {link.label}
                    <svg className="ml-1 h-3 w-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — About */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-white/40 mb-4">About</h3>
            <p className="text-xs text-white/30 italic leading-relaxed">
              Salary data is crowdsourced and may not reflect actual compensation.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/30">
          <span>Built with ♥ for India&apos;s tech community</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>
            {stats.totalRecords}+ records · {stats.companies} companies · {stats.cities} cities
          </span>
        </div>
      </div>
    </footer>
  );
}
