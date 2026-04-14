export type BlogStatus = 'idea' | 'draft' | 'published';

export interface BlogPost {
  id: string;
  slug: string | null;
  draft_title: string;
  draft_body: string;
  target_audience: string;
  core_theme: string;
  status: BlogStatus;
  is_featured: boolean;
  featured_image_url: string | null;
  created_at: string;
  published_at?: string | null;
  // Temporary for backward compatibility during migration
  title?: string;
  content?: string;
  description?: string;
}
