"use client";

import Navbar from "@/components/Navbar"; 
import Hero from "@/components/Home/Hero";
import About from "@/components/Home/About";
import Contact from "@/components/Home/Contact";
import Footer from "@/components/Home/Footer";
import { motion, easeOut } from "motion/react";

export default function HomePage() {
  const scrollAnimate = {
    initial: { y: 40, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, ease: easeOut }
  };

  return (
    <main className="min-h-screen bg-[#FFF8E1]">
      <Navbar />
      <div className="pt-15 md:pt-17 overflow-x-hidden">
        <motion.div {...scrollAnimate}>
          <Hero />
        </motion.div>

        <motion.div {...scrollAnimate}>
          <About />
        </motion.div>

        <motion.div {...scrollAnimate}>
          <Contact />
        </motion.div>

        <motion.div {...scrollAnimate}>
          <Footer />
        </motion.div>
      </div>
    </main>
  );
}