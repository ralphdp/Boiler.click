/* Account page for authenticated users */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Settings, LogOut, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  telephone?: string;
  role: string;
  emailVerified: boolean;
  password: string | null;
  accounts: {
    id: string;
    provider: string;
    providerId: string;
    createdAt: string;
  }[];
}

export default function AccountPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Check if user has a password (not OAuth only)
  const hasPassword = user && user.password && user.password.trim().length > 0;

  useEffect(() => {
    const fetchUser = async () => {
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
      } catch (error) {
        setError("Failed to load user data");
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/auth/login");
      } else {
        setError("Failed to logout");
      }
    } catch (error) {
      setError("Failed to logout");
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>User not found</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans dark:bg-gradient-to-br dark:from-gray-900 dark:to-black">
      <Navigation />
      <main className="flex min-h-screen w-full max-w-3xl mx-auto flex-col items-center justify-center py-32 px-16 sm:items-start relative z-10">
        <div className="prose prose-lg dark:prose-invert max-w-none w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t("account.dashboard.title")}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {t("account.dashboard.welcome")}, {user.firstName}!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {t("account.profile.title")}
                  </CardTitle>
                  <CardDescription>
                    {t("account.profile.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t("account.profile.name")}
                    </p>
                    <p className="text-lg">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t("account.profile.email")}
                    </p>
                    <p className="text-lg">{user.email}</p>
                    {!user.emailVerified && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {t("account.profile.emailNotVerified")}
                      </p>
                    )}
                  </div>
                  {user.telephone && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t("account.profile.phone")}
                      </p>
                      <p className="text-lg">{user.telephone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t("account.profile.role")}
                    </p>
                    <p className="text-lg capitalize">
                      {user.role.replace("_", " ")}
                    </p>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="/account/profile">
                      {t("account.profile.editProfile")}
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    {t("account.settings.title")}
                  </CardTitle>
                  <CardDescription>
                    {t("account.settings.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/account/settings">
                      {t("account.settings.accountSettings")}
                    </Link>
                  </Button>
                  {hasPassword && (
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/account/profile">
                        {t("account.settings.changePassword")}
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("account.settings.signOut")}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
