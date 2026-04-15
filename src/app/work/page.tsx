import { getCmsPage } from "@/app/actions/cms";
import { cmsData as localCmsData } from "@/lib/cms-data";
import { ChevronRight } from "lucide-react";

export default async function WorkPage() {
  const cmsContent = await getCmsPage('workPage');

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
  
  const workPage = {
    ...localCmsData.workPage,
    headline: cmsContent.header?.headline || localCmsData.workPage.headline,
    description: cmsContent.header?.description || localCmsData.workPage.description,
    labels: merge(localCmsData.workPage.labels, cmsContent.labels)
  };

  const howItWorksSteps = localCmsData.workPage.howItWorks.map((step, i) => 
    merge(step, cmsContent[`howItWorksStep${i+1}`])
  );

  const entries = localCmsData.workPage.entries.map((entry, i) => {
    const cmsEntry = cmsContent[`entry${i+1}`];
    return {
      ...entry,
      company: cmsEntry?.company || entry.company,
      title: cmsEntry?.title || entry.title,
      problem: cmsEntry?.problem || entry.problem,
      approach: cmsEntry?.approach || entry.approach,
      outcome: cmsEntry?.outcome || entry.outcome,
    };
  });

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-24 pb-20 border-b border-brand-neutral relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-neutral/30 skew-x-[-12deg] translate-x-20" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-7xl mb-8 tracking-tight animate-in fade-in slide-in-from-left-4 duration-700">
            {workPage.headline}
          </h1>
          <p className="text-xl md:text-2xl text-brand-plum/80 max-w-3xl leading-relaxed italic border-l-2 border-brand-gold pl-12 animate-in fade-in slide-in-from-left-4 duration-700 delay-150 fill-both">
            {workPage.description}
          </p>
        </div>
      </section>

      {/* How It Works Steps (Moved from Homepage) */}
      <section className="py-16 lg:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, i) => (
              <div 
                key={i} 
                className="brand-card group border-none bg-brand-neutral/20 shadow-none hover:shadow-subtle transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 fill-both"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <span className="text-[12px] font-bold text-brand-plum/80 uppercase tracking-[0.4em] mb-8 block group-hover:text-brand-gold transition-colors duration-500">
                  Step 0{i + 1}
                </span>
                <h3 className="text-2xl mb-4 text-brand-plum font-bold group-hover:translate-x-1 transition-transform duration-500">{step.title}</h3>
                <p className="text-brand-plum/90 leading-relaxed italic text-lg">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Entries */}
      <section className="py-24 bg-brand-neutral/20 border-t border-brand-neutral">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col gap-32 lg:gap-40">
            {entries.map((entry, index) => (
              <article key={entry.id} id={entry.slug} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative group/article">
                <div className="lg:col-span-5 lg:sticky lg:top-40 lg:self-start">
                  <div className="flex items-center gap-6 mb-8">
                    <span className="text-[12px] font-bold text-brand-plum/70 uppercase tracking-[0.4em]">Case 0{index + 1}</span>
                    <div className="h-px flex-1 bg-brand-plum/20 group-hover/article:bg-brand-gold transition-colors duration-700" />
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6 group-hover/article:text-brand-plum transition-colors leading-tight text-brand-dark font-display font-bold">
                    {entry.company}
                  </h2>
                  <div className="flex items-center gap-3 text-brand-plum">
                    <div className="w-8 h-px bg-brand-gold" />
                    <p className="font-bold text-[12px] uppercase tracking-[0.3em]">{entry.title}</p>
                  </div>
                </div>
                
                <div className="lg:col-span-7 flex flex-col gap-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                    <div className="space-y-6">
                      <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-brand-plum/70 border-b border-brand-neutral pb-4 group-hover/article:border-brand-gold/30 transition-colors">
                        {workPage.labels.problem}
                      </h3>
                      <p className="text-xl text-brand-plum/90 leading-relaxed italic">
                        {entry.problem}
                      </p>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-brand-plum/70 border-b border-brand-neutral pb-4 group-hover/article:border-brand-gold/30 transition-colors">
                        {workPage.labels.approach}
                      </h3>
                      <p className="text-xl text-brand-plum/90 leading-relaxed italic">
                        {entry.approach}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-brand-dark p-10 lg:p-12 relative overflow-hidden group shadow-bold rounded-xl border border-white/5 transition-all duration-700 group-hover/article:shadow-plum">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/5 -m-24 rounded-full blur-3xl group-hover:bg-brand-gold/10 transition-colors" />
                    <div className="relative z-10">
                      <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-brand-gold/60 mb-8 flex items-center gap-3">
                        <div className="w-6 h-px bg-brand-gold/40" />
                        {workPage.labels.outcome}
                      </h3>
                      <p className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white leading-tight italic">
                        "{entry.outcome}"
                      </p>
                    </div>
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
