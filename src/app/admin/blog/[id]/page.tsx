"use client";

import { useState, useEffect, useTransition, use, useRef, useCallback } from "react";
import { BlogStatus } from "@/types/blog";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Save, 
  Globe, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Upload,
  Sparkles
} from "lucide-react";
import { getBlogPostById, updateBlogPost } from "@/app/actions/blog";
import { RichTextEditor } from "@/components/rich-text-editor";

function generateOptimalSlug(text: string) {
  let s = text.toLowerCase()
  s = s.replace(/\b(19|20)\d{2}\b/g, ' ')
  s = s.replace(/\b(a|an|the|and|or|but|in|on|at|to|for|with|of|is|are|was|were)\b/g, ' ')
  s = s.replace(/[^a-z0-9 ]+/g, ' ')
  s = s.replace(/\s+/g, '-')
  s = s.replace(/^-+|-+$/g, '')
  const parts = s.split('-').filter(Boolean)
  return parts.slice(0, 5).join('-')
}

function formatManualSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9 -]+/g, '').replace(/\s+/g, '-')
}

export default function AdminBlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [description, setDescription] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<BlogStatus>('draft')
  const [isFeatured, setIsFeatured] = useState(false)
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>('')
  const [publishedAt, setPublishedAt] = useState<string>('')

  const [generateTheme, setGenerateTheme] = useState<'light' | 'dark'>('light')
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadPost = useCallback(async () => {
    setIsLoading(true)
    try {
      const post = await getBlogPostById(id)
      if (post) {
        setTitle(post.draft_title || post.title || '')
        setSlug(post.slug || '')
        if (post.slug && !post.slug.startsWith('untitled-')) setSlugEdited(true)
        setDescription(post.description || '')
        setBody(post.content || post.draft_body || '')
        setStatus(post.status || 'draft')
        setIsFeatured(post.is_featured || false)
        setFeaturedImageUrl(post.featured_image_url || '')
        setPublishedAt(post.published_at ? post.published_at.slice(0, 10) : '')
      } else {
        setErrorMsg("Post not found")
      }
    } catch {
      setErrorMsg("Failed to load post")
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadPost()
  }, [loadPost])

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!slugEdited) {
      setSlug(generateOptimalSlug(val))
    }
  }

  function handleSlugChange(val: string) {
    setSlug(formatManualSlug(val))
    setSlugEdited(true)
  }

  async function handleGenerateImage() {
    if (!title.trim()) return
    setImageError('')
    setIsGeneratingImage(true)
    try {
      const res = await fetch('/api/admin/blog/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), theme: generateTheme }),
      })
      const json = await res.json()
      if (!res.ok) {
        setImageError(json.error || 'Generation failed')
      } else {
        setFeaturedImageUrl(json.url)
      }
    } catch (err: any) {
      setImageError(err.message || 'Network error')
    } finally {
      setIsGeneratingImage(false)
    }
  }

  async function handleImageUpload(file: File) {
    setImageError('')
    setImageUploading(true)
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await fetch('/api/admin/blog/upload-image', {
        method: 'POST',
        body: form,
      })
      const json = await res.json()
      if (!res.ok) {
        setImageError(json.error || 'Upload failed')
      } else {
        setFeaturedImageUrl(json.url)
      }
    } catch {
      setImageError('Network error')
    } finally {
      setImageUploading(false)
    }
  }

  function handleSave(newStatus?: BlogStatus) {
    const statusToSave = newStatus || status
    setErrorMsg('')
    
    if (statusToSave === 'published' && (!slug || slug.trim() === '')) {
      setErrorMsg('A URL slug is required to publish.')
      return
    }

    startTransition(async () => {
      try {
        const payload: any = {
          draft_title: title,
          slug: slug.trim() === '' ? null : slug.trim(),
          description,
          draft_body: body,
          status: statusToSave,
          is_featured: isFeatured,
          featured_image_url: featuredImageUrl || null
        }

        if (publishedAt) {
          payload.published_at = new Date(publishedAt).toISOString()
        } else if (statusToSave === 'published' && status !== 'published') {
          payload.published_at = new Date().toISOString()
        }

        await updateBlogPost(id, payload)
        setStatus(statusToSave)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to save post.')
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-neutral/10">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-brand-plum" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-plum/40">Acquiring Data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-6">
          <Link 
            href="/admin/blog" 
            className="p-2 border border-brand-neutral rounded-sm hover:bg-brand-neutral transition-colors text-gray-500 hover:text-brand-dark"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-display font-bold text-brand-dark">Edit Article</h1>
              {status === 'published' ? (
                <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-green-50 text-green-700 border border-green-100 flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   Live on Site
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-brand-neutral text-gray-500 border border-brand-neutral/50">
                  Private Draft
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID Reference: {id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {saved && <span className="text-green-600 text-[10px] font-bold uppercase tracking-widest mr-4 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Changes Synced
          </span>}
          <button
            onClick={() => handleSave('draft')}
            disabled={isPending}
            className="flex-1 md:flex-none px-6 py-3 border border-brand-dark text-brand-dark hover:bg-brand-neutral rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Progress
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={isPending || status === 'published'}
            className="flex-1 md:flex-none px-8 py-3 bg-brand-dark text-white hover:bg-brand-plum rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-dark/20 disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            {status === 'published' ? 'Article Live' : 'Go Public'}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-10 p-5 bg-red-50 border border-red-100 rounded-sm text-red-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-4">
          <AlertCircle className="w-5 h-5" />
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-12">
          <div className="bg-white border border-brand-neutral/50 rounded-sm subtle-shadow p-8 lg:p-12 space-y-12">
            {/* Title Input */}
            <div className="group">
              <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300 mb-4 group-focus-within:text-brand-plum transition-colors">
                Headline
              </label>
              <input
                type="text"
                className="w-full text-4xl lg:text-5xl font-display font-bold text-brand-dark border-b-2 border-brand-neutral/20 pb-6 focus:border-brand-plum transition-colors outline-none placeholder:text-brand-neutral bg-transparent leading-tight"
                placeholder="Enter article title..."
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>

            {/* Rich Text Editor */}
            <div className="group">
              <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300 mb-6 group-focus-within:text-brand-plum transition-colors">
                Body Content
              </label>
              <RichTextEditor content={body} onChange={setBody} />
            </div>
          </div>
        </div>

        {/* Sidebar / Options */}
        <div className="lg:col-span-4 space-y-8">
          {/* Article Config */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark border-b border-brand-neutral/30 pb-4">
              Article Configuration
            </h3>

            <div className="space-y-6">
              {/* Featured Toggle */}
              <div className="flex items-start gap-4 p-4 rounded-sm border border-brand-neutral/30 bg-brand-neutral/10 hover:bg-brand-neutral/20 transition-colors cursor-pointer"
                   onClick={() => setIsFeatured(!isFeatured)}>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="mt-1 w-4 h-4 text-brand-plum rounded-sm border-brand-neutral focus:ring-brand-plum"
                />
                <div>
                  <div className="text-[10px] font-bold text-brand-dark uppercase tracking-widest mb-1">Featured Insight</div>
                  <p className="text-[9px] text-gray-500 font-medium leading-relaxed">
                    Promote this article to the primary slot on the home landing page.
                  </p>
                </div>
              </div>

              {/* Published Date */}
              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-brand-plum transition-colors">
                  Publish Date
                </label>
                <input
                  type="date"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full px-4 py-3 bg-brand-neutral/10 border border-brand-neutral/30 focus:bg-white focus:border-brand-plum/30 rounded-sm text-[10px] font-bold transition-all outline-none"
                />
                <p className="text-[8px] text-gray-400 mt-2 font-bold uppercase tracking-widest italic">
                  Overrides auto-set date on publish
                </p>
              </div>

              {/* URL Slug */}
              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-brand-plum transition-colors">
                  Live URL Path
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="my-post-title"
                    className="w-full pl-9 pr-4 py-3 bg-brand-neutral/10 border border-brand-neutral/30 focus:bg-white focus:border-brand-plum/30 rounded-sm text-[10px] font-bold transition-all outline-none"
                  />
                </div>
                <p className="text-[8px] text-gray-400 mt-2 font-bold uppercase tracking-widest flex items-center gap-1.5 italic">
                  <ExternalLink className="w-2.5 h-2.5" />
                  blog/{slug || '...'}
                </p>
              </div>

              {/* Description */}
              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-brand-plum transition-colors">
                  SEO Meta Summary
                </label>
                <textarea
                  className="w-full p-4 bg-brand-neutral/10 border border-brand-neutral/30 focus:bg-white focus:border-brand-plum/30 rounded-sm text-[11px] font-medium transition-all leading-relaxed outline-none"
                  rows={4}
                  placeholder="The concise version of this insight..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
                  Featured Image
                </label>

                {featuredImageUrl ? (
                  <div className="relative mb-3 border border-brand-neutral/30 rounded-sm overflow-hidden aspect-[2/1] bg-brand-neutral/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featuredImageUrl}
                      alt="Featured"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFeaturedImageUrl('')}
                      className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-[9px] font-bold uppercase tracking-widest rounded-sm hover:bg-black"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="mb-3 border border-dashed border-brand-neutral/40 rounded-sm aspect-[2/1] flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    No image set
                  </div>
                )}

                {/* Upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleImageUpload(f)
                    e.target.value = ''
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageUploading}
                  className="w-full mb-3 px-4 py-3 border border-brand-dark text-brand-dark hover:bg-brand-neutral rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {imageUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  Upload Image
                </button>

                {/* Generate from title */}
                <div className="p-3 border border-brand-neutral/30 rounded-sm bg-brand-neutral/10 space-y-3">
                  <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">
                    Generate from title
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setGenerateTheme('light')}
                      className={`flex-1 px-3 py-2 rounded-sm text-[9px] font-bold uppercase tracking-widest transition-all ${
                        generateTheme === 'light'
                          ? 'bg-brand-dark text-white'
                          : 'bg-white text-brand-dark border border-brand-neutral/40 hover:border-brand-dark'
                      }`}
                    >
                      Light
                    </button>
                    <button
                      type="button"
                      onClick={() => setGenerateTheme('dark')}
                      className={`flex-1 px-3 py-2 rounded-sm text-[9px] font-bold uppercase tracking-widest transition-all ${
                        generateTheme === 'dark'
                          ? 'bg-brand-dark text-white'
                          : 'bg-white text-brand-dark border border-brand-neutral/40 hover:border-brand-dark'
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage || !title.trim()}
                    className="w-full px-4 py-2.5 bg-brand-plum text-white hover:bg-brand-dark rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isGeneratingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    Generate Image
                  </button>
                  {!title.trim() && (
                    <p className="text-[9px] text-gray-400 italic">
                      Enter a headline first.
                    </p>
                  )}
                </div>

                {imageError && (
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" />
                    {imageError}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-brand-dark text-white p-8 rounded-sm overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-plum opacity-20 -m-16 rounded-full blur-2xl transition-opacity group-hover:opacity-40" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-6">Article Preview</h3>
            <Link 
              href={`/blog/${slug}`} 
              target="_blank"
              className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Public Version
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
