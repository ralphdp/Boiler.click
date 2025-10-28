"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { SimpleLanguageSwitcher } from "@/components/SimpleLanguageSwitcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { HeroBackground } from "./HeroBackground";
import { DarkOverlay } from "./DarkOverlay";
import { AuthFormContainer } from "./auth/AuthFormContainer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
interface ErrorDisplayProps {
  statusCode?: number;
  title?: string;
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

export function ErrorDisplay({
  statusCode,
  title,
  message,
  showRetry = false,
  onRetry,
}: ErrorDisplayProps) {
  const { t, isRTL } = useLanguage();

  const getErrorInfo = (code?: number) => {
    switch (code) {
      case 404:
        return {
          title: t("error.404.title"),
          message: t("error.404.message"),
        };
      case 403:
        return {
          title: t("error.403.title"),
          message: t("error.403.message"),
        };
      case 405:
        return {
          title: t("error.405.title"),
          message: t("error.405.message"),
        };
      case 429:
        return {
          title: t("error.429.title"),
          message: t("error.429.message"),
        };
      case 500:
        return {
          title: t("error.500.title"),
          message: t("error.500.message"),
        };
      case 503:
        return {
          title: t("error.503.title"),
          message: t("error.503.message"),
        };
      default:
        return {
          title: title || t("error.default.title"),
          message: message || t("error.default.message"),
        };
    }
  };

  const errorInfo = getErrorInfo(statusCode);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative">
      {/* Animated Gradient Background */}
      <HeroBackground />

      {/* Dark Overlay */}
      <DarkOverlay />

      {/* Language Selector - Responsive to RTL */}
      <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} z-20`}>
        <SimpleLanguageSwitcher />
      </div>

      {/* Dark Mode Toggle - Responsive to RTL */}
      <div className={`absolute bottom-4 ${isRTL ? "left-4" : "right-4"} z-20`}>
        <ThemeToggle />
      </div>

      {/* Main Error Content */}

      <Card>
        <CardHeader>
          <CardTitle>{errorInfo.title}</CardTitle>
          <CardDescription>{errorInfo.message}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="space-x-4">
              {showRetry && onRetry && (
                <button
                  onClick={onRetry}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t("error.actions.tryAgain")}
                </button>
              )}
              <Link
                href="/"
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {t("error.actions.goHome")}
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
