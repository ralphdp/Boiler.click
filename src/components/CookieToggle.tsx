"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CookieToggleProps {
  onOpenSettings: () => void;
}

export default function CookieToggle({ onOpenSettings }: CookieToggleProps) {
  const { t } = useLanguage();
  const [cookieStatus, setCookieStatus] = useState<string | null>(null);

  useEffect(() => {
    const checkCookieStatus = () => {
      const status = localStorage.getItem("boiler-click-cookies");
      setCookieStatus(status);
    };

    checkCookieStatus();

    // Listen for storage changes (cross-tab)
    window.addEventListener("storage", checkCookieStatus);

    // Listen for custom cookie status changes (same tab)
    const handleCookieStatusChange = () => {
      checkCookieStatus();
    };

    window.addEventListener("cookieStatusChanged", handleCookieStatusChange);

    return () => {
      window.removeEventListener("storage", checkCookieStatus);
      window.removeEventListener(
        "cookieStatusChanged",
        handleCookieStatusChange
      );
    };
  }, []);

  const getStatusColor = () => {
    switch (cookieStatus) {
      case "accepted":
        return "text-green-600 dark:text-green-400";
      case "declined":
        return "text-red-600 dark:text-red-400";
      case "custom":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusText = () => {
    switch (cookieStatus) {
      case "accepted":
        return t("cookies.status.accepted");
      case "declined":
        return t("cookies.status.declined");
      case "custom":
        return t("cookies.status.custom");
      default:
        return t("cookies.status.notSet");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 text-sm">
        <Cookie className={`w-4 h-4 ${getStatusColor()}`} />
        <span className={`${getStatusColor()}`}>{getStatusText()}</span>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenSettings}
              className="p-2 h-8 w-8"
            >
              <Settings className="w-4 h-4" />
              <span className="sr-only">
                {String(t("cookies.openSettings"))}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{String(t("cookies.openSettings"))}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
