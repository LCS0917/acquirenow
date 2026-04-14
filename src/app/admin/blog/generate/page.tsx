"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Sparkles, 
  RefreshCw, 
  ArrowRight, 
  Globe, 
  Target, 
  Layout, 
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getBlogPostsByStatus } from "@/app/actions/blog";

export default function AdminBlogGeneratePage() {
  const router = useRouter();
  const [directUrl, setDirectUrl] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDrafting, setIsDrafting] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadIdeas();
  }, []);

  async function loadIdeas() {
    const data = await getBlogPostsByStatus("idea");
    setIdeas(data || []);
  }

  async function handleSyncFeeds(url?: string) {
    setIsSyncing(true);
    setSyncError(null);
    setSyncSuccess(null);
    try {
      const res = await fetch("/api/admin/content-ingest/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(url ? { url } : {}),
      });
      const data = await res.json();
      if (!res.ok) {
        setSyncError(data.error || `Server error ${res.status}`);
      } else {
        if (url) setDirectUrl("");
        setSyncSuccess(`Success! Ingested ${data.ingested || 0} new research ideas.`);
        await loadIdeas();
      }
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : "Network error");
    } finally {
      setIsSyncing(false);
    }
  }

  async function handleDraftPost(draftId: string) {
    setIsDrafting(draftId);
    setDraftError(null);
    try {
      const res = await fetch("/api/admin/content-ingest/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft_id: draftId }),
      });
      const data = await res.json();
      if (data.success && data.draft?.id) {
        router.push(`/admin/blog/${data.draft.id}`);
      } else {
        setDraftError(data.error || `Server error ${res.status}`);
        await loadIdeas();
      }
    } catch (err) {
      setDraftError(err instanceof Error ? err.message : "Network error");
    } finally {
      setIsDrafting(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <Link 
            href="/admin/blog" 
            className="p-2 border border-brand-neutral rounded-sm hover:bg-brand-neutral transition-colors text-gray-500"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold text-brand-dark mb-1">Generate Content</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-plum/40 italic">
              AI-triaged ideas from industry feeds
            </p>
          </div>
        </div>
      </div>

      {/* Error Banners */}
      {(syncError || draftError || syncSuccess) && (
        <div className="mb-10 space-y-4">
          {syncSuccess && (
            <div className="p-4 bg-green-50 border border-green-100 rounded-sm text-green-700 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4" />
              {syncSuccess}
            </div>
          )}
          {syncError && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-sm text-red-600 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
              <AlertCircle className="w-4 h-4" />
              <strong>Sync Error:</strong> {syncError}
            </div>
          )}
          {draftError && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-sm text-red-600 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
              <AlertCircle className="w-4 h-4" />
              <strong>Draft Error:</strong> {draftError}
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="bg-white border border-brand-neutral/50 rounded-sm subtle-shadow p-8 mb-12">
        <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-end">
          <div className="w-full lg:w-auto">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
              News Aggregator
            </label>
            <button
              onClick={() => handleSyncFeeds()}
              disabled={isSyncing}
              className="w-full lg:w-auto brand-button-primary flex items-center gap-3"
            >
              {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Sync Research Feeds
            </button>
          </div>
          
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
              Direct Extraction
            </label>
            <div className="flex gap-3 w-full">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={directUrl}
                  onChange={(e) => setDirectUrl(e.target.value)}
                  placeholder="https://www.fiercehealthcare.com/..."
                  className="w-full pl-10 pr-4 py-3 bg-brand-neutral/10 border-transparent focus:bg-white focus:border-brand-plum/30 rounded-sm text-sm transition-all outline-none"
                />
              </div>
              <button
                onClick={() => handleSyncFeeds(directUrl)}
                disabled={isSyncing || !directUrl}
                className="brand-button-secondary border-brand-dark flex items-center gap-2"
              >
                Extract
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Idea Inbox Table */}
      <div className="bg-white border border-brand-neutral/50 rounded-sm subtle-shadow overflow-hidden">
        <div className="px-8 py-6 border-b border-brand-neutral/30 bg-brand-neutral/5 flex items-center justify-between">
          <h3 className="text-sm font-display font-bold uppercase tracking-[0.2em] text-brand-dark">Idea Inbox</h3>
          <span className="px-2 py-0.5 bg-brand-plum/10 text-brand-plum text-[9px] font-bold uppercase tracking-widest rounded-sm">
            {ideas.length} Potential Articles
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-neutral/5 border-b border-brand-neutral/30">
                <th className="px-8 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">Headline</th>
                <th className="px-8 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">Target Audience</th>
                <th className="px-8 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">Core Theme</th>
                <th className="px-8 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-neutral/20">
              {ideas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 bg-brand-neutral/30 rounded-full flex items-center justify-center">
                        < RefreshCw className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-gray-500 font-medium italic">Inbox is empty. Sync feeds to generate new research ideas.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                ideas.map((idea) => (
                  <tr key={idea.id} className="hover:bg-brand-neutral/5 transition-colors group">
                    <td className="px-8 py-6 text-sm font-display font-bold text-brand-dark max-w-sm leading-snug italic group-hover:text-brand-plum transition-colors">
                      "{idea.title}"
                    </td>
                    <td className="px-8 py-6">
                      <div className="inline-flex items-center gap-2 px-2 py-1 rounded-sm text-[9px] font-bold uppercase tracking-widest bg-brand-plum/5 text-brand-plum">
                        <Target className="w-2.5 h-2.5" />
                        {idea.target_audience}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-gray-500">
                        <Layout className="w-3 h-3 text-gray-300" />
                        {idea.core_theme}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => handleDraftPost(idea.id)}
                        disabled={!!isDrafting}
                        className="brand-button-secondary border-brand-plum/20 hover:border-brand-plum text-brand-plum text-[9px] px-4 py-2 flex items-center gap-2 ml-auto"
                      >
                        {isDrafting === idea.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowRight className="w-3 h-3" />}
                        Draft Blog
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
