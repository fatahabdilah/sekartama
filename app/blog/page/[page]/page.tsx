import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPage, totalBlogPages } from "@/components/blog/BlogPage";

type Props = { params: Promise<{ page: string }> };

export const dynamicParams = false;

// Page 1 lives at /blog; this route serves /blog/page/2 onwards.
export function generateStaticParams() {
  return Array.from({ length: totalBlogPages - 1 }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Blog - Halaman ${(await params).page}` };
}

export default async function BlogPaginated({ params }: Props) {
  const page = Number((await params).page);
  if (!Number.isInteger(page) || page < 2 || page > totalBlogPages) notFound();
  return <BlogPage page={page} />;
}
