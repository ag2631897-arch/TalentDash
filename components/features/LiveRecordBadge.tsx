'use client';

import { useEffect, useState } from 'react';

export function LiveRecordBadge() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/stats', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setCount(data.totalRecords);
        }
      } catch {
        /* ignore */
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white/70"
      style={{
        background: 'rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.8)'
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#008A05] animate-pulse" />
      {count !== null ? `${count}+` : '...'} salary records indexed
    </div>
  );
}
