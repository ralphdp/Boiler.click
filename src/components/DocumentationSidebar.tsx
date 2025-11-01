"use client";

import { useState } from "react";
import { getAllSteps } from "@/lib/documentation-steps";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface DocumentationSidebarProps {
  currentStepNumber: number;
}

export function DocumentationSidebar({
  currentStepNumber,
}: DocumentationSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const allSteps = getAllSteps();

  const SidebarContent = () => (
    <div className="p-6">
      {/* Main Site Link */}
      <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <a
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          {t("documentation.sidebar.backToMainSite")}
        </a>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {t("documentation.sidebar.stepsTitle")}
      </h2>
      <nav className="space-y-2">
        {allSteps.map((step) => (
          <a
            key={step.id}
            href={`/documentation/${step.id}/${step.slug}`}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              step.id === currentStepNumber
                ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            onClick={() => setIsOpen(false)}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.id === currentStepNumber
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              {step.id}
            </div>
            <div>
              <div className="font-medium">{step.title}</div>
              <div className="text-sm opacity-75">{step.description}</div>
            </div>
          </a>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 xl:w-80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-r border-gray-200 dark:border-gray-800 sticky top-0 h-screen overflow-y-auto flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="fixed top-4 left-4 z-50 lg:hidden"
            >
              <Menu className="w-4 h-4" />
              <span className="ml-2">{t("documentation.sidebar.steps")}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 md:w-80 p-0">
            <SheetHeader className="p-6 pb-0">
              <SheetTitle>{t("documentation.sidebar.stepsTitle")}</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
