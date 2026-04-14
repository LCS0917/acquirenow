const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('sample_post.html', 'utf8');
const $ = cheerio.load(html);

// Title
const title = $('h1').first().text().trim() || $('title').text().replace(/ - AcquireNow.*/, '').trim();

// SEO Description
const seoDescription = $('meta[name="description"]').attr('content') || '';

// Content
// Framer usually puts the main rich text in a specific div. 
// We will look for elements with 'framer-text' or the main wrapper containing h1.
// A common pattern in Framer is a div with a specific data-framer-name like "Content" or just the parent of the h1.
let contentHtml = '';
const contentNode = $('div[data-framer-name="Content"]');
if (contentNode.length > 0) {
  contentHtml = contentNode.html();
} else {
  // Fallback: look for the parent of h1, then find the rich text blocks
  const h1Parent = $('h1').first().parent();
  contentHtml = h1Parent.html();
}

// Featured Image
let featuredImageUrl = '';
const ogImage = $('meta[property="og:image"]').attr('content');
if (ogImage) {
  featuredImageUrl = ogImage;
}

// Published Date
// Let's try to find a date text
const textNodes = $('p, span').filter(function() {
  return /202[0-9]/.test($(this).text()) || /Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/.test($(this).text());
});
let date = '';
if (textNodes.length > 0) {
    date = textNodes.first().text().trim();
}

console.log(JSON.stringify({
  title,
  seoDescription,
  featuredImageUrl,
  date: date.substring(0, 30),
  contentLength: contentHtml ? contentHtml.length : 0
}, null, 2));
