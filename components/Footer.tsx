import Image from "next/image";
import Link from "next/link";
import type { Contact, NavItem } from "@/lib/site";
import styles from "./Footer.module.css";

export default function Footer({ contact, navItems }: { contact: Contact; navItems: NavItem[] }) {
  const contactItems = [
    { icon: "/icons/location.svg", label: contact.address },
    { icon: "/icons/email.svg", label: contact.email, href: `mailto:${contact.email}` },
    { icon: "/icons/phone.svg", label: contact.phone, href: contact.whatsappUrl },
    { icon: "/icons/instagram.svg", label: contact.instagramHandle, href: contact.instagramUrl },
  ];

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.about}>
          <h2 className={styles.brand}>CV. SEKAR TAMA CONTRACTION</h2>
          <p className={styles.aboutText}>
            Berdiri sejak 2019, CV. Sekar Tama fokus pada bidang uPVC, meliputi penyediaan produk berkualitas tinggi dan
            layanan pemasangan profesional dengan komitmen terhadap hasil terbaik.
          </p>
        </div>

        <div className={styles.contact}>
          <h2 className={styles.heading}>Kontak dan Media Sosial</h2>
          <ul className={styles.contactList}>
            {contactItems.map((item) => {
              const content = (
                <>
                  <Image src={item.icon} alt="" width={16} height={16} className={styles.icon} />
                  <span>{item.label}</span>
                </>
              );
              return (
                <li key={item.label}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className={styles.contactItem}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                    >
                      {content}
                    </a>
                  ) : (
                    <p className={styles.contactItem}>{content}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <nav aria-label="Quick Menu">
          <h2 className={styles.menuHeading}>Quick Menu</h2>
          <ul className={styles.menu}>
            {navItems.map((item) => (
              <li key={item.label}>
                <Link href={item.href}>{item.label}</Link>
                {item.children && (
                  <ul className={styles.submenu}>
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link href={child.href}>{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
