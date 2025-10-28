/* Account settings page for authenticated users */
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
import { ArrowLeft, Settings, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { HeroBackground } from "@/components/HeroBackground";
import { DarkOverlay } from "@/components/DarkOverlay";
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

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Check if user has a password (not OAuth only)
  const hasPassword = user && user.password && user.password.trim().length > 0;
  const isOAuthOnly =
    user && user.accounts && user.accounts.length > 0 && !hasPassword;

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
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
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Account
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Account Settings
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage your account preferences and settings
              </p>
            </div>

            <div className="space-y-6">
              {/* Account Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Account Information
                  </CardTitle>
                  <CardDescription>
                    View your account details and status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Account ID
                      </p>
                      <p className="text-sm font-mono">{user.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Role
                      </p>
                      <p className="text-sm capitalize">
                        {user.role.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email Status
                    </p>
                    <p
                      className={`text-sm ${user.emailVerified ? "text-green-600" : "text-red-600"}`}
                    >
                      {user.emailVerified ? "Verified" : "Not Verified"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hasPassword ? (
                    <div className="space-y-2">
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last changed: Recently
                      </p>
                      <Button asChild variant="outline" size="sm">
                        <Link href="/account/profile">Change Password</Link>
                      </Button>
                    </div>
                  ) : isOAuthOnly ? (
                    <div className="space-y-2">
                      <h4 className="font-medium">Authentication</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        You&apos;re signed in with{" "}
                        {user?.accounts.map((acc) => acc.provider).join(", ")}.
                        Password management is not available for OAuth accounts.
                      </p>
                    </div>
                  ) : null}
                  <div className="space-y-2">
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add an extra layer of security to your account
                    </p>
                    <Button variant="outline" size="sm" disabled>
                      Enable 2FA (Coming Soon)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Control your privacy and data preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Data Export</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Download a copy of your data
                    </p>
                    <Button variant="outline" size="sm" disabled>
                      Export Data (Coming Soon)
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Account Deletion</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Permanently delete your account and all associated data
                    </p>
                    <Button variant="destructive" size="sm" disabled>
                      Delete Account (Coming Soon)
                    </Button>
                  </div>
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
