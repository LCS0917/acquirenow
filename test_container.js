const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('sample2.html', 'utf8');
const $ = cheerio.load(html);

let best = null;
$('p').each((i, el) => {
    if ($(el).text().length > 50) {
        let current = $(el);
        // Go up until we find a div that has multiple paragraphs as direct children
        while (current.length && current[0].tagName !== 'body') {
             if (current.children('p').length > 2 || current.children('h2, h3').length > 0) {
                 best = current;
                 break;
             }
             current = current.parent();
        }
        if (best) return false; // break loop
    }
});

if (best) {
   console.log("Found container length:", best.html().length);
   // Print a snippet of the found html
   console.log(best.html().substring(0, 200));
} else {
   console.log("Could not find a good container.");
}
