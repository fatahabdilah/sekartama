import Image from "next/image";
import styles from "./PageHero.module.css";

type PageHeroProps = {
  title: string;
  image?: string;
};

export default function PageHero({ title, image = "/images/hero-bg.png" }: PageHeroProps) {
  return (
    <section className={`section-wide ${styles.hero}`}>
      <Image src={image} alt="" fill priority sizes="100vw" className={styles.bg} />
      <div className={styles.overlay} />
      <h1 className={styles.title}>{title}</h1>
    </section>
  );
}
