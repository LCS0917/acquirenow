import { CMSData } from "@/types/cms";

export const cmsData: CMSData = {
  homepage: {
    hero: {
      headline: "I build and launch healthcare products that drive revenue and align complex organizations.",
      subtext: "Operator across product, go-to-market, and enterprise healthcare systems. I work where strategy breaks down and execution needs to actually happen.",
      cta: "View Work",
    },
    valueProps: [
      {
        title: "Build and launch products",
        description: "From early concept to market-ready execution. I turn unclear ideas into structured products that can be sold, adopted, and scaled.",
      },
      {
        title: "Drive go-to-market and revenue",
        description: "Positioning, commercial strategy, and execution tied directly to growth. Not just messaging, but systems that produce pipeline and revenue.",
      },
      {
        title: "Align stakeholders",
        description: "Work across clinical, product, and executive teams to move initiatives forward inside complex, matrixed organizations.",
      },
    ],
    howItWorksHeadline: "How It Works",
    howItWorksSubtext: "The strategic execution framework",
    howItWorks: [
      {
        step: "01",
        title: "Define what actually matters",
        description: "Clarify the problem, market dynamics, and where value is created or lost.",
      },
      {
        step: "02",
        title: "Build the system",
        description: "Translate strategy into something real. Product, GTM motion, or internal structure that can operate.",
      },
      {
        step: "03",
        title: "Drive execution",
        description: "Work across teams to ensure adoption, alignment, and measurable outcomes.",
      },
    ],
    workPreviewHeadline: "Selected Work",
    workPreviewAllCasesLabel: "Explore All cases",
    workPreviewCaseStudyLabel: "Case Study",
    workPreview: [
      {
        id: "1",
        title: "Scout Health",
        company: "Scout Health",
        description: "Built and validated commercial strategy for a point-of-care diagnostics platform, supporting funding and early market traction.",
        slug: "scout-health",
      },
      {
        id: "2",
        title: "Navigating Cancer",
        company: "Navigating Cancer",
        description: "Led full repositioning and go-to-market strategy, driving $12M+ in growth and re-establishing market leadership.",
        slug: "navigating-cancer",
      },
      {
        id: "3",
        title: "UCSF",
        company: "UCSF",
        description: "Established enterprise-wide digital governance and aligned stakeholders across clinical and executive teams.",
        slug: "ucsf",
      },
    ],
    vbcIndexSection: {
      headline: "VBCIndex: A Product Approach to Value-Based Care",
      description: "A system designed to make value-based care data actionable. Built to explore market opportunities, operational friction, and where organizations fit within evolving reimbursement models.",
      cta: "Learn More",
    },
    featuredInsightSection: {
      headline: "Featured Insight",
      description: "Thoughts on healthcare operations, product strategy, and the transition to value-based care.",
      viewAllCta: "View All Insights →",
      readArticleCta: "Read Article",
    },
    insightsPreview: {
      headline: "Insights",
    },
  },
  workPage: {
    headline: "Work & Experience",
    labels: {
      problem: "Problem",
      approach: "Approach",
      outcome: "Outcome",
    },
    entries: [
      {
        id: "1",
        title: "Scout Health",
        company: "Scout Health",
        problem: "Unclear commercial pathway for a new diagnostics platform",
        approach: "Built GTM strategy and validated market demand through early partnerships",
        outcome: "$6M funding supported by commercial validation",
        slug: "scout-health",
      },
      {
        id: "2",
        title: "Navigating Cancer",
        company: "Navigating Cancer",
        problem: "Loss of market leadership and weak positioning",
        approach: "Rebuilt brand, messaging, and GTM strategy",
        outcome: "$12M+ revenue growth and renewed market presence",
        slug: "navigating-cancer",
      },
      {
        id: "3",
        title: "UCSF",
        company: "UCSF",
        problem: "Lack of alignment across digital and communications systems",
        approach: "Established governance and cross-functional coordination",
        outcome: "Scaled content production and improved organizational alignment",
        slug: "ucsf",
      },
      {
        id: "4",
        title: "Silene Biotech",
        company: "Silene Biotech",
        problem: "Early-stage concept lacked scalable GTM",
        approach: "Built product positioning and commercial infrastructure",
        outcome: "Revenue growth and acquisition by Curi Bio",
        slug: "silene-biotech",
      },
    ],
  },
  vbcIndexPage: {
    headline: "The VBC Index",
    intro: "VBCIndex is a product built to make value-based care easier to understand and act on.",
    labels: {
      problem: "The Problem",
      approach: "Our Approach",
      whyItMatters: "Why It Matters",
    },
    problem: "Value-based care data is fragmented, inconsistent, and difficult to use for decision-making.",
    approach: "Structured data combined with an intelligence layer to surface actionable insights.",
    whyItMatters: "Helps organizations identify opportunities, manage risk, and align strategy with real market dynamics.",
  },
  aboutPage: {
    headline: "About Lena Shaw",
    summary: "Lena Shaw is a healthcare operator with over a decade of experience in digital health and clinical operations. She works where strategy breaks down and execution needs to actually happen.",
    highlightsHeadline: "Experience Highlights",
    highlights: [
      "Built and scaled product teams in early-stage startups.",
      "Led GTM strategy for national health systems.",
      "Expert in clinical workflow and digital governance.",
      "Proven track record in driving revenue growth and organizational alignment.",
    ],
    connectSection: {
      headline: "Let's Connect",
      description: "Always looking for new challenges in healthcare innovation and operations.",
      cta: "Get in Touch",
    },
  },
  insightsPage: {
    headline: "Insights",
    readMoreCta: "Read More →",
    backToInsightsCta: "← Back to Insights",
  },
};
