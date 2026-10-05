import Link from "next/link";
import { deleteProduct, saveProduct } from "@/app/admin/actions";
import GalleryBox from "./GalleryBox";
import Postbox from "./Postbox";
import PublishBox from "./PublishBox";
import TitleField from "./TitleField";
import WpForm from "./WpForm";

export type ProductRecord = {
  id: string;
  category_slug: string;
  name: string;
  description: string;
  price: string;
  price_size: string;
  images: string[];
  sort_order: number;
};

type Props = {
  product?: ProductRecord;
  categories: { slug: string; title: string }[];
  defaultCategory?: string;
  message?: React.ReactNode;
};

export default function ProductEditor({ product, categories, defaultCategory, message }: Props) {
  const category = product?.category_slug ?? defaultCategory ?? categories[0]?.slug;
  return (
    <div className="wrap">
      <h1 className="wp-heading-inline">{product ? "Edit Product" : "Add New Product"}</h1>
      {product && (
        <Link href="/admin/produk/new" className="page-title-action">
          Add New Product
        </Link>
      )}
      <hr className="wp-header-end" />

      <WpForm action={saveProduct} name="post" id="post" initialMessage={message}>
        {product && <input type="hidden" name="id" value={product.id} />}
        <div id="poststuff">
          <div id="post-body" className="metabox-holder columns-2">
            <div id="post-body-content" style={{ position: "relative" }}>
              <TitleField defaultValue={product?.name} placeholder="Product name" />
            </div>

            <div id="postbox-container-1" className="postbox-container">
              <div id="side-sortables" className="meta-box-sortables">
                <PublishBox isNew={!product} id={product?.id} deleteAction={deleteProduct} />
                <Postbox id="product_catdiv" title="Product category">
                  <div id="taxonomy-product_cat" className="categorydiv">
                    <div id="product_cat-all" className="tabs-panel">
                      <ul id="product_catchecklist" className="categorychecklist form-no-clear">
                        {categories.map((option) => (
                          <li key={option.slug} id={`product_cat-${option.slug}`}>
                            <label className="selectit">
                              <input type="radio" name="category_slug" value={option.slug} defaultChecked={option.slug === category} />{" "}
                              {option.title}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Postbox>
                <Postbox id="pageparentdiv" title="Product Attributes">
                  <p className="post-attributes-label-wrapper menu-order-label-wrapper">
                    <label className="post-attributes-label" htmlFor="menu_order">
                      Order
                    </label>
                  </p>
                  <input name="menu_order" type="text" size={4} id="menu_order" defaultValue={product?.sort_order ?? 0} />
                  <p className="post-attributes-help-text">Lower numbers are shown first.</p>
                </Postbox>
              </div>
            </div>

            <div id="postbox-container-2" className="postbox-container">
              <div id="normal-sortables" className="meta-box-sortables">
                <Postbox id="product_data" title="Product data">
                  <table className="form-table" role="presentation">
                    <tbody>
                      <tr>
                        <th scope="row">
                          <label htmlFor="price">Price from</label>
                        </th>
                        <td>
                          <input name="price" id="price" type="text" className="regular-text" defaultValue={product?.price} placeholder="Rp. 1.600.000" />
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">
                          <label htmlFor="price_size">For size</label>
                        </th>
                        <td>
                          <input name="price_size" id="price_size" type="text" className="regular-text" defaultValue={product?.price_size} placeholder="90cm x 210cm" />
                          <p className="description">The size the starting price applies to. Every product can be made to a custom size.</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Postbox>
                <Postbox id="postexcerpt" title="Product description">
                  <label className="screen-reader-text" htmlFor="description">
                    Product description
                  </label>
                  <textarea rows={6} cols={40} name="description" id="description" defaultValue={product?.description} style={{ width: "100%", boxSizing: "border-box" }} />
                </Postbox>
                <GalleryBox name="images" folder="products" defaultValue={product?.images} />
              </div>
            </div>
          </div>
          <br className="clear" />
        </div>
      </WpForm>
    </div>
  );
}
