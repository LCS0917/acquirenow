'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string // Get the password from the form

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Auth error:', error.message)
    return redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  // Once logged in, go straight to the Dashboard
  return redirect('/admin')
}