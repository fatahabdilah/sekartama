export const contact = {
  address:
    "JL. Maruga ciater, Gg. Waru, Rt04/09, no.67, serpong, tangerang selatan, banten , ID, 15317",
  email: "admin@sekartama-upvc.com",
  phone: "+62 851-5606-5079",
  whatsappUrl: "https://wa.me/6285156065079",
  instagram: "@sekartama_upvc",
  instagramUrl: "https://www.instagram.com/sekartama_upvc",
};

// Search-based embed; for an exact pin, paste the URL from Google Maps → Share → Embed a map.
export const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(contact.address)}&output=embed`;

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export const navItems: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Tentang", href: "/tentang" },
  { label: "Proyek", href: "/proyek" },
  {
    label: "Produk",
    href: "/produk/pintu-upvc",
    children: [
      { label: "Pintu UPVC", href: "/produk/pintu-upvc" },
      { label: "Jendela UPVC", href: "/produk/jendela-upvc" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Hubungi Kami", href: "/hubungi-kami" },
];
