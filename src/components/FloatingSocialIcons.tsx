"use client";

import { motion } from "framer-motion";
import { Twitter, Facebook, Linkedin, Github } from "lucide-react";
import { useEffect, useState } from "react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/contexts/LanguageContext";
import { getGitHubUrl } from "@/lib/github";

interface FloatingSocialIconsProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
}

// Custom hook to get current URL safely
function useCurrentUrl() {
  const [currentUrl, setCurrentUrl] = useState("https://boiler.click");

  useEffect(() => {
    if (typeof window !== "undefined") {
      React.startTransition(() => {
        setCurrentUrl(window.location.href);
      });
    }
  }, []);

  return currentUrl;
}

export function FloatingSocialIcons({
  url,
  title = "Boiler.click - Next generation full-stack SaaS boilerplate",
  description = "Next generation full-stack SaaS boilerplate. Powered with Next.js, Prisma, Shadcn, and other performant technologies.",
  className = "",
}: FloatingSocialIconsProps) {
  const { t } = useLanguage();
  const currentUrl = useCurrentUrl();
  const shareUrl = url || currentUrl;

  const shareData = {
    url: shareUrl,
    title,
    text: description,
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareData.title
    )}&url=${encodeURIComponent(shareData.url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareData.url
    )}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareData.url
    )}`,
    github: getGitHubUrl(),
  };

  const socialIcons = [
    {
      name: "Twitter",
      icon: Twitter,
      href: shareLinks.twitter,
      color: "hover:text-blue-400",
      bg: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
      tooltip: t("social.tooltips.twitter"),
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: shareLinks.facebook,
      color: "hover:text-blue-600",
      bg: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
      tooltip: t("social.tooltips.facebook"),
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: shareLinks.linkedin,
      color: "hover:text-blue-700",
      bg: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
      tooltip: t("social.tooltips.linkedin"),
    },
    {
      name: "GitHub",
      icon: Github,
      href: shareLinks.github,
      color: "hover:text-gray-800 dark:hover:text-gray-200",
      bg: "hover:bg-gray-50 dark:hover:bg-gray-800/20",
      tooltip: t("social.tooltips.github"),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-20 ${className}`}
      role="complementary"
      aria-label="Social sharing links"
    >
      <div className="flex flex-col gap-3">
        <TooltipProvider>
          {socialIcons.map((social, index) => {
            const IconComponent = social.icon;
            return (
              <Tooltip key={social.name}>
                <TooltipTrigger asChild>
                  <motion.a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      w-8 h-8 rounded-full 
                      bg-white dark:bg-gray-800 
                      border border-gray-200 dark:border-gray-700
                      flex items-center justify-center
                      text-gray-600 dark:text-gray-400
                      ${social.color}
                      ${social.bg}
                      transition-all duration-300
                      hover:scale-110 hover:shadow-lg
                      backdrop-blur-sm
                      cursor-pointer
                    `}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    aria-label={`Share on ${social.name}`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <IconComponent className="h-3.5 w-3.5" />
                  </motion.a>
                </TooltipTrigger>
                <TooltipContent side="left" className="text-xs">
                  <p>{social.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </motion.div>
  );
}

// Mobile version for smaller screens
export function MobileSocialIcons({
  url,
  title = "Boiler.click - Next generation full-stack SaaS boilerplate",
  description = "Next generation full-stack SaaS boilerplate. Powered with Next.js, Prisma, Shadcn, and other performant technologies.",
  className = "",
}: FloatingSocialIconsProps) {
  const { t } = useLanguage();
  const currentUrl = useCurrentUrl();
  const shareUrl = url || currentUrl;

  const shareData = {
    url: shareUrl,
    title,
    text: description,
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareData.title
    )}&url=${encodeURIComponent(shareData.url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareData.url
    )}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareData.url
    )}`,
    github: getGitHubUrl(),
  };

  const socialIcons = [
    {
      name: "Twitter",
      icon: Twitter,
      href: shareLinks.twitter,
      tooltip: t("social.tooltips.twitter"),
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: shareLinks.facebook,
      tooltip: t("social.tooltips.facebook"),
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: shareLinks.linkedin,
      tooltip: t("social.tooltips.linkedin"),
    },
    {
      name: "GitHub",
      icon: Github,
      href: shareLinks.github,
      tooltip: t("social.tooltips.github"),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className={`flex justify-center gap-4 lg:hidden ${className}`}
      role="complementary"
      aria-label="Social sharing links"
    >
      <TooltipProvider>
        {socialIcons.map((social) => {
          const IconComponent = social.icon;
          return (
            <Tooltip key={social.name}>
              <TooltipTrigger asChild>
                <motion.a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Share on ${social.name}`}
                >
                  <IconComponent className="h-3.5 w-3.5" />
                </motion.a>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                <p>{social.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </motion.div>
  );
}
