// app/page.tsx — TalentDash Homepage with Premium Design

import Link from 'next/link';
import { LiveStats } from '@/components/features/LiveStats';
import { LiveCompanyList } from '@/components/features/LiveCompanyList';
import { LiveRecordBadge } from '@/components/features/LiveRecordBadge';
import { CodexAnimatedBackground } from '@/components/ui/open-ai-codex-animated-background';

export default function HomePage() {
  return (
    <>
      {/* ── Hero Section ───────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-transparent">
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <LiveRecordBadge />
            <h1
              className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-[0_4px_24px_rgba(0,0,0,1)]"
              style={{ fontFamily: 'var(--font-display)', textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}
            >
              Career Intelligence for{' '}
              <span className="bg-gradient-to-r from-[#f05555] to-[#ff6b6b] bg-clip-text text-transparent" style={{ textShadow: 'none' }}>
                India&apos;s Tech Professionals
              </span>
            </h1>
            <p
              className="mt-6 text-lg leading-relaxed text-white/90 sm:text-xl drop-shadow-[0_4px_16px_rgba(0,0,0,1)]"
              style={{ fontFamily: 'var(--font-body)', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
            >
              Structured, comparable, decision-ready compensation data.
              Stop guessing if your offer is fair — know it.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/salaries"
                className="group inline-flex items-center justify-center rounded-xl bg-[#f05555] px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#e04545] hover:scale-[1.02]"
                style={{ 
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 12px 32px rgba(0,0,0,0.8), 0 4px 16px rgba(240,85,85,0.4)',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                Explore Salaries
                <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/[0.08] px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/[0.12] hover:scale-[1.02] hover:border-white/30"
                style={{ 
                  boxShadow: '0 12px 32px rgba(0,0,0,0.8)',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                Compare Offers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Live Stats Bar ──────────────────────────────────────── */}
      <LiveStats />

      {/* ── Featured Companies (Live) ───────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-2xl font-bold text-white/90" style={{ fontFamily: 'var(--font-display)' }}>
          Top Companies
        </h2>
        <p className="mt-2 text-sm text-white/50 mb-6">
          Explore compensation data from India&apos;s most sought-after employers
        </p>
        <LiveCompanyList />
      </section>

      {/* ── Value Proposition ──────────────────────────────────── */}
      <section className="border-t border-white/[0.06] bg-black/20 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                title: 'Level-Based Data',
                desc: 'Every salary is tagged with a standardised level — L3 to Principal. Compare apples to apples.',
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                ),
              },
              {
                title: 'Total Compensation',
                desc: 'Base + bonus + stock = the real number. We compute it server-side so no one games the data.',
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ),
              },
              {
                title: 'India-First Coverage',
                desc: 'Deep data on Bengaluru, Hyderabad, Mumbai, Pune, Delhi — not just Bay Area salaries.',
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl p-6 border border-white/[0.1] transition-all duration-300 hover:-translate-y-1 hover:border-[#f05555]/50 hover:shadow-[0_12px_40px_rgba(240,85,85,0.15)] bg-white/[0.03] backdrop-blur-xl"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#f05555]/20 text-[#f05555]">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-white/90" style={{ fontFamily: 'var(--font-display)' }}>
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
