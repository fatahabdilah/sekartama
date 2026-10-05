import type { Product } from "@/lib/products";
import ProductCarousel from "./ProductCarousel";
import styles from "./ProductList.module.css";

function whatsappLink(whatsappUrl: string, productName: string) {
  const text = `Halo CV. Sekar Tama, saya ingin konsultasi tentang ${productName}.`;
  return `${whatsappUrl}?text=${encodeURIComponent(text)}`;
}

export default function ProductList({ products, whatsappUrl }: { products: Product[]; whatsappUrl: string }) {
  return (
    <section className={`section-wide ${styles.section}`}>
      <div className={`container ${styles.list}`}>
        {products.map((product, index) => (
          <article key={product.id ?? product.name} className={`${styles.row} ${index % 2 === 1 ? styles.reverse : ""}`}>
            <ProductCarousel images={product.images} alt={product.name} />
            <div className={styles.body}>
              <h2 className={styles.name}>{product.name}</h2>
              <p className={styles.description}>{product.description}</p>
              <ul className={styles.specs}>
                <li>
                  Ukuran: <strong>Custom</strong>, dapat disesuaikan sesuai kebutuhan
                </li>
                <li>
                  Mulai dari <strong>{product.price}</strong> ({product.priceSize})
                </li>
              </ul>
              <a
                href={whatsappLink(whatsappUrl, product.name)}
                target="_blank"
                rel="noreferrer"
                className={`btn btn-yellow ${styles.cta}`}
              >
                Konsultasi via WhatsApp
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
