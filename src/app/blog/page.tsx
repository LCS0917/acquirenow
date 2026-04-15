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
    ...post,
    title: post.title || post.draft_title || 'Untitled',
    description: post.description || '',
    content: post.content || post.draft_body || '',
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

  const insightsPage = {
    ...localInsightsPage,
    headline: cmsContent.content?.headline || localInsightsPage.headline,
    description: cmsContent.content?.description || localInsightsPage.description,
    brandingText: cmsContent.content?.brandingText || localInsightsPage.brandingText,
    readMoreCta: cmsContent.content?.readMoreCta || localInsightsPage.readMoreCta,
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="pt-24 pb-20 bg-brand-neutral/20 border-b border-brand-neutral relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white skew-x-[-12deg] translate-x-20" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-7xl mb-8 tracking-tight">
                {insightsPage.headline}
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed italic border-l-4 border-brand-gold pl-12">
                {insightsPage.description}
              </p>
            </div>
            <div className="hidden lg:block pb-4">
               <div className="flex flex-col items-end gap-2">
                  <span className="text-[12px] font-bold uppercase tracking-[0.5em] text-brand-plum/70">AcquireNow</span>
                  <span className="text-[12px] font-bold uppercase tracking-[0.5em] text-brand-plum/70">
                    {insightsPage.brandingText}
                  </span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* List */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {publishedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
              {publishedPosts.map((post) => (
                <article key={post.id} className="group flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <Calendar className="w-4 h-4 text-brand-gold" />
                    <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-brand-plum/70">
                      {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Recently Published'}
                    </span>
                    <div className="h-px flex-1 bg-brand-neutral" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-dark mb-4 group-hover:text-brand-plum transition-colors leading-tight italic">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-gray-800 text-lg md:text-xl leading-relaxed mb-8 line-clamp-3 italic">
                    {post.description}
                  </p>
                  <div className="mt-auto">
                    <Link href={`/blog/${post.slug}`} className="brand-button-secondary transition-all group/btn">
                      {insightsPage.readMoreCta}
                      <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-dashed border-brand-neutral">
              <p className="text-gray-700 text-xl italic">No articles published yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
