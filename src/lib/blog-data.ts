import { BlogPost } from "@/types/blog";

export const blogData: BlogPost[] = [
  {
    id: "1",
    slug: "scaling-digital-health",
    draft_title: "Scaling Digital Health Solutions",
    draft_body: "Building in healthcare is different...",
    title: "Scaling Digital Health Solutions",
    content: "Building in healthcare is different...",
    description: "Lessons learned from building products in a regulated environment.",
    status: "published",
    is_featured: true,
    published_at: "2026-04-01",
    created_at: "2026-03-25",
    target_audience: "Digital health vendors",
    core_theme: "Scaling",
    featured_image_url: null
  },
  {
    id: "2",
    slug: "future-of-vbc",
    draft_title: "The Future of Value-Based Care",
    draft_body: "Value-based care is the future...",
    title: "The Future of Value-Based Care",
    content: "Value-based care is the future...",
    description: "Why data integrity is the foundation of VBC success.",
    status: "published",
    is_featured: false,
    published_at: "2026-04-10",
    created_at: "2026-04-05",
    target_audience: "Health systems",
    core_theme: "VBC",
    featured_image_url: null
  },
];
