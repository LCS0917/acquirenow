import { getCmsPage } from "@/app/actions/cms";
import { cmsData as localCmsData } from "@/lib/cms-data";
import { CheckCircle2, Layout, Database, Workflow, UserCircle, Zap, Shield, BarChart3, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function VBCIndexPage() {
  const cmsContent = await getCmsPage('vbcIndexPage');
  
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

  const content = merge(localCmsData.vbcIndexPage, cmsContent.content);
  
  const section1 = {
    headline: cmsContent.section1?.headline || localCmsData.vbcIndexPage.section1.headline,
    description: cmsContent.section1?.description || localCmsData.vbcIndexPage.section1.description,
    points: [
      { 
        title: cmsContent.section1?.p1Title || localCmsData.vbcIndexPage.section1.points[0].title, 
        description: cmsContent.section1?.p1Desc || localCmsData.vbcIndexPage.section1.points[0].description 
      },
      { 
        title: cmsContent.section1?.p2Title || localCmsData.vbcIndexPage.section1.points[1].title, 
        description: cmsContent.section1?.p2Desc || localCmsData.vbcIndexPage.section1.points[1].description 
      },
      { 
        title: cmsContent.section1?.p3Title || localCmsData.vbcIndexPage.section1.points[2].title, 
        description: cmsContent.section1?.p3Desc || localCmsData.vbcIndexPage.section1.points[2].description 
      },
      { 
        title: cmsContent.section1?.p4Title || localCmsData.vbcIndexPage.section1.points[3].title, 
        description: cmsContent.section1?.p4Desc || localCmsData.vbcIndexPage.section1.points[3].description 
      },
    ]
  };

  const section2 = {
    headline: cmsContent.section2?.headline || localCmsData.vbcIndexPage.section2.headline,
    description: cmsContent.section2?.description || localCmsData.vbcIndexPage.section2.description,
    points: [
      { 
        title: cmsContent.section2?.p1Title || localCmsData.vbcIndexPage.section2.points[0].title, 
        description: cmsContent.section2?.p1Desc || localCmsData.vbcIndexPage.section2.points[0].description 
      },
      { 
        title: cmsContent.section2?.p2Title || localCmsData.vbcIndexPage.section2.points[1].title, 
        description: cmsContent.section2?.p2Desc || localCmsData.vbcIndexPage.section2.points[1].description 
      },
      { 
        title: cmsContent.section2?.p3Title || localCmsData.vbcIndexPage.section2.points[2].title, 
        description: cmsContent.section2?.p3Desc || localCmsData.vbcIndexPage.section2.points[2].description 
      },
      { 
        title: cmsContent.section2?.p4Title || localCmsData.vbcIndexPage.section2.points[3].title, 
        description: cmsContent.section2?.p4Desc || localCmsData.vbcIndexPage.section2.points[3].description 
      },
    ]
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero / Intro */}
      <section className="pt-24 pb-24 bg-white border-b border-brand-neutral overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-neutral/50 skew-x-[-12deg] translate-x-20" />
        {/* Soft Ring Motif Fragment */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] border-[40px] border-brand-plum/5 rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 animate-in fade-in slide-in-from-left-8 duration-1000 ease-out-expo">
              <div className="flex items-center gap-4 mb-8">
                <span className="px-4 py-1.5 bg-brand-plum/5 text-brand-plum text-[12px] font-bold uppercase tracking-[0.3em] rounded-full border border-brand-plum/10">
                  {content.badge}
                </span>
                <div className="h-px w-12 bg-brand-plum/20" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl mb-8 tracking-tight">
                {content.headline}
              </h1>
              <p className="text-2xl md:text-3xl text-brand-plum/80 leading-relaxed max-w-2xl italic border-l-4 border-brand-gold pl-12 mb-12">
                {content.intro}
              </p>
              <Link href="mailto:lena@acquirenowhq.com" target="_blank" rel="noopener noreferrer" className="brand-button-primary group">
                {content.ctaTop}
                <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="lg:col-span-5 animate-in fade-in zoom-in-95 duration-1000 delay-300 fill-both">
              <div className="aspect-square bg-brand-dark rounded-2xl p-16 flex flex-col justify-center items-center relative overflow-hidden group shadow-bold border border-white/5">
                <div className="absolute inset-0 bg-brand-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="text-[14rem] font-display font-bold text-white/5 select-none absolute -bottom-12 -right-12 leading-none transition-all duration-1000 group-hover:scale-110 group-hover:text-white/10">VBC</div>
                <div className="grid grid-cols-2 gap-6 relative z-10 w-full h-full">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border border-white/10 rounded-xl bg-white/5 flex flex-col justify-end p-6 backdrop-blur-sm group-hover:border-brand-gold/30 transition-all duration-500 hover:scale-105">
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-gold transition-all duration-1000 delay-500" style={{ width: `${30 + (i * 15)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: More Intelligence. Less Friction. */}
      <section className="py-24 bg-brand-neutral/20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-5">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-8 leading-tight">
                {section1.headline}
              </h2>
              <p className="text-xl text-brand-plum/80 leading-relaxed italic border-l-4 border-brand-gold pl-8">
                {section1.description}
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {section1.points.map((point, i) => (
                  <div 
                    key={i} 
                    className="brand-card bg-white/80 backdrop-blur-sm border-none shadow-subtle hover:shadow-bold transition-all duration-500 hover:-translate-y-1"
                  >
                    <h3 className="text-xl font-bold text-brand-plum mb-4 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                      {point.title}
                    </h3>
                    <p className="text-brand-plum/80 leading-relaxed text-base italic">{point.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: The Era of the Mini-Product */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {section2.points.map((point, i) => (
                  <div 
                    key={i} 
                    className="brand-card bg-brand-neutral/30 border-none shadow-none hover:shadow-subtle transition-all duration-500 hover:-translate-y-1"
                  >
                    <h3 className="text-xl font-bold text-brand-plum mb-4 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                      {point.title}
                    </h3>
                    <p className="text-brand-plum/80 leading-relaxed text-base italic">{point.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-8 leading-tight">
                {section2.headline}
              </h2>
              <p className="text-xl text-brand-plum/80 leading-relaxed italic border-l-4 border-brand-gold pl-8">
                {section2.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-brand-dark text-white overflow-hidden relative border-t border-brand-plum/10">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-plum opacity-20 skew-x-[-12deg] translate-x-20" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 tracking-tight italic font-display">
            {content.bottomCtaHeadline}
          </h2>
          <Link href="mailto:lena@acquirenowhq.com" target="_blank" rel="noopener noreferrer" className="brand-button-inverted px-12 py-5 text-lg group">
            {content.ctaBottom}
            <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
