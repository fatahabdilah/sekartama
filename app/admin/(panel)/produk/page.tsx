import type { Metadata } from "next";
import Link from "next/link";
import DeleteButton from "@/components/admin/wp/DeleteButton";
import ListTable from "@/components/admin/wp/ListTable";
import RowToggle from "@/components/admin/wp/RowToggle";
import SearchBox from "@/components/admin/wp/SearchBox";
import { Notice } from "@/components/admin/wp/WpForm";
import { requireAdmin } from "@/lib/admin";
import { deleteProduct } from "../../actions";

export const metadata: Metadata = { title: "Products" };

type Props = { searchParams: Promise<{ product_cat?: string; s?: string; deleted?: string }> };

const COLUMNS = [
  { id: "thumb", label: "Image" },
  { id: "title", label: "Name", primary: true },
  { id: "price", label: "Price" },
  { id: "product_cat", label: "Category" },
  { id: "menu_order", label: "Order" },
];

export default async function AdminProductsPage({ searchParams }: Props) {
  const { product_cat: filter, s: search, deleted } = await searchParams;
  const { supabase } = await requireAdmin();
  const [{ data: categories }, { data: all }] = await Promise.all([
    supabase.from("product_categories").select("slug, title").order("sort_order"),
    supabase.from("products").select("id, category_slug, name, price, price_size, images, sort_order").order("sort_order").order("created_at"),
  ]);

  const titles = Object.fromEntries((categories ?? []).map((c) => [c.slug, c.title]));
  const products = (all ?? []).filter(
    (p) => (!filter || p.category_slug === filter) && (!search || p.name.toLowerCase().includes(search.toLowerCase())),
  );
  const views = [
    { key: undefined as string | undefined, label: "All", count: all?.length ?? 0 },
    ...(categories ?? []).map((c) => ({ key: c.slug, label: c.title, count: all?.filter((p) => p.category_slug === c.slug).length ?? 0 })),
  ];

  return (
    <div className="wrap">
      <h1 className="wp-heading-inline">Products</h1>
      <Link href="/admin/produk/new" className="page-title-action">
        Add New Product
      </Link>
      {search && (
        <span className="subtitle">
          Search results for: <strong>{search}</strong>
        </span>
      )}
      <hr className="wp-header-end" />

      {deleted && <Notice type="success">1 product permanently deleted.</Notice>}

      <h2 className="screen-reader-text">Filter products list</h2>
      <ul className="subsubsub">
        {views.map((view, index) => (
          <li key={view.label} className={view.key ?? "all"}>
            <Link
              href={view.key ? `/admin/produk?product_cat=${view.key}` : "/admin/produk"}
              className={filter === view.key ? "current" : undefined}
              aria-current={filter === view.key ? "page" : undefined}
            >
              {view.label} <span className="count">({view.count})</span>
            </Link>
            {index < views.length - 1 && " |"}
          </li>
        ))}
      </ul>

      <SearchBox id="post-search-input" label="Search Products" value={search} hidden={{ product_cat: filter }} />

      <h2 className="screen-reader-text">Products list</h2>
      <ListTable columns={COLUMNS} className="posts" itemCount={products.length} empty="No products found.">
        {products.map((product) => (
          <tr key={product.id} id={`post-${product.id}`} className="iedit level-0 type-product status-publish hentry">
            <td className="thumb column-thumb" data-colname="Image">
              {product.images[0] && <img src={product.images[0]} alt="" width={50} height={50} />}
            </td>
            <td className="title column-title has-row-actions column-primary" data-colname="Name">
              <strong>
                <Link className="row-title" href={`/admin/produk/${product.id}`} aria-label={`“${product.name}” (Edit)`}>
                  {product.name}
                </Link>
              </strong>
              <div className="row-actions">
                <span className="edit">
                  <Link href={`/admin/produk/${product.id}`}>Edit</Link> |{" "}
                </span>
                <span className="trash">
                  <DeleteButton action={deleteProduct} id={product.id} /> |{" "}
                </span>
                <span className="view">
                  <a href={`/produk/${product.category_slug}`} rel="bookmark" target="_blank">
                    View
                  </a>
                </span>
              </div>
              <RowToggle />
            </td>
            <td className="price column-price" data-colname="Price">
              {product.price}
              {product.price_size && (
                <>
                  <br />
                  <span className="description">{product.price_size}</span>
                </>
              )}
            </td>
            <td className="product_cat column-product_cat" data-colname="Category">
              <Link href={`/admin/produk?product_cat=${product.category_slug}`}>{titles[product.category_slug] ?? product.category_slug}</Link>
            </td>
            <td className="menu_order column-menu_order" data-colname="Order">
              {product.sort_order}
            </td>
          </tr>
        ))}
      </ListTable>
      <div className="clear" />
    </div>
  );
}
