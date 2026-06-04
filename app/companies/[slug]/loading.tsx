export default function CompanyDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header skeleton */}
      <div className="rounded-2xl border border-white/[0.07] p-8 mb-8" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <div className="flex items-start gap-6">
          <div className="h-24 w-24 skeleton rounded-2xl" />
          <div className="flex-1">
            <div className="h-8 w-48 skeleton mb-3" />
            <div className="h-4 w-64 skeleton mb-4" />
            <div className="flex gap-3">
              <div className="h-8 w-32 skeleton rounded-lg" />
              <div className="h-8 w-40 skeleton rounded-lg" />
            </div>
          </div>
        </div>
      </div>
      {/* Stats skeleton */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-white/[0.07] p-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="h-4 w-24 skeleton mb-3" />
            <div className="h-10 w-32 skeleton" />
          </div>
        ))}
      </div>
      {/* Level bar skeleton */}
      <div className="h-6 w-full skeleton rounded-full mb-8" />
      {/* Table skeleton */}
      <div className="rounded-xl border border-white/[0.07] overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="h-10 skeleton rounded-none" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 skeleton rounded-none border-b border-white/[0.04]" style={{ animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
    </div>
  );
}
