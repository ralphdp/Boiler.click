"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Mail, Smartphone, Shield, Copy, Check, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/contexts/ToastContext";

interface TwoFactorSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function TwoFactorSetupModal({
  open,
  onOpenChange,
  onSuccess,
}: TwoFactorSetupModalProps) {
  const { t } = useLanguage();
  const { showSuccess, showError } = useToast();

  const [activeMethod, setActiveMethod] = useState<"email" | "totp">("totp");
  const [step, setStep] = useState<"select" | "verify" | "success">("select");

  // TOTP state
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [totpSecret, setTotpSecret] = useState("");
  const [totpBackupCodes, setTotpBackupCodes] = useState<string[]>([]);
  const [totpVerificationCode, setTotpVerificationCode] = useState("");
  const [isSettingUpTotp, setIsSettingUpTotp] = useState(false);
  const [isVerifyingTotp, setIsVerifyingTotp] = useState(false);

  // Email state
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  // General
  const [isCompleting, setIsCompleting] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  // Initialize TOTP setup
  const handleInitTotp = async () => {
    try {
      setIsSettingUpTotp(true);
      const response = await fetch("/api/auth/enable-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "totp" }),
      });

      if (!response.ok) {
        throw new Error("Failed to initialize 2FA");
      }

      const data = await response.json();
      setQrCodeUrl(data.qrCodeUrl);
      setTotpSecret(data.secret);
      setTotpBackupCodes(data.backupCodes);
      setStep("verify");
    } catch (error) {
      console.error("Init TOTP error:", error);
      showError("Failed to initialize authenticator app");
    } finally {
      setIsSettingUpTotp(false);
    }
  };

  // Verify TOTP code
  const handleVerifyTotp = async () => {
    if (!totpVerificationCode || totpVerificationCode.length !== 6) {
      showError("Please enter a valid 6-digit code");
      return;
    }

    try {
      setIsVerifyingTotp(true);
      const response = await fetch("/api/auth/verify-2fa-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "totp",
          secret: totpSecret,
          code: totpVerificationCode,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid verification code");
      }

      // Complete setup
      await completeSetup();
    } catch (error) {
      console.error("Verify TOTP error:", error);
      showError("Invalid code. Please try again.");
      setTotpVerificationCode("");
    } finally {
      setIsVerifyingTotp(false);
    }
  };

  // Initialize Email setup
  const handleInitEmail = async () => {
    try {
      const response = await fetch("/api/auth/enable-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "email" }),
      });

      if (!response.ok) {
        throw new Error("Failed to initialize email 2FA");
      }

      // Send verification code
      // This should be handled by a separate API endpoint
      setEmailCodeSent(true);
      showSuccess("Verification code sent to your email");
    } catch (error) {
      console.error("Init email error:", error);
      showError("Failed to send verification code");
    }
  };

  // Verify Email code
  const handleVerifyEmail = async () => {
    if (!emailVerificationCode || emailVerificationCode.length !== 6) {
      showError("Please enter a valid 6-digit code");
      return;
    }

    try {
      setIsVerifyingEmail(true);
      const response = await fetch("/api/auth/verify-2fa-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "email",
          code: emailVerificationCode,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid verification code");
      }

      // Complete setup
      await completeSetup();
    } catch (error) {
      console.error("Verify email error:", error);
      showError("Invalid code. Please try again.");
      setEmailVerificationCode("");
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  // Complete 2FA setup
  const completeSetup = async () => {
    try {
      setIsCompleting(true);
      const response = await fetch("/api/auth/enable-2fa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: activeMethod,
          secret: activeMethod === "totp" ? totpSecret : undefined,
          backupCodes: activeMethod === "totp" ? totpBackupCodes : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to enable 2FA");
      }

      // Fetch backup codes for email method
      if (activeMethod === "email") {
        const backupResponse = await fetch("/api/auth/backup-codes");
        if (backupResponse.ok) {
          const backupData = await backupResponse.json();
          setTotpBackupCodes(backupData.backupCodes);
        }
      }

      setStep("success");
      setShowBackupCodes(true);
    } catch (error) {
      console.error("Complete setup error:", error);
      showError("Failed to enable 2FA");
    } finally {
      setIsCompleting(false);
    }
  };

  // Copy backup code
  const copyBackupCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  // Copy all backup codes
  const copyAllBackupCodes = () => {
    const allCodes = totpBackupCodes.join("\n");
    navigator.clipboard.writeText(allCodes);
    setCopiedCode("all");
    setTimeout(() => setCopiedCode(""), 2000);
  };

  // Download backup codes as .txt file
  const downloadBackupCodes = () => {
    const content = `Boiler™ - Two-Factor Authentication Backup Codes\n\nSave these codes in a safe place. You can use them to access your account if you lose access to your authenticator app.\n\n${totpBackupCodes.join("\n")}\n\nEach code can only be used once. If you lose these codes, you may need to disable and re-enable 2FA.`;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `boiler-2fa-backup-codes.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Reset modal
  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("select");
      setActiveMethod("totp");
      setQrCodeUrl("");
      setTotpSecret("");
      setTotpBackupCodes([]);
      setTotpVerificationCode("");
      setEmailCodeSent(false);
      setEmailVerificationCode("");
      setShowBackupCodes(false);
      setCopiedCode("");
    }, 300);
  };

  // Handle method change
  const handleMethodChange = (method: "email" | "totp") => {
    setActiveMethod(method);
    setStep("select");
    setEmailCodeSent(false);
    setQrCodeUrl("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Set Up Two-Factor Authentication
          </DialogTitle>
          <DialogDescription>
            Choose a method to enhance your account security
          </DialogDescription>
        </DialogHeader>

        {step === "select" && (
          <Tabs value={activeMethod} onValueChange={(v) => handleMethodChange(v as "email" | "totp")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="totp">
                <Smartphone className="h-4 w-4 mr-2" />
                Authenticator App
              </TabsTrigger>
              <TabsTrigger value="email">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </TabsTrigger>
            </TabsList>

            <TabsContent value="totp" className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use an authenticator app like Google Authenticator, Authy, or 1Password to generate security codes.
                </p>
                <Button
                  onClick={handleInitTotp}
                  disabled={isSettingUpTotp}
                  className="w-full"
                >
                  {isSettingUpTotp ? "Setting up..." : "Continue with Authenticator"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive a 6-digit verification code via email when you sign in.
                </p>
                <Button
                  onClick={handleInitEmail}
                  disabled={emailCodeSent}
                  className="w-full"
                >
                  {emailCodeSent ? "Code sent!" : "Continue with Email"}
                </Button>
              </div>

              {emailCodeSent && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-code">Enter verification code</Label>
                    <Input
                      id="email-code"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={emailVerificationCode}
                      onChange={(e) => setEmailVerificationCode(e.target.value)}
                      placeholder="000000"
                      className="text-center text-2xl tracking-widest"
                    />
                  </div>
                  <Button
                    onClick={handleVerifyEmail}
                    disabled={isVerifyingEmail || emailVerificationCode.length !== 6}
                    className="w-full"
                  >
                    {isVerifyingEmail ? "Verifying..." : "Verify"}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {step === "verify" && activeMethod === "totp" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Scan QR Code</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Scan this QR code with your authenticator app:
              </p>
              {qrCodeUrl && (
                <div className="flex flex-col items-center space-y-4">
                  <div className="border-2 border-gray-300 dark:border-gray-700 p-4 rounded-lg bg-white">
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="w-64 h-64"
                    />
                  </div>
                  <div className="space-y-2 w-full max-w-md">
                    <Label>Or enter this code manually:</Label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded border text-center font-mono text-sm">
                        {totpSecret}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(totpSecret);
                          setCopiedCode("secret");
                          setTimeout(() => setCopiedCode(""), 2000);
                        }}
                      >
                        {copiedCode === "secret" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totp-code">Enter verification code</Label>
              <Input
                id="totp-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={totpVerificationCode}
                onChange={(e) => setTotpVerificationCode(e.target.value)}
                placeholder="000000"
                className="text-center text-2xl tracking-widest"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            <Button
              onClick={handleVerifyTotp}
              disabled={isVerifyingTotp || totpVerificationCode.length !== 6}
              className="w-full"
            >
              {isVerifyingTotp ? "Verifying..." : "Verify and Enable"}
            </Button>
          </div>
        )}

        {step === "success" && showBackupCodes && (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Save Your Backup Codes
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Store these codes in a safe place. You can use them to access your account if you lose access to your authenticator app.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {totpBackupCodes.map((code, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded border"
                >
                  <code className="font-mono text-sm">{code}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyBackupCode(code)}
                  >
                    {copiedCode === code ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={downloadBackupCodes}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                onClick={copyAllBackupCodes}
                className="flex-1"
              >
                {copiedCode === "all" ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All
                  </>
                )}
              </Button>
            </div>

            <Button
              onClick={() => {
                handleClose();
                onSuccess();
                showSuccess("2FA enabled successfully");
              }}
              className="w-full"
              disabled={isCompleting}
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

