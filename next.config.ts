import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : null;

// Old WordPress post slugs (sekartama-upvc.com/<slug>/) → the new /blog/<slug> pages.
const oldPosts: Record<string, string> = {
  "kenapa-kusen-upvc-menjadi-tren-dalam-dunia-kontruksi": "kenapa-kusen-upvc-menjadi-tren",
  "kusen-upvc-solusi-meningkatkan-keamanan-rumah": "kusen-upvc-solusi-keamanan-rumah",
  "kusen-upvc-solusi-agar-rumah-anda-menjadi-kedap-suara": "kusen-upvc-rumah-kedap-suara",
  "kusen-upvc-kusen-modern-saat-ini-untuk-rumah-dan-bangunan-anda": "kusen-upvc-kusen-modern",
  "kusen-upvc-solusi-tahan-lama-menghadapi-cuaca-buruk-di-indonesia": "kusen-upvc-tahan-cuaca-buruk",
  "kusen-upvc-pilihan-pintar-untuk-efisiensi-energi-dan-keamanan-rumah": "kusen-upvc-efisiensi-energi",
  "kusen-upvc-vs-kusen-alumunium-mana-yang-lebih-unggul-untuk-hunian-anda": "kusen-upvc-vs-kusen-aluminium",
  "kusen-upvc-solusi-tahan-cuaca-dan-lebih-aman-untuk-rumah-anda": "kusen-upvc-tahan-cuaca-lebih-aman",
  "mengenal-jendela-upvc-dan-keunggulannya": "mengenal-jendela-upvc",
  "mengenal-pintu-upvc-keunggulan-dan-manfaatnya": "mengenal-pintu-upvc",
};

const nextConfig: NextConfig = {
  images: {
    // Images uploaded from the admin panel live in the Supabase "media" bucket.
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },

  // Permanent redirects from the old WordPress site's URLs, so search results and shared links keep working.
  async redirects() {
    return [
      ...Object.entries(oldPosts).map(([from, to]) => ({ source: `/${from}`, destination: `/blog/${to}`, permanent: true })),
      { source: "/about", destination: "/tentang", permanent: true },
      { source: "/contact", destination: "/hubungi-kami", permanent: true },
      { source: "/projects", destination: "/proyek", permanent: true },
      { source: "/project/:slug", destination: "/proyek", permanent: true },
      { source: "/pintu-upvc", destination: "/produk/pintu-upvc", permanent: true },
      { source: "/jendela-upvc", destination: "/produk/jendela-upvc", permanent: true },
      { source: "/services", destination: "/#layanan", permanent: true },
      { source: "/category/:slug", destination: "/blog", permanent: true },
      { source: "/:sitemap(post|page|project|category)-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/:sitemap(sitemap_index|wp-sitemap).xml", destination: "/sitemap.xml", permanent: true },
      { source: "/wp-login.php", destination: "/admin/login", permanent: true },
      { source: "/wp-admin/:path*", destination: "/admin", permanent: true },
    ];
  },
};

export default nextConfig;
