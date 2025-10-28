"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { getGitHubUrl } from "@/lib/github";
import Link from "next/link";
import { HeroBackground } from "@/components/HeroBackground";
import { DarkOverlay } from "@/components/DarkOverlay";
export default function DocumentationPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen font-sans dark:bg-gradient-to-br dark:from-gray-900 dark:to-black relative">
      {/* Animated Gradient Background */}
      <HeroBackground />

      {/* Dark Overlay */}
      <DarkOverlay />

      <Navigation />
      <main
        className="flex min-h-screen w-full max-w-3xl mx-auto flex-col items-center justify-center py-32 px-16 sm:items-start relative z-10"
        role="main"
        aria-label="Documentation page main content"
      >
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <motion.div
            className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-bold text-black dark:text-white mb-8">
              {t("documentation.title")}
            </h1>
          </motion.div>

          <motion.div
            className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t("documentation.lastUpdated")}
            </div>

            <div
              className="space-y-12"
              role="contentinfo"
              aria-label="Documentation sections"
            >
              {/* Quick Start Section
              <section aria-labelledby="quick-start">
                <h2
                  id="quick-start"
                  className="text-3xl font-bold text-black dark:text-white mb-6"
                >
                  {t("documentation.quickStart.title")}
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {t("documentation.quickStart.description")}
                </p>
                <QuickStart />
              </section> */}

              {/* Step-by-Step Guide */}
              <section aria-labelledby="step-guide">
                <h2
                  id="step-guide"
                  className="text-3xl font-bold text-black dark:text-white mb-6"
                >
                  {t("documentation.stepGuide.title")}
                </h2>

                <div className="space-y-4">
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t("documentation.stepGuide.description")}
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Link
                      href="/documentation/1/welcome"
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-medium">
                          1
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {t("documentation.stepGuide.welcome.title")}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("documentation.stepGuide.welcome.description")}
                      </p>
                    </Link>
                    <Link
                      href="/documentation/2/install"
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-medium">
                          2
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {t("documentation.stepGuide.install.title")}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("documentation.stepGuide.install.description")}
                      </p>
                    </Link>
                    <Link
                      href="/documentation/3/development"
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-medium">
                          3
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {t("documentation.stepGuide.development.title")}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("documentation.stepGuide.development.description")}
                      </p>
                    </Link>
                    <Link
                      href="/documentation/4/building-patterns"
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-medium">
                          4
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {t("documentation.stepGuide.buildingPatterns.title")}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t(
                          "documentation.stepGuide.buildingPatterns.description"
                        )}
                      </p>
                    </Link>
                    <Link
                      href="/documentation/5/shadcn-components"
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-medium">
                          5
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {t("documentation.stepGuide.shadcnComponents.title")}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t(
                          "documentation.stepGuide.shadcnComponents.description"
                        )}
                      </p>
                    </Link>
                    <Link
                      href="/documentation/6/vercel-optimization"
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-medium">
                          6
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {t(
                            "documentation.stepGuide.vercelOptimization.title"
                          )}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t(
                          "documentation.stepGuide.vercelOptimization.description"
                        )}
                      </p>
                    </Link>
                  </div>
                </div>
              </section>

              {/* GitHub Repository */}
              <section aria-labelledby="github">
                <h2
                  id="github"
                  className="text-3xl font-bold text-black dark:text-white mb-6"
                >
                  {t("documentation.github.title")}
                </h2>

                <div className="space-y-4">
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t("documentation.github.description")}
                  </p>
                  <Button asChild>
                    <a
                      href={getGitHubUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                      aria-label="View Boiler.click on GitHub (opens in new tab)"
                    >
                      <Github className="h-4 w-4" />
                      {t("documentation.github.button")}
                    </a>
                  </Button>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
