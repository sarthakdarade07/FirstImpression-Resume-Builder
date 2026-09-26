import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Hero from "../Components/homePage/Hero";
import SplashScreen from "../Components/homePage/SplashScreen";
import Template from "../Components/homePage/Template";
import AdvertisementVideo from "../Components/homePage/AdvertisementVideo";
import CallToAction from "../Components/homePage/CallToAction";
import Footer from "../Components/Footer";

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