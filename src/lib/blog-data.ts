import { BlogPost } from "@/types/blog";

export const blogData: BlogPost[] = [
  {
    id: "1",
    title: "Scaling Digital Health Solutions",
    description: "Lessons learned from building products in a regulated environment.",
    content: "Building in healthcare is different...",
    slug: "scaling-digital-health",
    status: "published",
    is_featured: true,
    published_at: "2026-04-01",
    created_at: "2026-03-25",
  },
  {
    id: "2",
    title: "The Future of Value-Based Care",
    description: "Why data integrity is the foundation of VBC success.",
    content: "Value-based care is the future...",
    slug: "future-of-vbc",
    status: "published",
    is_featured: false,
    published_at: "2026-04-10",
    created_at: "2026-04-05",
  },
];
