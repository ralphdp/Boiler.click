/* About page for the website */
"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Search,
  Package,
  Gauge,
  Clock,
  Github,
  Zap,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { getGitHubUrl } from "@/lib/github";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen font-sans dark:bg-gradient-to-br dark:from-gray-900 dark:to-black">
      <Navigation />
      <main
        className="flex min-h-screen w-full max-w-4xl mx-auto flex-col items-center justify-center py-32 px-16 sm:items-start relative z-10"
        role="main"
        aria-label="About page main content"
      >
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <motion.div
            className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-bold text-black dark:text-white mb-8">
              {String(t("navigation.title")).split(".")[0]}
              <span className="text-sm">
                .{String(t("navigation.title")).split(".")[1]}
              </span>
            </h1>
          </motion.div>

          <motion.div
            className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <p className="text-lg text-gray-600 dark:text-gray-200 leading-relaxed">
              {t("about.description")}
            </p>

            {/* Technology Labels */}
            <div
              className="flex flex-wrap gap-4 mb-2"
              role="list"
              aria-label="Technologies used"
            >
              <Badge
                variant="outline"
                role="listitem"
                className="bg-transparent border-purple-500 text-purple-600 dark:text-purple-400 px-4 py-2 text-sm font-medium"
              >
                Next.js
              </Badge>
              <Badge
                variant="outline"
                role="listitem"
                className="bg-transparent border-purple-500 text-purple-600 dark:text-purple-400 px-4 py-2 text-sm font-medium"
              >
                React
              </Badge>
              <Badge
                variant="outline"
                role="listitem"
                className="bg-transparent border-purple-500 text-purple-600 dark:text-purple-400 px-4 py-2 text-sm font-medium"
              >
                TypeScript
              </Badge>
              <Badge
                variant="outline"
                role="listitem"
                className="bg-transparent border-purple-500 text-purple-600 dark:text-purple-400 px-4 py-2 text-sm font-medium"
              >
                Prisma
              </Badge>
              <Badge
                variant="outline"
                role="listitem"
                className="bg-transparent border-purple-500 text-purple-600 dark:text-purple-400 px-4 py-2 text-sm font-medium"
              >
                PostgreSQL
              </Badge>
              <Badge
                variant="outline"
                role="listitem"
                className="bg-transparent border-purple-500 text-purple-600 dark:text-purple-400 px-4 py-2 text-sm font-medium"
              >
                Tailwind CSS
              </Badge>
              <Badge
                variant="outline"
                role="listitem"
                className="bg-transparent border-purple-500 text-purple-600 dark:text-purple-400 px-4 py-2 text-sm font-medium"
              >
                Shadcn/ui
              </Badge>
              <Badge
                variant="outline"
                role="listitem"
                className="bg-transparent border-purple-500 text-purple-600 dark:text-purple-400 px-4 py-2 text-sm font-medium"
              >
                Passport.js
              </Badge>
              <Badge
                variant="outline"
                role="listitem"
                className="bg-transparent border-purple-500 text-purple-600 dark:text-purple-400 px-4 py-2 text-sm font-medium"
              >
                Framer Motion
              </Badge>
              <Badge
                variant="outline"
                role="listitem"
                className="bg-transparent border-purple-500 text-purple-600 dark:text-purple-400 px-4 py-2 text-sm font-medium"
              >
                ESLint
              </Badge>
              <Badge
                variant="outline"
                role="listitem"
                className="bg-transparent border-purple-500 text-purple-600 dark:text-purple-400 px-4 py-2 text-sm font-medium"
              >
                Prettier
              </Badge>
            </div>

            <Separator className="my-2" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
              <section aria-labelledby="core-features">
                <h2
                  id="core-features"
                  className="text-2xl font-semibold text-black dark:text-white mb-4"
                >
                  {t("about.coreFeatures.title")}
                </h2>
                <ul
                  className="space-y-4"
                  role="list"
                  aria-label="Core features"
                >
                  {(() => {
                    const points = t("about.coreFeatures.points");
                    const pointsArray = Array.isArray(points) ? points : [];
                    return pointsArray.map((point: string, index: number) => (
                      <li
                        key={index}
                        className="text-gray-600 dark:text-gray-400"
                        role="listitem"
                      >
                        <span className="text-black dark:text-white">
                          {point}
                        </span>
                      </li>
                    ));
                  })()}
                </ul>
              </section>

              <section aria-labelledby="dev-experience">
                <h2
                  id="dev-experience"
                  className="text-2xl font-semibold text-black dark:text-white mb-4"
                >
                  {t("about.devExperience.title")}
                </h2>
                <ul
                  className="space-y-4"
                  role="list"
                  aria-label="Developer experience features"
                >
                  {(() => {
                    const points = t("about.devExperience.points");
                    const pointsArray = Array.isArray(points) ? points : [];
                    return pointsArray.map((point: string, index: number) => (
                      <li
                        key={index}
                        className="text-gray-600 dark:text-gray-400"
                        role="listitem"
                      >
                        <span className="text-black dark:text-white">
                          {point}
                        </span>
                      </li>
                    ));
                  })()}
                </ul>
              </section>
              <section aria-labelledby="user-experience">
                <h2
                  id="user-experience"
                  className="text-2xl font-semibold text-black dark:text-white mb-4"
                >
                  {t("about.userExperience.title")}
                </h2>
                <ul
                  className="space-y-4"
                  role="list"
                  aria-label="User experience features"
                >
                  {(() => {
                    const points = t("about.userExperience.points");
                    const pointsArray = Array.isArray(points) ? points : [];
                    return pointsArray.map((point: string, index: number) => (
                      <li
                        key={index}
                        className="text-gray-600 dark:text-gray-400"
                        role="listitem"
                      >
                        <span className="text-black dark:text-white">
                          {point}
                        </span>
                      </li>
                    ));
                  })()}
                </ul>
              </section>
            </div>

            <Separator className="my-2" />

            {/* Security & SEO Highlights */}
            <section aria-labelledby="security-seo" className="w-full">
              <h2
                id="security-seo"
                className="text-2xl font-semibold text-black dark:text-white mb-6"
              >
                {t("about.securitySeo.title")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      {t("about.securitySeo.security.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                      {(() => {
                        const features = t(
                          "about.securitySeo.security.features"
                        );
                        if (Array.isArray(features)) {
                          return features.map(
                            (feature: string, index: number) => (
                              <li key={index}>• {feature}</li>
                            )
                          );
                        }
                        // Fallback to hardcoded English features if translation fails
                        const fallbackFeatures = [
                          "* BotID built-in Vercel bot detection",
                          "Content Security Policy headers",
                          "Rate limiting with IP blocking",
                          "Input validation with Zod",
                          "Secure authentication flow",
                          "XSS protection",
                          "CSRF protection",
                        ];
                        return fallbackFeatures.map(
                          (feature: string, index: number) => (
                            <li key={index}>• {feature}</li>
                          )
                        );
                      })()}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Search className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      {t("about.securitySeo.seo.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                      {(() => {
                        const features = t("about.securitySeo.seo.features");
                        if (Array.isArray(features)) {
                          return features.map(
                            (feature: string, index: number) => (
                              <li key={index}>• {feature}</li>
                            )
                          );
                        }
                        // Fallback to hardcoded English features if translation fails
                        const fallbackFeatures = [
                          "Meta tags optimization",
                          "Open Graph & Twitter cards",
                          "Sitemap generation",
                          "Robots.txt configuration",
                          "Structured data markup",
                          "Performance optimization",
                        ];
                        return fallbackFeatures.map(
                          (feature: string, index: number) => (
                            <li key={index}>• {feature}</li>
                          )
                        );
                      })()}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* BotID Advanced Bot Detection Section */}
            <section aria-labelledby="botid-detection" className="w-full">
              <h2
                id="botid-detection"
                className="text-2xl font-semibold text-black dark:text-white mb-6"
              >
                {t("about.securitySeo.botid.title")}
              </h2>
              <div className="mb-4">
                <p className="text-lg text-zinc-600 dark:text-zinc-200 mb-4">
                  {t("about.securitySeo.botid.description")}
                </p>
                <Card>
                  <CardContent className="pt-6">
                    <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                      {(() => {
                        const features = t("about.securitySeo.botid.features");
                        if (Array.isArray(features)) {
                          return features.map(
                            (feature: string, index: number) => (
                              <li key={index}>• {feature}</li>
                            )
                          );
                        }
                        // Fallback to hardcoded English features if translation fails
                        const fallbackBotIdFeatures = [
                          "Automatic bot detection using machine learning",
                          "No configuration or API keys required",
                          "Real-time risk scoring and analysis",
                          "Protection against automated attacks",
                          "Seamless integration with Vercel platform",
                          "Invisible to legitimate users",
                          "Advanced behavioral analysis",
                          "Automatic blocking of malicious traffic",
                        ];
                        return fallbackBotIdFeatures.map(
                          (feature: string, index: number) => (
                            <li key={index}>• {feature}</li>
                          )
                        );
                      })()}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator className="my-2" />

            {/* Performance Metrics Section */}
            <section aria-labelledby="performance-metrics" className="w-full">
              <h2
                id="performance-metrics"
                className="text-2xl font-semibold text-black dark:text-white mb-6"
              >
                {t("about.performance.title")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      {t("about.performance.bundleSize.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-zinc-600 dark:text-zinc-400 mb-2">
                      {t("about.performance.bundleSize.value")}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {t("about.performance.bundleSize.description")}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      {t("about.performance.lighthouse.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-zinc-600 dark:text-zinc-400 mb-2">
                      {t("about.performance.lighthouse.value")}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {t("about.performance.lighthouse.description")}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      {t("about.performance.buildTime.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-zinc-600 dark:text-zinc-400 mb-2">
                      {t("about.performance.buildTime.value")}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {t("about.performance.buildTime.description")}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator className="my-2" />

            {/* Advanced Features & Compliance Section */}
            <section aria-labelledby="advanced-features" className="w-full">
              <h2
                id="advanced-features"
                className="text-2xl font-semibold text-black dark:text-white mb-6"
              >
                {t("about.advancedFeatures.title")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      {t("about.advancedFeatures.performance.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                      {(() => {
                        const features = t(
                          "about.advancedFeatures.performance.features"
                        );
                        if (Array.isArray(features)) {
                          return features.map(
                            (feature: string, index: number) => (
                              <li key={index}>• {feature}</li>
                            )
                          );
                        }
                        // Fallback to hardcoded English features if translation fails
                        const fallbackFeatures = [
                          "Next.js Image Optimization with WebP/AVIF",
                          "Automatic code splitting and lazy loading",
                          "Edge Runtime optimization for Vercel",
                          "Built-in caching strategies",
                          "Bundle size optimization",
                          "Core Web Vitals optimization",
                        ];
                        return fallbackFeatures.map(
                          (feature: string, index: number) => (
                            <li key={index}>• {feature}</li>
                          )
                        );
                      })()}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      {t("about.advancedFeatures.compliance.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                      {(() => {
                        const features = t(
                          "about.advancedFeatures.compliance.features"
                        );
                        if (Array.isArray(features)) {
                          return features.map(
                            (feature: string, index: number) => (
                              <li key={index}>• {feature}</li>
                            )
                          );
                        }
                        // Fallback to hardcoded English features if translation fails
                        const fallbackFeatures = [
                          "GDPR compliant cookie management",
                          "SOC 2 Type 2 compliant hosting (Vercel)",
                          "WCAG 2.1 AA accessibility standards",
                          "Security headers and CSP implementation",
                          "Data protection and privacy controls",
                        ];
                        return fallbackFeatures.map(
                          (feature: string, index: number) => (
                            <li key={index}>• {feature}</li>
                          )
                        );
                      })()}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <div role="group" aria-label="GitHub link">
              <Button asChild>
                <a
                  href={getGitHubUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                  aria-label="View Boiler.click on GitHub (opens in new tab)"
                >
                  <Github className="h-4 w-4" />
                  {t("about.githubButton")}
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
