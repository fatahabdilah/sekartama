import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteButton from "@/components/admin/wp/DeleteButton";
import SubmitButton from "@/components/admin/wp/SubmitButton";
import WpForm from "@/components/admin/wp/WpForm";
import { requireAdmin } from "@/lib/admin";
import { deleteCategory, saveCategory } from "../../../../actions";

export const metadata: Metadata = { title: "Edit Category" };

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ message?: string }> };

export default async function EditCategoryPage({ params, searchParams }: Props) {
  const { supabase } = await requireAdmin();
  const [{ slug }, { message }] = await Promise.all([params, searchParams]);
  const { data: category } = await supabase.from("product_categories").select("*").eq("slug", slug).maybeSingle();
  if (!category) notFound();

  return (
    <div className="wrap">
      <h1>Edit Category</h1>
      <WpForm
        action={saveCategory}
        name="edittag"
        id="edittag"
        className="validate"
        key={JSON.stringify(category)}
        initialMessage={
          message === "updated" && (
            <>
              Category updated. <Link href="/admin/produk/kategori">&larr; Go to Product categories</Link>
            </>
          )
        }
      >
        <input type="hidden" name="original_slug" value={category.slug} />
        <input type="hidden" name="id" value={category.slug} />
        <table className="form-table" role="presentation">
          <tbody>
            <tr className="form-field form-required term-name-wrap">
              <th scope="row">
                <label htmlFor="name">Name</label>
              </th>
              <td>
                <input name="name" id="name" type="text" defaultValue={category.title} size={40} aria-required="true" aria-describedby="name-description" />
                <p className="description" id="name-description">
                  The name is how it appears on your site.
                </p>
              </td>
            </tr>
            <tr className="form-field term-slug-wrap">
              <th scope="row">
                <label htmlFor="slug">Slug</label>
              </th>
              <td>
                <input name="slug" id="slug" type="text" defaultValue={category.slug} size={40} aria-describedby="slug-description" />
                <p className="description" id="slug-description">
                  The &#8220;slug&#8221; is the URL-friendly version of the name. It is usually all lowercase and contains
                  only letters, numbers, and hyphens. Changing it changes the category page address (
                  <code>/produk/{category.slug}</code>).
                </p>
              </td>
            </tr>
            <tr className="form-field term-order-wrap">
              <th scope="row">
                <label htmlFor="menu_order">Order</label>
              </th>
              <td>
                <input name="menu_order" id="menu_order" type="text" defaultValue={category.sort_order} size={4} style={{ width: "auto" }} aria-describedby="order-description" />
                <p className="description" id="order-description">
                  Position in the Produk menu; lower numbers come first.
                </p>
              </td>
            </tr>
            <tr className="form-field term-description-wrap">
              <th scope="row">
                <label htmlFor="description">Description</label>
              </th>
              <td>
                <textarea name="description" id="description" rows={5} cols={50} className="large-text" defaultValue={category.meta_description} aria-describedby="description-description" />
                <p className="description" id="description-description">
                  Shown to search engines for the category page.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="edit-tag-actions">
          <SubmitButton value="Update" />
          <span id="delete-link">
            <DeleteButton action={deleteCategory} id={category.slug} label="Delete" inForm className="delete" />
          </span>
        </div>
      </WpForm>
    </div>
  );
}
