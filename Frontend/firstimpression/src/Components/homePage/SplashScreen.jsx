import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SplashScreen = ({ onComplete }) => {
  const [stage, setStage] = useState(() => {
    return sessionStorage.getItem("hasSeenSplash") ? "finished" : "entering";
  });

  useEffect(() => {
    if (stage === "entering") {
      const sequence = async () => {
        // Allow entering animation to finish
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setStage("finished");
        sessionStorage.setItem("hasSeenSplash", "true");
        if (onComplete) onComplete();
      };
      sequence();
    } else {
      if (onComplete) onComplete();
    }
  }, [stage, onComplete]);

  const firstText = "first";
  const impressionText = "impression";

  // If finished, we just want it to be a tiny logo in the top left
  const isFinished = stage === "finished";

  return (
    <motion.div
      className="fixed inset-0 z-[100]"
      initial={false}
      animate={{
        backgroundColor: isFinished
          ? "rgba(255, 255, 255, 0)"
          : "rgba(255, 255, 255, 1)",
      }}
      style={{
        pointerEvents: isFinished ? "none" : "auto",
      }}
      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}>
      <div
        className={`w-full h-full flex transition-all duration-1000 ${
          isFinished
            ? "items-start justify-start p-6 sm:p-8"
            : "items-center justify-center"
        }`}>
        <motion.div
          layout
          className={`flex items-center font-bold tracking-tight text-gray-900 ${
            isFinished
              ? "text-xl sm:text-3xl"
              : "text-4xl sm:text-6xl md:text-7xl"
          }`}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}>
          {/* "first" coming from left letter by letter */}
          <motion.div
            layout
            className="flex text-[var(--theme-red-start)]"
            initial={isFinished ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.15 }}>
            {firstText.split("").map((char, index) => (
              <motion.span
                layout
                key={index}
                initial={isFinished ? false : { opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}>
                {char}
              </motion.span>
            ))}
          </motion.div>

          {/* "impression" coming from right */}
          
          <motion.div
            layout
            initial={isFinished ? false : { opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: isFinished ? 0 : 0.8,
              ease: "easeOut",
            }}
            className="ml-1">
            {impressionText}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
