import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { login } from '../actions';
import Link from 'next/link';
import { Lock } from 'lucide-react';

export default async function LoginPage({ searchParams, params }: { searchParams: Promise<{ error?: string }>; params: Promise<{ locale: string }> }) {
  const { error } = await searchParams;
  const { locale } = await params;
  const t = await getTranslations('Auth');

  return (
    <div className="flex-1 flex items-start justify-center pt-4 pb-8 px-4 sm:px-6 lg:px-8 bg-[#f5f5f7]">
      <div className="w-full max-w-md animate-scale-in">
        <Card className="shadow-apple-lg border-border bg-white/90 backdrop-blur-xl">
          <CardHeader className="text-center space-y-3 pb-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-2">
              <Lock className="h-5 w-5 text-accent" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              {t('loginTitle')}
            </CardTitle>
            <CardDescription className="text-muted text-[15px]">
              {t('loginSubtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {error && (
              <div className="mb-5 text-sm font-medium text-danger bg-danger-light p-3.5 rounded-xl text-center">
                {error}
              </div>
            )}
            <form action={login} className="space-y-5">
              <input type="hidden" name="locale" value={locale} />
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  {t('emailLabel')}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder={t('emailPlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  {t('passwordLabel')}
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder={t('passwordPlaceholder')}
                />
              </div>
              <Button type="submit" className="w-full h-12 text-[15px] rounded-xl">
                {t('loginButton')}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-muted">
              {t('noAccount')}{' '}
              <Link href="/register" className="font-semibold text-accent hover:text-accent-hover transition-colors">
                {t('registerButton')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
