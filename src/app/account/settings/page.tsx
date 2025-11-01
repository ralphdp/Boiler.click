/* Account settings page for authenticated users */
"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  AlertCircle,
  UserCog,
  Shield,
  Copy,
  Download,
} from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { HeroBackground } from "@/components/HeroBackground";
import { DarkOverlay } from "@/components/DarkOverlay";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/contexts/ToastContext";
import { ConnectedAccounts } from "@/components/account/ConnectedAccounts";
import { TwoFactorSetupModal } from "@/components/auth/TwoFactorSetupModal";
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  telephone?: string;
  role: string;
  emailVerified: boolean;
  password: string | null;
  twoFactorEnabled: boolean;
  twoFactorMethod: string | null;
  accounts: {
    id: string;
    provider: string;
    providerId: string;
    createdAt: string;
  }[];
}

function SettingsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const { showSuccess, showError } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState("");
  const hasShownSuccessToast = useRef(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);
  const [isRegeneratingBackupCodes, setIsRegeneratingBackupCodes] =
    useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [newBackupCodes, setNewBackupCodes] = useState<string[]>([]);

  // Check if user has a password (not OAuth only)
  const hasPassword = user && user.password && user.password.trim().length > 0;
  const isOAuthOnly =
    user && user.accounts && user.accounts.length > 0 && !hasPassword;

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        throw new Error(t("auth.messages.fetchUserError"));
      }
      const userData = await response.json();
      setUser(userData.user);
    } catch (error) {
      setError(t("auth.messages.loadUserDataError"));
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router, t]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Handle 2FA disable
  const handleDisable2FA = async () => {
    try {
      setIsDisabling2FA(true);
      const response = await fetch("/api/auth/disable-2fa", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to disable 2FA");
      }

      showSuccess("2FA disabled successfully");
      await fetchUser(); // Refresh user data
    } catch (error) {
      console.error("Disable 2FA error:", error);
      showError("Failed to disable 2FA");
    } finally {
      setIsDisabling2FA(false);
    }
  };

  // Handle backup codes regeneration
  const handleRegenerateBackupCodes = async () => {
    try {
      setIsRegeneratingBackupCodes(true);
      const response = await fetch("/api/auth/backup-codes/regenerate", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to regenerate backup codes");
      }

      const data = await response.json();
      setNewBackupCodes(data.backupCodes);
      setShowRegenerateModal(true);
      showSuccess("Backup codes regenerated successfully");
    } catch (error) {
      console.error("Regenerate backup codes error:", error);
      showError("Failed to regenerate backup codes");
    } finally {
      setIsRegeneratingBackupCodes(false);
    }
  };

  // Handle data export
  const handleExportData = async () => {
    try {
      setIsExporting(true);

      const response = await fetch("/api/account/export");

      if (!response.ok) {
        throw new Error(t("auth.messages.dataExportFailed"));
      }

      // Get the blob and create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch
        ? filenameMatch[1]
        : `boiler-data-export-${Date.now()}.json`;

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSuccess(t("auth.messages.dataExportedSuccessfully"));
    } catch (error) {
      console.error("Export error:", error);
      showError(t("auth.messages.dataExportFailed"));
    } finally {
      setIsExporting(false);
    }
  };

  // Handle success message from OAuth linking
  useEffect(() => {
    const linkedProvider = searchParams.get("linked");
    if (linkedProvider && !hasShownSuccessToast.current && !isLoading) {
      const message = t("auth.messages.accountLinkedSuccessfully");
      // Only show toast if we have a valid message (not empty from loading state)
      if (message && message.trim()) {
        hasShownSuccessToast.current = true;
        showSuccess(message);
        // Remove the query parameter from URL without reloading
        router.replace("/account/settings", { scroll: false });
      }
    }
  }, [searchParams, showSuccess, router, t, isLoading]);

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
              <AlertDescription>
                {t("auth.messages.userNotFound")}
              </AlertDescription>
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
                {t("auth.account.settings.backToAccount")}
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t("auth.account.settings.title")}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {t("auth.account.settings.description")}
              </p>
            </div>

            <div className="space-y-6">
              {/* Account Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCog className="h-5 w-5" />
                    {t("auth.account.settings.accountInformation")}
                  </CardTitle>
                  <CardDescription>
                    {t("auth.account.settings.accountInformationDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t("auth.account.settings.accountId")}
                      </p>
                      <p className="text-sm font-mono">{user.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t("auth.account.settings.role")}
                      </p>
                      <p className="text-sm capitalize">
                        {user.role.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t("auth.account.settings.emailStatus")}
                    </p>
                    <p
                      className={`text-sm font-medium ${user.emailVerified ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      {user.emailVerified
                        ? t("auth.account.settings.verified")
                        : t("auth.account.settings.notVerified")}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("auth.account.settings.securitySettings")}
                  </CardTitle>
                  <CardDescription>
                    {t("auth.account.settings.securitySettingsDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hasPassword ? (
                    <div className="space-y-2">
                      <h4 className="font-medium">
                        {t("auth.account.settings.password")}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("auth.account.settings.lastChanged")}:{" "}
                        {t("auth.account.settings.recently")}
                      </p>
                      <Button asChild variant="outline" size="sm">
                        <Link href="/account/profile">
                          {t("auth.account.profile.changePassword")}
                        </Link>
                      </Button>
                    </div>
                  ) : isOAuthOnly ? (
                    <div className="space-y-2">
                      <h4 className="font-medium">
                        {t("auth.account.settings.authentication")}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("auth.account.settings.signedInWith")}{" "}
                        {user?.accounts.map((acc) => acc.provider).join(", ")}.
                        {t(
                          "auth.account.settings.passwordManagementNotAvailable"
                        )}
                      </p>
                    </div>
                  ) : null}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        {t("auth.account.settings.twoFactorAuthentication")}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("auth.account.settings.twoFactorDescription")}
                      </p>
                      {user.twoFactorEnabled ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                              ✓ Enabled via{" "}
                              {user.twoFactorMethod === "totp"
                                ? "Authenticator App"
                                : "Email"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleDisable2FA}
                              disabled={isDisabling2FA}
                            >
                              {isDisabling2FA ? "Disabling..." : "Disable 2FA"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleRegenerateBackupCodes}
                              disabled={isRegeneratingBackupCodes}
                            >
                              {isRegeneratingBackupCodes
                                ? "Regenerating..."
                                : "Regenerate Backup Codes"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIs2FAModalOpen(true)}
                        >
                          {t("auth.account.settings.enable2FA")}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Connected Accounts */}
              {hasPassword && (
                <ConnectedAccounts
                  accounts={user?.accounts || []}
                  onUpdate={() => fetchUser()}
                />
              )}

              {/* Privacy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("auth.account.settings.privacySettings")}
                  </CardTitle>
                  <CardDescription>
                    {t("auth.account.settings.privacySettingsDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">
                      {t("auth.account.settings.dataExport")}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("auth.account.settings.dataExportDescription")}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportData}
                      disabled={isExporting}
                    >
                      {isExporting
                        ? t("auth.messages.exportingData")
                        : t("auth.account.settings.exportData")}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">
                      {t("auth.account.settings.accountDeletion")}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("auth.account.settings.accountDeletionDescription")}
                    </p>
                    <Button variant="destructive" size="sm" disabled>
                      {t("auth.account.settings.deleteAccount")} (
                      {t("auth.account.settings.comingSoon")})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
      <TwoFactorSetupModal
        open={is2FAModalOpen}
        onOpenChange={setIs2FAModalOpen}
        onSuccess={fetchUser}
      />

      {/* Regenerated Backup Codes Modal */}
      <Dialog open={showRegenerateModal} onOpenChange={setShowRegenerateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              New Backup Codes Generated
            </DialogTitle>
            <DialogDescription>
              Save these codes in a safe place. You can use them to access your
              account if you lose access to your authenticator app.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Important: Old codes no longer work
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Your previous backup codes have been disabled. Only these new
                codes will work.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {newBackupCodes.map((code, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded border"
                >
                  <code className="font-mono text-sm">{code}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(code);
                      showSuccess("Code copied!");
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const content = `Boiler™ - Two-Factor Authentication Backup Codes\n\nSave these codes in a safe place. You can use them to access your account if you lose access to your authenticator app.\n\n${newBackupCodes.join("\n")}\n\nEach code can only be used once. If you lose these codes, you may need to disable and re-enable 2FA.`;
                  const blob = new Blob([content], { type: "text/plain" });
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `boiler-2fa-backup-codes.txt`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                  showSuccess("Backup codes downloaded!");
                }}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(newBackupCodes.join("\n"));
                  showSuccess("All codes copied!");
                }}
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
            </div>

            <Button
              onClick={() => setShowRegenerateModal(false)}
              className="w-full"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Loading Settings...</CardTitle>
              <CardDescription>Please wait while we load your settings</CardDescription>
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
      <SettingsPageContent />
    </Suspense>
  );
}
