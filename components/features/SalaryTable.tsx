'use client';

import { useRef, useEffect, useState } from 'react';
import type { SalaryRecord } from "@/types/salary";
import { formatSalary, formatExperience } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { toast } from 'sonner';

interface SalaryTableProps {
  salaries: SalaryRecord[];
  currency: string;
}

export function SalaryTable({ salaries, currency }: SalaryTableProps) {
  const [visibleRows, setVisibleRows] = useState<Set<number>>(new Set());
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Stagger first 10 rows on mount
    salaries.slice(0, 10).forEach((_, i) => {
      setTimeout(() => {
        setVisibleRows(prev => new Set(prev).add(i));
      }, i * 30);
    });
    // Show remaining immediately
    if (salaries.length > 10) {
      setTimeout(() => {
        setVisibleRows(new Set(salaries.map((_, i) => i)));
      }, 350);
    }
  }, [salaries]);

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${value} copied to clipboard`);
    } catch {
      toast.error('Failed to copy');
    }
  };

  if (salaries.length === 0) return null;

  return (
    <div
      ref={tableRef}
      className="overflow-x-auto rounded-xl border border-white/[0.07]"
      style={{
        background: 'rgba(255,255,255,0.02)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      <table>
        <thead>
          <tr style={{ background: 'rgba(240,85,85,0.08)', borderBottom: '1px solid rgba(240,85,85,0.2)' }}>
            {['Company', 'Role', 'Level', 'Location', 'Exp', 'Base Salary', 'Stock', 'Total Comp'].map((h, i) => (
              <th
                key={h}
                className={`text-${i >= 4 ? 'right' : 'left'} text-white/60 text-xs font-semibold uppercase tracking-wide px-4 py-3`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {salaries.map((record, idx) => (
            <tr
              key={record.id}
              className={`border-b border-white/[0.04] transition-all duration-300 hover:bg-white/[0.04] hover:border-l-2 hover:border-l-[#f05555]/50 ${
                idx % 2 === 0 ? 'bg-white/[0.015]' : ''
              } ${
                visibleRows.has(idx)
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-2'
              }`}
              style={{ transition: 'opacity 0.3s ease, transform 0.3s ease, background-color 0.15s ease' }}
            >
              {/* Company */}
              <td className="px-4 py-3">
                <Link
                  href={`/companies/${record.company_slug}`}
                  className="block max-w-[180px] truncate text-sm font-medium text-white/80 hover:text-[#f05555] transition-colors"
                  title={record.company_display}
                >
                  {record.company_display}
                </Link>
              </td>

              {/* Role */}
              <td className="px-4 py-3 text-sm text-white/60">
                {record.role}
              </td>

              {/* Level */}
              <td className="px-4 py-3">
                <Badge level={record.level} />
              </td>

              {/* Location */}
              <td className="px-4 py-3 text-sm text-white/40">
                {record.location}
              </td>

              {/* Experience */}
              <td className="px-4 py-3 text-sm text-white/40 text-right">
                {formatExperience(record.experience_years)}
              </td>

              {/* Base Salary */}
              <td
                className="px-4 py-3 text-sm text-white/60 text-right font-medium cursor-pointer hover:text-white/80 transition-colors"
                style={{ fontFamily: 'var(--font-mono)' }}
                onClick={() => handleCopy(formatSalary(record.base_salary, currency))}
                title="Click to copy"
              >
                {formatSalary(record.base_salary, currency)}
              </td>

              {/* Stock */}
              <td
                className="px-4 py-3 text-sm text-white/50 text-right cursor-pointer hover:text-white/70 transition-colors"
                style={{ fontFamily: 'var(--font-mono)' }}
                onClick={() => handleCopy(record.stock === 0 ? '—' : formatSalary(record.stock, currency))}
                title="Click to copy"
              >
                {record.stock === 0 ? "—" : formatSalary(record.stock, currency)}
              </td>

              {/* Total Comp — dominant */}
              <td className="px-4 py-3 text-right">
                <span
                  className="text-[#3b82f6] font-bold text-lg cursor-pointer hover:text-[#60a5fa] transition-colors active:scale-105"
                  style={{ fontFamily: 'var(--font-mono)', transition: 'color 0.15s, transform 0.15s' }}
                  onClick={() => handleCopy(formatSalary(record.total_compensation, currency))}
                  title="Click to copy"
                >
                  {formatSalary(record.total_compensation, currency)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
