import type { Metadata } from "next";
import ContactDetails from "@/components/contact/ContactDetails";
import PageHero from "@/components/PageHero";
import { getContact } from "@/lib/data";

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description: "Alamat, telepon, WhatsApp, dan email CV. SEKAR TAMA CONTRACTION di Serpong, Tangerang Selatan.",
};

export default async function ContactPage() {
  const contact = await getContact();
  return (
    <>
      <PageHero title="Hubungi Kami" />
      <ContactDetails contact={contact} />
    </>
  );
}
