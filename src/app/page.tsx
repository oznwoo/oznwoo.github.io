import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Projects } from "@/components/projects/Projects";
import { Contact } from "@/components/contact/Contact";
import { InkDivider } from "@/components/ui/InkDivider";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <InkDivider />
        <About />
        <InkDivider />
        <Projects />
        <InkDivider />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
