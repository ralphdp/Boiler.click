"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface CodeOptionsDropdownProps {
  isOpen: boolean;
  currentCodeIndex: number;
  onSelectCode: (index: number) => void;
  onClose: () => void;
}

export function CodeOptionsDropdown({
  isOpen,
  currentCodeIndex,
  onSelectCode,
  onClose,
}: CodeOptionsDropdownProps) {
  const { t } = useLanguage();

  const options = [
    t("codeOptions.options.apiRoute"),
    t("codeOptions.options.prismaSchema"),
    t("codeOptions.options.reactComponent"),
    t("codeOptions.options.authContext"),
    t("codeOptions.options.validationSchema"),
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute right-full top-0 mr-2 w-60 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
      data-dropdown
      dir="ltr"
    >
      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {t("codeOptions.title")}
        </span>
      </div>
      {options.map((option, index) => (
        <div
          key={index}
          className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 ${
            index < options.length - 1
              ? "border-b border-gray-200 dark:border-gray-700"
              : ""
          }`}
          onClick={() => {
            onSelectCode(index);
            onClose();
          }}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              currentCodeIndex === index
                ? "bg-purple-500"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
          ></div>
          {option}
        </div>
      ))}
    </motion.div>
  );
}
