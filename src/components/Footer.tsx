"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import CookieToggle from "@/components/CookieToggle";
import CookieSettings, { CookiePreferences } from "@/components/CookieSettings";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Footer() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [showCookieSettings, setShowCookieSettings] = useState(false);

  return (
    <footer
      className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 relative z-30"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className="flex flex-col sm:flex-row sm:justify-between items-center gap-4"
          role="group"
          aria-label="Footer content"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div
              className="text-sm text-gray-600 dark:text-gray-400"
              role="text"
            >
              {(() => {
                const copyrightText = t("footer.copyright") as string;
                const year = new Date().getFullYear().toString();
                const replacedText = copyrightText.replace("{year}", year);
                const parts = replacedText.split(".");
                return (
                  <>
                    {parts[0]}
                    <span className="text-xs">.{parts[1] || ""}</span>
                  </>
                );
              })()}
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/legal"
                className={`text-sm underline transition-all duration-300 ${
                  pathname === "/legal"
                    ? "text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-200"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                }`}
                aria-label="View legal information"
              >
                {t("footer.legal")}
              </Link>
              <span className="text-gray-400 dark:text-gray-500">•</span>
              <Link
                href="/sitemap.xml"
                className="text-sm underline transition-all duration-300 text-zinc-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                aria-label="View sitemap"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("footer.sitemap")}
              </Link>
              <span className="text-gray-400 dark:text-gray-500">•</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/documentation">
                      <Badge
                        variant="secondary"
                        className="text-xs cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        v.{process.env.NEXT_PUBLIC_VERSION || "0.0.1"}
                      </Badge>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      Build:{" "}
                      {process.env.NEXT_PUBLIC_BUILD_TIME ||
                        new Date().toISOString()}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <CookieToggle onOpenSettings={() => setShowCookieSettings(true)} />
            <ThemeToggle />
          </div>
        </div>
      </div>

      <CookieSettings
        isOpen={showCookieSettings}
        onClose={() => setShowCookieSettings(false)}
        onSave={(preferences: CookiePreferences) => {
          localStorage.setItem(
            "boiler-click-cookie-preferences",
            JSON.stringify(preferences)
          );
          // Don't override the status here - let CookieSettings handle it
          setShowCookieSettings(false);
        }}
      />
    </footer>
  );
}
