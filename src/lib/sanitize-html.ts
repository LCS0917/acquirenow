import sanitize from "sanitize-html";

export function sanitizeBlogHtml(html: string): string {
  return sanitize(html, {
    allowedTags: [
      "p", "br", "hr",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "strong", "em", "u", "s", "code", "pre",
      "ul", "ol", "li",
      "blockquote",
      "a", "img",
      "span", "div",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      "*": ["style", "class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedStyles: {
      "*": {
        "color": [/^#(?:[0-9a-fA-F]{3}){1,2}$/, /^rgb\(/, /^rgba\(/, /^[a-zA-Z]+$/],
        "background-color": [/^#(?:[0-9a-fA-F]{3}){1,2}$/, /^rgb\(/, /^rgba\(/, /^[a-zA-Z]+$/],
        "text-align": [/^(left|right|center|justify)$/],
      },
    },
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href || "";
        const isExternal = /^https?:\/\//i.test(href);
        return {
          tagName: "a",
          attribs: {
            ...attribs,
            ...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {}),
          },
        };
      },
    },
  });
}
