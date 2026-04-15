import { CMSData } from "@/types/cms";
import { BlogPost } from "@/types/blog";
import Link from "next/link";
import { ChevronRight, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface HomeViewProps {
  data: CMSData;
  blogPosts: BlogPost[];
}

export default function HomeView({ data, blogPosts }: HomeViewProps) {
  const { homepage } = data;

  // 1. Try to find explicitly featured posts
  const publishedFeaturedPosts = blogPosts
    .filter((post) => post.status === "published" && post.is_featured)
    .sort((a, b) => new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime());

  // 2. If none, try to find any published posts
  const anyPublishedPosts = blogPosts
    .filter((post) => post.status === "published")
    .sort((a, b) => new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime());

  // 3. Fallback logic: Featured > Latest > Null (show design with placeholder)
  const displayPost = publishedFeaturedPosts[0] || anyPublishedPosts[0];

  return (
    <div className="flex flex-col text-brand-dark overflow-x-hidden">
      {/* Hero Section - Textured Stage */}
      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 bg-white border-b border-brand-plum/10">
        {/* Architectural Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23522A6F' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        
        {/* Soft Ring Motif */}
        <div className="absolute top-0 right-0 w-2/3 h-full opacity-[0.06] pointer-events-none">
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] border-[60px] border-brand-plum rounded-full translate-x-1/4 -translate-y-1/4" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] border-[30px] border-brand-gold rounded-full translate-x-1/3 -translate-y-1/3" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out-expo">
            <div className="inline-flex items-center gap-3 mb-8">
              <span className="w-12 h-px bg-brand-gold" />
              <span className="text-[13px] font-bold uppercase tracking-[0.4em] text-brand-plum">{homepage.hero.badge}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] mb-8 tracking-tight leading-[1.05]">
              {homepage.hero.headline}
            </h1>

            <div className="flex flex-col md:flex-row md:items-start gap-8 mt-12">
              <div className="flex-shrink-0">
                <Link href="/work" className="brand-button-primary">
                  {homepage.hero.cta}
                  <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <p className="text-xl text-brand-plum/90 max-w-md leading-relaxed italic border-l-2 border-brand-gold pl-10 pt-2">
                {homepage.hero.subtext}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Unified Value Props Block - Higher Contrast */}
      <section className="py-24 bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none -z-10" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23fff'/%3E%3C/svg%3E")` }} />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-20">
            {homepage.valueProps.map((prop, i) => (
              <div 
                key={i} 
                className="group p-2 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out-expo"
                style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'both' }}
              >
                <div className="text-5xl lg:text-6xl font-bold text-brand-gold mb-6 font-display transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1 origin-left">
                  {prop.stat}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white leading-tight">
                  {prop.title}
                </h3>
                <p className="text-brand-neutral/80 leading-relaxed text-lg italic flex-grow">
                  {prop.description}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out-expo delay-500 fill-both">
            <Link href="/work" className="brand-button-inverted px-12 py-5 group">
              View All Work
              <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* VBC Index Preview - Tightened vertical spacing */}
      <section className="pt-20 pb-10 lg:pt-32 lg:pb-12 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="bg-brand-neutral/30 p-8 lg:p-20 relative overflow-hidden group border border-brand-neutral rounded-xl shadow-sm hover:shadow-bold transition-all duration-700">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/10 -m-64 rounded-full blur-3xl transition-opacity group-hover:opacity-20" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              <div className="lg:col-span-7 relative z-10">
                <div className="inline-flex items-center gap-4 mb-8">
                  <span className="px-3 py-1 bg-brand-dark text-white text-[12px] font-bold uppercase tracking-[0.3em] rounded-sm">New Product</span>
                  <div className="h-px w-12 bg-brand-dark/20" />
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl mb-8 font-display text-brand-dark leading-tight">
                  {homepage.vbcIndexSection.headline}
                </h2>
                <p className="text-xl md:text-2xl text-brand-plum/90 mb-12 leading-relaxed italic border-l-2 border-brand-plum pl-10">
                  {homepage.vbcIndexSection.description}
                </p>
                <Link href="/vbcindex" className="brand-button-primary group">
                  {homepage.vbcIndexSection.cta}
                  <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="lg:col-span-5 relative">
                <div className="aspect-square bg-brand-dark rounded-xl p-16 flex flex-col justify-between group overflow-hidden shadow-bold border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-plum/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-1 bg-brand-gold/30 w-12 transition-all duration-500 group-hover:bg-brand-gold/60" style={{ transitionDelay: `${i * 100}ms` }} />
                    ))}
                  </div>
                  <div className="font-display font-bold text-[12rem] text-white/5 select-none leading-none -ml-8 -mb-8 tracking-tighter transition-all duration-1000 group-hover:text-white/10 group-hover:scale-105">VBC</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Insight Section - Tightened top spacing */}
      <section className="pt-10 pb-24 lg:pt-12 bg-brand-neutral/30 border-t border-brand-plum/5 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end gap-12 mb-16 pb-8 border-b border-brand-plum/10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl leading-tight font-bold tracking-tight font-display animate-in fade-in slide-in-from-left-4 duration-700">
              {homepage.insightsPreview.headline}
            </h2>
          </div>
          
          <article className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center group">
            <div className="lg:col-span-7">
              <Link href={displayPost ? `/insights/${displayPost.slug}` : "/insights"} className="block overflow-hidden rounded-2xl shadow-bold border border-brand-plum/5 relative aspect-[16/9]">
                {displayPost?.featured_image_url ? (
                  <Image 
                    src={displayPost.featured_image_url} 
                    alt={displayPost.title || displayPost.draft_title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-brand-dark flex items-center justify-center p-20">
                      <div className="text-[10rem] font-display font-bold text-white/5 select-none leading-none tracking-tighter">INSIGHT</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </Link>
            </div>
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-3 mb-8">
                <Star className="w-5 h-5 text-brand-gold fill-brand-gold animate-pulse" />
                <span className="text-[13px] font-bold uppercase tracking-[0.5em] text-brand-gold">
                  {homepage.featuredInsightSection.headline}
                </span>
              </div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl mb-8 italic tracking-tight leading-tight font-display text-brand-dark font-bold group-hover:text-brand-plum transition-colors duration-500">
                "{displayPost?.title || displayPost?.draft_title || "Strategic Observations"}"
              </h3>
              <p className="text-brand-plum/90 text-xl mb-10 line-clamp-3 leading-relaxed italic">
                {displayPost?.description || "In-depth analysis of healthcare product strategy and value-based care delivery."}
              </p>
              <Link
                href={displayPost ? `/insights/${displayPost.slug}` : "/insights"}
                className="brand-button-primary group"
              >
                {homepage.featuredInsightSection.readArticleCta}
                <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* Testimonial Quote Section */}
      <section className="py-24 lg:py-32 bg-brand-dark text-white overflow-hidden relative border-t border-white/5">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-plum opacity-30 skew-x-[-12deg] translate-x-20" />
        <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <p className="text-3xl md:text-4xl lg:text-[4rem] mb-16 tracking-tight leading-[1.15] italic font-display animate-in fade-in zoom-in-95 duration-1000">
            "{homepage.testimonial.quote}"
          </p>
          <div className="flex justify-center items-center gap-10 opacity-50 group">
            <div className="h-px w-24 bg-white/20 transition-all duration-700 group-hover:w-32 group-hover:bg-brand-gold/40" />
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-brand-gold/60 shadow-sm transition-all duration-500 group-hover:bg-brand-gold group-hover:scale-125" style={{ transitionDelay: `${i * 100}ms` }} />
              ))}
            </div>
            <div className="h-px w-24 bg-white/20 transition-all duration-700 group-hover:w-32 group-hover:bg-brand-gold/40" />
          </div>
        </div>
      </section>
    </div>
  );
}
