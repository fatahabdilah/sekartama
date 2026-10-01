"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { contact } from "@/lib/site";
import styles from "./NewsletterFaq.module.css";

// The Figma design only shows the questions; answers are drafted from the page copy — adjust as needed.
const faqs = [
  {
    question: "Apa saja layanan utama CV. SEKAR TAMA CONTRACTION?",
    answer:
      "Kami melayani pembuatan, pemasangan, hingga desain produk UPVC seperti pintu dan jendela yang dirancang khusus sesuai kebutuhan Anda.",
  },
  {
    question: "Apakah survei gratis berlaku di luar Jabodetabek?",
    answer:
      "Survei gratis berlaku untuk wilayah Jabodetabek. Untuk lokasi di luar Jabodetabek, silakan hubungi kami untuk informasi lebih lanjut.",
  },
  {
    question: "Bagaimana cara melakukan pemesanan produk?",
    answer: `Hubungi kami melalui WhatsApp di ${contact.phone} atau email ${contact.email}. Tim kami akan membantu konsultasi, survei, hingga pemasangan.`,
  },
  {
    question: "Bagaimana cara mendapatkan informasi promo terbaru?",
    answer: `Daftarkan email Anda melalui formulir di samping, atau ikuti Instagram kami ${contact.instagram}.`,
  },
  {
    question: "Apakah produk UPVC bisa disesuaikan dengan ukuran yang diinginkan?",
    answer: "Bisa. Setiap produk UPVC kami dibuat khusus sesuai ukuran dan kebutuhan Anda.",
  },
];

export default function NewsletterFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: connect to a newsletter/email backend.
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <section id="kontak" className={`container ${styles.section}`}>
      <div className={styles.newsletter}>
        <div>
          <h2 className={`title ${styles.newsletterTitle}`}>Siap mendapatkan promo terbaik dari kami?</h2>
          <p className={styles.newsletterText}>
            Masukkan email Anda untuk menerima informasi promo, produk terbaru, dan penawaran eksklusif.
          </p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            aria-label="Email"
            className={styles.input}
            onChange={() => setSubmitted(false)}
          />
          <button type="submit" className={`btn btn-yellow ${styles.submit}`}>
            Daftar Sekarang
          </button>
          {submitted && <p className={styles.success}>Terima kasih! Email Anda sudah terdaftar.</p>}
        </form>
      </div>

      <div className={styles.faq}>
        <div>
          <h4 className={`eyebrow ${styles.faqEyebrow}`}>Butuh Bantuan?</h4>
          <h2 className={`title ${styles.faqTitle}`}>Kami Punya Jawabannya!</h2>
        </div>
        <div className={styles.tabs}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className={styles.tab}>
                <button
                  type="button"
                  className={styles.question}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${index}`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span>{faq.question}</span>
                  <Image
                    src="/icons/chevron-faq.svg"
                    alt=""
                    width={12}
                    height={12}
                    className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`}
                  />
                </button>
                <div id={`faq-${index}`} className={`${styles.answer} ${isOpen ? styles.answerOpen : ""}`}>
                  <div>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
