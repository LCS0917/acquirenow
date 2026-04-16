# AcquireNow — Project Guide for Claude

## Context for whoever picks this up

The owner (Lena) is **not a developer**. She builds via Claude / Gemini CLI. Prior
AI assistants have left structural bugs in the code (mismatched JSX, references
to undeclared state, etc.). Be skeptical of existing code and **verify JSX
balance and type-checks** before declaring something fixed.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind
- Supabase (Postgres + Storage + Auth) — server actions in `src/app/actions/*`
- Rich text: custom `RichTextEditor` in `src/components/rich-text-editor.tsx`
- Admin auth: `src/lib/admin-auth.ts` (`validateAdmin`), checked by all
  `/api/admin/*` routes
- Supabase service-role client: `@/lib/supabase-admin` (server-only)
- Supabase user/SSR client: `@/utils/supabase/server`

## Blog system — important quirks

### Schema

Table `blog_posts` has **two parallel sets of columns**:

| Draft-side (edit-in-progress) | Live-side (published)    |
| ----------------------------- | ------------------------ |
| `draft_title`                 | `title`                  |
| `draft_body`                  | `content`                |

Plus: `description`, `slug`, `status` (`'idea' \| 'draft' \| 'published'`),
`is_featured`, `featured_image_url`, `published_at`, `created_at`,
`target_audience`, `core_theme`, `raw_feed_id`.

**There is a Supabase DB trigger** that auto-syncs `draft_title → title`
and `draft_body → content` (and auto-generates `slug`). It's not in the repo —
it lives in Supabase. When you insert only `draft_title`, the row comes back
with `title` populated and `draft_title: null`. That's expected.

Because of this, **all reads should fall back**:
```ts
post.draft_title || post.title
post.draft_body || post.content
```

### Writing / saving posts

`updateBlogPost` in `src/app/actions/blog.ts` mirrors `draft_title → title`
and `draft_body → content` in the update payload for redundancy with the
trigger. Don't remove that sync without understanding why.

If a save silently fails: check `updateBlogPost` — it now surfaces the real
Supabase error message. Most common cause is writing to a column that doesn't
exist. Always confirm schema against the table before adding fields to the
payload.

### Featured image pipeline

1. User clicks **Generate Image** or **Upload Image** in the editor sidebar
   (`src/app/admin/blog/[id]/page.tsx`).
2. **Generate** → `POST /api/admin/blog/generate-image` renders a 1200×600 PNG
   via `next/og` using the post title + a light/dark theme, then uploads to
   Supabase storage bucket `blog-images` and returns a public URL.
3. **Upload** → `POST /api/admin/blog/upload-image` accepts a file, uploads to
   the same bucket, returns a URL.
4. The URL is stored in `blog_posts.featured_image_url` and rendered by the
   homepage featured card (`src/components/HomeView.tsx`) and blog pages.

**Prerequisites** (run once per environment):
- `blog-images` bucket must exist and be public →
  `npx tsx scripts/setup-storage.ts`
- The `featured_image_url` column must exist →
  `alter table blog_posts add column if not exists featured_image_url text;`

### Homepage featured-post selection

`HomeView.tsx`: prefers posts with `status='published' AND is_featured=true`,
falls back to latest published. If no posts are published, shows a design
placeholder. The edit page's "Featured Insight" checkbox auto-unsets
`is_featured` on all other posts (enforced in `updateBlogPost`) so there's
always at most one featured.

### Ideas pipeline (known rough)

Rows with `status='idea'` come from a separate pipeline (see `raw_feed_id`
column). As of 2026-04, this generator is not working well — Lena is aware.
Don't assume ideas are edit-ready drafts.

## Admin area

- `/admin/blog` — list view
- `/admin/blog/[id]` — editor (tricky JSX nesting — previously broken by
  Gemini; verify div balance after edits)
- `/admin/blog/generate` — AI drafting assistant
- `/admin/cms` — CMS page editor (homepage, work, VBC index, about, insights,
  global footer, **Site Settings**)

### Blog editor — publish date

The sidebar has a **Publish Date** field. If set, it overrides `published_at`
on every save. If left blank, `published_at` auto-sets to the current timestamp
on first publish.

## CMS (non-blog content)

Homepage / insights page / etc. copy lives in two places:

1. `src/lib/cms-data.ts` — local defaults (source of truth for structure)
2. Supabase `cms_pages` table — optional overrides

The merge pattern in `src/app/page.tsx` / `src/app/blog/page.tsx` layers DB
values on top of local defaults, skipping empty strings. Don't break this
fallback — if Supabase is unreachable, the site must still render.

### CMS field types

`src/types/cms.ts` defines four field types: `text`, `textarea`, `url`,
`image`. The `image` type renders a file-upload button in the CMS editor;
uploaded files go to the `blog-images` Supabase bucket via
`POST /api/admin/blog/upload-image`.

### Site Settings (CMS page key: `siteSettings`)

Editable fields: **Site Title**, **Meta Description**, **Social Preview Image**
(upload). Values feed into `generateMetadata()` in `src/app/layout.tsx` (async,
reads from CMS at request time). Local defaults live in
`src/lib/cms-data.ts` → `siteSettings.metadata`.

### Work page — case study entries

Entries no longer have a `title` field. They have `ctaLabel` (default: "Read
Case Study") and `ctaUrl`. If `ctaUrl` is set, the CTA renders as a link;
otherwise plain text. Edit per-entry in CMS → Work Page → Case Studies.

## Favicon

Favicon is served from `src/app/icon.png` (Next.js App Router auto-detects
this). The file is a copy of `public/assets/a-logo.png`. Do **not** add a
`favicon.ico` to `src/app/` — it overrides `icon.png` and will revert to the
default Vercel icon.

## Commit conventions

**Do not add `Co-Authored-By: Claude` trailers to commits.** The owner has
asked to keep that off the public git history.

## Working norms

- **Verify before claiming done**: run `npx tsc --noEmit` after JSX edits. Past
  AI edits have left the admin editor in a state where it looked plausible but
  had unbalanced `<div>`s or undeclared state hooks.
- **Don't re-read the same file** to debug — use the depth-counting approach
  (count `<div` opens vs `</div>` closes) to locate JSX imbalance quickly.
- **Schema-first** when touching anything DB: query Supabase to confirm
  columns exist before writing to them. The repo has no SQL migrations
  checked in — Supabase is the source of truth.
- **Don't delete the dual-column draft/live system** unless you're also
  removing the DB trigger.

## Local dev

```bash
npm run dev                 # start Next.js
npx tsc --noEmit            # typecheck
npx tsx scripts/setup-storage.ts        # ensure blog-images bucket exists
npx tsx scripts/migrate-framer-blog.ts  # import legacy Framer posts (one-time)
```

Env lives in `.env.local`. Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
