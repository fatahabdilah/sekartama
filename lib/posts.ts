export type Post = {
  slug: string;
  title: string;
  date: string;
  comments: number;
  excerpt: string;
  image: { src: string; width: number; height: number };
};

export const POSTS_PER_PAGE = 6;

export const posts: Post[] = [
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
];
