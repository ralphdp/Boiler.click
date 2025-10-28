"use client";

import { useState } from "react";
import CookieBanner from "@/components/CookieBanner";
import CookieSettings, { CookiePreferences } from "@/components/CookieSettings";
import { useCookie } from "@/contexts/CookieContext";

export default function CookieManager() {
  const [showSettings, setShowSettings] = useState(false);
  const { updateCookieStatus, updateCookiePreferences } = useCookie();

  const handleAccept = () => {
    updateCookieStatus("accepted");
    updateCookiePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleDecline = () => {
    updateCookieStatus("declined");
    updateCookiePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const handleShowSettings = () => {
    setShowSettings(true);
  };

  const handleSavePreferences = (preferences: CookiePreferences) => {
    updateCookiePreferences(preferences);
    updateCookieStatus("custom");
  };

  return (
    <>
      <CookieBanner
        onAccept={handleAccept}
        onDecline={handleDecline}
        onShowSettings={handleShowSettings}
      />
      <CookieSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSavePreferences}
      />
    </>
  );
}
