import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { signup } from '../actions';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

export default function RegisterPage({ searchParams }: { searchParams: { error?: string } }) {
  const t = useTranslations('Auth');

  return (
    <div className="flex-1 flex items-start justify-center pt-4 pb-8 px-4 sm:px-6 lg:px-8 bg-[#f5f5f7]">
      <div className="w-full max-w-md animate-scale-in">
        <Card className="shadow-apple-lg border-border bg-white/90 backdrop-blur-xl">
          <CardHeader className="text-center space-y-3 pb-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-2">
              <UserPlus className="h-5 w-5 text-accent" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              {t('registerTitle')}
            </CardTitle>
            <CardDescription className="text-muted text-[15px]">
              {t('registerSubtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {searchParams?.error && (
              <div className="mb-5 text-sm font-medium text-danger bg-danger-light p-3.5 rounded-xl text-center">
                {searchParams.error}
              </div>
            )}
            <form action={signup} className="space-y-5">
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
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full h-12 text-[15px] rounded-xl">
                {t('registerButton')}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-muted">
              {t('haveAccount')}{' '}
              <Link href="/login" className="font-semibold text-accent hover:text-accent-hover transition-colors">
                {t('loginButton')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
