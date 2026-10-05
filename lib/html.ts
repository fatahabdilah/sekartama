import sanitizeHtml from "sanitize-html";

// The only markup article bodies may contain (what the admin's classic editor produces).
const ALLOWED_HTML: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "del",
    "a", "ul", "ol", "li", "blockquote", "hr", "img", "code", "pre",
  ],
  allowedAttributes: { a: ["href", "target", "rel"], img: ["src", "alt", "width", "height"] },
  allowedSchemes: ["http", "https", "mailto", "tel"],
};

export function sanitizeArticle(html: string) {
  return sanitizeHtml(html, ALLOWED_HTML).trim();
}

export function plainText(html: string) {
  return sanitizeHtml(html.replace(/<\/(p|h\d|li|blockquote)>/g, " "), { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
}
