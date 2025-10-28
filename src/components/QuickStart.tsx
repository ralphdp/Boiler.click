"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Copy, Github } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getGitHubCloneCommand } from "@/lib/github";

export default function QuickStart() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const codeBlock = `# ${t("homepage.quickStart.codeComments.clone")}
${getGitHubCloneCommand()}

# ${t("homepage.quickStart.codeComments.install")}
npm install

# ${t("homepage.quickStart.codeComments.env")}
cp .env.example .env

# ${t("homepage.quickStart.codeComments.dev")}
npm run dev

# ${t("homepage.quickStart.codeComments.build")}
npm run build`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codeBlock);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <section aria-labelledby="quick-start">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          {t("homepage.quickStart.title")}
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="flex items-center gap-2 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              {t("homepage.quickStart.copiedButton")}
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              {t("homepage.quickStart.copyButton")}
            </>
          )}
        </Button>
      </div>
      <div className="bg-zinc-900 dark:bg-zinc-500/10 p-6 rounded-lg">
        <ScrollArea className="h-48">
          <pre className="text-sm text-left">
            <code className="block">
              <span className="text-zinc-400">
                # {t("homepage.quickStart.codeComments.clone")}
              </span>
              <br />
              <span className="text-zinc-100">{getGitHubCloneCommand()}</span>
              <br />
              <br />
              <span className="text-zinc-400">
                # {t("homepage.quickStart.codeComments.install")}
              </span>
              <br />
              <span className="text-zinc-100">npm install</span>
              <br />
              <br />
              <span className="text-zinc-400">
                # {t("homepage.quickStart.codeComments.env")}
              </span>
              <br />
              <span className="text-zinc-100">cp .env.example .env</span>
              <br />
              <br />
              <span className="text-zinc-400">
                # {t("homepage.quickStart.codeComments.dev")}
              </span>
              <br />
              <span className="text-zinc-100">npm run dev</span>
              <br />
              <br />
              <span className="text-zinc-400">
                # {t("homepage.quickStart.codeComments.build")}
              </span>
              <br />
              <span className="text-zinc-100">npm run build</span>
            </code>
          </pre>
        </ScrollArea>
      </div>
    </section>
  );
}
