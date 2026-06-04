// lib/seo.ts — JSON-LD structured data and metadata generators

import type { SalaryRecord } from '@/types/salary';
import type { Metadata } from 'next';

/**
 * Generate JSON-LD structured data for a salary page.
 * Uses schema.org/JobPosting for individual salary entries.
 */
export function salaryJsonLd(record: SalaryRecord) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: record.role,
    hiringOrganization: {
      '@type': 'Organization',
      name: record.company_display,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: record.location,
      },
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: record.currency,
      value: {
        '@type': 'QuantitativeValue',
        value: record.base_salary / 100,
        unitText: 'YEAR',
      },
    },
  };
}

/**
 * Generate JSON-LD structured data for a salary dataset page.
 */
export function salaryDatasetJsonLd(params: {
  name: string;
  description: string;
  url: string;
  recordCount: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: params.name,
    description: params.description,
    url: params.url,
    variableMeasured: 'Total Compensation',
    measurementTechnique: 'User Submission and Web Scraping',
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
    },
  };
}

/**
 * Generate page metadata for a salary table page.
 */
export function salariesPageMetadata(filters?: {
  company?: string;
  role?: string;
  location?: string;
  level?: string;
}): Metadata {
  const parts: string[] = [];
  if (filters?.role) parts.push(filters.role);
  if (filters?.company) parts.push(`at ${filters.company}`);
  if (filters?.location) parts.push(`in ${filters.location}`);

  const suffix = parts.length > 0 ? ` — ${parts.join(' ')}` : '';

  return {
    title: `Salary Data${suffix} | TalentDash`,
    description: `Explore structured compensation data${suffix}. Compare base salary, bonus, stock, and total compensation across levels and companies on TalentDash.`,
    openGraph: {
      title: `Salary Data${suffix} | TalentDash`,
      description: `Explore structured compensation data${suffix}. Compare base salary, bonus, stock, and total compensation.`,
      url: `https://talentdash.com/salaries`,
      type: 'website',
    },
    alternates: {
      canonical: `https://talentdash.com/salaries`,
    },
  };
}

/**
 * Generate page metadata for a company page.
 */
export function companyPageMetadata(companyName: string, slug: string): Metadata {
  return {
    title: `${companyName} Salaries — L3 to Principal Compensation | TalentDash`,
    description: `Explore compensation data at ${companyName}. View base salary, bonus, stock, and total compensation across all levels. Compare with other companies on TalentDash.`,
    openGraph: {
      title: `${companyName} Salaries | TalentDash`,
      description: `Salary and compensation data at ${companyName} — all levels, all locations.`,
      url: `https://talentdash.com/companies/${slug}`,
      type: 'website',
    },
    alternates: {
      canonical: `https://talentdash.com/companies/${slug}`,
    },
  };
}

/**
 * Generate page metadata for the compare page.
 */
export function comparePageMetadata(): Metadata {
  return {
    title: 'Compare Salaries — Side by Side Compensation | TalentDash',
    description: 'Compare two salary records side by side. See the difference in base salary, bonus, stock, and total compensation between any two roles or companies.',
    openGraph: {
      title: 'Compare Salaries | TalentDash',
      description: 'Side-by-side salary comparison tool.',
      url: 'https://talentdash.com/compare',
      type: 'website',
    },
    alternates: {
      canonical: 'https://talentdash.com/compare',
    },
  };
}
