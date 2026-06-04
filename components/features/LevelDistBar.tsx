'use client';

import { LEVEL_DISPLAY, type Level } from '@/types/salary';

interface LevelDistBarProps {
  level: string;
  count: number;
  total: number;
  index: number;
}

export function LevelDistBar({ level, count, total, index }: LevelDistBarProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  const displayLabel = LEVEL_DISPLAY[level as Level] ?? level;

  return (
    <div 
      className="group"
      style={{
        animation: 'fadeInUp 0.5s ease-out forwards',
        animationDelay: `${index * 0.1}s`,
        opacity: 0,
      }}
    >
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-white/70 group-hover:text-white transition-colors">{displayLabel}</span>
        <span className="text-white/40" style={{ fontFamily: 'var(--font-mono)' }}>{count}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.04] border border-white/[0.02]">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #f05555, #ff6b6b)',
            boxShadow: '0 0 10px rgba(240,85,85,0.4)',
          }}
        />
      </div>
    </div>
  );
}
