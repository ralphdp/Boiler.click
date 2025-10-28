"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Github, Mail } from "lucide-react";
import { getGitHubUrl } from "@/lib/github";

export default function SupportPage() {
  const { t } = useLanguage();

  // Get dynamic contact information from environment variables
  const supportEmail =
    process.env.NEXT_PUBLIC_SITE_EMAIL_SUPPORT || "support@boiler.click";

  return (
    <div
      className="min-h-screen font-sans dark:bg-gradient-to-br dark:from-gray-900 dark:to-black"
      role="main"
    >
      <Navigation />
      <main
        className="flex min-h-screen w-full max-w-3xl mx-auto flex-col items-center justify-center py-32 px-16 sm:items-start relative z-10"
        role="main"
        aria-label="Support page content"
      >
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <motion.div
            className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-bold text-black dark:text-white mb-8">
              {t("support.title")}
            </h1>
          </motion.div>

          <motion.div
            className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <p className="text-lg text-zinc-600 dark:text-zinc-200 leading-relaxed">
              {t("support.description")}
            </p>

            <div className="space-y-6">
              <div role="group" aria-label="GitHub support">
                <h2 className="text-2xl font-semibold text-black dark:text-white mb-2">
                  {t("support.github.title")}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                  {t("support.github.description")}
                </p>
                <Button asChild>
                  <a
                    href={getGitHubUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                    aria-label="Visit GitHub repository (opens in new tab)"
                  >
                    <Github className="h-4 w-4" />
                    {t("support.github.button")}
                  </a>
                </Button>
              </div>

              <div role="group" aria-label="Email support">
                <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                  {t("support.email.title")}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                  {t("support.email.description")}
                </p>
                <Button asChild>
                  <a
                    href={`mailto:${supportEmail}`}
                    className="inline-flex items-center"
                    aria-label="Send email to support"
                  >
                    <Mail className="h-4 w-4" />
                    {t("support.email.button")}: {supportEmail}
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
