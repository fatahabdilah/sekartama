import Image from "next/image";
import Link from "next/link";
import styles from "./Projects.module.css";

const projects = [
  { name: "Cluster Depok", location: "Kecamatan Beji, Kota Depok", image: "/images/project-depok.png" },
  {
    name: "Cluster Alam Sutera",
    location: "Kecamatan Serpong Utara, Kota Tangerang Selatan",
    image: "/images/project-alam-sutera.png",
  },
  {
    name: "Cluster Pondok Cabe",
    location: "Kecamatan Pamulang, Kota Tangerang Selatan",
    image: "/images/project-pondok-cabe.png",
  },
  {
    name: "Cluster Serpong",
    location: "Kecamatan Serpong, Kota Tangerang Selatan",
    image: "/images/project-serpong.png",
  },
];

export default function Projects() {
  return (
    <section id="proyek">
      <div className={`section-wide ${styles.header}`}>
        <div className={`container ${styles.headerInner}`}>
          <div>
            <h4 className={`eyebrow ${styles.eyebrow}`}>Proyek Kami</h4>
            <h2 className={`title ${styles.title}`}>Proyek Terbaru</h2>
          </div>
          <Link href="/proyek" className={`font-open-sans ${styles.viewAll}`}>
            Lihat Semua Proyek
            <Image src="/icons/arrow-right.svg" alt="" width={15} height={15} className={styles.arrow} />
          </Link>
        </div>
      </div>

      <div className={`section-wide ${styles.grid}`}>
        {projects.map((project) => (
          <article key={project.name} className={styles.card}>
            <Image
              src={project.image}
              alt={project.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={styles.image}
            />
            <div className={styles.overlay} />
            <div className={styles.caption}>
              <h3 className={styles.name}>{project.name}</h3>
              <p className={styles.location}>{project.location}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
