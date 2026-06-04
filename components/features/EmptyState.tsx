export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center rounded-xl border border-white/[0.05] bg-white/[0.02]">
      <svg className="h-12 w-12 text-white/10 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 className="text-lg font-medium text-white/70">No data available</h3>
      <p className="mt-1 text-sm text-white/40">We couldn't find any records matching your criteria.</p>
    </div>
  );
}
