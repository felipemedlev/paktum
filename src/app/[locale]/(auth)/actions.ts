'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

// Derive the locale from the referer URL header so we can redirect correctly
async function getLocale(): Promise<string> {
  const headersList = await headers()
  const referer = headersList.get('referer') ?? ''
  // e.g. http://localhost:3000/he/register -> locale is "he"
  const match = referer.match(/\/([a-z]{2})\//i)
  return match?.[1] ?? 'en'
}

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const locale = formData.get('locale') as string || await getLocale()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('[Supabase login error]', error.message)
    return redirect(`/${locale}/login?error=${encodeURIComponent(error.message || 'Could not authenticate user')}`)
  }

  revalidatePath(`/${locale}/dashboard`)
  redirect(`/${locale}/dashboard`)
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const locale = formData.get('locale') as string || await getLocale()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error('[Supabase signup error]', error.message, error.status)
    return redirect(`/${locale}/register?error=${encodeURIComponent(error.message || 'Could not create user')}`)
  }

  // signUp can succeed but require email confirmation (data.user exists, session is null)
  if (data.session === null) {
    return redirect(`/${locale}/login?error=${encodeURIComponent('Check your email to confirm your account')}`)
  }

  revalidatePath(`/${locale}/dashboard`)
  redirect(`/${locale}/dashboard`)
}

export async function signOut() {
  const supabase = await createClient()
  const locale = await getLocale()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect(`/${locale}/login`)
}
