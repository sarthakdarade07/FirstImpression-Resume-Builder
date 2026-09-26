import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/homepage/Hero";
import SplashScreen from "../components/homepage/SplashScreen";
import Template from "../components/homepage/Template";
import AdvertisementVideo from "../components/homepage/AdvertisementVideo";
import CallToAction from "../components/homepage/CallToAction";
import Footer from "../components/Footer";

export default function HomePage() {
  const [isSplashFinished, setIsSplashFinished] = useState(
    () => sessionStorage.getItem("hasSeenSplash") === "true"
  );

  return (
    <>
      <SplashScreen onComplete={() => setIsSplashFinished(true)} />
      <Navbar isSplashFinished={isSplashFinished} />
      <Hero isSplashFinished={isSplashFinished} />
      {isSplashFinished && (
        <>
          <Template />
          <AdvertisementVideo />
          <CallToAction />
          <Footer />
        </>
      )}
    </>
  );
}