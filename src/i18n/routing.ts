import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // All supported locales
  locales: ['en', 'he'],

  // Used when no locale matches
  defaultLocale: 'en',

  // 'as-needed' = default locale has no prefix, others get /he/...
  localePrefix: 'as-needed',
});
