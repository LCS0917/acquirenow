const fs = require('fs');
const cheerio = require('cheerio');

async function fetchAndExtract() {
  const indexHtml = fs.readFileSync('blog_source.html', 'utf8');
  const $index = cheerio.load(indexHtml);
  
  const links = new Set();
  $index('a').each((i, el) => {
    const href = $index(el).attr('href');
    if (href && href.startsWith('./blog/') && href !== './blog') {
      links.add('https://www.acquirenowhq.com' + href.replace('./', '/'));
    }
  });
  
  const urls = Array.from(links).slice(0, 3);
  const results = [];
  
  for (const url of urls) {
    const slug = url.split('/').pop();
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    const title = $('h1').first().text().trim() || $('title').text().replace(/ - AcquireNow.*/, '').trim();
    const seoDescription = $('meta[name="description"]').attr('content') || '';
    const featuredImageUrl = $('meta[property="og:image"]').attr('content') || '';
    
    let contentHtml = '';
    let best = null;
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
        contentHtml = best.html();
    } else {
        // Fallback
        const contentNode = $('div[data-framer-name="Content"]');
        if (contentNode.length > 0) contentHtml = contentNode.html();
    }
    
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
      content_html_preview: contentHtml ? contentHtml.substring(0, 150) + '...' : '(empty)',
      content_html_length: contentHtml ? contentHtml.length : 0,
      excerpt: seoDescription,
      featured_image_url: featuredImageUrl,
      published_at: date,
      seo_title: $('title').text(),
      seo_description: seoDescription,
      status: 'published'
    });
  }
  
  console.log(JSON.stringify(results, null, 2));
}

fetchAndExtract().catch(console.error);