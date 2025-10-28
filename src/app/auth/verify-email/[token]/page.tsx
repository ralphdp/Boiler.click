"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { AuthFormContainer } from "@/components/auth/AuthFormContainer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useLanguage();
  const token = params.token as string;

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
      <AuthFormContainer
        title={t("auth.verifyEmail.verifyingTitle")}
        subtitle={t("auth.verifyEmail.verifyingSubtitle")}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
    );
  }

  if (status === "success") {
    return (
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
                  {t("auth.verifyEmail.welcomeTitle")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("auth.verifyEmail.welcomeMessage")}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  {t("auth.verifyEmail.redirectMessage")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </AuthFormContainer>
    );
  }

  return (
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
  );
}
