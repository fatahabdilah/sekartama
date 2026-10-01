import Link from "next/link";
import IconBadge from "@/components/IconBadge";
import styles from "./AboutIntro.module.css";

const features = [
  {
    icon: "/icons/about-team.svg",
    title: "Tim Profesional",
    description:
      "Kami memiliki tim tenaga ahli yang berpengalaman dan profesional untuk memastikan hasil yang berkualitas.",
  },
  {
    icon: "/icons/about-history.svg",
    title: "Pengalaman dan Sejarah",
    description: "Lebih dari 6 tahun menghadirkan layanan unggulan dengan hasil memuaskan.",
  },
  {
    icon: "/icons/about-economy.svg",
    title: "Hasil Ekonomi yang Optimal",
    description: "Kami membantu klien mencapai efisiensi biaya tanpa mengurangi kualitas.",
  },
];

export default function AboutIntro() {
  return (
    <section className={`section-wide ${styles.section}`}>
      <div className={`container ${styles.row}`}>
        <div>
          <h3 className={`eyebrow ${styles.eyebrow}`}>Tentang Kami</h3>
          <h2 className={`title ${styles.title}`}>Kami Adalah Perusahaan Terkemuka di Bidang UPVC</h2>
          <div className={styles.text}>
            <p>
              CV. SEKAR TAMA adalah mitra terpercaya Anda dalam menghadirkan solusi pintu dan jendela UPVC berkualitas
              tinggi sejak tahun 2019. Dengan pengalaman lebih dari 6 tahun, kami berkomitmen untuk memberikan layanan
              terbaik yang berfokus pada kebutuhan UPVC.
            </p>
            <p>
              Kami selalu memprioritaskan inovasi, keselamatan, dan kepuasan klien dalam setiap layanan yang kami
              tangani.
            </p>
          </div>
          <Link href="/hubungi-kami" className={`btn btn-yellow ${styles.cta}`}>
            Hubungi Kami
          </Link>
        </div>

        <ul className={styles.features}>
          {features.map((feature) => (
            <li key={feature.title} className={styles.feature}>
              <IconBadge icon={feature.icon} />
              <div className={styles.featureBody}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureText}>{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
