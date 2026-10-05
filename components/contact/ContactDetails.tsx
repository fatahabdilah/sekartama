import type { Contact } from "@/lib/site";
import styles from "./ContactDetails.module.css";

export default function ContactDetails({ contact }: { contact: Contact }) {
  return (
    <section className={`section-wide ${styles.section}`}>
      <div className="container">
        <header className={styles.header}>
          <h3 className={`eyebrow ${styles.eyebrow}`}>Kontak Kami</h3>
          <h2 className={`title ${styles.title}`}>Detail Kontak</h2>
        </header>

        <div className={styles.row}>
          <div className={styles.details}>
            <h3 className={styles.office}>
              Kantor Pusat
              <br />
              CV. SEKAR TAMA CONTRACTION
            </h3>
            <address className={styles.list}>
              <div>
                <h4 className={styles.label}>Alamat:</h4>
                <p>{contact.address}</p>
              </div>
              <div>
                <h4 className={styles.label}>Telepon &amp; WhatsApp:</h4>
                <a href={contact.whatsappUrl} target="_blank" rel="noreferrer">
                  {contact.phone}
                </a>
              </div>
              <div>
                <h4 className={styles.label}>Email:</h4>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </div>
            </address>
          </div>

          <iframe
            className={styles.map}
            src={contact.mapEmbedUrl}
            title="Lokasi CV. SEKAR TAMA CONTRACTION di Google Maps"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
