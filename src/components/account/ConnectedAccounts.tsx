import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chrome, Github, MessageCircle, Facebook, Twitter, Link as LinkIcon, Unlink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";

interface ConnectedAccount {
  id: string;
  provider: string;
  providerId: string;
  createdAt: string;
}

interface ConnectedAccountsProps {
  accounts: ConnectedAccount[];
  onUpdate: () => void;
}

const providerConfig = [
  { id: "google", name: "Google", icon: Chrome },
  { id: "github", name: "GitHub", icon: Github },
  { id: "discord", name: "Discord", icon: MessageCircle },
  { id: "facebook", name: "Facebook", icon: Facebook },
  { id: "twitter", name: "Twitter", icon: Twitter },
];

export function ConnectedAccounts({ accounts, onUpdate }: ConnectedAccountsProps) {
  const { t } = useLanguage();
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const [unlinkingProvider, setUnlinkingProvider] = useState<string | null>(null);
  const [configuredProviders, setConfiguredProviders] = useState<Record<string, boolean>>({});
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);

  // Fetch configured providers on mount
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch("/api/auth/providers");
        if (response.ok) {
          const data = await response.json();
          setConfiguredProviders(data.providers || {});
        }
      } catch (error) {
        console.error("Failed to fetch providers:", error);
      } finally {
        setIsLoadingProviders(false);
      }
    };

    fetchProviders();
  }, []);

  const isConnected = (providerId: string) => {
    return accounts.some((acc) => acc.provider.toLowerCase() === providerId.toLowerCase());
  };

  const handleLink = (providerId: string) => {
    router.push(`/api/auth/${providerId}`);
  };

  const handleUnlink = async (providerId: string) => {
    try {
      setUnlinkingProvider(providerId);
      const response = await fetch(`/api/auth/unlink?provider=${providerId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.error || t("auth.messages.unexpectedError"));
        return;
      }

      showSuccess(data.message || t("auth.messages.accountUnlinkedSuccessfully"));
      onUpdate();
    } catch (error) {
      console.error("Unlink error:", error);
      showError(t("auth.messages.unexpectedError"));
    } finally {
      setUnlinkingProvider(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("auth.account.settings.connectedAccounts.title")}
        </CardTitle>
        <CardDescription>
          {t("auth.account.settings.connectedAccounts.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoadingProviders ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : providerConfig.filter((provider) => configuredProviders[provider.id]).length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            {t("auth.account.settings.connectedAccounts.noAccounts")}
          </p>
        ) : (
          providerConfig
            .filter((provider) => configuredProviders[provider.id])
            .map((provider) => {
          const Icon = provider.icon;
          const connected = isConnected(provider.id);
          const account = accounts.find((acc) => acc.provider.toLowerCase() === provider.id.toLowerCase());

          return (
            <div
              key={provider.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{provider.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        connected
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {connected
                        ? t("auth.account.settings.connectedAccounts.statusConnected")
                        : t("auth.account.settings.connectedAccounts.statusNotConnected")}
                    </span>
                  </div>
                  {connected && account && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t("auth.account.settings.connectedAccounts.connectedOnDate")} {formatDate(account.createdAt)}
                    </p>
                  )}
                </div>
              </div>
              <div>
                {connected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnlink(provider.id)}
                    disabled={unlinkingProvider === provider.id}
                  >
                    <Unlink className="h-4 w-4 mr-2" />
                    {unlinkingProvider === provider.id
                      ? t("auth.messages.loading")
                      : t("auth.account.settings.connectedAccounts.unlinkButton")}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLink(provider.id)}
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    {t("auth.account.settings.connectedAccounts.linkButton")}
                  </Button>
                )}
              </div>
            </div>
          );
        })
        )}
      </CardContent>
    </Card>
  );
}

