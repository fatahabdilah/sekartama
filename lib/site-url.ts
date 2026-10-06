/**
 * The public site address, used for the sitemap, robots.txt, and absolute social-preview URLs.
 * Set NEXT_PUBLIC_SITE_URL in production; Vercel's production domain is the fallback.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://sekartama-upvc.com")
).replace(/\/$/, "");
