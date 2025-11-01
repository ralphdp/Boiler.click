"use client";

import { motion } from "framer-motion";

interface HeroBackgroundProps {
  className?: string;
  opacity?: number;
  darkOpacity?: number;
}

export function HeroBackground({
  className = "",
  opacity = 20,
  darkOpacity = 30,
}: HeroBackgroundProps) {
  return (
    <div
      className={`fixed inset-0 z-0 overflow-hidden pointer-events-none ${className}`}
      style={{
        opacity: `${opacity}%`,
      }}
      data-dark-opacity={darkOpacity}
      aria-hidden="true"
    >
      {/* First animated gradient layer */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 pointer-events-none"
        animate={{
          background: [
            "linear-gradient(45deg, #8b5cf6, #ec4899, #3b82f6)",
            "linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)",
            "linear-gradient(225deg, #ec4899, #3b82f6, #8b5cf6)",
            "linear-gradient(315deg, #8b5cf6, #ec4899, #3b82f6)",
          ],
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Second animated gradient layer */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-l from-blue-400 via-green-400 to-purple-400 pointer-events-none"
        animate={{
          background: [
            "linear-gradient(225deg, #3b82f6, #10b981, #8b5cf6)",
            "linear-gradient(315deg, #8b5cf6, #3b82f6, #10b981)",
            "linear-gradient(45deg, #10b981, #8b5cf6, #3b82f6)",
            "linear-gradient(135deg, #3b82f6, #10b981, #8b5cf6)",
          ],
          scale: [1.1, 1, 1.1],
          opacity: [0.1, 0.4, 0.1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </div>
  );
}
