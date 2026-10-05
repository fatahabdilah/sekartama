import About from "@/components/About";
import Commitment from "@/components/Commitment";
import Hero from "@/components/Hero";
import NewsletterFaq from "@/components/NewsletterFaq";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import { getContact } from "@/lib/data";

export default async function Home() {
  const contact = await getContact();
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Commitment />
      <Projects />
      <NewsletterFaq contact={contact} />
    </>
  );
}
