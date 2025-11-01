"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PasswordConfirmInput } from "@/components/auth/PasswordConfirmInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { HeroBackground } from "@/components/HeroBackground";
import { DarkOverlay } from "@/components/DarkOverlay";
import {
  profileUpdateSchema,
  changePasswordSchema,
} from "@/lib/validation/auth";
import { ArrowLeft, User, Lock } from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/contexts/ToastContext";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  telephone?: string;
  role: string;
  emailVerified: boolean;
  password: string;
  accounts: {
    id: string;
    provider: string;
    providerId: string;
    createdAt: string;
  }[];
}

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { showError, showSuccess } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  // Check if user has OAuth accounts and password
  const hasOAuthAccounts = user && user.accounts && user.accounts.length > 0;
  const hasPassword = user && user.password && user.password.length > 0;
  const shouldShowPasswordTab = hasPassword;

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      setUser(userData.user);
      setProfileData({
        firstName: userData.user.firstName,
        lastName: userData.user.lastName,
        email: userData.user.email,
        telephone: userData.user.telephone || "",
      });
    } catch (error) {
      showError(t("error.failedToLoadUserData"));
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router, showError, t]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const validatedData = profileUpdateSchema.parse(profileData);

      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.error || t("auth.account.profile.failedToUpdateProfile"));
        return;
      }

      showSuccess(t("auth.account.profile.successMessage"));
      // Refetch full user data to preserve password and accounts
      await fetchUser();
    } catch (error: unknown) {
      if (error && typeof error === "object" && "errors" in error) {
        showError(
          (error as { errors: { message: string }[] }).errors
            .map((e: { message: string }) => e.message)
            .join(", ")
        );
      } else {
        showError(t("auth.account.profile.failedToUpdateProfile"));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const validatedData = changePasswordSchema.parse(passwordData);

      const response = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.error || t("auth.account.profile.failedToChangePassword"));
        return;
      }

      showSuccess(t("auth.account.profile.successMessage"));
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error: unknown) {
      if (error && typeof error === "object" && "errors" in error) {
        showError(
          (error as { errors: { message: string }[] }).errors
            .map((e: { message: string }) => e.message)
            .join(", ")
        );
      } else {
        showError(t("auth.account.profile.failedToChangePassword"));
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400">{t("error.userNotFound")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans dark:bg-gradient-to-br dark:from-gray-900 dark:to-black">
      {/* Animated Gradient Background */}
      <HeroBackground />

      {/* Dark Overlay */}
      <DarkOverlay />

      <Navigation />
      <main className="flex min-h-screen w-full max-w-3xl mx-auto flex-col items-center justify-center py-32 px-16 sm:items-start relative z-10">
        <div className="prose prose-lg dark:prose-invert max-w-none w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <Link
                href="/account"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:underline mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("auth.account.profile.backToAccount")}
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t("auth.account.profile.profileSettings")}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {t("auth.account.profile.manageProfileInfo")}
                {shouldShowPasswordTab ? t("auth.account.profile.andPassword") : ""}
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "profile"
                        ? "border-purple-500 text-gray-900 dark:text-white dark:border-purple-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                  >
                    <User className="h-4 w-4 inline mr-2" />
                    {t("auth.account.profile.profileInformation")}
                  </button>
                  {shouldShowPasswordTab && (
                    <button
                      onClick={() => setActiveTab("password")}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "password"
                          ? "border-purple-500 text-gray-900 dark:text-white dark:border-purple-400"
                          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                    >
                      <Lock className="h-4 w-4 inline mr-2" />
                      {t("auth.account.profile.changePassword")}
                    </button>
                  )}
                </nav>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                {activeTab === "profile" ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">
                          {t("auth.account.profile.firstName")} *
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          required
                          disabled={isSaving}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">
                          {t("auth.account.profile.lastName")} *
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                          required
                          disabled={isSaving}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {t("auth.account.profile.email")} *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        required
                        disabled={isSaving}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telephone">
                        {t("auth.account.profile.phoneNumber")}
                      </Label>
                      <Input
                        id="telephone"
                        type="tel"
                        value={profileData.telephone}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            telephone: e.target.value,
                          }))
                        }
                        disabled={isSaving}
                      />
                    </div>

                    <Button type="submit" disabled={isSaving}>
                      {isSaving
                        ? t("auth.account.profile.saving")
                        : t("auth.account.profile.saveChanges")}
                    </Button>
                  </form>
                ) : shouldShowPasswordTab ? (
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">
                        {t("auth.account.profile.currentPassword")} *
                      </Label>
                      <PasswordInput
                        value={passwordData.currentPassword}
                        onChange={(value) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            currentPassword: value,
                          }))
                        }
                        disabled={isSaving}
                        required
                      />
                    </div>

                    <PasswordConfirmInput
                      password={passwordData.newPassword}
                      confirmPassword={passwordData.confirmNewPassword}
                      onPasswordChange={(value) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          newPassword: value,
                        }))
                      }
                      onConfirmPasswordChange={(value) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          confirmNewPassword: value,
                        }))
                      }
                      disabled={isSaving}
                      required
                    />

                    <Button type="submit" disabled={isSaving}>
                      {isSaving
                        ? t("auth.account.profile.changing")
                        : t("auth.account.profile.changePassword")}
                    </Button>
                  </form>
                ) : null}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
