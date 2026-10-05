import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import ProductList from "@/components/products/ProductList";
import { getContact, getProductCategories, getProductCategory } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProductCategories()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getProductCategory((await params).slug);
  return category ? { title: category.title, description: category.metaDescription } : {};
}

export default async function ProductCategoryPage({ params }: Props) {
  const [category, contact] = await Promise.all([getProductCategory((await params).slug), getContact()]);
  if (!category) notFound();

  return (
    <>
      <PageHero title={category.title} />
      <ProductList products={category.products} whatsappUrl={contact.whatsappUrl} />
    </>
  );
}
