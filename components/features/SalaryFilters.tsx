"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VALID_LEVELS, LEVEL_DISPLAY, type Level } from "@/types/salary";
import { CustomSelect } from "@/components/ui/CustomSelect";

interface FilterOptions {
  companies: Array<{ slug: string; display: string }>;
  roles: string[];
  locations: string[];
}

export function SalaryFilters({
  companies,
  roles,
  locations,
}: FilterOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial values from URL
  const [companySearch, setCompanySearch] = useState(
    searchParams.get("company") ?? ""
  );
  const [role, setRole] = useState(searchParams.get("role") ?? "");
  const [location, setLocation] = useState(
    searchParams.get("location") ?? ""
  );
  const [currency, setCurrency] = useState(
    searchParams.get("currency") ?? "INR"
  );
  const [selectedLevels, setSelectedLevels] = useState<Set<string>>(() => {
    const param = searchParams.get("levels");
    return param ? new Set(param.split(",")) : new Set<string>();
  });
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const levelDropdownRef = useRef<HTMLDivElement>(null);

  // Debounce for company search
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateUrl = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      // Reset to page 1 when filters change
      params.delete("page");
      router.push(`/salaries?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Debounced company search
  const handleCompanySearch = useCallback(
    (value: string) => {
      setCompanySearch(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updateUrl({ company: value });
      }, 300);
    },
    [updateUrl]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Close level dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        levelDropdownRef.current &&
        !levelDropdownRef.current.contains(e.target as Node)
      ) {
        setLevelDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRoleChange = (value: string) => {
    setRole(value);
    updateUrl({ role: value });
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    updateUrl({ location: value });
  };

  const handleCurrency = (cur: string) => {
    setCurrency(cur);
    updateUrl({ currency: cur });
  };

  const toggleLevel = (level: string) => {
    const next = new Set(selectedLevels);
    if (next.has(level)) {
      next.delete(level);
    } else {
      next.add(level);
    }
    setSelectedLevels(next);
    updateUrl({ levels: Array.from(next).join(",") });
  };

  const hasFilters =
    companySearch || role || location || selectedLevels.size > 0;

  const clearAll = () => {
    setCompanySearch("");
    setRole("");
    setLocation("");
    setSelectedLevels(new Set());
    setCurrency("INR");
    router.push("/salaries", { scroll: false });
  };

  const selectStyle = "appearance-none bg-white/[0.04] border border-white/[0.1] rounded-lg px-3 py-2 pr-8 text-sm text-white/70 hover:bg-white/[0.06] transition-colors focus:ring-2 focus:ring-[#f05555]/40 focus:border-transparent outline-none cursor-pointer bg-[length:16px_16px] bg-[right_8px_center] bg-no-repeat";
  const selectBgStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ffffff'%3E%3Cpath d='M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z'/%3E%3C/svg%3E")`,
  };

  const currencies = [
    { value: 'INR', label: '₹ INR' },
    { value: 'USD', label: '$ USD' },
    { value: 'EUR', label: '€ EUR' },
    { value: 'GBP', label: '£ GBP' },
    { value: 'AUD', label: 'A$ AUD' },
    { value: 'CAD', label: 'C$ CAD' },
    { value: 'SGD', label: 'S$ SGD' },
    { value: 'AED', label: 'د.إ AED' },
    { value: 'JPY', label: '¥ JPY' },
  ];

  return (
    <div
      className="py-4 sticky top-14 z-10 border-b border-white/[0.06]"
      style={{
        backdropFilter: 'blur(20px)',
        background: 'rgba(13,17,23,0.9)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          {/* Company Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              value={companySearch}
              onChange={(e) => handleCompanySearch(e.target.value)}
              placeholder="Search company…"
              className="w-52 bg-white/[0.04] border border-white/[0.1] rounded-lg pl-9 pr-3 py-2 text-sm text-white/70 placeholder:text-white/30 focus:ring-2 focus:ring-[#f05555]/40 focus:border-transparent outline-none transition-colors"
            />
            {companySearch && (
              <button
                onClick={() => handleCompanySearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>

          {/* Role Select */}
          <div className="w-40">
            <CustomSelect
              value={role}
              onChange={handleRoleChange}
              options={roles.map(r => ({ value: r, label: r }))}
              placeholder="All Roles"
            />
          </div>

          {/* Level Multi-Select */}
          <div ref={levelDropdownRef} className="relative">
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setLevelDropdownOpen((prev) => !prev);
              }}
              className={`appearance-none bg-white/[0.04] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/[0.06] transition-colors focus:ring-2 focus:ring-[#f05555]/40 focus:border-transparent outline-none cursor-pointer flex items-center gap-1.5`}
            >
              <span>
                {selectedLevels.size > 0
                  ? `${selectedLevels.size} level${selectedLevels.size > 1 ? "s" : ""}`
                  : "All Levels"}
              </span>
              <svg
                className={`h-4 w-4 text-white/40 transition-transform pointer-events-none ${levelDropdownOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
              >
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {levelDropdownOpen && (
              <div
                className="absolute top-full left-0 mt-1 w-44 rounded-xl py-1 z-20 border border-white/[0.1]"
                style={{
                  background: 'rgba(15, 22, 35, 0.95)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                }}
              >
                {VALID_LEVELS.map((level) => (
                  <label
                    key={level}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-white/60 hover:bg-white/[0.05] cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedLevels.has(level)}
                      onChange={() => toggleLevel(level)}
                      className="rounded border-white/20 text-[#f05555] focus:ring-[#f05555] accent-[#f05555]"
                    />
                    {LEVEL_DISPLAY[level as Level]}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Location Select */}
          <div className="w-40">
            <CustomSelect
              value={location}
              onChange={handleLocationChange}
              options={locations.map(l => ({ value: l, label: l }))}
              placeholder="All Locations"
            />
          </div>

          {/* Currency Select */}
          <div className="ml-auto w-28">
            <CustomSelect
              value={currency}
              onChange={handleCurrency}
              options={currencies}
              align="right"
            />
          </div>

          {/* Clear All */}
          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-[#f05555] hover:underline font-medium cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
