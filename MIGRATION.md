# Blog Migration Guide

This guide covers the one-time migration of the existing Framer blog to the new custom CMS.

## Overview
The migration process involves two main steps:
1.  **Extraction:** Scraping the live Framer site to collect all posts (title, HTML body, metadata, dates, and images).
2.  **Importing:** Inserting the extracted data into the new Supabase `blog_posts` table without duplicating existing entries.

All tools and scripts have been built to favor fidelity, keeping the original HTML styling intact where possible and maintaining the exact URL structure to prevent SEO loss.

## Deliverables
- `scripts/extract-framer-blog.ts`: Scrapes all blog URLs found in the `sitemap.xml`.
- `scripts/migrate-framer-blog.ts`: Reads the extracted JSON and imports it to Supabase.
- `data/blog-migration.json`: Full structured output of all blog posts.
- `data/blog-migration.csv`: CSV version for manual review.
- `data/redirects.csv`: Documentation of old to new paths (kept 1:1, so no redirect rules are necessary).
- `data/blog-assets-manifest.csv`: A list of all remote Framer images that were featured on the blog.

## Step 1: Extraction

To run the extraction script and pull down the latest content from the live site:

```bash
npx tsx scripts/extract-framer-blog.ts
```

*This will populate the `data/` directory with all the `.json` and `.csv` files.*

## Step 2: Database Migration

Before importing, ensure your Supabase database has a `blog_posts` table that matches the schema in `src/types/blog.ts` (id, title, slug, content, description, draft_title, draft_body, target_audience, core_theme, is_featured, published_at).

You must have these environment variables set locally:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (Required to bypass RLS policies during import)

Run the import script:

```bash
npx tsx scripts/migrate-framer-blog.ts
```

*The script is idempotent. It checks by `slug` before inserting, meaning it can be run multiple times safely without creating duplicates.*

## QA and Manual Review Checklist

Before officially launching the new blog index, manually verify the following:
1.  **Image Hosting:** The current migration leaves featured images and inline images pointing to `framerusercontent.com`. If you plan to close the Framer account, you **must** download these images and upload them to Supabase Storage, updating the database records accordingly. Use `data/blog-assets-manifest.csv` as a checklist.
2.  **Global CSS Constraints:** The extracted HTML body contains Framer's proprietary CSS classes (`framer-text`, `framer-styles-preset-...`). Ensure your new `globals.css` or Tailwind configuration does not catastrophically break these inline styles.
3.  **Code Blocks & Rich Text:** Review complex posts to ensure lists, bold text, and line breaks survived the migration.
4.  **Redirects:** If any Next.js routing changes occurred (e.g. moving from `/blog/` to `/insights/`), update your `next.config.ts` redirects based on the `data/redirects.csv` logic. Currently, URLs are configured to remain identical to preserve SEO.