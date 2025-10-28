/* Reset password page for authentication */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthFormContainer } from "@/components/auth/AuthFormContainer";
import { PasswordConfirmInput } from "@/components/auth/PasswordConfirmInput";
import { resetPasswordSchema } from "@/lib/validation/auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { SimpleLanguageSwitcher } from "@/components/SimpleLanguageSwitcher";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const { t, isRTL } = useLanguage();
  const token = params.token as string;

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    // Validate token on component mount
    if (!token) {
      setTokenValid(false);
      setErrors({ general: "Invalid reset link" });
    } else {
      setTokenValid(true);
    }
  }, [token]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validate form
      const validationResult = resetPasswordSchema.safeParse(formData);
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

      // Submit reset password request
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          ...validationResult.data,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          const fieldErrors: Record<string, string> = {};
          data.details.forEach((error: { path: string[]; message: string }) => {
            if (error.path[0]) {
              fieldErrors[error.path[0] as string] = error.message;
            }
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: data.error });
        }
        return;
      }

      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login?message=password_reset_success");
      }, 3000);
    } catch (error) {
      console.error("Reset password error:", error);
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
          title={t("auth.resetPassword.successTitle")}
          subtitle={t("auth.resetPassword.successSubtitle")}
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
                    {t("auth.resetPassword.passwordUpdatedTitle")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("auth.resetPassword.passwordUpdatedMessage")}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    {t("auth.resetPassword.redirectMessage")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AuthFormContainer>
      </div>
    );
  }

  if (tokenValid === false) {
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
          title={t("auth.resetPassword.invalidLinkTitle")}
          subtitle={t("auth.resetPassword.invalidLinkSubtitle")}
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
                    {t("auth.resetPassword.linkInvalidTitle")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("auth.resetPassword.linkInvalidMessage")}
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href="/auth/forgot-password"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {t("auth.resetPassword.requestNewLink")}
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
        title={t("auth.resetPassword.title")}
        subtitle={t("auth.resetPassword.subtitle")}
      >
        <Card>
          <CardHeader>
            <CardTitle>{t("auth.resetPassword.formTitle")}</CardTitle>
            <CardDescription>
              {t("auth.resetPassword.formDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  {errors.general}
                </div>
              )}

              <PasswordConfirmInput
                password={formData.password}
                confirmPassword={formData.confirmPassword}
                onPasswordChange={(value) =>
                  handleInputChange("password", value)
                }
                onConfirmPasswordChange={(value) =>
                  handleInputChange("confirmPassword", value)
                }
                disabled={isLoading}
                required
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? t("auth.resetPassword.submittingButton")
                  : t("auth.resetPassword.submitButton")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("auth.resetPassword.rememberPassword")}{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {t("auth.resetPassword.signInLink")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </AuthFormContainer>
    </div>
  );
}
