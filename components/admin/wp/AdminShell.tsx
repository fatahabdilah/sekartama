"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { adminMenu, type MenuItem } from "./menu";

const FOLD_KEY = "sekar-admin-folded";
const AVATAR = "https://secure.gravatar.com/avatar/?d=mm&r=g";

function isInSection(pathname: string, item: MenuItem) {
  return item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
}

function MenuTop({ item, pathname, first, last }: { item: MenuItem; pathname: string; first: boolean; last: boolean }) {
  const current = isInSection(pathname, item);
  const hasSubmenu = Boolean(item.submenu);
  const state = hasSubmenu
    ? current
      ? "wp-has-submenu wp-has-current-submenu wp-menu-open"
      : "wp-has-submenu wp-not-current-submenu"
    : current
      ? "current"
      : "wp-not-current-submenu";
  const classes = [
    first && "wp-first-item",
    state,
    "menu-top",
    first && "menu-top-first",
    last && "menu-top-last",
    `menu-icon-${item.id}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <li className={classes} id={`menu-${item.id}`}>
      <Link
        href={item.href}
        className={classes}
        aria-haspopup={hasSubmenu && !current ? true : undefined}
        aria-current={!hasSubmenu && current ? "page" : undefined}
      >
        <div className="wp-menu-arrow">
          <div />
        </div>
        <div className={`wp-menu-image dashicons-before ${item.icon}`} aria-hidden="true">
          <br />
        </div>
        <div className="wp-menu-name">{item.label}</div>
      </Link>
      {item.submenu && (
        <ul className="wp-submenu wp-submenu-wrap">
          <li className="wp-submenu-head" aria-hidden="true">
            {item.label}
          </li>
          {item.submenu.map((sub, index) => {
            const subCurrent = pathname === sub.href;
            const subClasses = [index === 0 && "wp-first-item", subCurrent && "current"].filter(Boolean).join(" ");
            return (
              <li key={sub.href} className={subClasses || undefined}>
                <Link href={sub.href} className={subClasses || undefined} aria-current={subCurrent ? "page" : undefined}>
                  {sub.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

export default function AdminShell({ displayName, children }: { displayName: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [folded, setFolded] = useState(false);
  const [responsiveOpen, setResponsiveOpen] = useState(false);

  useEffect(() => {
    try {
      setFolded(localStorage.getItem(FOLD_KEY) === "1");
    } catch {
      // Storage unavailable; keep the menu expanded.
    }
  }, []);

  useEffect(() => setResponsiveOpen(false), [pathname]);

  function toggleFold() {
    setFolded((value) => {
      try {
        localStorage.setItem(FOLD_KEY, value ? "0" : "1");
      } catch {
        // Not persisted; fine.
      }
      return !value;
    });
  }

  const tops = adminMenu.filter((entry) => entry !== "separator");

  return (
    <div
      className={`wp-root wp-toolbar wp-admin wp-core-ui js auto-fold admin-bar admin-color-fresh locale-en-us ${
        folded ? "folded" : ""
      }`}
    >
      <div id="wpwrap" className={responsiveOpen ? "wp-responsive-open" : undefined}>
        <div id="adminmenumain" role="navigation" aria-label="Main menu">
          <div id="adminmenuback" />
          <div id="adminmenuwrap">
            <ul id="adminmenu">
              {adminMenu.map((entry, index) =>
                entry === "separator" ? (
                  <li key={`sep-${index}`} className="wp-not-current-submenu wp-menu-separator" aria-hidden="true">
                    <div className="separator" />
                  </li>
                ) : (
                  <MenuTop
                    key={entry.id}
                    item={entry}
                    pathname={pathname}
                    first={entry === tops[0]}
                    last={entry === tops.at(-1)}
                  />
                ),
              )}
              <li id="collapse-menu" className="hide-if-no-js">
                <button
                  type="button"
                  id="collapse-button"
                  aria-label={folded ? "Expand Main menu" : "Collapse Main menu"}
                  aria-expanded={!folded}
                  onClick={toggleFold}
                >
                  <span className="collapse-button-icon" aria-hidden="true" />
                  <span className="collapse-button-label">Collapse menu</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div id="wpcontent">
          <div id="wpadminbar" className="nojs">
            <div className="quicklinks" id="wp-toolbar" role="navigation" aria-label="Toolbar">
              <ul role="menu" id="wp-admin-bar-root-default" className="ab-top-menu">
                <li role="group" id="wp-admin-bar-menu-toggle">
                  <a
                    className="ab-item"
                    href="#"
                    role="menuitem"
                    aria-expanded={responsiveOpen}
                    onClick={(event) => {
                      event.preventDefault();
                      setResponsiveOpen((open) => !open);
                    }}
                  >
                    <span className="ab-icon" aria-hidden="true" />
                    <span className="screen-reader-text">Menu</span>
                  </a>
                </li>
                <li role="group" id="wp-admin-bar-site-name" className="menupop">
                  <a className="ab-item" role="menuitem" aria-haspopup="true" href="/" target="_blank" rel="noreferrer">
                    Sekar Tama UPVC
                  </a>
                  <div className="ab-sub-wrapper">
                    <ul role="menu" id="wp-admin-bar-site-name-default" className="ab-submenu">
                      <li role="group" id="wp-admin-bar-view-site">
                        <a className="ab-item" role="menuitem" href="/" target="_blank" rel="noreferrer">
                          Visit Site
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li role="group" id="wp-admin-bar-new-content" className="menupop">
                  <Link className="ab-item" role="menuitem" aria-haspopup="true" href="/admin/blog/new">
                    <span className="ab-icon" aria-hidden="true" />
                    <span className="ab-label">New</span>
                  </Link>
                  <div className="ab-sub-wrapper">
                    <ul role="menu" id="wp-admin-bar-new-content-default" className="ab-submenu">
                      <li role="group" id="wp-admin-bar-new-post">
                        <Link className="ab-item" role="menuitem" href="/admin/blog/new">
                          Post
                        </Link>
                      </li>
                      <li role="group" id="wp-admin-bar-new-product">
                        <Link className="ab-item" role="menuitem" href="/admin/produk/new">
                          Product
                        </Link>
                      </li>
                      <li role="group" id="wp-admin-bar-new-project">
                        <Link className="ab-item" role="menuitem" href="/admin/proyek/new">
                          Project
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
              <ul role="menu" id="wp-admin-bar-top-secondary" className="ab-top-secondary ab-top-menu">
                <li role="group" id="wp-admin-bar-my-account" className="menupop with-avatar">
                  <Link className="ab-item" role="menuitem" aria-haspopup="true" href="/admin">
                    Howdy, <span className="display-name">{displayName}</span>
                    <img alt="" src={`${AVATAR}&s=26`} className="avatar avatar-26 photo" height={26} width={26} />
                  </Link>
                  <div className="ab-sub-wrapper">
                    <ul role="menu" id="wp-admin-bar-user-actions" className="ab-submenu">
                      <li role="group" id="wp-admin-bar-user-info">
                        <Link className="ab-item" tabIndex={-1} role="menuitem" href="/admin">
                          <img alt="" src={`${AVATAR}&s=64`} className="avatar avatar-64 photo" height={64} width={64} />
                          <span className="display-name">{displayName}</span>
                        </Link>
                      </li>
                      <li role="group" id="wp-admin-bar-logout">
                        <a className="ab-item" role="menuitem" href="/admin/logout">
                          Log Out
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div id="wpbody" role="main">
            <div id="wpbody-content">
              {children}
              <div className="clear" />
            </div>
            <div className="clear" />
          </div>
          <div className="clear" />
        </div>

        <div id="wpfooter" role="contentinfo">
          <p id="footer-left" className="alignleft">
            <span id="footer-thankyou">
              Thank you for creating with{" "}
              <a href="/" target="_blank" rel="noreferrer">
                Sekar Tama UPVC
              </a>
              .
            </span>
          </p>
          <p className="alignright" id="footer-upgrade" />
          <div className="clear" />
        </div>
      </div>
    </div>
  );
}
