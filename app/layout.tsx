import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteUrl } from "@/lib/site-url";
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

const description =
  "Mitra terpercaya Anda dalam menghadirkan produk dan solusi UPVC berkualitas tinggi: pembuatan, pemasangan, hingga desain pintu dan jendela UPVC.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CV. SEKAR TAMA CONTRACTION | Distributor UPVC Terpercaya",
    template: "%s | CV. SEKAR TAMA CONTRACTION",
  },
  description,
  // Social previews (WhatsApp, Facebook, LinkedIn); pages override title/description/images.
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "CV. SEKAR TAMA CONTRACTION",
    title: "CV. SEKAR TAMA CONTRACTION | Distributor UPVC Terpercaya",
    description,
    images: [{ url: "/images/hero-bg.png", alt: "Pintu dan jendela UPVC oleh CV. SEKAR TAMA CONTRACTION" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${poppins.variable} ${openSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
