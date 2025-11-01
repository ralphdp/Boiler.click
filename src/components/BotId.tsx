"use client";

import { useEffect, useState } from "react";
import { BotIdClient } from "botid/client";
import { isBotIdEnabled, getBotIdConfig } from "@/lib/botid";
import { useLanguage } from "@/contexts/LanguageContext";

interface BotIdProps {
  className?: string;
  children?: React.ReactNode;
}

export default function BotId({ className = "", children }: BotIdProps) {
  const { t } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const config = getBotIdConfig();

  useEffect(() => {
    // BotID is automatically active when deployed to Vercel
    setIsActive(config.enabled);
  }, [config.enabled]);

  // In development, show status indicator
  if (!config.enabled) {
    return (
      <div className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 dark:bg-green-900 rounded border border-green-300 dark:border-green-700 flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <span>{t("ui.botid.disabledInDevelopment")}</span>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className={className}>
      {isActive && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900 rounded border border-blue-300 dark:border-blue-700 flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
          <span>{t("ui.botid.protectionActive")}</span>
        </div>
      )}
      {children}
      {/* Official BotID Client Component - automatically handles bot detection */}
      <BotIdClient protect={[]} />
    </div>
  );
}

// BotID Provider for context
export const BotIdProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const config = getBotIdConfig();

  useEffect(() => {
    // BotID initializes automatically on Vercel
    setIsInitialized(true);
  }, []);

  return (
    <div data-botid-initialized={isInitialized} data-vercel={config.isVercel}>
      {children}
      {/* Official BotID Client Component */}
      <BotIdClient protect={[]} />
    </div>
  );
};
