export type Project = {
  id?: string;
  name: string;
  location: string;
  image: string;
  /** Completion date (YYYY-MM-DD), shown in the project popup. */
  date?: string | null;
  description?: string;
};

// Fallback content used when Supabase isn't configured, and the source of supabase/seed.sql.
export const defaultProjects: Project[] = [
  {
    name: "Cluster Cileubut",
    location: "Kecamatan Cilebut, Kabupaten Bogor",
    image: "/images/projects/cileubut.png",
    date: "2025-12-06",
    description: "Pengerjaan instalasi pintu dan jendela UPVC pada kawasan hunian di Cilebut dengan fokus pada ketahanan material dan efisiensi pencahayaan alami.",
  },
  {
    name: "Villa Puncak Bogor",
    location: "Kecamatan Cisarua, Kabupaten Bogor",
    image: "/images/projects/villa-puncak.png",
    date: "2025-09-06",
    description: "Pemasangan sistem UPVC pada bangunan villa di area pegunungan dengan mempertimbangkan ketahanan terhadap cuaca dan kelembapan tinggi.",
  },
  {
    name: "Kantor Polri Lebak Bulus",
    location: "Kecamatan Cilandak, Kota Jakarta Selatan",
    image: "/images/projects/polri-lebak-bulus.png",
    date: "2025-07-06",
    description: "Implementasi produk UPVC pada gedung perkantoran untuk meningkatkan kenyamanan, keamanan, serta efisiensi penggunaan energi.",
  },
  // Same photo as the product gallery, reused rather than duplicated
  {
    name: "Cluster Sukabumi",
    location: "Kecamatan Cikole, Kota Sukabumi",
    image: "/images/products/pintu-lipat-2.png",
    date: "2026-04-06",
    description: "Proyek pemasangan pintu dan jendela UPVC pada hunian modern dengan desain yang menyesuaikan kebutuhan estetika dan fungsionalitas.",
  },
  {
    name: "Cluster Serpong",
    location: "Kecamatan Serpong, Kota Tangerang Selatan",
    image: "/images/projects/serpong.png",
    date: "2025-04-06",
    description: "Penerapan sistem UPVC pada kawasan perumahan dengan standar kualitas tinggi guna meningkatkan kenyamanan dan daya tahan bangunan.",
  },
  // Same photo as the product gallery, reused rather than duplicated
  {
    name: "Cluster Pondok Cabe",
    location: "Kecamatan Pamulang, Kota Tangerang Selatan",
    image: "/images/products/jendela-geser-2.png",
    date: "2025-03-06",
    description: "Instalasi produk UPVC dengan fokus pada efisiensi ruang dan pencahayaan, serta memberikan tampilan yang modern dan minimalis.",
  },
  {
    name: "Cluster Alam Sutera",
    location: "Kecamatan Serpong Utara, Kota Tangerang Selatan",
    image: "/images/projects/alam-sutera.png",
    date: "2025-02-01",
    description: "Pemasangan UPVC pada kawasan hunian premium dengan penekanan pada desain elegan, kualitas material, dan ketahanan jangka panjang.",
  },
  {
    name: "Cluster Depok",
    location: "Kecamatan Beji, Kota Depok",
    image: "/images/projects/depok.png",
    date: "2025-01-01",
    description: "Proyek pengerjaan UPVC pada perumahan di Depok dengan tujuan meningkatkan kenyamanan hunian melalui material yang tahan cuaca dan perawatan rendah.",
  },
];
