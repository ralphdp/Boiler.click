"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { HeroBackground } from "@/components/HeroBackground";
import { DarkOverlay } from "@/components/DarkOverlay";
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// FAQ data will be loaded from translations

function FAQItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg"
        aria-expanded={isOpen}
        aria-controls={`faq-${item.id}`}
      >
        <span className="font-medium text-gray-900 dark:text-white">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`faq-${item.id}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
              height: { duration: 0.3, ease: "easeInOut" },
              opacity: { duration: 0.2, ease: "easeInOut" },
            }}
            className="overflow-hidden"
          >
            <div className="px-6 pt-2 pb-4">
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const { t } = useLanguage();
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    "all",
    "general",
    "technical",
    "getting-started",
    "customization",
    "production",
    "development",
  ];

  // Get FAQ data from translations
  const faqQuestions = t("faq.questions");
  console.log("FAQ questions from translation:", faqQuestions);

  // Ensure we have a valid array of FAQ items
  const faqData: FAQItem[] = Array.isArray(faqQuestions)
    ? (faqQuestions as FAQItem[])
    : [];

  // Update loading state when FAQ data is available
  useEffect(() => {
    if (Array.isArray(faqQuestions) && faqQuestions.length > 0) {
      setIsLoading(false);
    }
  }, [faqQuestions]);

  const filteredFAQs =
    selectedCategory === "all"
      ? faqData
      : faqData.filter((item) => item.category === selectedCategory);

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
        aria-label={t("ui.ariaLabels.faqPageMainContent")}
      >
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <motion.div
            className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-bold text-black dark:text-white mb-8">
              {t("faq.title")}
            </h1>
          </motion.div>

          <motion.div
            className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <p className="text-lg text-zinc-600 dark:text-zinc-200 leading-relaxed">
              {t("faq.description")}
            </p>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-2 justify-center sm:justify-start">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-black dark:bg-white text-white dark:text-black"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {t(`faq.categories.${category}`)}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="w-full space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    Loading FAQs...
                  </p>
                </div>
              ) : Array.isArray(filteredFAQs) && filteredFAQs.length > 0 ? (
                filteredFAQs.map((item) => (
                  <FAQItem
                    key={item.id}
                    item={item}
                    isOpen={openFAQ === item.id}
                    onToggle={() =>
                      setOpenFAQ(openFAQ === item.id ? null : item.id)
                    }
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    {t("faq.noResults")}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
