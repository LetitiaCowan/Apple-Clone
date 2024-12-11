import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { heroVideo, smallHeroVideo } from "../utils";

const Hero = () => {
  const [videoSrc, setVideoSrc] = useState("");

  // Function to update the video source based on the window width
  const updateVideoSrc = () => {
    const isSmallScreen = window.innerWidth < 760;
    setVideoSrc(isSmallScreen ? smallHeroVideo : heroVideo);
  };

  useEffect(() => {
    // Set the initial video source
    updateVideoSrc();

    // Add a resize event listener
    window.addEventListener("resize", updateVideoSrc);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateVideoSrc);
    };
  }, []); // Run once on mount

  useGSAP(() => {
    gsap.to("#hero", {
      opacity: 1,
      delay: 2,
    });

    gsap.to('#cta', {
      opacity: 1, 
      delay: 2.2, 
      translateY: -50
    })
  }, []);

  return (
    <section className="w-full nav-height bg-black relative">
      <div className="h-5/6 w-full flex-center flex-col">
        <p id="hero" className="hero-title">
          iPhone 15 Pro
        </p>
        <div className="md:w-10/12 w-9/12">
          <video
            className="pointer-events-none"
            src={videoSrc}
            type="video/mp4"
            muted
            autoPlay
            playsInline={true}
            key={videoSrc}
          />
        </div>
      </div>

      <div id="cta" className="flex flex-col items-center translate-y-20 opacity-0">
        <a href="#highlights" className="btn">Buy</a>
        <p className="font-normal text-xl">From $199/month or $999</p>
      </div>
    </section>
  );
};

export default Hero;