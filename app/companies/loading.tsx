export default function CompaniesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-8 w-48 skeleton mb-2" />
      <div className="h-4 w-72 skeleton mb-8" />
      <div className="h-12 w-full max-w-md skeleton rounded-xl mb-8" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-white/[0.07] p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-start gap-4 mb-4">
              <div className="h-14 w-14 skeleton rounded-xl" />
              <div className="flex-1">
                <div className="h-5 w-32 skeleton mb-2" />
                <div className="h-4 w-20 skeleton" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full skeleton" />
              <div className="h-3 w-full skeleton" />
              <div className="h-3 w-2/3 skeleton" />
            </div>
            <div className="mt-4 flex gap-3">
              <div className="h-3 w-16 skeleton" />
              <div className="h-3 w-20 skeleton" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
