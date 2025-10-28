"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthFormContainer } from "@/components/auth/AuthFormContainer";
import { forgotPasswordSchema } from "@/lib/validation/auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { SimpleLanguageSwitcher } from "@/components/SimpleLanguageSwitcher";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ForgotPasswordPage() {
  const { t, isRTL } = useLanguage();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validate form
      const validationResult = forgotPasswordSchema.safeParse({ email });
      if (!validationResult.success) {
        const fieldErrors: Record<string, string> = {};
        validationResult.error.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }

      // Submit forgot password request
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error });
        return;
      }

      setSuccess(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      setErrors({ general: t("auth.messages.unexpectedError") });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 relative">
        {/* Language Selector - Responsive to RTL */}
        <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} z-10`}>
          <SimpleLanguageSwitcher />
        </div>

        {/* Theme Toggle - Responsive to RTL */}
        <div
          className={`absolute bottom-4 ${isRTL ? "left-4" : "right-4"} z-10`}
        >
          <ThemeToggle />
        </div>

        <AuthFormContainer
          title={t("auth.forgotPassword.successTitle")}
          subtitle={t("auth.forgotPassword.successSubtitle")}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
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
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t("auth.forgotPassword.resetLinkSentTitle")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("auth.forgotPassword.resetLinkSentMessage")}{" "}
                    <strong>{email}</strong>{" "}
                    {t("auth.forgotPassword.resetLinkSentMessage2")}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    {t("auth.forgotPassword.checkEmailMessage")}
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href="/auth/login"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {t("auth.forgotPassword.backToSignIn")}
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
      <div className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} z-10`}>
        <SimpleLanguageSwitcher />
      </div>

      {/* Theme Toggle - Responsive to RTL */}
      <div className={`absolute bottom-4 ${isRTL ? "left-4" : "right-4"} z-10`}>
        <ThemeToggle />
      </div>

      <AuthFormContainer
        title={t("auth.forgotPassword.title")}
        subtitle={t("auth.forgotPassword.subtitle")}
      >
        <Card>
          <CardHeader>
            <CardTitle>{t("auth.forgotPassword.formTitle")}</CardTitle>
            <CardDescription>
              {t("auth.forgotPassword.formDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  {errors.general}
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-700 dark:text-gray-300"
                >
                  {t("auth.forgotPassword.email")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.forgotPassword.email")}
                  className={errors.email ? "border-red-500" : ""}
                  disabled={isLoading}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? t("auth.forgotPassword.submittingButton")
                  : t("auth.forgotPassword.submitButton")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("auth.forgotPassword.rememberPassword")}{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {t("auth.forgotPassword.signInLink")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </AuthFormContainer>
    </div>
  );
}
