"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { SimpleLanguageSwitcher } from "@/components/SimpleLanguageSwitcher";
import { ThemeToggle } from "@/components/theme-toggle";

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
      {/* Language Selector - Responsive to RTL */}
      <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"}`}>
        <SimpleLanguageSwitcher />
      </div>

      {/* Main Error Content */}
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          {errorInfo.title}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          {errorInfo.message}
        </p>
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

      {/* Dark Mode Toggle - Responsive to RTL */}
      <div className={`absolute bottom-4 ${isRTL ? "left-4" : "right-4"}`}>
        <ThemeToggle />
      </div>
    </div>
  );
}
