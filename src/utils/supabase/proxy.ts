import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest, response: NextResponse = NextResponse.next()) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Define protected and auth-only routes
  const isAuthPage = pathname.includes('/login') || pathname.includes('/register')
  const isProtectedPage = pathname.includes('/dashboard') || pathname.includes('/upload') || pathname.includes('/contracts/')

  // Extract locale from pathname (e.g., /en/dashboard -> /en)
  const pathnameParts = pathname.split('/')
  const locale = pathnameParts[1]
  const isLocaleExist = ['en', 'he'].includes(locale)
  const localePrefix = isLocaleExist ? `/${locale}` : ''

  if (!user && isProtectedPage) {
    const redirectUrl = new URL(`${localePrefix}/login`, request.url)
    return NextResponse.redirect(redirectUrl)
  }

  if (user && isAuthPage) {
    const redirectUrl = new URL(`${localePrefix}/dashboard`, request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}
