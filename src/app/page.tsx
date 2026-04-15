import { getCmsPage } from "@/app/actions/cms";
import { getPublishedBlogPosts } from "@/app/actions/blog";
import { cmsData as localCmsData } from "@/lib/cms-data";
import HomeView from "@/components/HomeView";
import { BlogPost } from "@/types/blog";

export default async function Home() {
  // Try to fetch from DB
  const cmsContent = await getCmsPage('homepage');
  const publishedPosts = await getPublishedBlogPosts();

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

  // Merge DB content into local defaults for maximum resilience
  const data: any = {
    homepage: {
      ...localCmsData.homepage,
      hero: {
        headline: cmsContent.hero?.headline || localCmsData.homepage.hero.headline,
        subhead: cmsContent.hero?.subhead || localCmsData.homepage.hero.subhead,
        cta: cmsContent.hero?.cta || localCmsData.homepage.hero.cta,
        ctaUrl: cmsContent.hero?.ctaUrl || localCmsData.homepage.hero.ctaUrl,
      },
      valueProps: localCmsData.homepage.valueProps.map((prop, i) => {
        const cmsProp = cmsContent[`valueProp${i+1}`];
        return {
          data: cmsProp?.data || prop.data,
          headline: cmsProp?.headline || prop.headline,
          caption: cmsProp?.caption || prop.caption,
        };
      }),
      valuePropsCta: merge(localCmsData.homepage.valuePropsCta, cmsContent.valuePropsCta),
      vbcIndexSection: merge(localCmsData.homepage.vbcIndexSection, cmsContent.vbcIndexSection),
      featuredInsightSection: merge(localCmsData.homepage.featuredInsightSection, cmsContent.featuredInsightSection),
      testimonial: merge(localCmsData.homepage.testimonial, cmsContent.testimonial),
    }
  };

  return <HomeView data={data} blogPosts={publishedPosts as unknown as BlogPost[]} />;
}
