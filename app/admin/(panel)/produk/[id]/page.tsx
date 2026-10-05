import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductEditor, { type ProductRecord } from "@/components/admin/wp/ProductEditor";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "Edit Product" };

const MESSAGES: Record<string, string> = { published: "Product published.", updated: "Product updated." };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ message?: string }> };

export default async function EditProductPage({ params, searchParams }: Props) {
  const { supabase } = await requireAdmin();
  const [{ id }, { message }] = await Promise.all([params, searchParams]);
  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle<ProductRecord>(),
    supabase.from("product_categories").select("slug, title").order("sort_order"),
  ]);
  if (!product) notFound();

  const notice = message && MESSAGES[message] && (
    <>
      {MESSAGES[message]}{" "}
      <a href={`/produk/${product.category_slug}`} target="_blank" rel="noreferrer">
        View product
      </a>
    </>
  );
  return <ProductEditor key={JSON.stringify(product)} product={product} categories={categories ?? []} message={notice || undefined} />;
}
