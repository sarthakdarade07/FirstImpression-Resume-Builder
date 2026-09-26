import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play } from 'lucide-react';
import HeroVideo from "../../Assets/videos/firstimpression-ad-video.webm";

const AdvertisementVideo = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // When the video component moves out of the screen (less than 10% visible)
        if (!entry.isIntersecting) {
          if (videoRef.current && !videoRef.current.muted) {
            videoRef.current.muted = true;
            setIsMuted(true);
          }
        }
      },
      { threshold: 0.1 } // Trigger when less than 10% of the video is visible
    );

    const currentVideo = videoRef.current;
    if (currentVideo) {
      observer.observe(currentVideo);
    }

    return () => {
      if (currentVideo) {
        observer.unobserve(currentVideo);
      }
    };
  }, []);

  const toggleMute = (e) => {
    e.stopPropagation(); // Prevent video pause/play if clicking mute
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-red-100 rounded-full blur-[100px] opacity-40 -z-10"></div>
      
      <div className="max-w-[1024px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        <div className="text-center mb-10 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold text-gray-900"
          >
            See First Impression in Action
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto"
          >
            Watch how our platform effortlessly transforms your experience and helps you land your dream job.
          </motion.p>
        </div>

        {/* Video Container (16:9 Aspect Ratio) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-4 border-white group cursor-pointer"
          onClick={togglePlay}
        >
          {/* Subtle gradient overlay for better icon visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none z-10 transition-opacity duration-300"></div>

          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted={isMuted}
            playsInline
          >
            {/* Fallback to external video if HeroVideo isn't ideal for 16:9, but attempting local first */}
            <source src={HeroVideo} type="video/mp4" />
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          </video>

          {/* Audio Toggle Button */}
          <button 
            onClick={toggleMute}
            className="absolute bottom-6 right-6 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </button>

          {/* Play/Pause Overlay Indicator (shows briefly or on pause) */}
          {!isPlaying && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
              <div className="bg-white/20 p-5 rounded-full backdrop-blur-md border border-white/30 text-white">
                <Play className="w-12 h-12 ml-1" />
              </div>
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
};

export default AdvertisementVideo;
