import { getCmsPage } from "@/app/actions/cms";
import { cmsData as localCmsData } from "@/lib/cms-data";
import { CheckCircle2, Layout, Database, Workflow, UserCircle } from "lucide-react";

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

  const vbcIndexPage = {
    ...merge(localCmsData.vbcIndexPage, cmsContent.content),
    labels: merge(localCmsData.vbcIndexPage.labels, cmsContent.labels)
  };

  const pillars = [
    { title: "Data Integrity", icon: Database, description: "Cleaning and normalizing fragmented clinical data." },
    { title: "Clinical Integration", icon: Workflow, description: "Embedding insights directly into clinical workflows." },
    { title: "Financial Risk", icon: Layout, description: "Modeling performance against value-based contracts." },
    { title: "Patient Engagement", icon: UserCircle, description: "Driving behavior change at the point of care." },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero / Intro */}
      <section className="pt-24 pb-24 bg-white border-b border-brand-neutral overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-neutral/50 skew-x-[-12deg] translate-x-20" />
        {/* Soft Ring Motif Fragment */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] border-[40px] border-brand-plum/5 rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-8">
                <span className="px-4 py-1.5 bg-brand-plum/5 text-brand-plum text-[12px] font-bold uppercase tracking-[0.3em] rounded-full border border-brand-plum/10">Product Spotlight</span>
                <div className="h-px w-12 bg-brand-plum/20" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl mb-8 tracking-tight">
                {vbcIndexPage.headline}
              </h1>
              <p className="text-2xl md:text-3xl text-brand-plum/80 leading-relaxed max-w-2xl italic border-l-4 border-brand-gold pl-12">
                {vbcIndexPage.intro}
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="aspect-square bg-brand-dark rounded-2xl p-16 flex flex-col justify-center items-center relative overflow-hidden group shadow-bold">
                <div className="absolute inset-0 bg-brand-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-[14rem] font-display font-bold text-white/5 select-none absolute -bottom-12 -right-12 leading-none">VBC</div>
                <div className="grid grid-cols-2 gap-6 relative z-10 w-full h-full">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border border-white/10 rounded-xl bg-white/5 flex flex-col justify-end p-6 backdrop-blur-sm group-hover:border-brand-gold/30 transition-colors">
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-gold" style={{ width: `${30 + (i * 15)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Pillars */}
      <section className="py-20 lg:py-32 bg-brand-neutral/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pillar, i) => (
              <div key={i} className="brand-card group border-none shadow-subtle hover:shadow-bold">
                <div className="w-14 h-14 bg-brand-neutral/50 rounded-xl flex items-center justify-center mb-8 group-hover:bg-brand-plum transition-colors duration-500 shadow-sm">
                  <pillar.icon className="w-7 h-7 text-brand-plum group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl mb-4 text-brand-plum font-bold group-hover:translate-x-1 transition-transform">{pillar.title}</h3>
                <p className="text-brand-plum/80 text-lg leading-relaxed italic">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem & Approach - Higher Contrast */}
      <section className="py-20 lg:py-32 bg-white border-y border-brand-neutral">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div className="space-y-12">
              <div>
                <h2 className="text-[12px] font-bold uppercase tracking-[0.5em] text-brand-plum/70 mb-8">{vbcIndexPage.labels.problem}</h2>
                <p className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-brand-dark leading-tight italic">
                  "{vbcIndexPage.problem}"
                </p>
              </div>
            </div>
            <div className="space-y-12 lg:pt-16">
              <div>
                <h2 className="text-[12px] font-bold uppercase tracking-[0.5em] text-brand-plum/70 mb-8">{vbcIndexPage.labels.approach}</h2>
                <p className="text-xl md:text-2xl text-brand-plum/80 leading-relaxed italic border-l-4 border-brand-gold pl-12">
                  {vbcIndexPage.approach}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-32 lg:py-40 bg-brand-dark text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-plum opacity-30 skew-x-[-12deg] translate-x-20" />
        <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <h2 className="text-[12px] font-bold uppercase tracking-[0.6em] text-brand-gold mb-12">{vbcIndexPage.labels.whyItMatters}</h2>
          <p className="text-3xl md:text-4xl lg:text-[4.5rem] mb-16 tracking-tight leading-[1.1] italic font-display">
            "{vbcIndexPage.whyItMatters}"
          </p>
          <div className="flex justify-center items-center gap-10">
            <div className="h-px w-24 bg-white/10" />
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full bg-brand-gold shadow-sm" />
              ))}
            </div>
            <div className="h-px w-24 bg-white/10" />
          </div>
        </div>
      </section>
    </div>
  );
}
