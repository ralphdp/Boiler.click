"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy } from "lucide-react";
import { InteractiveTerminal } from "@/components/InteractiveTerminal";
import { HeroBackground } from "@/components/HeroBackground";
import { DarkOverlay } from "@/components/DarkOverlay";

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TerminalModal({ isOpen, onClose }: TerminalModalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);

  // Hide page scrollbar when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleCopyOutput = () => {
    if (terminalRef.current) {
      const terminalText = terminalRef.current.innerText;
      navigator.clipboard.writeText(terminalText);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-gray-900 shadow-xl w-full h-full max-w-none max-h-none overflow-hidden flex flex-col"
          data-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Terminal Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-700 bg-gray-800 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
              <span className="ml-2 sm:ml-4 text-gray-300 text-xs sm:text-sm font-mono">
                Terminal
              </span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 relative z-50">
              <button
                onClick={handleCopyOutput}
                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-gray-400 hover:text-white hover:bg-gray-700 active:bg-gray-600 rounded-md transition-colors group touch-manipulation relative z-50"
                title="Copy terminal output"
                style={{ touchAction: "manipulation" }}
              >
                <Copy className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform pointer-events-none" />
              </button>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-gray-400 hover:text-white hover:bg-gray-700 active:bg-gray-600 rounded-md transition-colors group touch-manipulation relative z-50"
                title="Close terminal"
                style={{ touchAction: "manipulation" }}
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform pointer-events-none" />
              </button>
            </div>
          </div>

          {/* Terminal Content */}
          <div className="flex-1 overflow-hidden bg-gray-900 relative">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0 opacity-20 dark:opacity-30 overflow-hidden">
              <HeroBackground />
              <DarkOverlay />
            </div>

            {/* Interactive Terminal Content */}
            <div className="relative z-10 h-full">
              <InteractiveTerminal
                onClose={onClose}
                terminalRef={terminalRef}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
