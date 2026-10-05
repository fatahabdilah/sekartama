import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted (latin subset from Google Fonts) so builds don't depend on fonts.gstatic.com.
const poppins = localFont({
  src: [
    { path: "./fonts/poppins-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/poppins-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/poppins-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/poppins-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-poppins",
});

const openSans = localFont({
  src: [{ path: "./fonts/open-sans-600.woff2", weight: "600", style: "normal" }],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: {
    default: "CV. SEKAR TAMA CONTRACTION | Distributor UPVC Terpercaya",
    template: "%s | CV. SEKAR TAMA CONTRACTION",
  },
  description:
    "Mitra terpercaya Anda dalam menghadirkan produk dan solusi UPVC berkualitas tinggi: pembuatan, pemasangan, hingga desain pintu dan jendela UPVC.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${poppins.variable} ${openSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
