import { createClient } from "@/utils/supabase/server";
import { getCmsPage } from "@/app/actions/cms";
import { cmsData } from "@/lib/cms-data";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { BlogPost, BlogStatus } from "@/types/blog";

export default async function InsightsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const publishedPosts: BlogPost[] = (data || []).map((post: any) => ({
    id: post.id,
    title: post.title || post.draft_title || 'Untitled',
    description: post.description || '',
    content: post.content || post.draft_body || '',
    slug: post.slug,
    status: post.status as BlogStatus,
    is_featured: post.is_featured,
    publishedAt: post.published_at,
    createdAt: post.created_at,
  }));
    
  const { insightsPage: localInsightsPage } = cmsData;
  const cmsContent = await getCmsPage('insightsPage');

  // Helper to merge CMS content with local defaults, ignoring empty values
  const merge = (local: any, cms: any) => {
    if (!cms) return local;
    const result = { ...local };
    for (const key in cms) {
      if (cms[key] !== undefined && cms[key] !== null && cms[key] !== '') {
        result[key] = cms[key];
      }
    }
    return result;
  };

  const insightsPage = merge(localInsightsPage, cmsContent.content);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="pt-40 pb-32 bg-brand-neutral/20 border-b border-brand-neutral relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white skew-x-[-12deg] translate-x-20" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-12">
                <span className="px-3 py-1 bg-brand-dark text-white text-[10px] font-bold uppercase tracking-[0.4em]">Editorial</span>
                <div className="h-px w-12 bg-brand-dark/20" />
              </div>
              <h1 className="text-6xl lg:text-8xl mb-12">
                {insightsPage.headline}
              </h1>
              <p className="text-2xl text-gray-500 leading-relaxed italic border-l-4 border-brand-gold pl-12">
                Observations on healthcare product strategy, operational leverage, and the transition to value.
              </p>
            </div>
            <div className="hidden lg:block pb-4">
               <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-plum/40">AcquireNow</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-plum/40">Insights Dept.</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* List */}
      <section className="py-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {publishedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-32">
              {publishedPosts.map((post) => (
                <article key={post.id} className="group flex flex-col">
                  <div className="flex items-center gap-4 mb-10">
                    <Calendar className="w-4 h-4 text-brand-gold" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-plum/40">
                      {post.publishedAt}
                    </span>
                    <div className="h-px flex-1 bg-brand-neutral" />
                  </div>
                  <h2 className="text-4xl font-display font-bold text-brand-dark mb-8 group-hover:text-brand-plum transition-colors leading-tight italic">
                    <Link href={`/insights/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-gray-600 text-xl leading-relaxed mb-12 line-clamp-3 italic">
                    {post.description}
                  </p>
                  <div className="mt-auto">
                    <Link href={`/insights/${post.slug}`} className="brand-button-secondary transition-all group/btn">
                      {insightsPage.readMoreCta}
                      <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 border border-dashed border-brand-neutral">
              <p className="text-gray-500 text-xl italic">No articles published yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
