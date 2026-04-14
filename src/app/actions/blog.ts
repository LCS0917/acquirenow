'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export async function getPublishedBlogPosts() {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('id, slug, title, content, description, draft_title, draft_body, target_audience, core_theme, is_featured, published_at, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching published blog posts:', error)
    return []
  }
  return data
}

export async function getBlogPostBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .eq('slug', slug)
    .single()

  if (error) {
    return null
  }
  return data
}

export async function getFeaturedBlogPost() {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('id, slug, title, draft_title, description, target_audience, core_theme, is_featured, created_at')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    // Fallback to most recent if no featured
    const { data: latest, error: fallbackError } = await supabaseAdmin
      .from('blog_posts')
      .select('id, slug, title, draft_title, description, target_audience, core_theme, is_featured, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    return fallbackError ? null : latest
  }
  return data
}

export async function getBlogPostsByStatus(status: string) {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(`Error fetching ${status} blog posts:`, error)
    return []
  }
  return data
}

export async function getAllBlogPosts() {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all blog posts:', error)
    return []
  }
  return data
}

export async function deleteBlogPosts(ids: string[]) {
  const { error } = await supabaseAdmin
    .from('blog_posts')
    .delete()
    .in('id', ids)

  if (error) {
    console.error('Error deleting blog posts:', error)
    throw new Error('Failed to delete blog posts')
  }

  revalidatePath('/admin/blog')
  revalidatePath('/insights')
  revalidatePath('/')
  return { success: true, count: ids.length }
}

export async function getBlogPostById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
  return data
}

export async function createBlankBlogPost() {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .insert({
      draft_title: 'Untitled Draft',
      draft_body: '',
      status: 'draft',
      target_audience: 'All',
      slug: `untitled-${crypto.randomUUID().substring(0, 8)}` // Added to satisfy NOT NULL
    })
    .select('id')
    .single()

  if (error || !data) {
    console.error('Error creating blank blog post:', error)
    throw new Error('Failed to create blank post')
  }
  
  revalidatePath('/admin/blog')
  return data.id
}

export async function updateBlogPost(id: string, updates: any) {
  if (updates.status === 'published' && (!updates.slug || updates.slug.trim() === '')) {
    throw new Error('A URL slug is required to publish.')
  }

  // If this post is being set as featured, unset all others first
  if (updates.is_featured === true) {
    await supabaseAdmin
      .from('blog_posts')
      .update({ is_featured: false })
      .neq('id', id)
  }

  const { error } = await supabaseAdmin
    .from('blog_posts')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Error updating blog post:', error)
    if (error.code === '23505') {
      throw new Error('Slug already in use.')
    }
    throw new Error('Failed to update post')
  }
  
  revalidatePath('/admin/blog')
  revalidatePath(`/admin/blog/${id}`)
  revalidatePath('/')
  if (updates.status === 'published') {
    revalidatePath('/insights')
    if (updates.slug) {
      revalidatePath(`/insights/${updates.slug}`)
    }
  }
}
