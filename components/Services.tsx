import Image from "next/image";
import styles from "./Services.module.css";

const services = [
  {
    title: "Free Survei Jabodetabek",
    description:
      "Nikmati layanan survei gratis untuk wilayah Jabodetabek, termasuk estimasi dan konsultasi tanpa biaya tambahan.",
    image: "/images/service-survey.png",
  },
  {
    title: "Instalasi Profesional",
    description:
      "Dapatkan layanan instalasi yang dilakukan oleh tenaga ahli berpengalaman untuk memastikan hasil yang rapi, aman, dan sesuai standar.",
    image: "/images/service-installation.png",
  },
  {
    title: "Free Pengiriman Jabodetabek",
    description:
      "Layanan pengiriman gratis untuk wilayah Jabodetabek, sehingga Anda dapat menikmati kemudahan tanpa biaya tambahan.",
    image: "/images/service-delivery.png",
  },
];

export default function Services() {
  return (
    <section id="layanan" className={`section-wide ${styles.section}`}>
      <div className="container">
        <h4 className="eyebrow">Bangun Impian Anda Bersama Kami</h4>
        <h2 className={`title ${styles.title}`}>Layanan Unggulan Kami</h2>

        <div className={styles.grid}>
          {services.map((service) => (
            <article key={service.title}>
              <div className={styles.imageWrap}>
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className={styles.image}
                />
              </div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardText}>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
