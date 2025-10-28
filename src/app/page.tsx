"use client";

import { motion } from "framer-motion";
import { Flame, Github, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "@/components/Navigation";
import { getGitHubUrl } from "@/lib/github";

// Lazy load non-critical components
const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
  loading: () => (
    <div className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse" />
  ),
});

const TechnologyShowcase = dynamic(
  () => import("@/components/TechnologyShowcase"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed bottom-8 left-8 w-80 h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
    ),
  }
);

export default function Home() {
  const { t } = useLanguage();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div
        className="absolute inset-0 z-0 opacity-20 dark:opacity-30 overflow-hidden"
        aria-hidden="true"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"
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
        <motion.div
          className="absolute inset-0 bg-gradient-to-l from-blue-400 via-green-400 to-purple-400"
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

      <Navigation />
      <main
        id="main-content"
        className="flex min-h-screen w-full max-w-5xl mx-auto flex-col md:flex-row items-center justify-center pt-36 pb-16 px-4 sm:py-36 sm:px-8 md:px-32 relative z-10"
        role="main"
        aria-label="Homepage main content"
      >
        {/* Left Content */}
        <div className="flex-1 max-w-2xl">
          <motion.div
            className="text-2xl font-bold text-black dark:text-gray-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                aria-hidden="true"
              >
                <Flame className="w-8 h-8 text-purple-500 dark:text-purple-400" />
              </motion.div>
              <h1 className="text-4xl font-bold text-black dark:text-gray-50">
                {(() => {
                  const title = t("navigation.title") as string;
                  const parts = title.split(".");
                  return (
                    <>
                      {parts[0]}
                      <span className="text-sm">.{parts[1] || ""}</span>
                    </>
                  );
                })()}
              </h1>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col w-full items-center text-center md:items-start md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold leading-8 sm:leading-10 tracking-tight text-black dark:text-gray-50">
              {t("homepage.subtitle")}
            </h2>

            <p
              className="w-full text-base sm:text-lg leading-6 sm:leading-8 text-gray-600 dark:text-gray-400 mb-4"
              role="text"
            >
              {t("homepage.description")}
            </p>

            {/* Quick Start Section
          <div className="w-full mb-4">
            <QuickStart />
          </div> */}

            {/* Coming soon section */}
            <div className="w-full mb-4">
              <div className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <Badge
                  variant="outline"
                  className="bg-transparent border-purple-500 text-purple-600 dark:text-purple-400 px-4 py-2 text-sm font-medium"
                >
                  {t("homepage.comingSoon")}
                </Badge>
              </div>
            </div>

            <div
              className="flex flex-row gap-4 w-full justify-center md:justify-start"
              role="group"
              aria-label="Homepage action buttons"
            >
              <Button asChild className="w-auto">
                <Link href="/about" aria-label="Learn more about Boiler.click">
                  <Info className="h-4 w-4" />
                  {t("homepage.aboutButton")}
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-auto">
                <a
                  href={getGitHubUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View Boiler.click on GitHub (opens in new tab)"
                >
                  <Github className="h-4 w-4" />
                  {t("homepage.githubButton")}
                </a>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Right Content - Eddie the Elephant */}
        <motion.div
          className="flex-1 flex justify-center lg:justify-end"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          <div className="relative w-64 h-64 lg:w-80 lg:h-80">
            {isImageLoading && !hasImageError && (
              <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">
                <div className="text-gray-400 text-sm">Loading...</div>
              </div>
            )}
            {hasImageError && (
              <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-gray-400 text-sm">Image unavailable</div>
              </div>
            )}
            <Image
              src="/assets/uploads/eddie-the-elephant.webp"
              alt="Eddie the Elephant - Boiler.click mascot"
              width={320}
              height={320}
              className={`object-contain w-full h-full transition-opacity duration-300 ${
                !isImageLoading ? "opacity-100" : "opacity-0"
              }`}
              priority
              quality={90}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              onLoad={() => {
                setIsImageLoading(false);
                console.log("Eddie image loaded successfully");
              }}
              onError={(e) => {
                setHasImageError(true);
                console.error("Eddie image failed to load:", e);
              }}
            />
          </div>
        </motion.div>
      </main>
      <Footer />
      <TechnologyShowcase />
    </div>
  );
}
