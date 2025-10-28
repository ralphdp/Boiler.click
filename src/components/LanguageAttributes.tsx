"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

export default function LanguageAttributes() {
  const { language, isRTL } = useLanguage();

  useEffect(() => {
    // Update HTML attributes
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [language, isRTL]);

  return null; // This component doesn't render anything
}
