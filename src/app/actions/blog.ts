'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export async function getPublishedBlogPosts() {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('id, slug, title, draft_title, description, draft_body, target_audience, core_theme, is_featured, featured_image_url, status, published_at, created_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

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
    .select('id, slug, title, draft_title, description, target_audience, core_theme, is_featured, featured_image_url, published_at, created_at')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    // Fallback to most recent if no featured
    const { data: latest, error: fallbackError } = await supabaseAdmin
      .from('blog_posts')
      .select('id, slug, title, draft_title, description, target_audience, core_theme, is_featured, featured_image_url, published_at, created_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
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
  revalidatePath('/blog')
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
  // Use a timestamped title so the auto-generated slug never collides with
  // an existing draft named "Untitled Draft".
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)
  const title = `Untitled Draft ${stamp}`
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .insert({
      title,
      draft_title: title,
      content: '',
      draft_body: '',
      slug: `untitled-draft-${stamp}`,
      status: 'draft',
      target_audience: 'All'
    })
    .select('id')
    .single()

  if (error || !data) {
    console.error('Error creating blank blog post:', error)
    throw new Error(error?.message || 'Failed to create blank post')
  }
  
  revalidatePath('/admin/blog')
  return data
}

export async function updateBlogPost(id: string, updates: any) {
  if (updates.status === 'published' && (!updates.slug || updates.slug.trim() === '')) {
    throw new Error('A URL slug is required to publish.')
  }

  // Sync draft fields to live fields for maximum compatibility
  if (updates.draft_title !== undefined) updates.title = updates.draft_title;
  if (updates.draft_body !== undefined) updates.content = updates.draft_body;

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
    throw new Error(error.message || 'Failed to update post')
  }
  
  revalidatePath('/admin/blog')
  revalidatePath(`/admin/blog/${id}`)
  revalidatePath('/')
  if (updates.status === 'published') {
    revalidatePath('/blog')
    if (updates.slug) {
      revalidatePath(`/blog/${updates.slug}`)
    }
  }
}
