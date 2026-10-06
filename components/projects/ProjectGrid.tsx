"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import styles from "./ProjectGrid.module.css";

const dateFormat = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (selected) dialog.current?.showModal();
  }, [selected]);

  return (
    <section className={`section-wide ${styles.section}`}>
      <div className="container">
        <header className={styles.header}>
          <h3 className={`eyebrow ${styles.eyebrow}`}>Proyek Kami</h3>
          <h2 className={`title ${styles.title}`}>Proyek Terbaru</h2>
        </header>

        <ul className={styles.grid}>
          {projects.map((project) => (
            <li key={project.id ?? project.name}>
              <button
                type="button"
                className={styles.card}
                onClick={() => setSelected(project)}
                aria-haspopup="dialog"
                aria-label={`Lihat detail ${project.name}`}
              >
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
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialog}
        className={styles.modal}
        aria-labelledby="project-modal-title"
        onClose={() => setSelected(null)}
        // Clicking the backdrop (the dialog element itself, outside the content) closes it.
        onClick={(event) => event.target === event.currentTarget && dialog.current?.close()}
      >
        {selected && (
          <div className={styles.modalContent}>
            <div className={styles.modalImage}>
              <Image src={selected.image} alt={selected.name} fill sizes="(max-width: 760px) 90vw, 700px" className={styles.image} />
              <button type="button" className={styles.close} onClick={() => dialog.current?.close()} aria-label="Tutup">
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <h2 id="project-modal-title" className={styles.modalTitle}>
                {selected.name}
              </h2>
              <div className={styles.meta}>
                {selected.date && (
                  <p>
                    <span aria-hidden="true">📅</span> <time dateTime={selected.date}>{dateFormat.format(new Date(selected.date))}</time>
                  </p>
                )}
                <p>
                  <span aria-hidden="true">📍</span> {selected.location}
                </p>
              </div>
              {selected.description && <p className={styles.description}>{selected.description}</p>}
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
