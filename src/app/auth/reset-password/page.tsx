/* Reset password page for authentication - handles query parameters */
"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Redirect to the token-based route
      router.replace(`/auth/reset-password/${token}`);
    } else {
      // No token provided, redirect to forgot password page
      router.replace("/auth/forgot-password");
    }
  }, [searchParams, router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          {t("auth.messages.loading") || "Loading..."}
        </p>
      </div>
    </div>
  );
}
