import { CMSData } from "@/types/cms";
import { BlogPost } from "@/types/blog";
import Link from "next/link";
import { ChevronRight, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface HomeViewProps {
  data: CMSData;
  blogPosts: BlogPost[];
}

export default function HomeView({ data, blogPosts }: HomeViewProps) {
  const { homepage } = data;

  const publishedFeaturedPosts = blogPosts
    .filter((post) => post.status === "published" && post.is_featured)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const mainFeaturedPost = publishedFeaturedPosts[0];

  const previewInsights = blogPosts
    .filter((post) => post.status === "published")
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 2);

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
      <section className="py-16 bg-brand-dark text-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {homepage.valueProps.map((prop, i) => (
              <div key={i} className="group p-2">
                <div className="w-12 h-px bg-brand-gold/60 mb-8 group-hover:w-20 transition-all duration-700" />
                <h3 className="text-2xl font-bold mb-4 text-white leading-tight">
                  {prop.title}
                </h3>
                <p className="text-brand-neutral/80 leading-relaxed text-lg italic">
                  {prop.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32 bg-brand-neutral/30 border-y border-brand-plum/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-16">
            <div className="max-w-2xl text-brand-dark">
              <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6 font-display">
                {homepage.howItWorksHeadline}
              </h2>
              <p className="text-brand-plum/90 text-xl italic border-l-2 border-brand-gold pl-8">
                {homepage.howItWorksSubtext}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homepage.howItWorks.map((step, i) => (
              <div key={i} className="brand-card group">
                <span className="text-[12px] font-bold text-brand-plum/80 uppercase tracking-[0.4em] mb-8 block">
                  Step 0{i + 1}
                </span>
                <h3 className="text-2xl mb-4 text-brand-plum font-bold">{step.title}</h3>
                <p className="text-brand-plum/90 leading-relaxed italic text-lg">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VBC Index Preview - Restored Earlier Style */}
      <section className="py-20 lg:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="bg-brand-neutral/30 p-8 lg:p-20 relative overflow-hidden group border border-brand-neutral rounded-xl shadow-sm">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/10 -m-64 rounded-full blur-3xl" />
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
                <Link href="/vbcindex" className="brand-button-primary">
                  {homepage.vbcIndexSection.cta}
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
              <div className="lg:col-span-5 relative">
                <div className="aspect-square bg-brand-dark rounded-xl p-16 flex flex-col justify-between group overflow-hidden shadow-bold">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-plum/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-1 bg-brand-gold/30 w-12" />
                    ))}
                  </div>
                  <div className="font-display font-bold text-[12rem] text-white/5 select-none leading-none -ml-8 -mb-8 tracking-tighter">VBC</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Insight Section - High Contrast Editorial */}
      {mainFeaturedPost && (
        <section className="py-24 lg:py-40 bg-brand-plum text-white relative overflow-hidden px-6">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="absolute top-1/2 left-0 w-full h-px bg-white -skew-y-12" />
             <div className="absolute top-1/2 left-0 w-full h-px bg-white skew-y-12" />
          </div>
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
            <div className="inline-flex items-center gap-3 mb-8">
              <Star className="w-5 h-5 text-brand-gold fill-brand-gold" />
              <span className="text-[13px] font-bold uppercase tracking-[0.5em] text-brand-gold">
                {homepage.featuredInsightSection.headline}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-[5rem] mb-12 italic tracking-tight leading-[1.1] font-display text-white">
              "{mainFeaturedPost.title}"
            </h2>
            <Link
              href={`/insights/${mainFeaturedPost.slug}`}
              className="brand-button-inverted px-12 py-5"
            >
              {homepage.featuredInsightSection.readArticleCta}
              <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      )}

      {/* Work Preview - Restored Earlier Style */}
      <section className="py-20 lg:py-32 bg-white px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16 pb-8 border-b border-brand-neutral">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6 font-bold text-brand-plum tracking-tight font-display">
                {homepage.workPreviewHeadline}
              </h2>
              <p className="text-brand-plum/90 italic text-2xl border-l-2 border-brand-gold pl-8">Selected initiatives</p>
            </div>
            <Link href="/work" className="text-[12px] md:text-[13px] font-bold uppercase tracking-[0.3em] text-brand-plum hover:text-brand-dark transition-colors border-b-2 border-brand-gold pb-2">
              {homepage.workPreviewAllCasesLabel}
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-16 lg:gap-24">
            {homepage.workPreview.map((work) => (
              <div key={work.id} className="group grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative">
                {/* Sticky Left Column */}
                <div className="lg:col-span-5 lg:sticky lg:top-40 lg:self-start">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[12px] font-bold text-brand-plum uppercase tracking-[0.5em]">
                      {work.company}
                    </span>
                    <div className="h-px flex-1 bg-brand-neutral" />
                  </div>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl mb-6 group-hover:text-brand-plum transition-colors leading-tight text-brand-dark font-display">
                    {work.title}
                  </h3>
                  <Link href={`/work#${work.slug}`} className="inline-flex items-center text-[12px] font-bold uppercase tracking-[0.4em] group/link text-brand-plum hover:text-brand-plum transition-colors border-b border-transparent hover:border-brand-gold/50 pb-1">
                    {homepage.workPreviewCaseStudyLabel}
                    <ChevronRight className="ml-2 w-3 h-3 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
                <div className="lg:col-span-7 pt-8 lg:pt-12 border-t lg:border-t-0 lg:border-l border-brand-neutral lg:pl-16">
                  <p className="text-brand-dark text-xl md:text-2xl lg:text-3xl leading-relaxed italic border-l-4 border-brand-gold pl-10">
                    {work.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insights Preview */}
      <section className="py-20 lg:py-32 bg-brand-neutral/30 border-t border-brand-plum/5 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-16">
            <div className="max-w-2xl text-brand-dark">
              <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight font-bold tracking-tight font-display">
                {homepage.insightsPreview.headline}
              </h2>
              <p className="text-brand-plum/90 text-xl leading-relaxed italic border-l-2 border-brand-gold pl-10">
                {homepage.featuredInsightSection.description}
              </p>
            </div>
            <Link href="/insights" className="brand-button-secondary bg-white border-brand-dark/10">
              {homepage.featuredInsightSection.viewAllCta}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {previewInsights.map((post) => (
              <article key={post.id} className="brand-card group">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="px-3 py-1 bg-brand-gold/20 text-brand-plum text-[12px] font-bold uppercase tracking-[0.2em] rounded-full">
                      Article
                    </div>
                    <div className="h-px flex-1 bg-brand-plum/10" />
                  </div>
                  <h3 className="text-2xl md:text-3xl mb-6 italic leading-snug group-hover:text-brand-plum transition-colors font-display text-brand-dark font-bold">
                    {post.title}
                  </h3>
                  <p className="text-brand-plum/90 text-lg mb-8 line-clamp-3 leading-relaxed italic">{post.description}</p>
                  <div className="mt-auto pt-8 border-t border-brand-plum/10">
                    <Link href={`/insights/${post.slug}`} className="text-[12px] font-bold uppercase tracking-[0.4em] inline-flex items-center group/link text-brand-plum hover:text-brand-plum transition-all duration-500">
                      {homepage.featuredInsightSection.readArticleCta}
                      <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover/link:translate-x-2" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
