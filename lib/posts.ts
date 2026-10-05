export type Post = {
  slug: string;
  title: string;
  date: string;
  comments: number;
  excerpt: string;
  /** Full article body; paragraphs separated by blank lines. */
  content: string;
  image: { src: string; width: number; height: number };
};

export const POSTS_PER_PAGE = 6;

// Fallback content used when Supabase isn't configured, and the source of supabase/seed.sql.
export const defaultPosts: Omit<Post, "content">[] = [
  {
    slug: "kenapa-kusen-upvc-menjadi-tren",
    title: "“Kenapa Kusen UPVC Menjadi Tren dalam Dunia Konstruksi”",
    date: "2025-02-06",
    comments: 1,
    excerpt:
      "Kenapa Kusen UPVC Menjadi Tren dalam Dunia Konstruksi? Dalam beberapa tahun terakhir, kusen UPVC (Unplasticized…",
    image: { src: "/images/blog/kusen-upvc-tren-konstruksi.png", width: 475, height: 712 },
  },
  {
    slug: "kusen-upvc-solusi-keamanan-rumah",
    title: "“Kusen UPVC : Solusi Meningkatkan Keamanan Rumah”",
    date: "2025-02-06",
    comments: 0,
    excerpt:
      "Kusen UPVC: Solusi Meningkatkan Keamanan Rumah Keamanan rumah merupakan prioritas utama bagi setiap pemilik rumah…",
    image: { src: "/images/blog/kusen-upvc-keamanan-rumah.png", width: 1024, height: 755 },
  },
  {
    slug: "kusen-upvc-rumah-kedap-suara",
    title: "“Kusen UPVC : Solusi Agar Rumah Anda Menjadi Kedap Suara”",
    date: "2025-02-03",
    comments: 0,
    excerpt:
      "Kusen uPVC: Solusi Agar Rumah atau Bangunan Anda Jadi Kedap Suara Bagi banyak orang, kenyamanan…",
    image: { src: "/images/blog/kusen-upvc-kedap-suara.png", width: 640, height: 428 },
  },
  {
    slug: "kusen-upvc-kusen-modern",
    title: "“Kusen UPVC : Kusen Modern Saat Ini Untuk Rumah Dan Bangunan Anda”",
    date: "2025-02-03",
    comments: 0,
    excerpt: "uPVC: Kusen Modern Saat Ini untuk Rumah dan Bangunan Anda Pembangunan dan renovasi rumah atau…",
    image: { src: "/images/blog/kusen-upvc-modern.png", width: 768, height: 514 },
  },
  {
    slug: "kusen-upvc-tahan-cuaca-buruk",
    title: "“Kusen UPVC: Solusi Tahan Lama Menghadapi Cuaca Buruk di Indonesia”",
    date: "2025-01-31",
    comments: 0,
    excerpt:
      "Kusen UPVC: Solusi Tahan Lama Menghadapi Cuaca Buruk di Indonesia Indonesia dikenal dengan iklim tropis…",
    image: { src: "/images/blog/kusen-upvc-cuaca-buruk.png", width: 768, height: 768 },
  },
  {
    slug: "kusen-upvc-efisiensi-energi",
    title: "Kusen UPVC: Pilihan Pintar untuk Efisiensi Energi dan Keamanan Rumah",
    date: "2025-01-31",
    comments: 0,
    excerpt:
      "Kusen UPVC: Pilihan Pintar untuk Efisiensi Energi dan Keamanan Rumah Dalam dunia konstruksi modern, pemilihan…",
    image: { src: "/images/blog/kusen-upvc-efisiensi-energi.png", width: 768, height: 512 },
  },
  {
    slug: "kusen-upvc-vs-kusen-aluminium",
    title: "Kusen UPVC vs Kusen Alumunium: Mana yang Lebih Unggul untuk Hunian Anda?",
    date: "2025-01-30",
    comments: 0,
    excerpt: "Kusen UPVC vs Kusen Alumunium: Mana yang Lebih Unggul untuk Hunian Anda? Ketika membangun atau…",
    image: { src: "/images/blog/kusen-upvc-vs-kusen-aluminium.jpg", width: 633, height: 346 },
  },
  {
    slug: "kusen-upvc-tahan-cuaca-lebih-aman",
    title: "Kusen UPVC: ” Solusi Tahan Cuaca dan Lebih Aman untuk Rumah Anda “",
    date: "2025-01-30",
    comments: 0,
    excerpt: "Kusen UPVC: Solusi Tahan Cuaca dan Lebih Aman untuk Rumah Anda Kusen UPVC (Unplasticized Polyvinyl…",
    image: { src: "/images/blog/kusen-upvc-tahan-cuaca-lebih-aman.jpg", width: 736, height: 981 },
  },
  {
    slug: "mengenal-jendela-upvc",
    title: "Mengenal Jendela UPVC dan Keunggulannya",
    date: "2025-01-28",
    comments: 0,
    excerpt: "Jendela UPVC (Unplasticized Polyvinyl Chloride) semakin menjadi pilihan favorit untuk berbagai…",
    image: { src: "/images/blog/mengenal-jendela-upvc.jpg", width: 728, height: 410 },
  },
  {
    slug: "mengenal-pintu-upvc",
    title: "Mengenal Pintu UPVC: Keunggulan dan Manfaatnya",
    date: "2025-01-27",
    comments: 0,
    excerpt: "Pintu UPVC (Unplasticized Polyvinyl Chloride) semakin populer di kalangan masyarakat modern.…",
    image: { src: "/images/blog/mengenal-pintu-upvc.jpg", width: 625, height: 469 },
  },
];
