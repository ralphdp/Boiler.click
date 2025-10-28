"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CookiePreferences } from "@/components/CookieSettings";

interface CookieContextType {
  cookieStatus: string | null;
  cookiePreferences: CookiePreferences | null;
  updateCookieStatus: (status: string) => void;
  updateCookiePreferences: (preferences: CookiePreferences) => void;
  isAnalyticsEnabled: () => boolean;
  isMarketingEnabled: () => boolean;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export function CookieProvider({ children }: { children: ReactNode }) {
  const [cookieStatus, setCookieStatus] = useState<string | null>(null);
  const [cookiePreferences, setCookiePreferences] =
    useState<CookiePreferences | null>(null);

  useEffect(() => {
    // Load cookie status and preferences from localStorage
    const status = localStorage.getItem("boiler-click-cookies");
    const preferences = localStorage.getItem("boiler-click-cookie-preferences");

    setCookieStatus(status);

    if (preferences) {
      try {
        const parsed = JSON.parse(preferences);
        setCookiePreferences(parsed);
      } catch (e) {
        console.error("Failed to parse cookie preferences:", e);
      }
    }
  }, []);

  const updateCookieStatus = (status: string) => {
    localStorage.setItem("boiler-click-cookies", status);
    setCookieStatus(status);
  };

  const updateCookiePreferences = (preferences: CookiePreferences) => {
    localStorage.setItem(
      "boiler-click-cookie-preferences",
      JSON.stringify(preferences)
    );
    setCookiePreferences(preferences);
  };

  const isAnalyticsEnabled = () => {
    if (cookieStatus === "accepted") return true;
    if (cookieStatus === "declined") return false;
    if (cookiePreferences?.analytics) return true;
    return false;
  };

  const isMarketingEnabled = () => {
    if (cookieStatus === "accepted") return true;
    if (cookieStatus === "declined") return false;
    if (cookiePreferences?.marketing) return true;
    return false;
  };

  return (
    <CookieContext.Provider
      value={{
        cookieStatus,
        cookiePreferences,
        updateCookieStatus,
        updateCookiePreferences,
        isAnalyticsEnabled,
        isMarketingEnabled,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
}

export function useCookie() {
  const context = useContext(CookieContext);
  if (context === undefined) {
    throw new Error("useCookie must be used within a CookieProvider");
  }
  return context;
}
