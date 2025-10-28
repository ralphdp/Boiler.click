"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Cookie, Shield, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CookieBannerProps {
  onAccept: () => void;
  onDecline: () => void;
  onShowSettings: () => void;
}

export default function CookieBanner({
  onAccept,
  onDecline,
  onShowSettings,
}: CookieBannerProps) {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem("boiler-click-cookies");
    if (!cookieChoice) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("boiler-click-cookies", "accepted");
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem("boiler-click-cookies", "declined");
    setIsVisible(false);
    onDecline();
  };

  const handleShowSettings = () => {
    setIsVisible(false);
    onShowSettings();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-shrink-0">
                <Cookie className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {t("cookies.title")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("cookies.description")}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShowSettings}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                {t("cookies.settings")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecline}
                className="flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                {t("cookies.decline")}
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Cookie className="w-4 h-4" />
                {t("cookies.accept")}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
