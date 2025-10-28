"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CopyrightProps {
  className?: string;
  showVersion?: boolean;
  showLinks?: boolean;
}

export default function Copyright({
  className = "",
  showVersion = true,
  showLinks = true,
}: CopyrightProps) {
  const { t } = useLanguage();
  const pathname = usePathname();

  return (
    <div
      className={`flex flex-col sm:flex-row items-center gap-4 ${className}`}
      role="group"
      aria-label="Copyright information"
    >
      <div className="text-sm text-gray-600 dark:text-gray-400" role="text">
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

      {showLinks && (
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
        </div>
      )}

      {showVersion && (
        <>
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
        </>
      )}
    </div>
  );
}
