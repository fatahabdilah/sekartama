import type { Metadata } from "next";
import AboutIntro from "@/components/about/AboutIntro";
import AboutStats from "@/components/about/AboutStats";
import AboutStory from "@/components/about/AboutStory";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "CV. SEKAR TAMA adalah mitra terpercaya dalam solusi pintu dan jendela UPVC berkualitas tinggi sejak tahun 2019.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero title="Tentang Kami" />
      <AboutIntro />
      <AboutStats />
      <AboutStory />
    </>
  );
}
