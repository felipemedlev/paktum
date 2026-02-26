'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from './ui/Button';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === 'en' ? 'he' : 'en';
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);

    if (pathname === '/' || !pathname.startsWith(`/${locale}`)) {
      router.replace(`/${nextLocale}${pathname === '/' ? '' : pathname}`);
    } else {
      router.replace(newPath);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleLocale}
      className="rounded-xl font-semibold text-sm gap-1.5 px-3 h-9 hover:bg-accent-light text-foreground"
    >
      <Globe className="h-3.5 w-3.5 text-muted" />
      {locale === 'en' ? 'עברית' : 'EN'}
    </Button>
  );
}
