export type ContactSettings = {
  address: string;
  email: string;
  phone: string;
  /** WhatsApp number in international format, digits only (e.g. 6285156065079). */
  whatsapp: string;
  /** Instagram handle without the @. */
  instagram: string;
};

export type Contact = ContactSettings & {
  whatsappUrl: string;
  instagramHandle: string;
  instagramUrl: string;
  mapEmbedUrl: string;
};

// Used until the admin saves contact settings in Supabase (or when Supabase isn't configured).
export const defaultContactSettings: ContactSettings = {
  address:
    "JL. Maruga ciater, Gg. Waru, Rt04/09, no.67, serpong, tangerang selatan, banten , ID, 15317",
  email: "admin@sekartama-upvc.com",
  phone: "+62 851-5606-5079",
  whatsapp: "6285156065079",
  instagram: "sekartama_upvc",
};

export function toContact(settings: ContactSettings): Contact {
  const handle = settings.instagram.replace(/^@/, "");
  return {
    ...settings,
    whatsappUrl: `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`,
    instagramHandle: `@${handle}`,
    instagramUrl: `https://www.instagram.com/${handle}`,
    // Search-based embed; for an exact pin, paste the URL from Google Maps → Share → Embed a map.
    mapEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`,
  };
}

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

/** Site navigation; the Produk menu lists the product categories managed in the admin. */
export function buildNavItems(categories: { slug: string; title: string }[]): NavItem[] {
  const products = categories.map((category) => ({ label: category.title, href: `/produk/${category.slug}` }));
  return [
    { label: "Beranda", href: "/" },
    { label: "Tentang", href: "/tentang" },
    { label: "Proyek", href: "/proyek" },
    ...(products.length ? [{ label: "Produk", href: products[0].href, children: products }] : []),
    { label: "Blog", href: "/blog" },
    { label: "Hubungi Kami", href: "/hubungi-kami" },
  ];
}
