import styles from "./AboutStory.module.css";

const missions = [
  "Menyediakan produk kusen UPVC yang tahan lama, tahan cuaca, dan memiliki daya tahan tinggi terhadap korosi, guna mendukung kualitas bangunan yang lebih baik.",
  "Memberikan pelayanan terbaik kepada pelanggan, termasuk konsultasi, pemasangan, dan layanan purna jual yang cepat dan responsif.",
  "Meningkatkan kesadaran dan edukasi pasar mengenai keunggulan kusen UPVC sebagai material bangunan yang lebih efisien, tahan lama, dan ramah lingkungan.",
];

export default function AboutStory() {
  return (
    <section className={`section-wide ${styles.section}`}>
      <div className="container">
        <p className={styles.kicker}>Cerita Kami</p>
        <h2 className={`title ${styles.title}`}>Perjalanan Kami Hingga Saat Ini</h2>
        <p className={styles.text}>
          Kami percaya bahwa setiap orang memiliki potensi untuk meraih keunggulan dan mewujudkan impian mereka. Oleh
          karena itu, kami berkomitmen untuk menyediakan solusi inovatif dan layanan unggul yang memberdayakan individu
          dalam mengatasi tantangan serta mewujudkan aspirasi mereka. Dengan fokus yang kuat pada kepuasan pelanggan dan
          tim profesional yang berpengalaman, kami berusaha memberikan hasil yang tak tertandingi serta berdampak positif
          bagi kehidupan klien kami. Bergabunglah bersama kami dalam perjalanan ini, dan izinkan kami membantu mewujudkan
          impian Anda.
        </p>

        <div className={styles.rows}>
          <div className={styles.row}>
            <h3 className={styles.rowTitle}>VISI</h3>
            <p>
              Menjadi pemimpin pasar dalam industri konstruksi dengan menyediakan solusi kusen UPVC yang berkualitas
              tinggi, ramah lingkungan, dan inovatif, serta menjadi pilihan utama bagi pelanggan yang mengutamakan
              ketahanan dan efisiensi energi.
            </p>
          </div>
          <div className={styles.row}>
            <h3 className={styles.rowTitle}>MISI</h3>
            <ol className={styles.missions}>
              {missions.map((mission) => (
                <li key={mission}>{mission}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
