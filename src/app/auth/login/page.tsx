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
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { HeroBackground } from "@/components/HeroBackground";
import { DarkOverlay } from "@/components/DarkOverlay";
import { CodeTyping } from "@/components/auth/CodeTyping";
import { CodeOptionsDropdown } from "@/components/CodeOptionsDropdown";
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
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorSessionId, setTwoFactorSessionId] = useState("");
  const [twoFactorMethod, setTwoFactorMethod] = useState<"email" | "totp">("email");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);

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
    } else if (error === "oauth_conflict_existing_account") {
      setErrors({ general: t("auth.messages.oauthConflictExistingAccount") });
    } else if (error === "oauth_conflict_provider") {
      setErrors({ general: t("auth.messages.oauthConflictProvider") });
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

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying2FA(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/login/verify-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: twoFactorSessionId,
          code: twoFactorCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error });
        return;
      }

      // 2FA verified, redirect to account
      router.push("/account");
    } catch (error) {
      console.error("2FA verification error:", error);
      setErrors({ general: t("auth.messages.unexpectedError") });
    } finally {
      setIsVerifying2FA(false);
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

      // Check if 2FA is required
      if (data.requiresTwoFactor) {
        setRequires2FA(true);
        setTwoFactorSessionId(data.sessionId);
        setTwoFactorMethod(data.method);
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

  const [isImageLoading, setIsImageLoading] = useState(true);
  const [hasImageError, setHasImageError] = useState(false);
  const [showCodeOptions, setShowCodeOptions] = useState(false);
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        showCodeOptions &&
        !target.closest("[data-dropdown]") &&
        !target.closest("[data-eddie]")
      ) {
        setShowCodeOptions(false);
      }
    };

    if (showCodeOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCodeOptions]);

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
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8 bg-white dark:bg-gray-900 relative z-20 shadow-lg">
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
                Boiler™
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
              {!requires2FA ? (
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
            ) : (
              <form onSubmit={handleVerify2FA} className="space-y-4">
                <div className="p-3 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                  {twoFactorMethod === "email" 
                    ? "Enter the 6-digit code sent to your email"
                    : "Enter the 6-digit code from your authenticator app"}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="twoFactorCode"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Verification Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="twoFactorCode"
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className={errors.twoFactorCode ? "border-red-500 text-center text-2xl tracking-widest" : "text-center text-2xl tracking-widest"}
                    disabled={isVerifying2FA}
                    required
                  />
                  {errors.twoFactorCode && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.twoFactorCode}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isVerifying2FA || twoFactorCode.length !== 6}>
                  {isVerifying2FA ? "Verifying..." : "Verify Code"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setRequires2FA(false);
                    setTwoFactorCode("");
                    setTwoFactorSessionId("");
                  }}
                  disabled={isVerifying2FA}
                >
                  Back to Login
                </Button>
              </form>
            )}

              {!requires2FA && (
                <>
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
                </>
              )}
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
      <div
        className={`hidden lg:flex lg:w-2/3 fixed z-10 ${isRTL ? "left-0" : "right-0"} top-0 h-full overflow-hidden`}
        dir="ltr"
      >
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

        {/* Code Typing Component */}
        <div className="relative z-10 w-full h-full">
          <CodeTyping currentSnippetIndex={currentCodeIndex} />
        </div>

        {/* Eddie the Elephant - Positioned relative to right column - Visible on large screens */}
        <div className={`absolute bottom-10 z-50 right-10`}>
          <TooltipProvider>
            <Tooltip open={true}>
              <TooltipTrigger asChild>
                <div
                  className="relative w-64 h-64 lg:w-80 lg:h-80 cursor-pointer"
                  onClick={() => setShowCodeOptions(!showCodeOptions)}
                  data-eddie
                >
                  {isImageLoading && !hasImageError && (
                    <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">
                      <div className="text-gray-400 text-sm">
                        {t("auth.messages.loading")}
                      </div>
                    </div>
                  )}
                  {hasImageError && (
                    <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <div className="text-gray-400 text-sm">
                        {t("auth.messages.imageUnavailable")}
                      </div>
                    </div>
                  )}
                  <Image
                    src="/assets/uploads/eddie-the-elephant.webp"
                    alt="Eddie the Elephant - Boiler™ mascot"
                    width={320}
                    height={320}
                    className={`object-contain w-full h-full transition-opacity duration-300 ${
                      !isImageLoading ? "opacity-100" : "opacity-0"
                    }`}
                    priority
                    quality={90}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    onLoad={() => {
                      setIsImageLoading(false);
                      console.log("Eddie image loaded successfully");
                    }}
                    onError={(e) => {
                      setHasImageError(true);
                      console.error("Eddie image failed to load:", e);
                    }}
                  />

                  {/* Code Options Dropdown - Positioned relative to Eddie */}
                  <CodeOptionsDropdown
                    isOpen={showCodeOptions}
                    currentCodeIndex={currentCodeIndex}
                    onSelectCode={setCurrentCodeIndex}
                    onClose={() => setShowCodeOptions(false)}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                <p
                  dangerouslySetInnerHTML={{
                    __html: t("documentation.eddie.tooltip"),
                  }}
                />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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
