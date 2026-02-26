import type { Metadata } from "next";
import "../globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import { LanguageToggle } from '@/components/LanguageToggle';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { createClient } from '@/utils/supabase/server';
import { Button } from '@/components/ui/Button';
import { signOut } from './(auth)/actions';
import { LayoutDashboard, LogOut, LogIn, UserPlus } from 'lucide-react';

const inter = Inter({ subsets: ['latin'], weight: ['300','400','500','600','700','800','900'], display: 'swap' });

export const metadata: Metadata = {
  title: "Paktum — AI-Powered Legal Contract Analysis",
  description: "Navigate Israeli labor law with confidence. AI-powered contract analysis that helps you understand your rights, spot unfair clauses, and negotiate better terms.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  const authT = await getTranslations('Auth');

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang={locale} dir={locale === 'he' ? 'rtl' : 'ltr'} className={inter.className} suppressHydrationWarning>
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
              <div className="flex items-center gap-4">
                <nav className="flex items-center gap-2 sm:gap-4 mr-1">
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="p-2 rounded-xl hover:bg-accent/10 text-foreground transition-all flex items-center gap-2 group"
                        title={authT('dashboardTitle')}
                      >
                        <LayoutDashboard className="h-5 w-5 text-accent group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline text-sm font-medium">{authT('dashboardTitle')}</span>
                      </Link>
                      <form action={signOut}>
                        <button
                          type="submit"
                          className="p-2 rounded-xl hover:bg-danger/10 text-danger transition-all flex items-center gap-2 group"
                          title={authT('logoutButton')}
                        >
                          <LogOut className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                          <span className="hidden sm:inline text-sm font-medium">{authT('logoutButton')}</span>
                        </button>
                      </form>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="p-2 rounded-xl hover:bg-accent/10 text-foreground transition-all flex items-center gap-2 group"
                        title={authT('loginButton')}
                      >
                        <LogIn className="h-5 w-5 text-accent group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline text-sm font-medium">{authT('loginButton')}</span>
                      </Link>
                      <Button asChild variant="default" size="sm" className="rounded-xl px-4 h-10 shadow-apple-sm">
                        <Link href="/register" className="flex items-center gap-2">
                          <UserPlus className="h-4 w-4" />
                          <span className="hidden sm:inline">{authT('registerButton')}</span>
                        </Link>
                      </Button>
                    </>
                  )}
                </nav>
                <div className="h-4 w-[1px] bg-border mx-1 hidden xs:block"></div>
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
