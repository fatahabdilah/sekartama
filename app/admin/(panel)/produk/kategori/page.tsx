import type { Metadata } from "next";
import Link from "next/link";
import DeleteButton from "@/components/admin/wp/DeleteButton";
import ListTable from "@/components/admin/wp/ListTable";
import RowToggle from "@/components/admin/wp/RowToggle";
import SubmitButton from "@/components/admin/wp/SubmitButton";
import WpForm, { Notice } from "@/components/admin/wp/WpForm";
import { requireAdmin } from "@/lib/admin";
import { createCategory, deleteCategory } from "../../../actions";

export const metadata: Metadata = { title: "Product categories" };

type Props = { searchParams: Promise<{ added?: string; deleted?: string; error?: string; count?: string }> };

const COLUMNS = [
  { id: "name", label: "Name", primary: true },
  { id: "description", label: "Description" },
  { id: "slug", label: "Slug" },
  { id: "menu_order", label: "Order" },
  { id: "posts", label: "Count", className: "num" },
];

export default async function AdminCategoriesPage({ searchParams }: Props) {
  const { added, deleted, error, count } = await searchParams;
  const { supabase } = await requireAdmin();
  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("product_categories").select("*").order("sort_order"),
    supabase.from("products").select("category_slug"),
  ]);
  const countFor = (slug: string) => products?.filter((p) => p.category_slug === slug).length ?? 0;

  return (
    <div className="wrap nosubsub">
      <h1 className="wp-heading-inline">Product categories</h1>
      <hr className="wp-header-end" />

      {added && <Notice type="success">Category added.</Notice>}
      {deleted && <Notice type="success">Category deleted.</Notice>}
      {error === "has_products" && (
        <Notice type="error">
          This category still has {count} {count === "1" ? "product" : "products"}. Move them to another category or
          delete them first.
        </Notice>
      )}

      <div id="col-container" className="wp-clearfix">
        <div id="col-left">
          <div className="col-wrap">
            <div className="form-wrap">
              <h2>Add New Category</h2>
              <WpForm action={createCategory} id="addtag" className="validate" key={added}>
                <div className="form-field form-required term-name-wrap">
                  <label htmlFor="tag-name">Name</label>
                  <input name="name" id="tag-name" type="text" size={40} aria-required="true" aria-describedby="name-description" />
                  <p id="name-description">The name is how it appears on your site.</p>
                </div>
                <div className="form-field term-slug-wrap">
                  <label htmlFor="tag-slug">Slug</label>
                  <input name="slug" id="tag-slug" type="text" size={40} aria-describedby="slug-description" />
                  <p id="slug-description">
                    The &#8220;slug&#8221; is the URL-friendly version of the name. It is usually all lowercase and contains
                    only letters, numbers, and hyphens. The category page is <code>/produk/slug</code>.
                  </p>
                </div>
                <div className="form-field term-order-wrap">
                  <label htmlFor="tag-order">Order</label>
                  <input name="menu_order" id="tag-order" type="text" size={4} aria-describedby="order-description" style={{ width: "auto" }} />
                  <p id="order-description">Position in the Produk menu; lower numbers come first. Leave blank to add it at the end.</p>
                </div>
                <div className="form-field term-description-wrap">
                  <label htmlFor="tag-description">Description</label>
                  <textarea name="description" id="tag-description" rows={5} cols={40} aria-describedby="description-description" />
                  <p id="description-description">Shown to search engines for the category page.</p>
                </div>
                <p className="submit">
                  <SubmitButton value="Add New Category" id="submit" />
                </p>
              </WpForm>
            </div>
          </div>
        </div>

        <div id="col-right">
          <div className="col-wrap">
            <ListTable columns={COLUMNS} className="tags" itemCount={categories?.length ?? 0} empty="No categories found.">
              {categories?.map((category) => (
                <tr key={category.slug} id={`tag-${category.slug}`} className="level-0">
                  <td className="name column-name has-row-actions column-primary" data-colname="Name">
                    <strong>
                      <Link className="row-title" href={`/admin/produk/kategori/${category.slug}`} aria-label={`“${category.title}” (Edit)`}>
                        {category.title}
                      </Link>
                    </strong>
                    <div className="row-actions">
                      <span className="edit">
                        <Link href={`/admin/produk/kategori/${category.slug}`}>Edit</Link> |{" "}
                      </span>
                      <span className="trash">
                        <DeleteButton action={deleteCategory} id={category.slug} label="Delete" /> |{" "}
                      </span>
                      <span className="view">
                        <a href={`/produk/${category.slug}`} target="_blank" rel="noreferrer">
                          View
                        </a>
                      </span>
                    </div>
                    <RowToggle />
                  </td>
                  <td className="description column-description" data-colname="Description">
                    {category.meta_description}
                  </td>
                  <td className="slug column-slug" data-colname="Slug">
                    {category.slug}
                  </td>
                  <td className="menu_order column-menu_order" data-colname="Order">
                    {category.sort_order}
                  </td>
                  <td className="posts column-posts" data-colname="Count">
                    <Link href={`/admin/produk?product_cat=${category.slug}`}>{countFor(category.slug)}</Link>
                  </td>
                </tr>
              ))}
            </ListTable>
            <div className="form-wrap edit-term-notes">
              <p>
                <strong>Note:</strong>
                <br />
                Deleting a category does not delete its products — a category that still has products can&#8217;t be
                deleted. Move the products to another category first.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
