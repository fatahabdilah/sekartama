import type { Metadata } from "next";
import ProductEditor from "@/components/admin/wp/ProductEditor";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "Add New Product" };

type Props = { searchParams: Promise<{ kategori?: string }> };

export default async function NewProductPage({ searchParams }: Props) {
  const { supabase } = await requireAdmin();
  const { data: categories } = await supabase.from("product_categories").select("slug, title").order("sort_order");
  return <ProductEditor categories={categories ?? []} defaultCategory={(await searchParams).kategori} />;
}
