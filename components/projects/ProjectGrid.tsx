import Image from "next/image";
import type { Project } from "@/lib/projects";
import styles from "./ProjectGrid.module.css";

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <section className={`section-wide ${styles.section}`}>
      <div className="container">
        <header className={styles.header}>
          <h3 className={`eyebrow ${styles.eyebrow}`}>Proyek Kami</h3>
          <h2 className={`title ${styles.title}`}>Proyek Terbaru</h2>
        </header>

        <ul className={styles.grid}>
          {projects.map((project) => (
            <li key={project.id ?? project.name} className={styles.card}>
              <Image
                src={project.image}
                alt={project.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 285px"
                className={styles.image}
              />
              <div className={styles.caption}>
                <h3 className={styles.name}>{project.name}</h3>
                <p className={styles.location}>{project.location}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
