import Image from "next/image";
import IconBadge from "@/components/IconBadge";
import styles from "./AboutStats.module.css";

const stats = [
  { icon: "/icons/stat-years.svg", value: "6+", label: "tahun memberikan layanan unggulan sejak tahun 2019" },
  { icon: "/icons/stat-experts.svg", value: "50+", label: "tenaga ahli yang berpengalaman dan profesional" },
  { icon: "/icons/stat-projects.svg", value: "200+", label: "karya selesai dengan hasil yang memuaskan" },
  {
    icon: "/icons/stat-clients.svg",
    value: "100+",
    label: "mitra dan klien yang telah memberikan kepercayaan kepada kami",
  },
];

export default function AboutStats() {
  return (
    <section className={`section-wide ${styles.section}`}>
      <Image src="/images/about-stats-bg.png" alt="" fill sizes="100vw" className={styles.bg} />
      <div className={styles.overlay} />
      <ul className={`container ${styles.grid}`}>
        {stats.map((stat) => (
          <li key={stat.value} className={styles.stat}>
            <IconBadge icon={stat.icon} />
            <div className={styles.body}>
              <p className={styles.value}>{stat.value}</p>
              <p className={styles.label}>{stat.label}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
