import type { Metadata } from "next";
import "../globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import { LanguageToggle } from '@/components/LanguageToggle';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Paktum — AI-Powered Legal Contract Analysis",
  description: "Navigate Israeli labor law with confidence. AI-powered contract analysis that helps you understand your rights, spot unfair clauses, and negotiate better terms.",
};

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'he' ? 'rtl' : 'ltr'}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body
        className="antialiased min-h-screen bg-background text-foreground flex flex-col"
      >
        <NextIntlClientProvider messages={messages}>
          {/* ── Frosted Glass Navigation ── */}
          <header className="sticky top-0 z-50 w-full glass-heavy">
            <div className="max-w-7xl mx-auto flex h-[72px] items-center justify-between px-6 sm:px-12">
              <Link href="/" className="font-bold text-[22px] tracking-tight text-foreground flex items-center gap-0.5 transition-opacity hover:opacity-80">
                Paktum<span className="text-accent">.</span>
              </Link>
              <div className="flex items-center gap-3">
                <LanguageToggle />
              </div>
            </div>
          </header>

          <main className="flex-1 flex flex-col">
            {children}
          </main>

          {/* ── Minimal Footer ── */}
          <footer className="border-t border-border bg-[#f5f5f7]">
            <div className="max-w-7xl mx-auto px-6 sm:px-12 py-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm">Paktum<span className="text-accent">.</span></span>
                  <span className="text-muted text-xs">© {new Date().getFullYear()}</span>
                </div>
                <p className="text-xs text-muted text-center sm:text-right">
                  AI-powered legal analysis for Israeli labor law.
                </p>
              </div>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
