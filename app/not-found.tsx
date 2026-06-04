// app/not-found.tsx — Custom 404 page

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-[#EBEBEB]">404</p>
      <h1 className="mt-4 text-2xl font-bold text-[#222222]">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-[#717171]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/salaries"
        className="mt-6 inline-flex items-center rounded-xl bg-[#FF5A5F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e8494e]"
      >
        Browse Salaries
      </Link>
    </div>
  );
}
