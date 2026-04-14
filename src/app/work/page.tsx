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
    labels: merge(localCmsData.workPage.labels, cmsContent.labels)
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-40 pb-32 border-b border-brand-neutral relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-neutral/30 skew-x-[-12deg] translate-x-20" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <h1 className="text-6xl lg:text-8xl mb-12 tracking-tight">
            {workPage.headline}
          </h1>
          <p className="text-2xl text-brand-plum/50 max-w-3xl leading-relaxed italic border-l-2 border-brand-gold pl-12">
            A selection of strategic operations and product initiatives across the healthcare continuum.
          </p>
        </div>
      </section>

      {/* Entries */}
      <section className="py-40 bg-brand-neutral/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col gap-56 lg:gap-72">
            {workPage.entries.map((entry, index) => (
              <article key={entry.id} id={entry.slug} className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32 relative">
                <div className="lg:col-span-5 lg:sticky lg:top-40 lg:self-start">
                  <div className="flex items-center gap-6 mb-12">
                    <span className="text-[11px] font-bold text-brand-plum/40 uppercase tracking-[0.4em]">Case 0{index + 1}</span>
                    <div className="h-px flex-1 bg-brand-plum/10" />
                  </div>
                  <h2 className="text-5xl lg:text-6xl mb-8 group-hover:text-brand-plum transition-colors leading-tight text-brand-dark font-display font-bold">
                    {entry.company}
                  </h2>
                  <div className="flex items-center gap-3 text-brand-plum">
                    <div className="w-8 h-px bg-brand-gold" />
                    <p className="font-bold text-xs uppercase tracking-[0.3em]">{entry.title}</p>
                  </div>
                </div>
                
                <div className="lg:col-span-7 flex flex-col gap-24">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
                    <div className="space-y-8">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-plum/30 border-b border-brand-neutral pb-4">
                        {workPage.labels.problem}
                      </h3>
                      <p className="text-xl text-brand-plum/70 leading-relaxed italic">
                        {entry.problem}
                      </p>
                    </div>
                    <div className="space-y-8">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-plum/30 border-b border-brand-neutral pb-4">
                        {workPage.labels.approach}
                      </h3>
                      <p className="text-xl text-brand-plum/70 leading-relaxed italic">
                        {entry.approach}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-brand-dark p-12 lg:p-16 relative overflow-hidden group shadow-bold rounded-xl border border-white/5">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/5 -m-24 rounded-full blur-3xl group-hover:bg-brand-gold/10 transition-colors" />
                    <div className="relative z-10">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-gold/60 mb-10 flex items-center gap-3">
                        <div className="w-6 h-px bg-brand-gold/40" />
                        {workPage.labels.outcome}
                      </h3>
                      <p className="text-3xl lg:text-4xl font-display font-bold text-white leading-tight italic">
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
