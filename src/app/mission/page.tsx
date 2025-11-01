"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Github, HelpCircle } from "lucide-react";
import { getGitHubUrl } from "@/lib/github";
import Link from "next/link";
import { HeroBackground } from "@/components/HeroBackground";
import { DarkOverlay } from "@/components/DarkOverlay";

export default function MissionPage() {
  const { t } = useLanguage();

  return (
    <div
      className="min-h-screen font-sans relative overflow-hidden relative"
      role="main"
    >
      {/* Animated Gradient Background */}
      <HeroBackground />

      {/* Dark Overlay */}
      <DarkOverlay />

      <Navigation />
      <main
        className="flex min-h-screen w-full max-w-3xl mx-auto flex-col items-center justify-center py-32 px-16 sm:items-start relative z-10"
        role="main"
        aria-label="Mission page content"
      >
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <motion.div
            className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-bold text-black dark:text-white mb-8">
              {t("mission.title")}
            </h1>
          </motion.div>

          <motion.div
            className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <p className="text-lg text-zinc-600 dark:text-zinc-200 leading-relaxed">
              {t("mission.description")}
            </p>

            <p className="text-lg text-zinc-600 dark:text-zinc-200 leading-relaxed mb-2">
              {t("mission.goal")}
            </p>

            <div
              className="flex flex-row gap-4 w-full justify-center sm:justify-start"
              role="group"
              aria-label="Action buttons"
            >
              <Button asChild>
                <a
                  href={getGitHubUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                  aria-label="View Boiler™ on GitHub (opens in new tab)"
                >
                  <Github className="h-4 w-4" />
                  {t("mission.githubButton")}
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link href="/support" aria-label="Get support for Boiler™;">
                  <HelpCircle className="h-4 w-4" />
                  {t("navigation.support")}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
