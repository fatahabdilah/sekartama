"use client";

import "@/app/admin/wp/reset.css";
import "@/app/admin/wp/dashicons.css";
import "@/app/admin/wp/admin-bar.css";
import "./site-admin-bar.css";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const AVATAR = "https://secure.gravatar.com/avatar/?d=mm&r=g";

/** The admin page that edits what is on screen — WordPress's "Edit Post" toolbar item. */
function editLink(pathname: string): { href: string; label: string } | null {
  const post = pathname.match(/^\/blog\/([^/]+)$/);
  if (post && post[1] !== "page") return { href: `/admin/blog/by-slug/${post[1]}`, label: "Edit Post" };
  const category = pathname.match(/^\/produk\/([^/]+)$/);
  if (category) return { href: `/admin/produk?product_cat=${category[1]}`, label: "Edit Products" };
  if (pathname === "/proyek") return { href: "/admin/proyek", label: "Edit Projects" };
  if (pathname === "/hubungi-kami") return { href: "/admin/kontak", label: "Edit Contact" };
  if (pathname.startsWith("/blog")) return { href: "/admin/blog", label: "Edit Posts" };
  return null;
}

export default function SiteAdminBar({ displayName }: { displayName: string }) {
  const pathname = usePathname();
  const edit = editLink(pathname);

  // html.admin-bar-on: WordPress's `html { margin-top: 32px }` plus the offset for the site's fixed header.
  useEffect(() => {
    document.documentElement.classList.add("admin-bar-on");
    return () => document.documentElement.classList.remove("admin-bar-on");
  }, []);

  return (
    <div className="wp-root">
      <div id="wpadminbar" className="nojs">
        <div className="quicklinks" id="wp-toolbar" role="navigation" aria-label="Toolbar">
          <ul role="menu" id="wp-admin-bar-root-default" className="ab-top-menu">
            <li role="group" id="wp-admin-bar-site-name" className="menupop">
              <a className="ab-item" role="menuitem" aria-haspopup="true" href="/admin">
                Sekar Tama UPVC
              </a>
              <div className="ab-sub-wrapper">
                <ul role="menu" id="wp-admin-bar-site-name-default" className="ab-submenu">
                  <li role="group" id="wp-admin-bar-dashboard">
                    <a className="ab-item" role="menuitem" href="/admin">
                      Dashboard
                    </a>
                  </li>
                </ul>
                <ul role="menu" id="wp-admin-bar-appearance" className="ab-submenu">
                  <li role="group">
                    <a className="ab-item" role="menuitem" href="/admin/blog">
                      Posts
                    </a>
                  </li>
                  <li role="group">
                    <a className="ab-item" role="menuitem" href="/admin/produk">
                      Products
                    </a>
                  </li>
                  <li role="group">
                    <a className="ab-item" role="menuitem" href="/admin/proyek">
                      Projects
                    </a>
                  </li>
                  <li role="group">
                    <a className="ab-item" role="menuitem" href="/admin/kontak">
                      Contact
                    </a>
                  </li>
                  <li role="group">
                    <a className="ab-item" role="menuitem" href="/admin/chat">
                      Chat AI
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li role="group" id="wp-admin-bar-new-content" className="menupop">
              <a className="ab-item" role="menuitem" aria-haspopup="true" href="/admin/blog/new">
                <span className="ab-icon" aria-hidden="true" />
                <span className="ab-label">New</span>
              </a>
              <div className="ab-sub-wrapper">
                <ul role="menu" id="wp-admin-bar-new-content-default" className="ab-submenu">
                  <li role="group" id="wp-admin-bar-new-post">
                    <a className="ab-item" role="menuitem" href="/admin/blog/new">
                      Post
                    </a>
                  </li>
                  <li role="group" id="wp-admin-bar-new-product">
                    <a className="ab-item" role="menuitem" href="/admin/produk/new">
                      Product
                    </a>
                  </li>
                  <li role="group" id="wp-admin-bar-new-project">
                    <a className="ab-item" role="menuitem" href="/admin/proyek/new">
                      Project
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            {edit && (
              <li role="group" id="wp-admin-bar-edit">
                <a className="ab-item" role="menuitem" href={edit.href}>
                  {edit.label}
                </a>
              </li>
            )}
          </ul>
          <ul role="menu" id="wp-admin-bar-top-secondary" className="ab-top-secondary ab-top-menu">
            <li role="group" id="wp-admin-bar-my-account" className="menupop with-avatar">
              <a className="ab-item" role="menuitem" aria-haspopup="true" href="/admin">
                Howdy, <span className="display-name">{displayName}</span>
                <img alt="" src={`${AVATAR}&s=26`} className="avatar avatar-26 photo" height={26} width={26} />
              </a>
              <div className="ab-sub-wrapper">
                <ul role="menu" id="wp-admin-bar-user-actions" className="ab-submenu">
                  <li role="group" id="wp-admin-bar-user-info">
                    <a className="ab-item" tabIndex={-1} role="menuitem" href="/admin">
                      <img alt="" src={`${AVATAR}&s=64`} className="avatar avatar-64 photo" height={64} width={64} />
                      <span className="display-name">{displayName}</span>
                    </a>
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
    </div>
  );
}
