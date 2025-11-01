"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef, useEffect } from "react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

export function SimpleLanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage =
    languages.find((lang) => lang.code === language) || languages[0];

  const handleLanguageChange = (locale: string) => {
    setLanguage(locale as any);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Calculate dropdown position
  const getDropdownPosition = () => {
    if (!buttonRef.current) return { top: 0, right: 0 };

    const rect = buttonRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const dropdownWidth = 192; // w-48 = 12rem = 192px
    const dropdownHeight = languages.length * 40 + 16; // Approximate height

    let top = rect.bottom + 8;
    let right = viewportWidth - rect.right;

    // Adjust if dropdown would go off screen
    if (top + dropdownHeight > viewportHeight) {
      top = rect.top - dropdownHeight - 8;
    }

    if (right + dropdownWidth > viewportWidth) {
      right = viewportWidth - dropdownWidth - 16;
    }

    return { top, right };
  };

  const position = getDropdownPosition();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={buttonRef}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Globe className="w-4 h-4" />
            <Badge variant="outline" className="text-xs">
              {currentLanguage.code.toUpperCase()}
            </Badge>
          </Button>
        </TooltipTrigger>

        {isOpen && (
          <div
            ref={dropdownRef}
            className="fixed w-48 z-[9999] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-1"
            style={{
              top: `${position.top}px`,
              right: `${position.right}px`,
            }}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="w-full flex items-center gap-3 cursor-pointer px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm transition-colors"
              >
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        )}

        <TooltipContent>
          <p className="text-xs">{t("tooltips.languageSwitcher")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
