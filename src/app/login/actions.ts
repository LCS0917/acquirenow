'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const origin = (await headers()).get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const email = formData.get('email') as string

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error('Auth error:', error.message)
    return redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  return redirect('/login?message=Check your email for the login link')
}
