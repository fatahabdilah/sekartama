import type { MetadataRoute } from "next";
import { getPosts, getProductCategories } from "@/lib/data";
import { POSTS_PER_PAGE } from "@/lib/posts";
import { siteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([getPosts(), getProductCategories()]);
  const latest = posts[0]?.date;
  const blogPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));

  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/tentang`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/proyek`, changeFrequency: "monthly", priority: 0.8 },
    ...categories.map((category) => ({
      url: `${siteUrl}/produk/${category.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: `${siteUrl}/blog`, lastModified: latest, changeFrequency: "weekly", priority: 0.7 },
    ...Array.from({ length: blogPages - 1 }, (_, i) => ({
      url: `${siteUrl}/blog/page/${i + 2}`,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    { url: `${siteUrl}/hubungi-kami`, changeFrequency: "yearly", priority: 0.7 },
  ];
}
