import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  AboutHero,
  AboutStorySection,
  AboutValuesSection,
  AboutStatsSection,
  AboutCtaSection
} from "../components/about";

export default function AboutUsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <title>content="First Impression | AI Resume Builder | About US"</title>
      <meta
        name="description"
        content="Discover FirstImpression, an AI-powered resume platform helping job seekers build professional, ATS-friendly resumes, tailor them to job descriptions, and improve their chances of standing out."
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-h-screen bg-white flex flex-col font-sans selection:bg-theme-red-start/20 selection:text-theme-red">
        <Navbar isSplashFinished={true} />
        <main className="flex-1">
          <AboutHero />
          <AboutStorySection />
          <AboutValuesSection />
          <AboutStatsSection />
          <AboutCtaSection />
        </main>
        <Footer />
      </motion.div>
    </>
  );
}
