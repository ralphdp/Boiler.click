"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BotId from "@/components/BotId";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BotIdExample() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      // Test BotID verification (no token needed with official implementation)
      const response = await fetch("/api/botid/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setResult(
          `✅ BotID verification successful! Score: ${data.score}, Risk: ${data.riskLevel}`
        );
      } else {
        setError(`❌ BotID verification failed: ${data.error}`);
      }
    } catch (err) {
      setError(
        `❌ Error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">{t("botidExample.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <BotId>
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>{t("botidExample.description")}</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>{t("botidExample.features.invisibleDetection")}</li>
                <li>{t("botidExample.features.noInteraction")}</li>
                <li>{t("botidExample.features.mlProtection")}</li>
                <li>{t("botidExample.features.riskScoring")}</li>
                <li>{t("botidExample.features.automaticVercel")}</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="text-sm">
                <strong>{t("botidExample.status")}</strong>{" "}
                <span className="text-green-600">
                  {t("botidExample.active")}
                </span>
              </div>

              <div className="text-xs text-gray-500 font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                {t("botidExample.noTokens")}
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting
                ? t("botidExample.verifying")
                : t("botidExample.testVerification")}
            </Button>

            {result && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-800 dark:text-green-200">
                  {result}
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            )}

            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p>
                <strong>{t("botidExample.modes.development")}</strong>{" "}
                {t("botidExample.modes.developmentDesc")}
              </p>
              <p>
                <strong>{t("botidExample.modes.production")}</strong>{" "}
                {t("botidExample.modes.productionDesc")}
              </p>
              <p>
                <strong>{t("botidExample.modes.noConfig")}</strong>{" "}
                {t("botidExample.modes.noConfigDesc")}
              </p>
            </div>
          </div>
        </BotId>
      </CardContent>
    </Card>
  );
}
