export type BlogStatus = 'idea' | 'draft' | 'published';

export interface CmsPage {
  page_key: string;
  section_key: string;
  content: Record<string, any>;
  updated_at: string;
}

export interface CmsField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'url';
  placeholder?: string;
}

export interface CmsSectionDefinition {
  section_key: string;
  label: string;
  group?: string;
  fields: CmsField[];
}

export interface CmsPageDefinition {
  page_key: string;
  label: string;
  sections: CmsSectionDefinition[];
}

export const CMS_PAGE_DEFINITIONS: CmsPageDefinition[] = [
  {
    page_key: 'homepage',
    label: 'Homepage',
    sections: [
      {
        section_key: 'hero',
        label: 'Hero Section',
        group: 'Hero',
        fields: [
          { key: 'headline', label: 'Headline', type: 'textarea' },
          { key: 'subtext', label: 'Subtext', type: 'textarea' },
          { key: 'cta', label: 'Call to Action', type: 'text' },
        ]
      },
      {
        section_key: 'valueProp1',
        label: 'Value Prop 1',
        group: 'Value Propositions',
        fields: [
          { key: 'stat', label: 'Stat (e.g. 10X)', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ]
      },
      {
        section_key: 'valueProp2',
        label: 'Value Prop 2',
        group: 'Value Propositions',
        fields: [
          { key: 'stat', label: 'Stat (e.g. $30M+)', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ]
      },
      {
        section_key: 'valueProp3',
        label: 'Value Prop 3',
        group: 'Value Propositions',
        fields: [
          { key: 'stat', label: 'Stat (e.g. 13+ years)', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ]
      },
      {
        section_key: 'howItWorksHeadline',
        label: 'Header & Intro',
        group: 'How It Works',
        fields: [
          { key: 'howItWorksHeadline', label: 'Headline', type: 'text' },
          { key: 'subtext', label: 'Subtext Label', type: 'text' },
        ]
      },
      {
        section_key: 'howItWorksStep1',
        label: 'Step 1',
        group: 'How It Works',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ]
      },
      {
        section_key: 'howItWorksStep2',
        label: 'Step 2',
        group: 'How It Works',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ]
      },
      {
        section_key: 'howItWorksStep3',
        label: 'Step 3',
        group: 'How It Works',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ]
      },
      {
        section_key: 'vbcIndexSection',
        label: 'VBC Index Preview',
        group: 'Product Features',
        fields: [
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'cta', label: 'Button Label', type: 'text' },
        ]
      },
      {
        section_key: 'featuredInsightSection',
        label: 'Insights Section',
        group: 'Product Features',
        fields: [
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'description', label: 'Section Intro', type: 'textarea' },
          { key: 'viewAllCta', label: 'View All Text', type: 'text' },
          { key: 'readArticleCta', label: 'Read Article Text', type: 'text' },
        ]
      },
      {
        section_key: 'workPreviewHeadline',
        label: 'Work Preview Header',
        group: 'Work Preview',
        fields: [
          { key: 'workPreviewHeadline', label: 'Headline', type: 'text' },
          { key: 'workPreviewCta', label: 'All Cases Label', type: 'text' },
          { key: 'caseStudyLabel', label: 'Case Study Link Label', type: 'text' },
        ]
      },
      {
        section_key: 'testimonial',
        label: 'Quote Section',
        group: 'Footer Content',
        fields: [
          { key: 'quote', label: 'Quote Text', type: 'textarea' },
        ]
      }
    ]
  },
  {
    page_key: 'workPage',
    label: 'Work Page',
    sections: [
      {
        section_key: 'header',
        label: 'Page Header',
        fields: [
          { key: 'headline', label: 'Headline', type: 'text' },
        ]
      },
      {
        section_key: 'labels',
        label: 'Labels',
        fields: [
          { key: 'problem', label: 'Problem Label', type: 'text' },
          { key: 'approach', label: 'Approach Label', type: 'text' },
          { key: 'outcome', label: 'Outcome Label', type: 'text' },
        ]
      }
    ]
  },
  {
    page_key: 'vbcIndexPage',
    label: 'VBC Index Page',
    sections: [
      {
        section_key: 'content',
        label: 'Main Header',
        fields: [
          { key: 'headline', label: 'Hero Headline', type: 'text' },
          { key: 'intro', label: 'Hero Introduction', type: 'textarea' },
          { key: 'ctaTop', label: 'Top Button Text', type: 'text' },
          { key: 'subHeadline', label: 'Sub-Hero Headline', type: 'text' },
          { key: 'subHeadlineDescription', label: 'Sub-Hero Description', type: 'textarea' },
          { key: 'ctaBottom', label: 'Bottom Button Text', type: 'text' },
        ]
      },
      {
        section_key: 'section1',
        label: 'Intelligence & Friction',
        group: 'Core Value 1',
        fields: [
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'p1Title', label: 'Point 1 Title', type: 'text' },
          { key: 'p1Desc', label: 'Point 1 Description', type: 'textarea' },
          { key: 'p2Title', label: 'Point 2 Title', type: 'text' },
          { key: 'p2Desc', label: 'Point 2 Description', type: 'textarea' },
          { key: 'p3Title', label: 'Point 3 Title', type: 'text' },
          { key: 'p3Desc', label: 'Point 3 Description', type: 'textarea' },
          { key: 'p4Title', label: 'Point 4 Title', type: 'text' },
          { key: 'p4Desc', label: 'Point 4 Description', type: 'textarea' },
        ]
      },
      {
        section_key: 'section2',
        label: 'The Mini-Product Era',
        group: 'Core Value 2',
        fields: [
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'p1Title', label: 'Point 1 Title', type: 'text' },
          { key: 'p1Desc', label: 'Point 1 Description', type: 'textarea' },
          { key: 'p2Title', label: 'Point 2 Title', type: 'text' },
          { key: 'p2Desc', label: 'Point 2 Description', type: 'textarea' },
          { key: 'p3Title', label: 'Point 3 Title', type: 'text' },
          { key: 'p3Desc', label: 'Point 3 Description', type: 'textarea' },
          { key: 'p4Title', label: 'Point 4 Title', type: 'text' },
          { key: 'p4Desc', label: 'Point 4 Description', type: 'textarea' },
        ]
      }
    ]
  },
  {
    page_key: 'about',
    label: 'About Page',
    sections: [
      {
        section_key: 'bio',
        label: 'Biography',
        fields: [
          { key: 'headline', label: 'Page Title', type: 'text' },
          { key: 'summary', label: 'Professional Summary', type: 'textarea' },
        ]
      },
      {
        section_key: 'connectSection',
        label: 'Connect Section',
        fields: [
          { key: 'headline', label: 'CTA Headline', type: 'text' },
          { key: 'description', label: 'CTA Subtext', type: 'textarea' },
          { key: 'cta', label: 'Button Text', type: 'text' },
        ]
      }
    ]
  },
  {
    page_key: 'insightsPage',
    label: 'Insights Page',
    sections: [
      {
        section_key: 'content',
        label: 'Page Content',
        fields: [
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'readMoreCta', label: 'Read More Label', type: 'text' },
          { key: 'backToInsightsCta', label: 'Back Link Label', type: 'text' },
        ]
      }
    ]
  }
];

export interface CMSData {
  homepage: {
    hero: {
      headline: string;
      subtext: string;
      cta: string;
    };
    valueProps: Array<{
      stat: string;
      title: string;
      description: string;
    }>;
    howItWorksHeadline: string;
    howItWorksSubtext: string;
    howItWorks: Array<{
      step: string;
      title: string;
      description: string;
    }>;
    workPreviewHeadline: string;
    workPreviewAllCasesLabel: string;
    workPreviewCaseStudyLabel: string;
    workPreview: Array<{
      id: string;
      title: string;
      company: string;
      description: string;
      slug: string;
    }>;
    vbcIndexSection: {
      headline: string;
      description: string;
      cta: string;
    };
    featuredInsightSection: {
      headline: string;
      description: string;
      viewAllCta: string;
      readArticleCta: string;
    };
    insightsPreview: {
      headline: string;
    };
    testimonial: {
      quote: string;
    };
  };
  workPage: {
    headline: string;
    labels: {
      problem: string;
      approach: string;
      outcome: string;
    };
    entries: Array<{
      id: string;
      title: string;
      company: string;
      problem: string;
      approach: string;
      outcome: string;
      slug: string;
    }>;
  };
  vbcIndexPage: {
    headline: string;
    intro: string;
    ctaTop: string;
    subHeadline: string;
    subHeadlineDescription: string;
    ctaBottom: string;
    section1: {
      headline: string;
      description: string;
      points: Array<{ title: string; description: string }>;
    };
    section2: {
      headline: string;
      description: string;
      points: Array<{ title: string; description: string }>;
    };
  };
  aboutPage: {
    headline: string;
    summary: string;
    highlightsHeadline: string;
    highlights: string[];
    connectSection: {
      headline: string;
      description: string;
      cta: string;
    };
  };
  insightsPage: {
    headline: string;
    readMoreCta: string;
    backToInsightsCta: string;
  };
}
