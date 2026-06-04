import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/ui/Navigation";
import { Waves } from "@/components/ui/wave-background";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TalentDash — Career Intelligence Platform",
  description:
    "Structured compensation data for India's tech professionals. Compare salaries, levels, and total compensation across top companies.",
  openGraph: {
    title: "TalentDash — Career Intelligence Platform",
    description:
      "Structured compensation data for India's tech professionals.",
    url: "https://talentdash.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white/90">
        {/* ── Background & Navigation ──────────────────────── */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <Waves backgroundColor="#0a0a0a" strokeColor="rgba(255, 255, 255, 0.1)" />
        </div>
        <Navigation />

        {/* ── Main Content ───────────────────────────────── */}
        <main className="flex-1 relative z-10">{children}</main>

        {/* ── Footer ─────────────────────────────────────── */}
        <div className="relative z-10">
          <Footer />
        </div>

        {/* ── Toast Notifications ─────────────────────────── */}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(15, 22, 35, 0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              color: 'white',
            },
          }}
        />
      </body>
    </html>
  );
}
