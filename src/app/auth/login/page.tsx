/* Login page for authentication */
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { HeroBackground } from "@/components/HeroBackground";
import { DarkOverlay } from "@/components/DarkOverlay";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { loginSchema } from "@/lib/validation/auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/contexts/ToastContext";
import { ThemeToggle } from "@/components/theme-toggle";
import { SimpleLanguageSwitcher } from "@/components/SimpleLanguageSwitcher";
import { Flame } from "lucide-react";
import Copyright from "@/components/Copyright";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, isRTL } = useLanguage();
  const { showError } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    // Check for URL parameters
    const message = searchParams.get("message");
    const error = searchParams.get("error");

    if (message === "registration_success") {
      // Show success message
    }

    if (error === "oauth_error") {
      setErrors({ general: t("auth.messages.oauthError") });
    } else if (error === "oauth_failed") {
      setErrors({ general: t("auth.messages.oauthCancelled") });
    } else if (error === "session_error") {
      setErrors({ general: t("auth.messages.sessionError") });
    }
  }, [searchParams, t]);

  const handleInputChange = (field: string, value: string | boolean) => {
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
      const validationResult = loginSchema.safeParse({
        email: formData.email,
        password: formData.password,
      });

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

      // Submit login
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.needsVerification) {
          showError(data.error || t("auth.messages.emailNotVerified"));
        } else if (data.details) {
          const fieldErrors: Record<string, string> = {};
          data.details.forEach((error: { path: string[]; message: string }) => {
            if (error.path[0]) {
              fieldErrors[error.path[0]] = error.message;
            }
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: data.error });
        }
        return;
      }

      // Login successful, redirect to account
      router.push("/account");
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: t("auth.messages.unexpectedError") });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Animated Gradient Background */}
      <HeroBackground />

      {/* Dark Overlay */}
      <DarkOverlay />

      {/* Language Toggle - Responsive to RTL */}
      <div className={`fixed top-4 z-50 ${isRTL ? "left-4" : "right-4"}`}>
        <SimpleLanguageSwitcher />
      </div>

      {/* Theme Toggle - Responsive to RTL */}
      <div className={`fixed bottom-4 z-50 ${isRTL ? "left-4" : "right-4"}`}>
        <ThemeToggle />
      </div>

      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8 bg-white dark:bg-gray-900 relative z-10 shadow-lg">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
              <Flame className="w-8 h-8 text-purple-500 dark:text-purple-400" />
              {t("auth.login.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("auth.login.subtitleBefore")}{" "}
              <Link
                href="/"
                className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
              >
                Boiler.click
              </Link>{" "}
              {t("auth.login.subtitleAfter")}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("auth.login.formTitle")}</CardTitle>
              <CardDescription>
                {t("auth.login.formDescription")}
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
                    {t("auth.login.email")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder={t("auth.login.email")}
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

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    {t("auth.login.password")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder={t("auth.login.password")}
                    className={errors.password ? "border-red-500" : ""}
                    disabled={isLoading}
                    required
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        handleInputChange("rememberMe", !!checked)
                      }
                      disabled={isLoading}
                      className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 dark:data-[state=checked]:bg-purple-400 dark:data-[state=checked]:border-purple-400"
                    />
                    <Label
                      htmlFor="rememberMe"
                      className="ml-2 text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      {t("auth.login.rememberMe")}
                    </Label>
                  </div>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    {t("auth.login.forgotPassword")}
                  </Link>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? t("auth.login.submittingButton")
                    : t("auth.login.submitButton")}
                </Button>
              </form>

              <OAuthButtons className="mt-6" disabled={isLoading} />

              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("auth.login.dontHaveAccount")}{" "}
                  <Link
                    href="/auth/register"
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    {t("auth.login.signUpLink")}
                  </Link>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("auth.login.needToVerify")}{" "}
                  <Link
                    href="/auth/resend-activation"
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    {t("auth.login.resendVerification")}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Copyright Footer */}
          <div className="mt-8">
            <Copyright
              className="justify-center"
              showVersion={false}
              showLinks={false}
            />
          </div>
        </motion.div>
      </div>

      {/* Right Side - Animated Background with Code Typing */}
      <div className="hidden lg:flex lg:w-2/3 relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div
          className="absolute inset-0 z-0 opacity-20 dark:opacity-30 overflow-hidden"
          aria-hidden="true"
        >
          {/* Animated Gradient Background */}
          <HeroBackground />

          {/* Dark Overlay */}
          <DarkOverlay />
        </div>

        {/* Code Typing Component
        <div className="relative z-10 w-full h-full">
          <CodeTyping />
        </div> */}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Sign In...</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-600 dark:text-gray-400">
                Loading...
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
