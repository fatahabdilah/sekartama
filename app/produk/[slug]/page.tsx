import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import ProductList from "@/components/products/ProductList";
import { getProductCategory, productCategories } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return productCategories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getProductCategory((await params).slug);
  return category ? { title: category.title, description: category.metaDescription } : {};
}

export default async function ProductCategoryPage({ params }: Props) {
  const category = getProductCategory((await params).slug);
  if (!category) notFound();

  return (
    <>
      <PageHero title={category.title} />
      <ProductList products={category.products} />
    </>
  );
}
