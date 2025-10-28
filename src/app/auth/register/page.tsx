"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
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
import { PasswordConfirmInput } from "@/components/auth/PasswordConfirmInput";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { registerSchema } from "@/lib/validation/auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/theme-toggle";
import { SimpleLanguageSwitcher } from "@/components/SimpleLanguageSwitcher";
import Copyright from "@/components/Copyright";

export default function RegisterPage() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Scroll to top when page loads
  useEffect(() => {
    // Force scroll to top immediately and after a short delay
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });

    // Additional safety check after a short delay
    const timeoutId = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

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
      const validationResult = registerSchema.safeParse(formData);
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

      // Submit registration
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
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
        router.push("/auth/login?message=registration_success");
      }, 3000);
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: t("auth.messages.unexpectedError") });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
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
                  {t("auth.register.checkEmailTitle")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("auth.register.checkEmailMessage")}{" "}
                  <strong>{formData.email}</strong>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  {t("auth.register.redirectMessage")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Language Toggle - Responsive to RTL */}
      <div className={`fixed top-4 z-50 ${isRTL ? "left-4" : "right-4"}`}>
        <SimpleLanguageSwitcher />
      </div>

      {/* Theme Toggle - Responsive to RTL */}
      <div className={`fixed bottom-4 z-50 ${isRTL ? "left-4" : "right-4"}`}>
        <ThemeToggle />
      </div>

      {/* Left Side - Register Form */}
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
              {t("auth.register.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("auth.register.subtitleBefore")}{" "}
              <Link
                href="/"
                className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
              >
                Boiler.click
              </Link>{" "}
              {t("auth.register.subtitleAfter")}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("auth.register.formTitle")}</CardTitle>
              <CardDescription>
                {t("auth.register.formDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                  <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    {errors.general}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      {t("auth.register.firstName")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      placeholder={t("auth.register.firstName")}
                      className={errors.firstName ? "border-red-500" : ""}
                      disabled={isLoading}
                      required
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      {t("auth.register.lastName")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      placeholder={t("auth.register.lastName")}
                      className={errors.lastName ? "border-red-500" : ""}
                      disabled={isLoading}
                      required
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    {t("auth.register.email")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder={t("auth.register.email")}
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
                    htmlFor="telephone"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    {t("auth.register.telephone")}
                  </Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) =>
                      handleInputChange("telephone", e.target.value)
                    }
                    placeholder={t("auth.register.telephone")}
                    className={errors.telephone ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.telephone && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.telephone}
                    </p>
                  )}
                </div>

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
                    ? t("auth.register.submittingButton")
                    : t("auth.register.submitButton")}
                </Button>
              </form>

              <OAuthButtons className="mt-6" disabled={isLoading} />

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("auth.register.alreadyHaveAccount")}{" "}
                  <Link
                    href="/auth/login"
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    {t("auth.register.signInLink")}
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

      {/* Right Side - Animated Background */}
      <div className="hidden lg:flex lg:w-2/3 relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div
          className="absolute inset-0 z-0 opacity-20 dark:opacity-30 overflow-hidden"
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"
            animate={{
              background: [
                "linear-gradient(45deg, #8b5cf6, #ec4899, #3b82f6)",
                "linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)",
                "linear-gradient(225deg, #ec4899, #3b82f6, #8b5cf6)",
                "linear-gradient(315deg, #8b5cf6, #ec4899, #3b82f6)",
              ],
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-l from-blue-400 via-green-400 to-purple-400"
            animate={{
              background: [
                "linear-gradient(225deg, #3b82f6, #10b981, #8b5cf6)",
                "linear-gradient(315deg, #8b5cf6, #3b82f6, #10b981)",
                "linear-gradient(45deg, #10b981, #8b5cf6, #3b82f6)",
                "linear-gradient(135deg, #3b82f6, #10b981, #8b5cf6)",
              ],
              scale: [1.1, 1, 1.1],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>
      </div>
    </div>
  );
}
