import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="beranda" className={`section-wide ${styles.hero}`}>
      <Image src="/images/hero-bg.png" alt="" fill priority sizes="100vw" className={styles.bg} />
      <div className={styles.overlay} />

      <div className={`container ${styles.content}`}>
        <p className={styles.kicker}>Distributor UPVC</p>
        <h1 className={styles.heading}>
          <span className={styles.headingLight}>Selamat datang di</span>
          <span>CV. SEKAR TAMA CONTRACTION</span>
        </h1>
        <p className={styles.lead}>
          Mitra terpercaya Anda dalam menghadirkan produk dan solusi UPVC berkualitas tinggi. Dengan pengalaman lebih
          dari 6 tahun, kami melayani pembuatan, pemasangan, hingga desain produk UPVC yang dirancang khusus sesuai
          kebutuhan Anda.
        </p>
        <div className={styles.actions}>
          <Link href="/hubungi-kami" className={`btn btn-yellow font-open-sans ${styles.action}`}>
            Hubungi Kami
          </Link>
          <a href="#layanan" className={`btn btn-outline font-open-sans ${styles.action}`}>
            Layanan Kami
          </a>
        </div>
      </div>
    </section>
  );
}
