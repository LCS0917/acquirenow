'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache' // 1. Add this import

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Auth error:', error.message)
    return redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  // 2. Force Next.js to refresh the layout and see the new session
  revalidatePath('/', 'layout') 
  
  return redirect('/admin')
}