"use client";

import { use } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getStepByNumber, getAllSteps } from "@/lib/documentation-steps";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Code, Image, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentationSidebar } from "@/components/DocumentationSidebar";
import { ThemeToggle } from "@/components/theme-toggle";

interface StepPageProps {
  params: Promise<{
    "step-number": string;
    "step-name": string;
  }>;
}

export default function StepPage({ params }: StepPageProps) {
  const { t, isRTL } = useLanguage();
  const resolvedParams = use(params);
  const stepNumber = parseInt(resolvedParams["step-number"]);
  const stepName = resolvedParams["step-name"];

  const step = getStepByNumber(stepNumber);
  const allSteps = getAllSteps();

  if (!step || step.slug !== stepName) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans dark:bg-gradient-to-br dark:from-gray-900 dark:to-black">
      {/* Theme Toggle - Responsive to RTL */}
      <div className={`fixed top-4 z-50 ${isRTL ? "left-4" : "right-4"}`}>
        <ThemeToggle />
      </div>

      <div className="flex min-h-screen overflow-x-hidden">
        {/* Sidebar */}
        <DocumentationSidebar currentStepNumber={stepNumber} />

        {/* Main Content */}
        <div className="flex-1 max-w-4xl mx-auto p-4 sm:p-6 lg:p-12 lg:ml-0 min-w-0 w-full pt-16 sm:pt-20 lg:pt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge
                  variant="outline"
                  className="text-purple-600 border-purple-200"
                >
                  Step {step.id}
                </Badge>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  {step.title}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 break-words">
                {step.title}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 break-words">
                {step.description}
              </p>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              {step.content.sections.map((section, sectionIndex) => (
                <motion.div
                  key={sectionIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-500" />
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 overflow-hidden">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                        {section.content}
                      </p>

                      {/* Code Blocks */}
                      {section.codeBlocks && section.codeBlocks.length > 0 && (
                        <div className="space-y-4">
                          {section.codeBlocks.map((codeBlock, codeIndex) => (
                            <div key={codeIndex}>
                              {codeBlock.description && (
                                <div className="flex items-center gap-2 mb-2">
                                  <Code className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {codeBlock.description}
                                  </span>
                                </div>
                              )}
                              <div className="bg-gray-50 dark:bg-gray-500/10 p-4 sm:p-6 rounded-lg overflow-x-auto">
                                <pre className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-all overflow-wrap-anywhere">
                                  <code
                                    className={`language-${codeBlock.language}`}
                                  >
                                    {codeBlock.code}
                                  </code>
                                </pre>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Images */}
                      {section.images && section.images.length > 0 && (
                        <div className="space-y-4">
                          {section.images.map((image, imageIndex) => (
                            <div key={imageIndex} className="space-y-2">
                              <img
                                src={image.src}
                                alt={image.alt}
                                className="rounded-lg border border-zinc-200 dark:border-zinc-700 w-full"
                              />
                              {image.caption && (
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
                                  {image.caption}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Navigation */}
            <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                {stepNumber > 1 && (
                  <a
                    href={`/documentation/${stepNumber - 1}/${
                      allSteps[stepNumber - 2].slug
                    }`}
                    className="flex items-center gap-2 px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors break-words"
                  >
                    ← Previous: {allSteps[stepNumber - 2].title}
                  </a>
                )}
                {stepNumber < allSteps.length && (
                  <a
                    href={`/documentation/${stepNumber + 1}/${
                      allSteps[stepNumber].slug
                    }`}
                    className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-700 transition-colors break-words"
                  >
                    Next: {allSteps[stepNumber].title} →
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
