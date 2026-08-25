import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/homePage/Hero";
import SplashScreen from "../components/homePage/SplashScreen";
import Template from "../components/homePage/Template";
import AdvertisementVideo from "../components/homePage/AdvertisementVideo";
import CallToAction from "../components/homePage/CallToAction";
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