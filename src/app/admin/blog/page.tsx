"use client";

import { useState, useMemo, useEffect } from "react";
import { BlogPost } from "@/types/blog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Sparkles, 
  Filter,
  CheckCircle2,
  Clock,
  LayoutGrid,
  Star,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllBlogPosts, createBlankBlogPost, deleteBlogPosts } from "@/app/actions/blog";

type Tab = "all" | "draft" | "published";

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadPosts() {
      const data = await getAllBlogPosts();
      setPosts(data);
      setLoading(false);
    }
    loadPosts();
  }, []);

  const counts = useMemo(() => ({
    all: posts.length,
    draft: posts.filter(p => p.status === 'draft').length,
    published: posts.filter(p => p.status === 'published').length
  }), [posts]);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (activeTab !== "all") {
      result = result.filter(p => p.status === activeTab);
    }
    if (searchQuery) {
      result = result.filter(p => {
        const title = p.title || p.draft_title || "";
        const slug = p.slug || "";
        return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               slug.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    return result;
  }, [posts, activeTab, searchQuery]);

  const handleAddBlog = async () => {
    try {
      const newPost = await createBlankBlogPost();
      router.push(`/admin/blog/${newPost.id}`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      alert(`Failed to create blog post: ${msg}`);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteBlogPosts([id]);
        setPosts(posts.filter((p) => p.id !== id));
        const newSelected = new Set(selectedIds);
        newSelected.delete(id);
        setSelectedIds(newSelected);
      } catch (error) {
        alert("Failed to delete post");
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.size} selected posts?`)) {
      try {
        const idsToDelete = Array.from(selectedIds);
        await deleteBlogPosts(idsToDelete);
        setPosts(posts.filter(p => !selectedIds.has(p.id)));
        setSelectedIds(new Set());
      } catch (error) {
        alert("Failed to delete selected posts");
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredPosts.length && filteredPosts.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredPosts.map(p => p.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-plum" />
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 bg-brand-neutral/30 min-h-screen text-brand-dark">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 border-b border-brand-plum/10 pb-12">
          <div>
            <div className="inline-flex items-center gap-3 mb-6 px-3 py-1 bg-brand-plum/5 text-brand-plum text-[10px] font-bold uppercase tracking-[0.3em] rounded-full border border-brand-plum/10">
              Editorial Studio
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-plum tracking-tight font-display">Article Repository</h1>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Link
              href="/admin/blog/generate"
              className="brand-button-secondary border-brand-plum/20 hover:border-brand-plum text-brand-plum flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              AI Assistant
            </Link>
            <button
              onClick={handleAddBlog}
              className="brand-button-primary shadow-bold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Article
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-brand-plum/5 rounded-2xl shadow-subtle mb-8 overflow-hidden group hover:border-brand-plum/10 transition-all duration-500">
          <div className="p-3 border-b border-brand-neutral/50 flex flex-col md:flex-row gap-6 items-center justify-between bg-brand-neutral/10">
            <div className="flex bg-brand-neutral/50 p-1.5 rounded-xl w-full md:w-auto border border-brand-plum/5">
              {(["all", "draft", "published"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2",
                    activeTab === tab 
                      ? "bg-white text-brand-dark shadow-sm border border-brand-plum/5" 
                      : "text-brand-plum/40 hover:text-brand-plum"
                  )}
                >
                  {tab}
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[9px] font-bold",
                    activeTab === tab ? "bg-brand-plum text-white" : "bg-brand-neutral text-brand-plum/30"
                  )}>
                    {counts[tab]}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-plum/30" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-brand-neutral/30 border border-transparent focus:bg-white focus:border-brand-plum/20 rounded-xl text-sm transition-all outline-none italic"
                />
              </div>
              {selectedIds.size > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="px-6 py-3 bg-red-500 text-white hover:bg-red-600 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-red-500/10 scale-105"
                >
                  <Trash2 className="w-4 h-4" />
                  Archive ({selectedIds.size})
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-plum/5">
              <thead className="bg-brand-neutral/5">
                <tr>
                  <th className="px-8 py-5 text-left w-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredPosts.length && filteredPosts.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-brand-plum/20 text-brand-plum focus:ring-brand-plum/20"
                    />
                  </th>
                  <th className="px-8 py-5 text-left text-[10px] font-bold text-brand-plum/30 uppercase tracking-[0.3em]">Article Context</th>
                  <th className="px-8 py-5 text-left text-[10px] font-bold text-brand-plum/30 uppercase tracking-[0.3em]">Lifecycle</th>
                  <th className="px-8 py-5 text-left text-[10px] font-bold text-brand-plum/30 uppercase tracking-[0.3em]">Timeline</th>
                  <th className="px-8 py-5 text-right text-[10px] font-bold text-brand-plum/30 uppercase tracking-[0.3em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-plum/5 bg-white">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-brand-neutral/20 transition-colors group">
                    <td className="px-8 py-6">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(post.id)}
                        onChange={() => toggleSelect(post.id)}
                        className="w-4 h-4 rounded border-brand-plum/20 text-brand-plum focus:ring-brand-plum/20"
                      />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="text-base font-bold text-brand-dark group-hover:text-brand-plum transition-colors tracking-tight font-display">
                          {post.title || post.draft_title || "Untitled"}
                        </div>
                        {post.is_featured && (
                          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-brand-plum text-white text-[9px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                            <Star className="w-3 h-3 fill-brand-gold text-brand-gold" />
                            Top
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-bold text-brand-plum/30 mt-2 uppercase tracking-[0.3em] flex items-center gap-2">
                        <LayoutGrid className="w-3.5 h-3.5" />
                        blog/{post.slug}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={cn(
                          "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                          post.status === "published" 
                            ? "bg-green-500/5 text-green-600 border-green-500/10" 
                            : "bg-brand-gold/5 text-brand-plum/60 border-brand-gold/20"
                        )}
                      >
                        {post.status === "published" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {post.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-[11px] font-bold text-brand-plum/40 uppercase tracking-[0.2em] italic">
                      {post.created_at}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/blog/${post.slug}`} 
                          target="_blank"
                          className="p-2.5 text-brand-plum/30 hover:text-brand-plum bg-brand-neutral/50 rounded-xl transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link 
                          href={`/admin/blog/${post.id}`} 
                          className="p-2.5 text-brand-plum/30 hover:text-brand-plum bg-brand-neutral/50 rounded-xl transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2.5 text-red-400/40 hover:text-red-500 bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPosts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-brand-neutral/50 rounded-2xl flex items-center justify-center border border-brand-plum/5">
                          <Filter className="w-10 h-10 text-brand-plum/20" />
                        </div>
                        <p className="text-brand-plum/40 font-bold uppercase tracking-[0.4em] text-[11px]">No articles matched your current filter</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
