export default function SalariesLoading() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="bg-[#0f1623] border-b border-white/[0.06] pt-12 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-48 skeleton rounded-lg mb-4" />
          <div className="h-5 w-96 skeleton rounded-lg" />
        </div>
      </div>
      <div className="py-4 border-b border-white/[0.06] bg-[#0d1117]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex gap-3">
          <div className="h-10 w-52 skeleton rounded-lg" />
          <div className="h-10 w-32 skeleton rounded-lg" />
          <div className="h-10 w-32 skeleton rounded-lg" />
          <div className="h-10 w-32 skeleton rounded-lg" />
          <div className="h-10 w-28 skeleton rounded-lg ml-auto" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="h-6 w-64 skeleton rounded" />
          <div className="h-[600px] skeleton rounded-xl" />
        </div>
      </div>
    </div>
  );
}
