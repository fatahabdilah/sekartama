import About from "@/components/About";
import Commitment from "@/components/Commitment";
import Hero from "@/components/Hero";
import NewsletterFaq from "@/components/NewsletterFaq";
import Projects from "@/components/Projects";
import Services from "@/components/Services";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Commitment />
      <Projects />
      <NewsletterFaq />
    </>
  );
}
