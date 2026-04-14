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
    publishedAt: "2026-04-01",
    createdAt: "2026-03-25",
  },
  {
    id: "2",
    title: "The Future of Value-Based Care",
    description: "Why data integrity is the foundation of VBC success.",
    content: "Value-based care is the future...",
    slug: "future-of-vbc",
    status: "published",
    is_featured: false,
    publishedAt: "2026-04-10",
    createdAt: "2026-04-05",
  },
];
