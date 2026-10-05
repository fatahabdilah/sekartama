export type Product = {
  id?: string;
  name: string;
  description: string;
  price: string;
  priceSize: string;
  images: string[];
};

export type ProductCategory = {
  slug: string;
  title: string;
  metaDescription: string;
  products: Product[];
};

const images = (prefix: string) => [1, 2, 3].map((n) => `/images/products/${prefix}-${n}.png`);

// Fallback content used when Supabase isn't configured, and the source of supabase/seed.sql.
export const defaultProductCategories: ProductCategory[] = [
  {
    slug: "pintu-upvc",
    title: "Pintu UPVC",
    metaDescription:
      "Pintu UPVC ekonomis, geser, lipat, swing, dan kupu dengan ukuran custom sesuai kebutuhan Anda.",
    products: [
      {
        name: "Pintu Ekonomis",
        description:
          "Pintu Kupu UPVC Ekonomis adalah pilihan tepat untuk Anda yang membutuhkan pintu berkualitas dengan harga yang terjangkau. Terbuat dari material Unplasticized Polyvinyl Chloride (UPVC), pintu ini tetap menawarkan daya tahan tinggi, sifat tahan cuaca, serta ketahanan terhadap serangan rayap.",
        price: "Rp. 1.600.000",
        priceSize: "90cm x 210cm",
        images: images("pintu-ekonomis"),
      },
      {
        name: "Pintu Geser UPVC",
        description:
          "Pintu geser UPVC adalah solusi untuk akses yang mudah dan ruang terbuka yang indah. Terbuat dari bahan UPVC berkualitas tinggi, pintu ini menawarkan kekuatan, ketahanan, serta kemudahan dalam perawatan. Desainnya yang modern memungkinkan bukaan yang lancar secara horizontal, mengoptimalkan ruang dan pencahayaan alami. Pintu geser UPVC juga memberikan isolasi yang baik, membantu mempertahankan suhu dalam ruangan dan mengurangi kebisingan dari luar. Ideal untuk rumah tinggal dan bangunan komersial yang mengutamakan gaya, kenyamanan, dan efisiensi energi.",
        price: "Rp. 2.312.000",
        priceSize: "180cm x 210cm",
        images: images("pintu-geser"),
      },
      {
        name: "Pintu Lipat UPVC",
        description:
          "Pintu lipat UPVC adalah pilihan yang elegan dan praktis untuk meningkatkan estetika dan fungsi ruang. Terbuat dari bahan UPVC berkualitas tinggi, pintu ini dirancang untuk membuka ruang secara maksimal dengan gaya yang modern. Keunggulannya terletak pada kekuatan, tahan lama, serta kemudahan perawatan. Dengan sistem lipatan yang lancar, pintu ini mengoptimalkan penggunaan ruang dan pencahayaan alami, sesuai untuk berbagai jenis bangunan dari hunian pribadi hingga proyek komersial. Memiliki sifat isolasi yang baik untuk menjaga kenyamanan dalam ruangan dan mengurangi gangguan dari luar, menjadikannya pilihan terbaik untuk desain yang fungsional dan estetis.",
        price: "Rp. 4.900.000",
        priceSize: "180cm x 210cm",
        images: images("pintu-lipat"),
      },
      {
        name: "Pintu UPVC Swing",
        description:
          "Pintu UPVC swing merupakan pilihan elegan dan praktis untuk pintu masuk utama atau interior. Terbuat dari bahan UPVC berkualitas tinggi, pintu ini dirancang untuk memberikan kekuatan, daya tahan, dan kemudahan perawatan. Desainnya yang swing memungkinkan bukaan pintu yang mudah dan lancar ke dalam atau keluar ruangan, menambah nilai estetika dan fungsionalitas ruang. Dengan kemampuan isolasi yang baik, pintu UPVC swing membantu mempertahankan suhu ruangan dan mengurangi kebisingan dari luar, cocok untuk rumah tinggal, apartemen, atau bangunan komersial yang mengutamakan kenyamanan dan keamanan.",
        price: "Rp. 2.195.000",
        priceSize: "90cm x 210cm",
        images: images("pintu-swing"),
      },
      {
        name: "Pintu Kupu UPVC",
        description:
          "Pintu kupu UPVC adalah jenis pintu yang terbuat dari material Unplasticized Polyvinyl Chloride (UPVC), yang terkenal karena daya tahannya, perawatan yang rendah, serta sifatnya yang tahan terhadap cuaca dan serangan rayap. Jenis pintu ini sering digunakan untuk area yang membutuhkan ventilasi dan pencahayaan lebih baik, seperti pintu menuju taman, teras, atau balkon.",
        price: "Rp. 3.300.000",
        priceSize: "180cm x 210cm",
        images: images("pintu-kupu"),
      },
    ],
  },
  {
    slug: "jendela-upvc",
    title: "Jendela UPVC",
    metaDescription: "Jendela UPVC geser, jungkit, fixed kaca mati, dan swing dengan ukuran custom sesuai kebutuhan Anda.",
    products: [
      {
        name: "Jendela Geser",
        description:
          "Jendela geser UPVC merupakan produk yang terbuat dari bahan UPVC (Unplasticized Polyvinyl Chloride) yang kuat dan tahan lama. Desainnya memungkinkan jendela untuk digeser secara horizontal, memberikan kemudahan dalam penggunaan dan estetika yang modern. Jendela ini cocok digunakan untuk rumah tinggal maupun bangunan komersial karena tahan terhadap cuaca ekstrem dan membutuhkan sedikit perawatan. Dengan kualitas isolasi yang baik, jendela geser UPVC juga membantu mengurangi kebisingan dari luar dan meningkatkan efisiensi energi bangunan.",
        price: "Rp. 2.350.000",
        priceSize: "120cm x 120cm",
        images: images("jendela-geser"),
      },
      {
        name: "Jendela Jungkit UPVC",
        description:
          "Jendela jungkit UPVC adalah produk inovatif yang menggunakan bahan UPVC (Unplasticized Polyvinyl Chloride) berkualitas tinggi. Desainnya memungkinkan jendela untuk dibuka dengan cara dikangkangi (jungkit) ke atas atau ke bawah, memberikan fleksibilitas dalam pengaturan ventilasi udara. Jendela ini menyediakan kombinasi antara kekuatan, keamanan, dan tampilan estetika modern. Material UPVC membuatnya tahan terhadap cuaca ekstrem dan membutuhkan sedikit perawatan. Dengan kemampuan isolasi yang baik, jendela jungkit UPVC membantu menjaga kehangatan dan mengurangi kebisingan dari luar. Cocok digunakan untuk berbagai jenis bangunan, baik hunian pribadi maupun komersial, sebagai solusi praktis dan efisien untuk meningkatkan kenyamanan ruangan.",
        price: "Rp. 1.244.000",
        priceSize: "60cm x 120cm",
        images: images("jendela-jungkit"),
      },
      {
        name: "Jendela Fixed UPVC Kaca Mati",
        description:
          "Jendela fixed UPVC adalah produk jendela yang dirancang untuk tetap dalam posisi tertutup tanpa kemampuan untuk dibuka. Terbuat dari bahan UPVC (Unplasticized Polyvinyl Chloride) yang tahan lama dan kuat, jendela ini menawarkan keamanan yang baik serta tahan terhadap cuaca ekstrem. Desainnya memberikan penampilan yang modern dan bersih, cocok untuk menambah estetika bangunan baik rumah tinggal maupun bangunan komersial. Jendela fixed UPVC juga memiliki sifat isolasi yang baik, membantu mempertahankan suhu ruangan dan mengurangi kebisingan dari luar. Produk ini memerlukan sedikit perawatan dan umumnya dipilih untuk area-area di mana ventilasi udara tidak menjadi kebutuhan utama.",
        price: "Rp. 600.000",
        priceSize: "60cm x 120cm",
        images: images("jendela-fixed"),
      },
      {
        name: "Jendela Swing UPVC",
        description:
          "Jendela swing UPVC adalah produk yang menggunakan bahan UPVC (Unplasticized Polyvinyl Chloride) yang berkualitas tinggi. Desainnya memungkinkan jendela untuk dibuka dengan cara berayun (swing) ke dalam atau ke luar ruangan. Jendela ini menawarkan kombinasi antara kekuatan, keamanan, dan estetika yang modern. Material UPVC membuatnya tahan terhadap cuaca ekstrem dan membutuhkan sedikit perawatan. Dengan kemampuan isolasi yang baik, jendela swing UPVC membantu mempertahankan suhu ruangan dan mengurangi kebisingan dari luar. Cocok digunakan untuk rumah tinggal maupun bangunan komersial sebagai pilihan yang praktis dan efisien dalam memaksimalkan pencahayaan dan ventilasi udara.",
        price: "Rp. 1.176.000",
        priceSize: "60cm x 120cm",
        images: images("jendela-swing"),
      },
    ],
  },
];
