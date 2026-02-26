import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from '@/utils/supabase/proxy';
import { type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  // First, run intl middleware to get the response with locale header/cookie
  const response = intlMiddleware(request);

  // Then, update the Supabase session using that response
  return await updateSession(request, response);
}

export const config = {
  // Match all pathnames except for API routes, Next.js internals, and static files
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
