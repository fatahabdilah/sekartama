export type MenuItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
  submenu?: { label: string; href: string }[];
};

export type MenuEntry = MenuItem | "separator";

export const adminMenu: MenuEntry[] = [
  { id: "dashboard", label: "Dashboard", href: "/admin", icon: "dashicons-dashboard", submenu: [{ label: "Home", href: "/admin" }] },
  "separator",
  {
    id: "posts",
    label: "Posts",
    href: "/admin/blog",
    icon: "dashicons-admin-post",
    submenu: [
      { label: "All Posts", href: "/admin/blog" },
      { label: "Add New Post", href: "/admin/blog/new" },
    ],
  },
  {
    id: "products",
    label: "Products",
    href: "/admin/produk",
    icon: "dashicons-products",
    submenu: [
      { label: "All Products", href: "/admin/produk" },
      { label: "Add New Product", href: "/admin/produk/new" },
      { label: "Categories", href: "/admin/produk/kategori" },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    href: "/admin/proyek",
    icon: "dashicons-portfolio",
    submenu: [
      { label: "All Projects", href: "/admin/proyek" },
      { label: "Add New Project", href: "/admin/proyek/new" },
    ],
  },
  "separator",
  { id: "contact", label: "Contact", href: "/admin/kontak", icon: "dashicons-phone" },
  { id: "chat", label: "Chat AI", href: "/admin/chat", icon: "dashicons-format-chat" },
];
