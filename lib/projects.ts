export type Project = {
  id?: string;
  name: string;
  location: string;
  image: string;
};

// Fallback content used when Supabase isn't configured, and the source of supabase/seed.sql.
export const defaultProjects: Project[] = [
  { name: "Cluster Cileubut", location: "Kecamatan Cilebut, Kabupaten Bogor", image: "/images/projects/cileubut.png" },
  { name: "Villa Puncak Bogor", location: "Kecamatan Cisarua, Kabupaten Bogor", image: "/images/projects/villa-puncak.png" },
  {
    name: "Kantor Polri Lebak Bulus",
    location: "Kecamatan Cilandak, Kota Jakarta Selatan",
    image: "/images/projects/polri-lebak-bulus.png",
  },
  // Same photo as the product gallery, reused rather than duplicated
  { name: "Cluster Sukabumi", location: "Kecamatan Cikole, Kota Sukabumi", image: "/images/products/pintu-lipat-2.png" },
  { name: "Cluster Serpong", location: "Kecamatan Serpong, Kota Tangerang Selatan", image: "/images/projects/serpong.png" },
  {
    name: "Cluster Pondok Cabe",
    location: "Kecamatan Pamulang, Kota Tangerang Selatan",
    image: "/images/products/jendela-geser-2.png",
  },
  {
    name: "Cluster Alam Sutera",
    location: "Kecamatan Serpong Utara, Kota Tangerang Selatan",
    image: "/images/projects/alam-sutera.png",
  },
  { name: "Cluster Depok", location: "Kecamatan Beji, Kota Depok", image: "/images/projects/depok.png" },
];
