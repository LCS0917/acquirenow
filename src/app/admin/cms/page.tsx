'use client'

import { useState, useEffect, useTransition, useMemo, useRef } from 'react'
import { getAllCmsPages, updateCmsSection } from '@/app/actions/cms'
import { CMS_PAGE_DEFINITIONS, CmsPage } from '@/types/cms'
import { Save, CheckCircle2, Loader2, FileText, Layout, AlertCircle, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminCmsPage() {
  const [pages, setPages] = useState<CmsPage[]>([])
  const [activePage, setActivePage] = useState('homepage')
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Record<string, string>>({})
  const [originalValues, setOriginalValues] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [imageUploading, setImageUploading] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadingFieldRef = useRef<string | null>(null)

  useEffect(() => { 
    getAllCmsPages().then(setPages) 
  }, [])

  const pageDef = CMS_PAGE_DEFINITIONS.find(p => p.page_key === activePage)
  
  useEffect(() => {
    if (pageDef && !activeSection) setActiveSection(pageDef.sections[0]?.section_key ?? null)
  }, [activePage, pageDef, activeSection])

  useEffect(() => {
    if (!activeSection) return
    const row = pages.find(p => p.page_key === activePage && p.section_key === activeSection)
    if (row) {
      const flat: Record<string, string> = {}
      for (const [k, v] of Object.entries(row.content)) { 
        if (typeof v === 'string') flat[k] = v 
      }
      setEditValues(flat)
      setOriginalValues(flat)
    } else {
      setEditValues({})
      setOriginalValues({})
    }
  }, [activeSection, activePage, pages])

  const sectionDef = pageDef?.sections.find(s => s.section_key === activeSection)

  const hasChanges = useMemo(() => {
    return JSON.stringify(editValues) !== JSON.stringify(originalValues)
  }, [editValues, originalValues])

  function handleSave() {
    if (!activeSection) return
    startTransition(async () => {
      try {
        const result = await updateCmsSection(activePage, activeSection, editValues)
        if (result.success) {
          setSaved(true)
          setOriginalValues(editValues)
          setTimeout(() => setSaved(false), 2000)
          const fresh = await getAllCmsPages()
          setPages(fresh)
        } else {
          alert("Failed to save CMS content: " + result.error)
        }
      } catch (err) {
        alert("An unexpected error occurred while saving")
      }
    })
  }

  const handlePageChange = (pageKey: string) => {
    if (hasChanges) {
      if (!confirm("You have unsaved changes. Discard them?")) return
    }
    setActivePage(pageKey)
    setActiveSection(null)
  }

  const handleSectionChange = (sectionKey: string) => {
    if (hasChanges) {
      if (!confirm("You have unsaved changes. Discard them?")) return
    }
    setActiveSection(sectionKey)
  }

  // Group sections
  const groupedSections = useMemo(() => {
    if (!pageDef) return {}
    const groups: Record<string, typeof pageDef.sections> = {}
    pageDef.sections.forEach(s => {
      const g = s.group || 'General'
      if (!groups[g]) groups[g] = []
      groups[g].push(s)
    })
    return groups
  }, [pageDef])

  async function handleImageUpload(fieldKey: string, file: File) {
    setImageUploading(fieldKey)
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await fetch('/api/admin/blog/upload-image', { method: 'POST', body: form })
      const json = await res.json()
      if (res.ok) {
        setEditValues(v => ({ ...v, [fieldKey]: json.url }))
      } else {
        alert(json.error || 'Upload failed')
      }
    } catch {
      alert('Network error during upload')
    } finally {
      setImageUploading(null)
    }
  }

  return (
    <div className="p-8 lg:p-12 bg-brand-neutral/30 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-brand-plum/10 pb-12">
          <div>
            <div className="inline-flex items-center gap-3 mb-6 px-3 py-1 bg-brand-plum/5 text-brand-plum text-[10px] font-bold uppercase tracking-[0.3em] rounded-full border border-brand-plum/10">
              System Config
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-plum tracking-tight">Interface Editor</h1>
          </div>
          {hasChanges && (
            <div className="flex items-center gap-2 text-brand-plum animate-pulse mb-1">
              <AlertCircle className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Unsaved Changes</span>
            </div>
          )}
        </div>

        {/* Page Tabs */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-2 scrollbar-hide">
          {CMS_PAGE_DEFINITIONS.map(p => (
            <button
              key={p.page_key}
              onClick={() => handlePageChange(p.page_key)}
              className={cn(
                "px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all whitespace-nowrap border shadow-sm",
                activePage === p.page_key
                  ? "bg-brand-dark text-white border-brand-dark scale-105"
                  : "bg-white text-gray-400 border-brand-plum/5 hover:border-brand-plum hover:text-brand-plum"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Section Navigation */}
          <aside className="lg:col-span-3">
             <div className="bg-white border border-brand-plum/5 rounded-2xl shadow-subtle p-8 sticky top-32">
               <div className="text-[9px] font-bold text-brand-plum/40 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                 <Layout className="w-3.5 h-3.5" />
                 Structure
               </div>
               <nav className="flex flex-col gap-8">
                 {Object.entries(groupedSections).map(([group, sections]) => (
                   <div key={group}>
                     <h3 className="text-[9px] font-bold text-brand-plum/20 uppercase tracking-widest mb-4 px-2">{group}</h3>
                     <div className="flex flex-col gap-1">
                      {sections.map(s => (
                        <button
                          key={s.section_key}
                          onClick={() => handleSectionChange(s.section_key)}
                          className={cn(
                            "px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] text-left transition-all",
                            activeSection === s.section_key
                              ? "bg-brand-plum/5 text-brand-plum shadow-sm"
                              : "text-gray-400 hover:bg-brand-neutral/50"
                          )}
                        >
                          {s.label}
                        </button>
                      ))}
                     </div>
                   </div>
                 ))}
               </nav>
             </div>
          </aside>

          {/* Editor Content */}
          <main className="lg:col-span-9">
            {sectionDef ? (
              <div className="bg-white border border-brand-plum/5 rounded-2xl shadow-subtle overflow-hidden group hover:border-brand-plum/10 transition-all duration-500">
                <div className="p-8 lg:p-12">
                  <div className="flex justify-between items-start mb-16">
                    <div>
                      <h2 className="text-3xl font-bold text-brand-dark mb-3 tracking-tight">{sectionDef.label}</h2>
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-plum/30">
                         <FileText className="w-3.5 h-3.5" />
                         {pageDef?.label} &rsaquo; {sectionDef.label}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      {saved && <span className="text-green-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Synced
                      </span>}
                      <button
                        onClick={handleSave}
                        disabled={isPending || !hasChanges}
                        className={cn(
                          "brand-button-primary flex items-center gap-3 transition-all rounded-xl py-3 px-8",
                          !hasChanges && "opacity-50 grayscale cursor-not-allowed shadow-none scale-100",
                          hasChanges && "scale-105 shadow-xl shadow-brand-plum/10"
                        )}
                      >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isPending ? 'Syncing...' : 'Save Updates'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-12">
                    {sectionDef.fields.map(field => (
                      <div key={field.key} className="group/field">
                        <div className="flex justify-between items-center mb-4">
                          <label className="block text-[10px] font-bold uppercase tracking-[0.4em] text-brand-plum/40 group-focus-within/field:text-brand-plum transition-colors">
                            {field.label}
                          </label>
                          {originalValues[field.key] !== editValues[field.key] && (
                            <span className="text-[9px] font-bold text-brand-gold uppercase tracking-widest px-2 py-0.5 bg-brand-gold/10 rounded-sm">Edited</span>
                          )}
                        </div>
                        {field.type === 'image' ? (
                          <div className="space-y-4">
                            {editValues[field.key] && (
                              <div className="relative border border-brand-plum/10 rounded-xl overflow-hidden aspect-[2/1] bg-brand-neutral/20">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={editValues[field.key]} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setEditValues(v => ({ ...v, [field.key]: '' }))}
                                  className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-[9px] font-bold uppercase tracking-widest rounded-sm hover:bg-black"
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif"
                              className="hidden"
                              onChange={e => {
                                const f = e.target.files?.[0]
                                if (f && uploadingFieldRef.current) handleImageUpload(uploadingFieldRef.current, f)
                                e.target.value = ''
                              }}
                            />
                            <button
                              type="button"
                              disabled={imageUploading === field.key}
                              onClick={() => { uploadingFieldRef.current = field.key; fileInputRef.current?.click() }}
                              className="w-full flex items-center justify-center gap-3 border border-brand-plum/20 rounded-xl px-6 py-4 bg-brand-neutral/30 hover:bg-brand-neutral/60 transition-all text-[11px] font-bold uppercase tracking-widest text-brand-plum/60 disabled:opacity-50"
                            >
                              {imageUploading === field.key ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                              {editValues[field.key] ? 'Replace Image' : 'Upload Image'}
                            </button>
                          </div>
                        ) : field.type === 'textarea' ? (
                          <textarea
                            rows={4}
                            value={editValues[field.key] ?? ''}
                            onChange={e => setEditValues(v => ({ ...v, [field.key]: e.target.value }))}
                            placeholder={field.placeholder}
                            className="w-full border border-brand-plum/10 rounded-xl p-6 bg-brand-neutral/30 focus:bg-white focus:ring-4 focus:ring-brand-plum/5 focus:border-brand-plum/30 transition-all text-lg leading-relaxed italic outline-none text-brand-dark"
                          />
                        ) : (
                          <input
                            type={field.type === 'url' ? 'url' : 'text'}
                            value={editValues[field.key] ?? ''}
                            onChange={e => setEditValues(v => ({ ...v, [field.key]: e.target.value }))}
                            placeholder={field.placeholder}
                            className="w-full border border-brand-plum/10 rounded-xl px-6 py-4 bg-brand-neutral/30 focus:bg-white focus:ring-4 focus:ring-brand-plum/5 focus:border-brand-plum/30 transition-all text-lg italic outline-none text-brand-dark"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-brand-neutral/30 border-2 border-dashed border-brand-plum/10 rounded-2xl p-32 text-center">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-subtle">
                  <Layout className="w-10 h-10 text-brand-plum/20" />
                </div>
                <p className="text-brand-plum/40 font-bold uppercase tracking-[0.4em] text-[11px]">Select a section to begin configuring</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
