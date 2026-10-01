"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems, type NavItem } from "@/lib/site";
import styles from "./Header.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const matches = (href: string) => href === pathname || (href !== "/" && pathname.startsWith(`${href}/`));
  const isActive = (item: NavItem) => matches(item.href) || Boolean(item.children?.some((child) => matches(child.href)));

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="Sekar Tama UPVC">
          <Image src="/images/logo.png" alt="Sekar Tama UPVC" width={128} height={45} priority />
        </Link>

        <button
          type="button"
          className={styles.toggle}
          aria-label="Buka menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label="Primary Menu">
          <ul className={styles.list}>
            {navItems.map((item) => (
              <li key={item.label} className={item.children ? styles.hasChildren : undefined}>
                <Link
                  href={item.href}
                  className={`${styles.link} ${isActive(item) ? styles.active : ""}`}
                  aria-current={item.href === pathname ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                  {item.children && (
                    <Image
                      className={styles.caret}
                      src="/icons/chevron-down.svg"
                      alt=""
                      width={9}
                      height={9}
                    />
                  )}
                </Link>
                {item.children && (
                  <ul className={styles.submenu}>
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link href={child.href} onClick={() => setMenuOpen(false)}>
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
