"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Github, Chrome, MessageCircle, Facebook, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface OAuthButtonsProps {
  disabled?: boolean;
  className?: string;
}

export function OAuthButtons({
  disabled = false,
  className,
}: OAuthButtonsProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleOAuthClick = async (provider: string) => {
    if (disabled) return;

    setIsLoading(provider);
    try {
      router.push(`/api/auth/${provider}`);
    } catch (error) {
      console.error(`Failed to initiate ${provider} OAuth:`, error);
      setIsLoading(null);
    }
  };

  const oauthProviders = [
    {
      id: "google",
      name: "Google",
      icon: Chrome,
      className:
        "bg-white text-gray-900 hover:bg-gray-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-50 border-gray-300 dark:border-gray-300",
    },
    {
      id: "github",
      name: "GitHub",
      icon: Github,
      className:
        "bg-gray-900 hover:bg-gray-800 text-white hover:text-white dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white dark:hover:text-white border-gray-900 dark:border-gray-900",
    },
    {
      id: "discord",
      name: "Discord",
      icon: MessageCircle,
      className:
        "bg-purple-600 hover:bg-purple-700 text-white hover:text-white dark:bg-purple-600 dark:hover:bg-purple-700 dark:text-white dark:hover:text-white border-purple-600 dark:border-purple-600",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      className:
        "bg-blue-600 hover:bg-blue-700 text-white hover:text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white dark:hover:text-white border-blue-600 dark:border-blue-600",
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: Twitter,
      className:
        "bg-sky-500 hover:bg-sky-600 text-white hover:text-white dark:bg-sky-500 dark:hover:bg-sky-600 dark:text-white dark:hover:text-white border-sky-500 dark:border-sky-500",
    },
  ];

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
            {t("oauth.orContinueWith") || "Or continue with"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {oauthProviders.map((provider) => {
          const Icon = provider.icon;
          const isProviderLoading = isLoading === provider.id;

          return (
            <Button
              key={provider.id}
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-center gap-3 h-11",
                provider.className,
                isProviderLoading && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleOAuthClick(provider.id)}
              disabled={disabled || isProviderLoading}
            >
              <Icon className="h-5 w-5" />
              <span>
                {isProviderLoading
                  ? t("oauth.connecting") || "Connecting..."
                  : `${t("oauth.continueWith") || "Continue with"} ${t("oauth.providers." + provider.id) || provider.name}`}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
