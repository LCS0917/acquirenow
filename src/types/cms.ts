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
          { key: 'headline', label: 'Hero Headline', type: 'textarea' },
          { key: 'subhead', label: 'Hero Subhead', type: 'textarea' },
          { key: 'cta', label: 'Call to Action Label', type: 'text' },
          { key: 'ctaUrl', label: 'Call to Action URL', type: 'url' },
        ]
      },
      {
        section_key: 'valueProp1',
        label: 'Value Prop 1',
        group: 'Value Propositions',
        fields: [
          { key: 'data', label: 'Data (e.g. 10X)', type: 'text' },
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'caption', label: 'Caption', type: 'textarea' },
        ]
      },
      {
        section_key: 'valueProp2',
        label: 'Value Prop 2',
        group: 'Value Propositions',
        fields: [
          { key: 'data', label: 'Data (e.g. $30M+)', type: 'text' },
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'caption', label: 'Caption', type: 'textarea' },
        ]
      },
      {
        section_key: 'valueProp3',
        label: 'Value Prop 3',
        group: 'Value Propositions',
        fields: [
          { key: 'data', label: 'Data (e.g. 13+ years)', type: 'text' },
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'caption', label: 'Caption', type: 'textarea' },
        ]
      },
      {
        section_key: 'valuePropsCta',
        label: 'Value Props CTA',
        group: 'Value Propositions',
        fields: [
          { key: 'viewAllCta', label: 'View All Work Label', type: 'text' },
          { key: 'viewAllUrl', label: 'View All Work URL', type: 'url' },
        ]
      },
      {
        section_key: 'vbcIndexSection',
        label: 'VBC Index Preview',
        group: 'Product Features',
        fields: [
          { key: 'badge', label: 'Badge', type: 'text' },
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'cta', label: 'Button Label', type: 'text' },
          { key: 'ctaUrl', label: 'Button URL', type: 'url' },
        ]
      },
      {
        section_key: 'featuredInsightSection',
        label: 'Insights Section',
        group: 'Product Features',
        fields: [
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'viewAllCta', label: 'View All Text', type: 'text' },
          { key: 'viewAllUrl', label: 'View All URL', type: 'url' },
          { key: 'readArticleCta', label: 'Read Article Text', type: 'text' },
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
        group: 'Header',
        fields: [
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ]
      },
      {
        section_key: 'howItWorksStep1',
        label: 'Step 1',
        group: 'Process',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ]
      },
      {
        section_key: 'howItWorksStep2',
        label: 'Step 2',
        group: 'Process',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ]
      },
      {
        section_key: 'howItWorksStep3',
        label: 'Step 3',
        group: 'Process',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ]
      },
      {
        section_key: 'labels',
        label: 'Case Study Labels',
        group: 'Metadata',
        fields: [
          { key: 'problem', label: 'Problem Label', type: 'text' },
          { key: 'approach', label: 'Approach Label', type: 'text' },
          { key: 'outcome', label: 'Outcome Label', type: 'text' },
        ]
      },
      {
        section_key: 'entry1',
        label: 'Entry 1 (Scout)',
        group: 'Case Studies',
        fields: [
          { key: 'company', label: 'Company', type: 'text' },
          { key: 'ctaLabel', label: 'CTA Label', type: 'text', placeholder: 'Read Case Study' },
          { key: 'ctaUrl', label: 'CTA Link', type: 'url', placeholder: 'https://...' },
          { key: 'problem', label: 'Problem', type: 'textarea' },
          { key: 'approach', label: 'Approach', type: 'textarea' },
          { key: 'outcome', label: 'Outcome', type: 'textarea' },
        ]
      },
      {
        section_key: 'entry2',
        label: 'Entry 2 (Navigating Cancer)',
        group: 'Case Studies',
        fields: [
          { key: 'company', label: 'Company', type: 'text' },
          { key: 'ctaLabel', label: 'CTA Label', type: 'text', placeholder: 'Read Case Study' },
          { key: 'ctaUrl', label: 'CTA Link', type: 'url', placeholder: 'https://...' },
          { key: 'problem', label: 'Problem', type: 'textarea' },
          { key: 'approach', label: 'Approach', type: 'textarea' },
          { key: 'outcome', label: 'Outcome', type: 'textarea' },
        ]
      },
      {
        section_key: 'entry3',
        label: 'Entry 3 (UCSF)',
        group: 'Case Studies',
        fields: [
          { key: 'company', label: 'Company', type: 'text' },
          { key: 'ctaLabel', label: 'CTA Label', type: 'text', placeholder: 'Read Case Study' },
          { key: 'ctaUrl', label: 'CTA Link', type: 'url', placeholder: 'https://...' },
          { key: 'problem', label: 'Problem', type: 'textarea' },
          { key: 'approach', label: 'Approach', type: 'textarea' },
          { key: 'outcome', label: 'Outcome', type: 'textarea' },
        ]
      },
      {
        section_key: 'entry4',
        label: 'Entry 4 (Silene)',
        group: 'Case Studies',
        fields: [
          { key: 'company', label: 'Company', type: 'text' },
          { key: 'ctaLabel', label: 'CTA Label', type: 'text', placeholder: 'Read Case Study' },
          { key: 'ctaUrl', label: 'CTA Link', type: 'url', placeholder: 'https://...' },
          { key: 'problem', label: 'Problem', type: 'textarea' },
          { key: 'approach', label: 'Approach', type: 'textarea' },
          { key: 'outcome', label: 'Outcome', type: 'textarea' },
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
        label: 'Hero & Intro',
        group: 'Header',
        fields: [
          { key: 'badge', label: 'Badge', type: 'text' },
          { key: 'headline', label: 'Hero Headline', type: 'text' },
          { key: 'intro', label: 'Hero Introduction', type: 'textarea' },
          { key: 'ctaTop', label: 'Top Button Text', type: 'text' },
          { key: 'ctaTopUrl', label: 'Top Button URL', type: 'url' },
          { key: 'bottomCtaHeadline', label: 'Bottom Headline', type: 'text' },
          { key: 'ctaBottom', label: 'Bottom Button Text', type: 'text' },
          { key: 'ctaBottomUrl', label: 'Bottom Button URL', type: 'url' },
        ]
      },
      {
        section_key: 'section1',
        label: 'Section 1',
        group: 'Features',
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
        label: 'Section 2',
        group: 'Features',
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
        group: 'Header',
        fields: [
          { key: 'headline', label: 'Page Title', type: 'text' },
          { key: 'summary', label: 'Professional Summary', type: 'textarea' },
        ]
      },
      {
        section_key: 'highlights',
        label: 'Experience Highlights',
        group: 'Experience',
        fields: [
          { key: 'headline', label: 'Section Headline', type: 'text' },
          { key: 'h1', label: 'Highlight 1', type: 'textarea' },
          { key: 'h2', label: 'Highlight 2', type: 'textarea' },
          { key: 'h3', label: 'Highlight 3', type: 'textarea' },
          { key: 'h4', label: 'Highlight 4', type: 'textarea' },
        ]
      },
      {
        section_key: 'connectSection',
        label: 'Connect Section',
        group: 'Footer',
        fields: [
          { key: 'headline', label: 'CTA Headline', type: 'text' },
          { key: 'description', label: 'CTA Description', type: 'textarea' },
          { key: 'cta', label: 'Button Text', type: 'text' },
          { key: 'ctaUrl', label: 'Button URL', type: 'url' },
          { key: 'linkedinLabel', label: 'LinkedIn Label', type: 'text' },
          { key: 'linkedinUrl', label: 'LinkedIn URL', type: 'url' },
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
        group: 'Main',
        fields: [
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'description', label: 'Sub-headline', type: 'textarea' },
          { key: 'brandingText', label: 'Branding Text', type: 'text' },
          { key: 'readMoreCta', label: 'Read More Label', type: 'text' },
          { key: 'backToInsightsCta', label: 'Back Link Label', type: 'text' },
          { key: 'learnMoreCta', label: 'Author Learn More Text', type: 'text' },
          { key: 'learnMoreUrl', label: 'Author Learn More URL', type: 'url' },
        ]
      }
    ]
  },
  {
    page_key: 'global',
    label: 'Global Content',
    sections: [
      {
        section_key: 'footer',
        label: 'Footer & Layout',
        group: 'Layout',
        fields: [
          { key: 'tagline', label: 'Footer Tagline', type: 'textarea' },
          { key: 'navTitle', label: 'Navigation Title', type: 'text' },
          { key: 'contactTitle', label: 'Contact Title', type: 'text' },
          { key: 'emailLabel', label: 'Email Label', type: 'text' },
          { key: 'emailUrl', label: 'Email URL', type: 'url' },
          { key: 'linkedinLabel', label: 'LinkedIn Label', type: 'text' },
          { key: 'linkedinUrl', label: 'LinkedIn URL', type: 'url' },
          { key: 'copyrightText', label: 'Copyright Text', type: 'text' },
          { key: 'nav1Label', label: 'Nav Item 1 Label', type: 'text' },
          { key: 'nav1Url', label: 'Nav Item 1 URL', type: 'url' },
          { key: 'nav2Label', label: 'Nav Item 2 Label', type: 'text' },
          { key: 'nav2Url', label: 'Nav Item 2 URL', type: 'url' },
          { key: 'nav3Label', label: 'Nav Item 3 Label', type: 'text' },
          { key: 'nav3Url', label: 'Nav Item 3 URL', type: 'url' },
          { key: 'nav4Label', label: 'Nav Item 4 Label', type: 'text' },
          { key: 'nav4Url', label: 'Nav Item 4 URL', type: 'url' },
        ]
      }
    ]
  }
];

export interface CMSData {
  homepage: {
    hero: {
      headline: string;
      subhead: string;
      cta: string;
      ctaUrl: string;
    };
    valueProps: Array<{
      data: string;
      headline: string;
      caption: string;
    }>;
    valuePropsCta: {
      viewAllCta: string;
      viewAllUrl: string;
    };
    vbcIndexSection: {
      badge: string;
      headline: string;
      description: string;
      cta: string;
      ctaUrl: string;
    };
    featuredInsightSection: {
      headline: string;
      description: string;
      viewAllCta: string;
      viewAllUrl: string;
      readArticleCta: string;
    };
    testimonial: {
      quote: string;
    };
  };
  workPage: {
    headline: string;
    description: string;
    howItWorks: Array<{
      title: string;
      description: string;
    }>;
    labels: {
      problem: string;
      approach: string;
      outcome: string;
    };
    entries: Array<{
      id: string;
      ctaLabel: string;
      ctaUrl: string;
      company: string;
      problem: string;
      approach: string;
      outcome: string;
      slug: string;
    }>;
  };
  vbcIndexPage: {
    badge: string;
    headline: string;
    intro: string;
    ctaTop: string;
    ctaTopUrl: string;
    bottomCtaHeadline: string;
    ctaBottom: string;
    ctaBottomUrl: string;
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
      ctaUrl: string;
      linkedinLabel: string;
      linkedinUrl: string;
    };
  };
  insightsPage: {
    headline: string;
    description: string;
    brandingText: string;
    readMoreCta: string;
    backToInsightsCta: string;
    learnMoreCta: string;
    learnMoreUrl: string;
  };
  global: {
    footer: {
      tagline: string;
      navTitle: string;
      contactTitle: string;
      emailLabel: string;
      emailUrl: string;
      linkedinLabel: string;
      linkedinUrl: string;
      copyrightText: string;
      nav1Label: string;
      nav1Url: string;
      nav2Label: string;
      nav2Url: string;
      nav3Label: string;
      nav3Url: string;
      nav4Label: string;
      nav4Url: string;
    };
  };
}
