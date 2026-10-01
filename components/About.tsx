import Link from "next/link";
import styles from "./About.module.css";

const stats = [
  { value: "6+", label: "tahun memberikan layanan unggulan sejak tahun 2019" },
  { value: "50+", label: "tenaga ahli yang berpengalaman dan profesional" },
  { value: "200+", label: "karya selesai dengan hasil yang memuaskan" },
  { value: "100+", label: "mitra dan klien yang telah memberikan kepercayaan kepada kami" },
];

export default function About() {
  return (
    <section id="tentang" className={`section-wide ${styles.section}`}>
      <div className={`container ${styles.row}`}>
        <div className={styles.intro}>
          <h4 className="eyebrow">Bangun Impian Anda Bersama Kami</h4>
          <h2 className={styles.title}>Selama lebih dari 6 tahun,</h2>
          <p className={styles.text}>
            CV. SEKAR TAMA adalah mitra terpercaya yang sepenuhnya berfokus pada jasa pintu dan jendela UPVC. Dengan
            mengutamakan kualitas dan kepuasan pelanggan, kami menawarkan solusi inovatif yang dirancang khusus untuk
            memenuhi kebutuhan Anda. Komitmen kami adalah memberikan hasil yang tahan lama dan berkualitas tinggi.
          </p>
          <Link href="/tentang" className={`btn btn-navy ${styles.cta}`}>
            Tentang Kami
          </Link>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.value} className={styles.stat}>
                <div className={styles.statInner}>
                  <p className={styles.value}>{stat.value}</p>
                  <p className={styles.label}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
