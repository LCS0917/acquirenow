import { getCmsPage } from "@/app/actions/cms";
import { cmsData as localCmsData } from "@/lib/cms-data";
import { ArrowRight, User as UserIcon, Mail } from "lucide-react";
import Link from "next/link";

export default async function AboutPage() {
  const cmsContent = await getCmsPage('about');
  
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

  // Combine DB and local content
  const about = {
    ...localCmsData.aboutPage,
    headline: cmsContent.bio?.headline || localCmsData.aboutPage.headline,
    summary: cmsContent.bio?.summary || localCmsData.aboutPage.summary,
    highlightsHeadline: cmsContent.highlights?.headline || localCmsData.aboutPage.highlightsHeadline,
    highlights: [
      cmsContent.highlights?.h1 || localCmsData.aboutPage.highlights[0],
      cmsContent.highlights?.h2 || localCmsData.aboutPage.highlights[1],
      cmsContent.highlights?.h3 || localCmsData.aboutPage.highlights[2],
      cmsContent.highlights?.h4 || localCmsData.aboutPage.highlights[3],
    ],
    connectSection: merge(localCmsData.aboutPage.connectSection, cmsContent.connectSection)
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="pt-20 pb-24 border-b border-brand-neutral overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-neutral/50 skew-x-[-12deg] translate-x-20" />
        {/* Soft Ring Motif Fragment */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] border-[30px] border-brand-plum/5 rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            <div className="lg:col-span-5">
              <div className="aspect-[4/5] bg-brand-dark rounded-2xl overflow-hidden shadow-bold relative group border border-white/5">
                {/* Visual Image Treatment */}
                <div className="absolute inset-0 bg-brand-plum opacity-40 group-hover:opacity-50 transition-opacity duration-700" />
                
                {/* Decorative Soft Ring Motif in the Image */}
                <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] border-[20px] border-brand-gold rounded-full translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute bottom-0 left-0 w-[300px] h-[300px] border-[10px] border-white rounded-full -translate-x-1/2 translate-y-1/2 opacity-30" />
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="text-white/5 font-display font-bold text-[12rem] rotate-90 select-none uppercase leading-none tracking-tighter transition-all duration-1000 group-hover:scale-110 group-hover:text-white/10">
                     Lead
                   </div>
                </div>

                <div className="absolute bottom-10 left-10 right-10 z-10">
                   <div className="h-px w-12 bg-brand-gold mb-6 group-hover:w-20 transition-all duration-700" />
                   <p className="text-white font-bold text-[14px] uppercase tracking-[0.4em] drop-shadow-md">Strategic Operations</p>
                </div>
                
                {/* Subtle Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-plum/20 to-transparent" />
              </div>
            </div>
            <div className="lg:col-span-7">
              <h1 className="text-4xl md:text-5xl lg:text-7xl mb-8 tracking-tight">
                {about.headline}
              </h1>
              <p className="text-xl md:text-2xl text-brand-plum/80 leading-relaxed italic border-l-4 border-brand-gold pl-10 max-w-2xl">
                {about.summary}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Highlights */}
      <section className="py-20 lg:py-32 bg-brand-neutral/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16">
             <h2 className="text-[12px] font-bold uppercase tracking-[0.6em] text-brand-plum/80">
               {about.highlightsHeadline}
             </h2>
             <div className="h-px flex-1 bg-brand-plum/10 hidden md:block" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-20">
            {about.highlights.map((highlight, i) => (
              <div key={i} className="flex gap-12 group">
                <div className="text-6xl font-display font-bold text-brand-plum/30 transition-colors group-hover:text-brand-gold">
                  0{i + 1}
                </div>
                <div className="pt-4">
                  <p className="text-xl md:text-2xl text-brand-plum/90 leading-relaxed italic group-hover:text-brand-dark transition-colors">{highlight}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect */}
      <section className="py-32 bg-white px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-brand-dark text-white p-12 lg:p-24 relative overflow-hidden group rounded-[2.5rem] lg:rounded-[4rem] shadow-bold border border-white/5">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-plum opacity-30 -m-64 rounded-full blur-3xl transition-opacity group-hover:opacity-50" />
            <div className="relative z-10 max-w-3xl text-brand-neutral">
              <h2 className="text-4xl md:text-5xl lg:text-7xl mb-8 tracking-tight text-white">
                {about.connectSection.headline}
              </h2>
              <p className="text-xl md:text-2xl text-brand-neutral/70 mb-12 leading-relaxed italic border-l-2 border-brand-gold/50 pl-10">
                {about.connectSection.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-8">
                <a
                  href="mailto:lena@acquirenowhq.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brand-button-inverted shadow-bold"
                >
                  {about.connectSection.cta}
                  <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="https://www.linkedin.com/in/lenacshaw/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-3.5 font-bold text-sm uppercase tracking-widest rounded-xl border-2 border-white text-white hover:bg-white hover:text-brand-dark transition-all duration-300"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
