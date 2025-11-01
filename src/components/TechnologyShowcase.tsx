"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Database,
  Palette,
  Zap,
  Code,
  Layers,
  Globe,
  Type,
  X,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

interface TechnologyItem {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  category: string;
}

export default function TechnologyShowcase() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Load visibility state from localStorage on component mount
  useEffect(() => {
    const savedVisibility = localStorage.getItem("technologyShowcaseVisible");
    if (savedVisibility !== null) {
      setIsVisible(JSON.parse(savedVisibility));
    }
  }, []);

  // Save visibility state to localStorage when it changes
  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("technologyShowcaseVisible", "false");
  };

  const technologies: TechnologyItem[] = [
    {
      id: "nextjs",
      name: "Next.js",
      description: t("homepage.showcase.nextjs.description") as string,
      icon: Globe,
      color: "text-purple-500 dark:text-purple-400",
      category: "framework",
    },
    {
      id: "prisma",
      name: "Prisma",
      description: t("homepage.showcase.prisma.description") as string,
      icon: Database,
      color: "text-purple-500 dark:text-purple-400",
      category: "database",
    },
    {
      id: "shadcn",
      name: "Shadcn/UI",
      description: t("homepage.showcase.shadcn.description") as string,
      icon: Layers,
      color: "text-purple-500 dark:text-purple-400",
      category: "ui",
    },
    {
      id: "tailwind",
      name: "Tailwind CSS",
      description: t("homepage.showcase.tailwind.description") as string,
      icon: Palette,
      color: "text-purple-500 dark:text-purple-400",
      category: "styling",
    },
    {
      id: "typescript",
      name: "TypeScript",
      description: t("homepage.showcase.typescript.description") as string,
      icon: Type,
      color: "text-purple-500 dark:text-purple-400",
      category: "language",
    },
    {
      id: "framer",
      name: "Framer Motion",
      description: t("homepage.showcase.framer.description") as string,
      icon: Zap,
      color: "text-purple-500 dark:text-purple-400",
      category: "animation",
    },
    {
      id: "lucide",
      name: "Lucide React",
      description: t("homepage.showcase.lucide.description") as string,
      icon: Code,
      color: "text-purple-500 dark:text-purple-400",
      category: "icons",
    },
  ];

  // Auto-cycling effect
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % technologies.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered, technologies.length]);

  const currentTech = technologies[currentIndex];

  const fadeVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
    },
  };

  const panelVariants = {
    hidden: {
      opacity: 0,
      x: 100,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={panelVariants}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed bottom-8 left-8 z-40 hidden lg:block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-2xl p-8 px-8 w-86 max-w-md relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={t("ui.ariaLabels.closeTechnologyShowcase")}
        >
          <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </button>
        {/* <<div className="flex items-center justify-between mb-6">
          h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {t("homepage.showcase.title")}
          </h3> 
        </div> */}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTech.id}
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-4">
              <div
                className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-800 ${currentTech.color}`}
              >
                <currentTech.icon className="h-8 w-8" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentTech.name}
                </h4>
                <p className="text-base text-gray-500 dark:text-gray-400 capitalize font-medium">
                  {
                    t(
                      `homepage.showcase.categories.${currentTech.category}`
                    ) as string
                  }
                </p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
              {currentTech.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex space-x-2 mt-6 text-center justify-center">
          {technologies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentIndex
                  ? "bg-purple-500 dark:bg-purple-400 shadow-lg shadow-purple-500/50 dark:shadow-purple-400/50"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              aria-label={`Go to ${technologies[index].name}`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-6">
          <Button asChild size="sm" variant="outline" className="flex-1">
            <Link href="/about">{t("navigation.about")}</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="flex-1 bg-white dark:bg-gray-900"
          >
            <Link href="/support">{t("navigation.support")}</Link>
          </Button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center font-small">
            {t("homepage.showcase.footer")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
