import Navbar from "@/components/Navbar"; 
import Hero from "@/components/Home/Hero";
import About from "@/components/Home/About";
import Contact from "@/components/Home/Contact";
import Footer from "@/components/Home/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFF8E1]">
      <Navbar />
      <div className="pt-15 md:pt-17">
        <Hero />
        <About />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}