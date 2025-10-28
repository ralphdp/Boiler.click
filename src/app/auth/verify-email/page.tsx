"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { AuthFormContainer } from "@/components/auth/AuthFormContainer";
import { useLanguage } from "@/contexts/LanguageContext";
import { SimpleLanguageSwitcher } from "@/components/SimpleLanguageSwitcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { HeroBackground } from "@/components/HeroBackground";
import { DarkOverlay } from "@/components/DarkOverlay";
function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, isRTL } = useLanguage();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setError(t("auth.messages.tokenInvalid"));
        return;
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          setStatus("error");
          setError(data.error || t("auth.messages.unexpectedError"));
          return;
        }

        setStatus("success");
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/auth/login?message=email_verified");
        }, 3000);
      } catch (error) {
        console.error("Email verification error:", error);
        setStatus("error");
        setError(t("auth.messages.unexpectedError"));
      }
    };

    verifyEmail();
  }, [token, router, t]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 relative">
        {/* Animated Gradient Background */}
        <HeroBackground />

        {/* Dark Overlay */}
        <DarkOverlay />

        {/* Language Selector - Responsive to RTL */}
        <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} z-30`}>
          <SimpleLanguageSwitcher />
        </div>

        {/* Theme Toggle - Responsive to RTL */}
        <div
          className={`absolute bottom-4 ${isRTL ? "left-4" : "right-4"} z-30`}
        >
          <ThemeToggle />
        </div>

        <AuthFormContainer
          title={t("auth.verifyEmail.title")}
          subtitle={t("auth.verifyEmail.subtitle")}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto animate-spin">
                  <svg
                    className="w-8 h-8 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t("auth.verifyEmail.verifyingTitle")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("auth.verifyEmail.verifyingMessage")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AuthFormContainer>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 relative">
        {/* Language Selector - Responsive to RTL */}
        <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} z-30`}>
          <SimpleLanguageSwitcher />
        </div>

        {/* Theme Toggle - Responsive to RTL */}
        <div
          className={`absolute bottom-4 ${isRTL ? "left-4" : "right-4"} z-30`}
        >
          <ThemeToggle />
        </div>

        <AuthFormContainer
          title={t("auth.verifyEmail.successTitle")}
          subtitle={t("auth.verifyEmail.successSubtitle")}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-8 h-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t("auth.verifyEmail.verificationSuccessTitle")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {t("auth.verifyEmail.verificationSuccessMessage")}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {t("auth.verifyEmail.redirectingMessage")}
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {t("auth.verifyEmail.goToSignIn")}
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </AuthFormContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative">
      {/* Language Selector - Responsive to RTL */}
      <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} z-30`}>
        <SimpleLanguageSwitcher />
      </div>

      {/* Theme Toggle - Responsive to RTL */}
      <div className={`absolute bottom-4 ${isRTL ? "left-4" : "right-4"} z-30`}>
        <ThemeToggle />
      </div>

      <AuthFormContainer
        title={t("auth.verifyEmail.failedTitle")}
        subtitle={t("auth.verifyEmail.failedSubtitle")}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t("auth.verifyEmail.verificationFailedTitle")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {t("auth.verifyEmail.verificationFailedMessage")}
                </p>
              </div>
              <div className="pt-4 space-y-2">
                <Link
                  href="/auth/resend-activation"
                  className="block text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {t("auth.verifyEmail.requestNewVerification")}
                </Link>
                <Link
                  href="/auth/login"
                  className="block text-gray-600 dark:text-gray-400 hover:underline"
                >
                  {t("auth.verifyEmail.backToSignIn")}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </AuthFormContainer>
    </div>
  );
}

function LoadingFallback() {
  const { t, isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative">
      {/* Language Selector - Responsive to RTL */}
      <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} z-30`}>
        <SimpleLanguageSwitcher />
      </div>

      {/* Theme Toggle - Responsive to RTL */}
      <div className={`absolute bottom-4 ${isRTL ? "left-4" : "right-4"} z-30`}>
        <ThemeToggle />
      </div>

      <AuthFormContainer
        title={t("auth.verifyEmail.title")}
        subtitle={t("auth.verifyEmail.subtitle")}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto animate-spin">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t("auth.verifyEmail.verifyingTitle")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("auth.verifyEmail.verifyingMessage")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </AuthFormContainer>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
