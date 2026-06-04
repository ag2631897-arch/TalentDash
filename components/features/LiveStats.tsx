'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface Stats {
  totalRecords: number;
  companies: number;
  cities: number;
  levels: number;
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const duration = 1500;
        const start = performance.now();
        const animate = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // easeOutQuart
          const eased = 1 - Math.pow(1 - progress, 4);
          setDisplay(Math.round(eased * value));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="stat-number" style={{ fontFamily: 'var(--font-mono)' }}>
      {display}{suffix}
    </span>
  );
}

export function LiveStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setLastUpdated(new Date());
      }
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  if (!stats) {
    return (
      <section className="border-y border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="px-6 py-8 text-center border-r last:border-r-0 border-white/[0.06]">
              <div className="mx-auto h-10 w-20 skeleton" />
              <div className="mx-auto mt-3 h-4 w-24 skeleton" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const items = [
    { value: stats.totalRecords, suffix: '+', label: 'Salary Records' },
    { value: stats.companies, suffix: '', label: 'Companies' },
    { value: stats.cities, suffix: '', label: 'Cities' },
    { value: stats.levels, suffix: '', label: 'Levels Tracked' },
  ];

  return (
    <section
      className="border-y border-white/[0.06]"
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4">
        {items.map((stat, i) => (
          <div
            key={stat.label}
            className={`px-6 py-8 text-center ${
              i < items.length - 1 ? 'border-r border-white/[0.06]' : ''
            }`}
          >
            <p className="text-4xl sm:text-5xl font-bold text-[#3b82f6]">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-sm text-white/40">{stat.label}</p>
          </div>
        ))}
      </div>
      {lastUpdated && (
        <div className="mx-auto max-w-7xl px-4 pb-2 text-right">
          <span className="inline-flex items-center gap-1.5 text-[10px] text-white/30">
            <span className="h-1.5 w-1.5 rounded-full bg-[#008A05] animate-pulse" />
            Live
          </span>
        </div>
      )}
    </section>
  );
}
