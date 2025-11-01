"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [messages, setMessages] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // RTL detection
  const isRTL = language === "ar";

  // Load language from localStorage on mount
  useEffect(() => {
    setMounted(true);

    const savedLanguage = localStorage.getItem(
      "boiler-click-language"
    ) as Language;
    if (savedLanguage && ["en", "ar"].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split("-")[0];
      if (["en", "ar"].includes(browserLang)) {
        setLanguage(browserLang as Language);
        localStorage.setItem("boiler-click-language", browserLang);
      }
    }
  }, []);

  // Handle language change with localStorage persistence
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem("boiler-click-language", newLanguage);
  };

  // Load messages when language changes
  useEffect(() => {
    const loadMessages = async () => {
      try {
        let messages;
        switch (language) {
          case "ar":
            messages = (await import("../languages/ar.json")).default;
            break;
          default:
            messages = (await import("../languages/en.json")).default;
        }
        setMessages(messages);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load language messages:", error);
        // Fallback to English
        const fallback = (await import("../languages/en.json")).default;
        setMessages(fallback);
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [language]);

  // Translation function
  const t = (key: string): any => {
    if (!mounted || isLoading || Object.keys(messages).length === 0) {
      // Return empty string or loading indicator instead of the key
      return "";
    }

    const keys = key.split(".");
    let value: any = messages;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation not found for key: ${key}`);
        return key; // Return the key if translation not found
      }
    }

    return value;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleLanguageChange, t, isRTL }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
