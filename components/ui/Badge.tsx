import type { Level } from "@/types/salary";
import { LEVEL_DISPLAY } from "@/types/salary";

const LEVEL_STYLES: Record<string, { bg: string; text: string; glow: string }> = {
  L3: { bg: 'rgba(100,116,139,0.15)', text: '#94a3b8', glow: '0 0 8px rgba(100,116,139,0.3)' },
  SDE_I: { bg: 'rgba(100,116,139,0.15)', text: '#94a3b8', glow: '0 0 8px rgba(100,116,139,0.3)' },
  L4: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa', glow: '0 0 10px rgba(59,130,246,0.3)' },
  SDE_II: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa', glow: '0 0 10px rgba(59,130,246,0.3)' },
  L5: { bg: 'rgba(99,102,241,0.15)', text: '#818cf8', glow: '0 0 12px rgba(59,130,246,0.4)' },
  SDE_III: { bg: 'rgba(99,102,241,0.15)', text: '#818cf8', glow: '0 0 12px rgba(59,130,246,0.4)' },
  L6: { bg: 'rgba(139,92,246,0.15)', text: '#a78bfa', glow: '0 0 12px rgba(124,58,237,0.4)' },
  STAFF: { bg: 'rgba(139,92,246,0.15)', text: '#a78bfa', glow: '0 0 12px rgba(124,58,237,0.4)' },
  PRINCIPAL: { bg: 'rgba(147,51,234,0.2)', text: '#c084fc', glow: '0 0 14px rgba(88,28,135,0.5)' },
  IC4: { bg: 'rgba(16,185,129,0.15)', text: '#34d399', glow: '0 0 10px rgba(16,185,129,0.4)' },
  IC5: { bg: 'rgba(16,185,129,0.15)', text: '#34d399', glow: '0 0 10px rgba(16,185,129,0.4)' },
};

const DEFAULT_STYLE = { bg: 'rgba(100,116,139,0.15)', text: '#94a3b8', glow: '0 0 8px rgba(100,116,139,0.2)' };

interface BadgeProps {
  level: Level;
  className?: string;
}

export function Badge({ level, className = "" }: BadgeProps) {
  const style = LEVEL_STYLES[level] ?? DEFAULT_STYLE;
  const displayLabel = LEVEL_DISPLAY[level] ?? level;

  return (
    <span
      className={`inline-flex items-center font-medium text-xs px-2.5 py-1 rounded-full whitespace-nowrap ${className}`}
      style={{
        background: style.bg,
        color: style.text,
        boxShadow: style.glow,
        backdropFilter: 'blur(4px)',
      }}
    >
      {displayLabel}
    </span>
  );
}
