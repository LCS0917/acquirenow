import { createClient } from "@/utils/supabase/server";
import { getCmsPage } from "@/app/actions/cms";
import { cmsData as localCmsData } from "@/lib/cms-data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import React from "react";
import { BlogPost, BlogStatus } from "@/types/blog";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: postData, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!postData || error) {
    notFound();
  }

  const post: BlogPost = {
    ...postData,
    title: postData.title || postData.draft_title || 'Untitled',
    description: postData.description || '',
    content: postData.content || postData.draft_body || '',
  };

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

  const insightsPage = merge(localCmsData.insightsPage, cmsContent.content);

  return (
    <article className="bg-white min-h-screen">
      {/* Header */}
      <header className="pt-24 pb-20 bg-brand-neutral/20 border-b border-brand-neutral relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white skew-x-[-12deg] translate-x-20" />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">
          <Link href="/blog" className="text-[12px] font-bold uppercase tracking-[0.4em] text-brand-plum/80 hover:text-brand-plum transition-colors flex items-center gap-3 mb-12 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {insightsPage.backToInsightsCta}
          </Link>
          
          <div className="flex items-center gap-8 mb-8">
            <div className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.4em] text-brand-plum/70">
              <Calendar className="w-4 h-4 text-brand-gold" />
              {post.published_at}
            </div>
            <div className="h-px w-12 bg-brand-neutral" />
            <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-brand-plum/70 italic">5 min read</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-7xl mb-12 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed italic border-l-4 border-brand-gold pl-12 max-w-3xl">
            {post.description}
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <div 
            className="prose prose-lg md:prose-xl max-w-none 
              prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight 
              prose-p:text-lg md:text-xl prose-p:leading-relaxed prose-p:text-gray-800 prose-p:italic
              prose-blockquote:border-brand-gold prose-blockquote:bg-brand-neutral/20 prose-blockquote:p-8 md:p-12 prose-blockquote:not-italic prose-blockquote:text-2xl md:text-3xl prose-blockquote:font-display prose-blockquote:font-bold prose-blockquote:text-brand-dark
              prose-strong:text-brand-plum prose-strong:font-bold
              prose-a:text-brand-plum prose-a:font-bold prose-a:no-underline hover:prose-a:text-brand-dark transition-colors border-b-2 border-brand-gold/30 hover:border-brand-gold"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
          
          <div className="mt-24 pt-16 border-t border-brand-neutral flex flex-col items-center text-center">
             <div className="relative h-16 w-40 mb-8 transition-transform hover:scale-105">
                <img 
                  src="/assets/logo-color.png" 
                  alt="AcquireNow" 
                  className="h-full w-auto object-contain"
                />
             </div>
            <h3 className="text-3xl mb-4">Lena Shaw</h3>
            <p className="text-xl text-gray-700 max-w-md mb-8 italic leading-relaxed">
              Healthcare operator specialized in product strategy, go-to-market execution, and value-based care delivery.
            </p>
            <Link href="/about" className="brand-button-primary bg-brand-plum hover:bg-brand-dark">
              Learn More About Lena
              <ArrowRight className="ml-3 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
