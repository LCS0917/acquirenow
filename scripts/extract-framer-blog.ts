// @ts-nocheck
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

interface BlogPostExtracted {
  title: string;
  slug: string;
  old_url: string;
  content_html: string;
  excerpt: string;
  featured_image_url: string;
  published_at: string;
  seo_title: string;
  seo_description: string;
  status: string;
}

async function extractFramerBlog() {
  console.log('Fetching sitemap to find all blog URLs...');
  const sitemapRes = await fetch('https://www.acquirenowhq.com/sitemap.xml');
  const sitemapText = await sitemapRes.text();
  
  const urls: string[] = [];
  const regex = /<loc>(https:\/\/www\.acquirenowhq\.com\/blog\/[^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(sitemapText)) !== null) {
    urls.push(match[1]);
  }
  
  console.log(`Discovered ${urls.length} blog posts. Starting extraction...`);
  
  const results: BlogPostExtracted[] = [];
  const assetsManifest: any[] = [];
  const redirects: any[] = [];

  for (const url of urls) {
    console.log(`Extracting: ${url}`);
    const slug = url.split('/').pop() || '';
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    const title = $('h1').first().text().trim() || $('title').text().replace(/ - AcquireNow.*/, '').trim();
    const seoDescription = $('meta[name="description"]').attr('content') || '';
    const featuredImageUrl = $('meta[property="og:image"]').attr('content') || '';
    
    // Extract Content HTML
    let contentHtml = '';
    let best: cheerio.Cheerio<any> | null = null;
    
    $('p').each((i, el) => {
        if ($(el).text().trim().length > 30) {
            let current = $(el);
            while (current.length && current[0].tagName !== 'body') {
                 if (current.children('p').length > 2 || current.children('h2, h3').length > 0) {
                     best = current;
                     break;
                 }
                 current = current.parent();
            }
            if (best) return false;
        }
    });

    if (best) {
        contentHtml = best.html() || '';
    } else {
        const contentNode = $('div[data-framer-name="Content"]');
        if (contentNode.length > 0) contentHtml = contentNode.html() || '';
    }
    
    // Extract Date
    const textNodes = $('p, span').filter(function() {
      return /202[0-9]/.test($(this).text()) || /Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/.test($(this).text());
    });
    let date = '';
    if (textNodes.length > 0) {
        const dateMatch = $(textNodes).text().match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}, 202[0-9]/i);
        if (dateMatch) {
            date = dateMatch[0];
        } else {
            date = textNodes.first().text().trim().substring(0, 30);
        }
    }
    
    results.push({
      title,
      slug,
      old_url: url,
      content_html: contentHtml,
      excerpt: seoDescription,
      featured_image_url: featuredImageUrl,
      published_at: date,
      seo_title: $('title').text(),
      seo_description: seoDescription,
      status: 'published'
    });

    // Asset manifest collection
    if (featuredImageUrl) {
       const ext = featuredImageUrl.includes('.png') ? '.png' : (featuredImageUrl.includes('.jpg') ? '.jpg' : '.webp');
       assetsManifest.push({
         post_slug: slug,
         old_image_url: featuredImageUrl,
         suggested_new_filename: `${slug}-featured${ext}`
       });
    }

    // Redirects collection (keeping the same path, just documenting it)
    redirects.push({
       old_path: `/blog/${slug}`,
       new_path: `/blog/${slug}`
    });
  }

  // Write outputs
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
  }

  // JSON
  fs.writeFileSync(path.join(dataDir, 'blog-migration.json'), JSON.stringify(results, null, 2));
  
  // CSVs
  const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`;

  const migrationCsvHeader = 'title,slug,old_url,excerpt,featured_image_url,published_at,seo_title,seo_description,status\n';
  const migrationCsvRows = results.map(r => 
    [r.title, r.slug, r.old_url, r.excerpt, r.featured_image_url, r.published_at, r.seo_title, r.seo_description, r.status]
    .map(val => escapeCsv(val || '')).join(',')
  ).join('\n');
  fs.writeFileSync(path.join(dataDir, 'blog-migration.csv'), migrationCsvHeader + migrationCsvRows);

  const redirectsCsvHeader = 'old_path,new_path\n';
  const redirectsCsvRows = redirects.map(r => `${r.old_path},${r.new_path}`).join('\n');
  fs.writeFileSync(path.join(dataDir, 'redirects.csv'), redirectsCsvHeader + redirectsCsvRows);

  const assetsCsvHeader = 'post_slug,old_image_url,suggested_new_filename\n';
  const assetsCsvRows = assetsManifest.map(r => `${r.post_slug},${r.old_image_url},${r.suggested_new_filename}`).join('\n');
  fs.writeFileSync(path.join(dataDir, 'blog-assets-manifest.csv'), assetsCsvHeader + assetsCsvRows);

  console.log('Extraction complete! Data saved to data/ directory.');
}

extractFramerBlog().catch(console.error);
