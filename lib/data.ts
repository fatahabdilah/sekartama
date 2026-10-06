import { cache } from "react";
import { defaultChatConfig, type ChatConfig } from "@/lib/assistant";
import { defaultPostContents } from "@/lib/post-contents";
import { defaultPosts, type Post } from "@/lib/posts";
import { defaultProductCategories, type ProductCategory } from "@/lib/products";
import { defaultProjects, type Project } from "@/lib/projects";
import { defaultContactSettings, toContact, type ContactSettings } from "@/lib/site";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";

// Public content reads. Each falls back to the built-in content when Supabase isn't configured or
// the query fails, so the site keeps rendering if the database is unreachable.

type PostRow = {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  image_url: string;
  image_width: number;
  image_height: number;
  comments: number;
};

type ProductRow = {
  id: string;
  category_slug: string;
  name: string;
  description: string;
  price: string;
  price_size: string;
  images: string[];
};

const fallbackPosts: Post[] = defaultPosts.map((post) => ({ ...post, content: defaultPostContents[post.slug] ?? "" }));

export function toPost(row: PostRow): Post {
  return {
    slug: row.slug,
    title: row.title,
    date: row.date,
    comments: row.comments,
    excerpt: row.excerpt,
    content: row.content,
    image: { src: row.image_url, width: row.image_width, height: row.image_height },
  };
}

export const getPosts = cache(async (): Promise<Post[]> => {
  if (!isSupabaseConfigured) return fallbackPosts;
  const { data, error } = await createPublicClient()
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getPosts", error.message);
    return fallbackPosts;
  }
  return (data as PostRow[]).map(toPost);
});

export async function getPost(slug: string) {
  return (await getPosts()).find((post) => post.slug === slug);
}

export const getProductCategories = cache(async (): Promise<ProductCategory[]> => {
  if (!isSupabaseConfigured) return defaultProductCategories;
  const client = createPublicClient();
  const [categories, products] = await Promise.all([
    client.from("product_categories").select("*").order("sort_order"),
    client.from("products").select("*").order("sort_order").order("created_at"),
  ]);
  if (categories.error || products.error) {
    console.error("getProductCategories", categories.error?.message ?? products.error?.message);
    return defaultProductCategories;
  }
  return categories.data.map((category) => ({
    slug: category.slug,
    title: category.title,
    metaDescription: category.meta_description,
    products: (products.data as ProductRow[])
      .filter((product) => product.category_slug === category.slug)
      .map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        priceSize: product.price_size,
        images: product.images,
      })),
  }));
});

export async function getProductCategory(slug: string) {
  return (await getProductCategories()).find((category) => category.slug === slug);
}

export const getProjects = cache(async (): Promise<Project[]> => {
  if (!isSupabaseConfigured) return defaultProjects;
  const { data, error } = await createPublicClient()
    .from("projects")
    .select("id, name, location, image, date, description")
    .order("sort_order")
    .order("created_at");
  if (error) {
    console.error("getProjects", error.message);
    return defaultProjects;
  }
  return data;
});

const getSettings = cache(async (): Promise<Record<string, unknown>> => {
  if (!isSupabaseConfigured) return {};
  const { data, error } = await createPublicClient().from("settings").select("key, value");
  if (error) {
    console.error("getSettings", error.message);
    return {};
  }
  return Object.fromEntries(data.map((row) => [row.key, row.value]));
});

export async function getContactSettings(): Promise<ContactSettings> {
  const saved = (await getSettings()).contact as Partial<ContactSettings> | undefined;
  return { ...defaultContactSettings, ...saved };
}

export async function getContact() {
  return toContact(await getContactSettings());
}

export async function getChatConfig(): Promise<ChatConfig> {
  const saved = (await getSettings()).chat as Partial<ChatConfig> | undefined;
  return { ...defaultChatConfig, ...saved };
}
