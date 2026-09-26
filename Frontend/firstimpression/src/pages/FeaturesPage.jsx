import React, { useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import {
  FeaturesHero,
  AiTailoringSection,
  TemplateStudioSection,
  ProfileSyncSection,
  AtsOptimizationSection,
  FeaturesVideoSection,
  FeaturesCta
} from "../Components/features";

export default function FeaturesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-theme-red-start/20 selection:text-theme-red">
      <Navbar isSplashFinished={true} />
      <main className="flex-1">
        <FeaturesHero />
        <AiTailoringSection />
        <TemplateStudioSection />
        <ProfileSyncSection />
        <AtsOptimizationSection />
        <FeaturesVideoSection />
        <FeaturesCta />
      </main>
      <Footer />
    </div>
  );
}
