'use client';

import { useEffect, useState, useCallback } from 'react';
import { SalaryFilters } from './SalaryFilters';

export function LiveSalaryFilters() {
  const [companies, setCompanies] = useState<Array<{ slug: string; display: string }>>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  const fetchOptions = useCallback(async () => {
    try {
      const [compRes, salRes] = await Promise.all([
        fetch('/api/companies', { cache: 'no-store' }),
        fetch('/api/salaries?limit=100', { cache: 'no-store' }),
      ]);
      if (compRes.ok) {
        const { data } = await compRes.json();
        setCompanies(data);
      }
      if (salRes.ok) {
        const { data } = await salRes.json();
        const uniqueRoles = [...new Set(data.map((s: Record<string, unknown>) => s.role))].sort() as string[];
        const uniqueLocations = [...new Set(data.map((s: Record<string, unknown>) => s.location))].sort() as string[];
        setRoles(uniqueRoles);
        setLocations(uniqueLocations);
      }
    } catch (e) {
      console.error('Failed to fetch filter options:', e);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
    // Refresh filter options every 30 seconds (new companies/roles might appear)
    const interval = setInterval(fetchOptions, 30000);
    return () => clearInterval(interval);
  }, [fetchOptions]);

  return <SalaryFilters companies={companies} roles={roles} locations={locations} />;
}
