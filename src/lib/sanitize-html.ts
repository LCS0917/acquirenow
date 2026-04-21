import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p", "br", "hr",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "strong", "em", "u", "s", "code", "pre",
  "ul", "ol", "li",
  "blockquote",
  "a", "img",
  "span",
];

const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "title", "style", "class"];

export function sanitizeBlogHtml(html: string): string {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|\/|#)/i,
  });

  return clean.replace(/<a\s+([^>]*?)href="(https?:\/\/[^"]+)"([^>]*)>/gi, (match, pre, href, post) => {
    const combined = `${pre} ${post}`;
    const hasTarget = /\btarget=/.test(combined);
    const hasRel = /\brel=/.test(combined);
    const extras = `${hasTarget ? "" : ' target="_blank"'}${hasRel ? "" : ' rel="noopener noreferrer"'}`;
    return `<a ${pre}href="${href}"${post}${extras}>`;
  });
}
