"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, Shield, BarChart3, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Modal, { ModalContent, ModalFooter } from "@/components/ui/modal";

interface CookieSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: CookiePreferences) => void;
}

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieSettings({
  isOpen,
  onClose,
  onSave,
}: CookieSettingsProps) {
  const { t } = useLanguage();
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    if (isOpen) {
      // Load existing preferences
      const saved = localStorage.getItem("boiler-click-cookie-preferences");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setPreferences({ ...preferences, ...parsed });
        } catch (e) {
          console.error("Failed to parse cookie preferences:", e);
        }
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem(
      "boiler-click-cookie-preferences",
      JSON.stringify(preferences)
    );
    localStorage.setItem("boiler-click-cookies", "custom");
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("cookieStatusChanged"));
    onSave(preferences);
    onClose();
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem(
      "boiler-click-cookie-preferences",
      JSON.stringify(allAccepted)
    );
    localStorage.setItem("boiler-click-cookies", "accepted");
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("cookieStatusChanged"));
    onSave(allAccepted);
    onClose();
  };

  const handleRejectAll = () => {
    const allRejected = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(allRejected);
    localStorage.setItem(
      "boiler-click-cookie-preferences",
      JSON.stringify(allRejected)
    );
    localStorage.setItem("boiler-click-cookies", "declined");
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("cookieStatusChanged"));
    onSave(allRejected);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={String(t("cookies.settingsTitle"))}
      icon={<Settings className="w-6 h-6" />}
      maxWidth="2xl"
    >
      <ModalContent className="p-6">
        <div className="space-y-4">
          {/* Necessary Cookies */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <CardTitle className="text-lg">
                    {t("cookies.necessary.title")}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600 font-medium">
                    {t("cookies.alwaysActive")}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("cookies.necessary.description")}
              </p>
            </CardContent>
          </Card>

          {/* Analytics Cookies */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                  <CardTitle className="text-lg">
                    {t("cookies.analytics.title")}
                  </CardTitle>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        analytics: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("cookies.analytics.description")}
              </p>
            </CardContent>
          </Card>

          {/* Marketing Cookies */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cookie className="w-5 h-5 text-muted-foreground" />
                  <CardTitle className="text-lg">
                    {t("cookies.marketing.title")}
                  </CardTitle>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        marketing: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("cookies.marketing.description")}
              </p>
            </CardContent>
          </Card>
        </div>
      </ModalContent>

      <ModalFooter>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleRejectAll}
            className="flex-1"
          >
            {t("cookies.rejectAll")}
          </Button>
          <Button variant="outline" onClick={handleSave} className="flex-1">
            {t("cookies.savePreferences")}
          </Button>
          <Button
            onClick={handleAcceptAll}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
          >
            {t("cookies.acceptAll")}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
