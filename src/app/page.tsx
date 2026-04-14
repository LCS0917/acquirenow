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
      hero: merge(localCmsData.homepage.hero, cmsContent.hero),
      valueProps: localCmsData.homepage.valueProps.map((prop, i) => 
        merge(prop, cmsContent[`valueProp${i+1}`])
      ),
      howItWorksHeadline: cmsContent.howItWorksHeadline?.howItWorksHeadline || localCmsData.homepage.howItWorksHeadline,
      howItWorksSubtext: cmsContent.howItWorksHeadline?.subtext || localCmsData.homepage.howItWorksSubtext,
      howItWorks: localCmsData.homepage.howItWorks.map((step, i) => 
        merge(step, cmsContent[`howItWorksStep${i+1}`])
      ),
      vbcIndexSection: merge(localCmsData.homepage.vbcIndexSection, cmsContent.vbcIndexSection),
      featuredInsightSection: merge(localCmsData.homepage.featuredInsightSection, cmsContent.featuredInsightSection),
      workPreviewHeadline: cmsContent.workPreviewHeadline?.workPreviewHeadline || localCmsData.homepage.workPreviewHeadline,
      workPreviewAllCasesLabel: cmsContent.workPreviewHeadline?.workPreviewCta || localCmsData.homepage.workPreviewAllCasesLabel,
      workPreviewCaseStudyLabel: cmsContent.workPreviewHeadline?.caseStudyLabel || localCmsData.homepage.workPreviewCaseStudyLabel,
    }
  };

  return <HomeView data={data} blogPosts={publishedPosts as unknown as BlogPost[]} />;
}
