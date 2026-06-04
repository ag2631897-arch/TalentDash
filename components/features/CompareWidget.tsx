'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatSalary, formatExperience, formatDelta } from '@/lib/format';
import { Badge } from '@/components/ui/Badge';
import { CustomSelect } from '@/components/ui/CustomSelect';
import type { SalaryRecord } from '@/types/salary';

export function CompareWidget() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Parse current selection from URL
  const [s1Id, setS1Id] = useState(searchParams.get('s1') ?? '');
  const [s2Id, setS2Id] = useState(searchParams.get('s2') ?? '');

  // Fetch all salaries on mount (for the dropdowns)
  useEffect(() => {
    async function fetchAll() {
      try {
        // Fetch up to 500 records for the compare dropdowns
        const res = await fetch('/api/salaries?limit=500&sort=total_comp_desc', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          const data: SalaryRecord[] = json.data;
          setSalaries(data);
          
          // Auto-select logic if coming from a company page via ?s1_company=google
          const presetCompany = searchParams.get('s1_company');
          if (presetCompany && !searchParams.get('s1')) {
            // Find the highest comp record for this company
            const highestRecord = data.find(s => s.company_slug === presetCompany);
            if (highestRecord) {
              setS1Id(highestRecord.id);
              // Update URL immediately so it's persisted
              const params = new URLSearchParams(searchParams.toString());
              params.set('s1', highestRecord.id);
              params.delete('s1_company');
              router.replace(`/compare?${params.toString()}`);
            }
          }
        }
      } catch (e) {
        console.error('Failed to fetch salaries for compare:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [searchParams, router]);

  const s1 = salaries.find((s) => s.id === s1Id) ?? null;
  const s2 = salaries.find((s) => s.id === s2Id) ?? null;

  const updateUrl = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/compare?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleS1 = (id: string) => {
    setS1Id(id);
    updateUrl('s1', id);
  };

  const handleS2 = (id: string) => {
    setS2Id(id);
    updateUrl('s2', id);
  };

  // Sync from URL changes (like if user uses browser back button)
  useEffect(() => {
    const fromUrl1 = searchParams.get('s1') ?? '';
    const fromUrl2 = searchParams.get('s2') ?? '';
    if (fromUrl1 !== s1Id) setS1Id(fromUrl1);
    if (fromUrl2 !== s2Id) setS2Id(fromUrl2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const currency = 'INR'; // Standardize comparison to INR
  const showComparison = s1 && s2;

  function renderDelta(val1: number, val2: number) {
    const delta = val1 - val2;
    const result = formatDelta(delta, currency);
    return <span className={delta > 0 ? 'text-emerald-400' : delta < 0 ? 'text-red-400' : 'text-white/40'}>{result.text}</span>;
  }

  function renderSelectLabel(record: SalaryRecord) {
    return `${record.company_display} · ${record.role} · ${record.level} · ${formatSalary(record.total_compensation, currency)}`;
  }

  const selectStyle = "w-full appearance-none bg-white/[0.04] border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-white/70 focus:ring-2 focus:ring-[#f05555]/40 focus:border-transparent outline-none cursor-pointer transition-colors hover:bg-white/[0.06]";

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-16 skeleton rounded-lg" />
          <div className="h-16 skeleton rounded-lg" />
        </div>
        <div className="h-64 skeleton rounded-xl" />
      </div>
    );
  }

  return (
    <div>
      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Record 1 */}
        <div>
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-2">
            Record A
          </label>
          <CustomSelect
            value={s1Id}
            onChange={(val) => handleS1(val)}
            placeholder="Select a salary record..."
            options={salaries.map((s) => ({ value: s.id, label: renderSelectLabel(s) }))}
            className="w-full"
          />
        </div>

        {/* Record 2 */}
        <div>
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-2">
            Record B
          </label>
          <CustomSelect
            value={s2Id}
            onChange={(val) => handleS2(val)}
            placeholder="Select a salary record..."
            options={salaries.map((s) => ({ value: s.id, label: renderSelectLabel(s) }))}
            className="w-full"
          />
        </div>
      </div>

      {/* Comparison Table */}
      {showComparison ? (
        <div
          className="overflow-x-auto rounded-xl border border-white/[0.07]"
          style={{ background: 'rgba(255,255,255,0.02)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
        >
          <table>
            <thead>
              <tr style={{ background: 'rgba(240,85,85,0.08)', borderBottom: '1px solid rgba(240,85,85,0.2)' }}>
                <th className="text-left text-white/60 text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  Attribute
                </th>
                <th className="text-right text-white/60 text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  Record A
                </th>
                <th className="text-right text-white/60 text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  Record B
                </th>
                <th className="text-right text-white/60 text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  Delta (A − B)
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Company */}
              <tr className="border-b border-white/[0.04] hover:bg-white/[0.04]">
                <td className="px-4 py-3 text-sm font-medium text-white/70">Company</td>
                <td className="px-4 py-3 text-sm text-right text-white/60">{s1.company_display}</td>
                <td className="px-4 py-3 text-sm text-right text-white/60">{s2.company_display}</td>
                <td className="px-4 py-3 text-sm text-right text-white/30">—</td>
              </tr>

              {/* Role */}
              <tr className="border-b border-white/[0.04] hover:bg-white/[0.04] bg-white/[0.015]">
                <td className="px-4 py-3 text-sm font-medium text-white/70">Role</td>
                <td className="px-4 py-3 text-sm text-right text-white/60">{s1.role}</td>
                <td className="px-4 py-3 text-sm text-right text-white/60">{s2.role}</td>
                <td className="px-4 py-3 text-sm text-right text-white/30">—</td>
              </tr>

              {/* Level */}
              <tr className="border-b border-white/[0.04] hover:bg-white/[0.04]">
                <td className="px-4 py-3 text-sm font-medium text-white/70">Level</td>
                <td className="px-4 py-3 text-right"><Badge level={s1.level} /></td>
                <td className="px-4 py-3 text-right"><Badge level={s2.level} /></td>
                <td className="px-4 py-3 text-sm text-right text-white/30">—</td>
              </tr>

              {/* Location */}
              <tr className="border-b border-white/[0.04] hover:bg-white/[0.04] bg-white/[0.015]">
                <td className="px-4 py-3 text-sm font-medium text-white/70">Location</td>
                <td className="px-4 py-3 text-sm text-right text-white/60">{s1.location}</td>
                <td className="px-4 py-3 text-sm text-right text-white/60">{s2.location}</td>
                <td className="px-4 py-3 text-sm text-right text-white/30">—</td>
              </tr>

              {/* Experience */}
              <tr className="border-b border-white/[0.04] hover:bg-white/[0.04]">
                <td className="px-4 py-3 text-sm font-medium text-white/70">Experience</td>
                <td className="px-4 py-3 text-sm text-right text-white/60">{formatExperience(s1.experience_years)}</td>
                <td className="px-4 py-3 text-sm text-right text-white/60">{formatExperience(s2.experience_years)}</td>
                <td className="px-4 py-3 text-sm text-right text-white/40">
                  {s1.experience_years - s2.experience_years > 0 ? "+" : ""}
                  {s1.experience_years - s2.experience_years === 0
                    ? "—"
                    : `${s1.experience_years - s2.experience_years} yrs`}
                </td>
              </tr>

              {/* Base Salary */}
              <tr className="border-b border-white/[0.04] hover:bg-white/[0.04] bg-white/[0.015]">
                <td className="px-4 py-3 text-sm font-medium text-white/70">Base Salary</td>
                <td className="px-4 py-3 text-sm text-right font-medium text-white/60" style={{ fontFamily: 'var(--font-mono)' }}>
                  {formatSalary(s1.base_salary, currency)}
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium text-white/60" style={{ fontFamily: 'var(--font-mono)' }}>
                  {formatSalary(s2.base_salary, currency)}
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium" style={{ fontFamily: 'var(--font-mono)' }}>
                  {renderDelta(s1.base_salary, s2.base_salary)}
                </td>
              </tr>

              {/* Bonus */}
              <tr className="border-b border-white/[0.04] hover:bg-white/[0.04]">
                <td className="px-4 py-3 text-sm font-medium text-white/70">Bonus</td>
                <td className="px-4 py-3 text-sm text-right text-white/60" style={{ fontFamily: 'var(--font-mono)' }}>
                  {s1.bonus === 0 ? "—" : formatSalary(s1.bonus, currency)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-white/60" style={{ fontFamily: 'var(--font-mono)' }}>
                  {s2.bonus === 0 ? "—" : formatSalary(s2.bonus, currency)}
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium" style={{ fontFamily: 'var(--font-mono)' }}>
                  {renderDelta(s1.bonus, s2.bonus)}
                </td>
              </tr>

              {/* Stock */}
              <tr className="border-b border-white/[0.04] hover:bg-white/[0.04] bg-white/[0.015]">
                <td className="px-4 py-3 text-sm font-medium text-white/70">Stock</td>
                <td className="px-4 py-3 text-sm text-right text-white/60" style={{ fontFamily: 'var(--font-mono)' }}>
                  {s1.stock === 0 ? "—" : formatSalary(s1.stock, currency)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-white/60" style={{ fontFamily: 'var(--font-mono)' }}>
                  {s2.stock === 0 ? "—" : formatSalary(s2.stock, currency)}
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium" style={{ fontFamily: 'var(--font-mono)' }}>
                  {renderDelta(s1.stock, s2.stock)}
                </td>
              </tr>

              {/* Total Comp */}
              <tr className="bg-white/[0.04] hover:bg-white/[0.06]">
                <td className="px-4 py-4 text-sm font-bold text-white">
                  Total Compensation
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-[#3b82f6] font-bold text-lg" style={{ fontFamily: 'var(--font-mono)' }}>
                    {formatSalary(s1.total_compensation, currency)}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-[#3b82f6] font-bold text-lg" style={{ fontFamily: 'var(--font-mono)' }}>
                    {formatSalary(s2.total_compensation, currency)}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-bold text-base" style={{ fontFamily: 'var(--font-mono)' }}>
                      {renderDelta(
                        s1.total_compensation,
                        s2.total_compensation
                      )}
                    </span>
                    {s1.total_compensation !== s2.total_compensation && (
                      <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-[#3b82f6]/20 text-[#60a5fa]">
                        {s1.total_compensation > s2.total_compensation
                          ? "A"
                          : "B"}{" "}
                        — Higher TC
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg
            className="h-12 w-12 text-white/10 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-sm text-white/30">
            Select two salary records above to compare them side by side.
          </p>
        </div>
      )}
    </div>
  );
}
