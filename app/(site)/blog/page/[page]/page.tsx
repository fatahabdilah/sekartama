import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPage, getTotalBlogPages } from "@/components/blog/BlogPage";

type Props = { params: Promise<{ page: string }> };

// Page 1 lives at /blog; this route serves /blog/page/2 onwards.
export async function generateStaticParams() {
  return Array.from({ length: (await getTotalBlogPages()) - 1 }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Blog - Halaman ${(await params).page}` };
}

export default async function BlogPaginated({ params }: Props) {
  const page = Number((await params).page);
  if (!Number.isInteger(page) || page < 2 || page > (await getTotalBlogPages())) notFound();
  return <BlogPage page={page} />;
}
