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
  const isAuthPage = pathname.includes('/login') || pathname.includes('/register')
  const isProtectedPage = pathname.includes('/dashboard') || pathname.includes('/upload') || pathname.includes('/contracts/')

  if (!user && isProtectedPage) {
    const localeMatch = pathname.match(/^\/(en|he)/)
    const localePrefix = localeMatch ? localeMatch[0] : '/en'
    return NextResponse.redirect(new URL(`${localePrefix}/login`, request.url))
  }

  if (user && isAuthPage) {
    const localeMatch = pathname.match(/^\/(en|he)/)
    const localePrefix = localeMatch ? localeMatch[0] : '/en'
    return NextResponse.redirect(new URL(`${localePrefix}/dashboard`, request.url))
  }

  return response
}
