'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { CmsPage } from '@/types/cms'

export async function getAllCmsPages(): Promise<CmsPage[]> {
  const { data, error } = await supabaseAdmin
    .from('cms_pages')
    .select('*')

  if (error) {
    console.error('Error fetching CMS pages:', error)
    return []
  }

  return data as CmsPage[]
}

export async function getCmsPage(pageKey: string): Promise<Record<string, Record<string, any>>> {
  const { data, error } = await supabaseAdmin
    .from('cms_pages')
    .select('section_key, content')
    .eq('page_key', pageKey)

  if (error || !data) return {}

  const result: Record<string, Record<string, any>> = {}
  for (const row of data) {
    result[row.section_key] = row.content
  }
  
  return result
}

export async function updateCmsSection(pageKey: string, sectionKey: string, content: Record<string, any>) {
  console.log('Updating CMS section:', { pageKey, sectionKey, content })
  const { error } = await supabaseAdmin
    .from('cms_pages')
    .upsert({
      page_key: pageKey,
      section_key: sectionKey,
      content,
      updated_at: new Date().toISOString()
    }, { onConflict: 'page_key,section_key' })

  if (error) {
    console.error('Supabase error updating CMS section:', error)
    return { success: false, error: error.message || JSON.stringify(error) }
  }

  revalidatePath('/')
  revalidatePath('/about')
  revalidatePath('/work')
  revalidatePath('/vbcindex')
  revalidatePath('/blog')
  revalidatePath('/admin/cms')
  return { success: true }
}
