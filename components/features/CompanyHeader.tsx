import { getCompanyLogoUrl, COMPANY_DISPLAY, type Company } from '@/types/company';

export interface CompanyHeaderProps {
  company: Company;
  stats: {
    totalRecords: number;
    locations: number;
  };
}

export function CompanyHeader({ company, stats }: CompanyHeaderProps) {
  const logoUrl = getCompanyLogoUrl(company.slug);
  const companyInfo = COMPANY_DISPLAY[company.slug];
  
  return (
    <div className="bg-[#0f1623]/60 backdrop-blur-xl border-b border-white/[0.06] relative overflow-hidden">
      {/* Subtle mesh background */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 80% -20%, rgba(37, 99, 235, 0.2), transparent 70%)',
        }}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 shrink-0 overflow-hidden items-center justify-center rounded-2xl border border-white/[0.1] bg-white text-3xl font-bold shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              {logoUrl ? (
                <img src={logoUrl} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#222222]">{company.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                {company.name}
              </h1>
              {companyInfo?.description && (
                <p className="mt-2 text-sm text-white/70 max-w-2xl leading-relaxed">
                  {companyInfo.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/50">
                <span className="inline-flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                  {stats.totalRecords} Records
                </span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span className="inline-flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {stats.locations} Locations
                </span>
                {companyInfo?.valuation && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    <span className="inline-flex items-center gap-1.5">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {companyInfo.valuation} Valuation
                    </span>
                  </>
                )}
                {companyInfo?.headcount && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    <span className="inline-flex items-center gap-1.5">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                      {companyInfo.headcount} Employees
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            {companyInfo?.careersUrl && (
              <a
                href={companyInfo.careersUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-[#f05555] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#f05555]/25 transition-all hover:bg-[#e04545] hover:scale-[1.02] hover:shadow-xl hover:shadow-[#f05555]/30"
                style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 24px rgba(240,85,85,0.25)' }}
              >
                Apply for jobs
                <svg className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            )}
            {companyInfo?.website && (
              <a
                href={companyInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/40 hover:text-white transition-colors"
              >
                {companyInfo.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
