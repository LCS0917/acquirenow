import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  require('dotenv').config(); // fallback to .env
}

// Requires standard Supabase environment variables:
// NEXT_PUBLIC_SUPABASE_URL
// SUPABASE_SERVICE_ROLE_KEY

async function migrateToSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
    process.exit(1);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const dataPath = path.join(process.cwd(), 'data', 'blog-migration.json');
  if (!fs.existsSync(dataPath)) {
    console.error('Error: Migration data not found at data/blog-migration.json. Run extraction script first.');
    process.exit(1);
  }

  const posts = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log(`Found ${posts.length} posts to migrate.`);

  let imported = 0;
  let skipped = 0;
  let failed = 0;

  for (const post of posts) {
    try {
      // Check if post exists to avoid duplicates
      const { data: existing, error: fetchError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', post.slug)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "Row not found"
          console.error(`Error checking for existing post ${post.slug}:`, fetchError.message);
          failed++;
          continue;
      }

      if (existing) {
        console.log(`Skipping ${post.slug} - already exists.`);
        skipped++;
        continue;
      }

      // Format date
      let publishedAt = new Date().toISOString();
      if (post.published_at) {
         try {
             publishedAt = new Date(post.published_at).toISOString();
         } catch(e) {
             console.warn(`Could not parse date "${post.published_at}" for ${post.slug}. Using current time.`);
         }
      }

      // Insert new post
      const { error: insertError } = await supabase
        .from('blog_posts')
        .insert({
          title: post.title,
          slug: post.slug,
          content: post.content_html, // Assuming the new CMS handles raw HTML for migration, or update column name if different
          description: post.excerpt, // Mapped excerpt to description based on BlogPost schema
          featured_image_url: post.featured_image_url,
          status: 'draft',
          is_featured: false,
          published_at: publishedAt,
          // draft_title, draft_body, target_audience, core_theme are required by the local schema
          // We default them to safe values if the table requires them.
          draft_title: post.title,
          draft_body: post.excerpt,
          target_audience: 'General',
          core_theme: 'Migration'
        });

      if (insertError) {
        console.error(`Failed to insert ${post.slug}:`, insertError.message);
        failed++;
      } else {
        console.log(`Successfully imported: ${post.slug}`);
        imported++;
      }
    } catch (err) {
      console.error(`Unexpected error migrating ${post.slug}:`, err);
      failed++;
    }
  }

  console.log('\nMigration Summary:');
  console.log(`Imported: ${imported}`);
  console.log(`Skipped (Duplicates): ${skipped}`);
  console.log(`Failed: ${failed}`);
}

migrateToSupabase().catch(console.error);
