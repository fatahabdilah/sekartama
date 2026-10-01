import Image from "next/image";
import Link from "next/link";
import styles from "./Commitment.module.css";

const advantages = [
  { label: "Sustainability", icon: "/icons/sustainability.svg" },
  { label: "Project On Time", icon: "/icons/project-on-time.svg" },
  { label: "Modern Technology", icon: "/icons/modern-technology.svg" },
  { label: "Latest Designs", icon: "/icons/latest-designs.svg" },
];

export default function Commitment() {
  return (
    <section className={`section-wide ${styles.section}`}>
      <div className={`${styles.panel} ${styles.commitment}`}>
        <Image src="/images/commitment-bg.png" alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className={styles.bg} />
        <div className={styles.overlay} />
        <div className={styles.commitmentContent}>
          <h4 className={`eyebrow ${styles.eyebrowYellow}`}>Komitmen Kami</h4>
          <h2 className={`title ${styles.titleWhite}`}>Kami berkomitmen untuk memberikan hasil terbaik,</h2>
          <p className={styles.textWhite}>
            dengan prioritas pada kesehatan, keselamatan, dan kenyamanan di setiap proyek yang kami tangani.
          </p>
          <Link href="/hubungi-kami" className={`btn btn-yellow ${styles.cta}`}>
            Hubungi Kami
          </Link>
        </div>
      </div>

      <div className={`${styles.panel} ${styles.advantage}`}>
        <Image src="/images/advantage-bg.png" alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className={styles.bg} />
        <div className={styles.overlay} />
        <div className={styles.advantageContent}>
          <h3 className={styles.advantageTitle}>Keunggulan Kami</h3>
          <p className={styles.advantageText}>
            Kami hadir dengan produk dan layanan terbaik yang dirancang untuk memenuhi kebutuhan Anda.
          </p>
          <ul className={styles.list}>
            {advantages.map((item) => (
              <li key={item.label} className={styles.item}>
                <Image src={item.icon} alt="" width={20} height={20} className={styles.icon} />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
