export default function CompareLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-8 w-64 skeleton mb-2" />
      <div className="h-4 w-96 skeleton mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="h-12 skeleton rounded-lg" />
        <div className="h-12 skeleton rounded-lg" />
      </div>
      <div className="rounded-xl border border-white/[0.07] overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-12 skeleton rounded-none border-b border-white/[0.04]" style={{ animationDelay: `${i * 0.08}s` }} />
        ))}
      </div>
    </div>
  );
}
