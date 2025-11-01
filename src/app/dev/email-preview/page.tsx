"use client";

import { useState } from "react";
import { generateEmailPreviews } from "@/lib/email/preview";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Mail, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function EmailPreviewPage() {
  const { t } = useLanguage();
  const [selectedTemplate, setSelectedTemplate] =
    useState<keyof ReturnType<typeof generateEmailPreviews>>("welcome");
  const previews = generateEmailPreviews();

  const templateNames = {
    welcome: t("emailPreview.templateNames.welcome"),
    verification: t("emailPreview.templateNames.verification"),
    reset: t("emailPreview.templateNames.reset"),
    notification: t("emailPreview.templateNames.notification"),
  };

  const downloadHTML = () => {
    const html = previews[selectedTemplate];
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTemplate}-template.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t("emailPreview.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("emailPreview.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Template Selector */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  {t("emailPreview.templates")}
                </CardTitle>
                <CardDescription>
                  {t("emailPreview.selectTemplate")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(templateNames).map(([key, name]) => (
                  <Button
                    key={key}
                    variant={selectedTemplate === key ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() =>
                      setSelectedTemplate(key as keyof typeof templateNames)
                    }
                  >
                    {name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  {t("emailPreview.actions")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={downloadHTML} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {t("emailPreview.downloadHtml")}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Email Preview */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      {templateNames[selectedTemplate]}
                    </CardTitle>
                    <CardDescription>
                      {t("emailPreview.previewOf")}{" "}
                      {templateNames[selectedTemplate].toLowerCase()}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{selectedTemplate}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden bg-white">
                  <iframe
                    srcDoc={previews[selectedTemplate]}
                    className="w-full h-[600px] border-0"
                    title={`${templateNames[selectedTemplate]} Preview`}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Template Information */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>{t("emailPreview.templateInfo")}</CardTitle>
              <CardDescription>
                {t("emailPreview.templateDetails")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {t("emailPreview.features")}
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• {t("emailPreview.featureList.responsive")}</li>
                    <li>• {t("emailPreview.featureList.branding")}</li>
                    <li>• {t("emailPreview.featureList.typography")}</li>
                    <li>• {t("emailPreview.featureList.darkMode")}</li>
                    <li>• {t("emailPreview.featureList.socialLinks")}</li>
                    <li>• {t("emailPreview.featureList.accessibility")}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {t("emailPreview.technicalDetails")}
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• {t("emailPreview.techList.html5")}</li>
                    <li>• {t("emailPreview.techList.css3")}</li>
                    <li>• {t("emailPreview.techList.emailClient")}</li>
                    <li>• {t("emailPreview.techList.mobileFirst")}</li>
                    <li>• {t("emailPreview.techList.inlineCss")}</li>
                    <li>• {t("emailPreview.techList.fallbackFonts")}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
