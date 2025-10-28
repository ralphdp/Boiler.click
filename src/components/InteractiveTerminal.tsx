"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { HeroBackground } from "@/components/HeroBackground";
import { DarkOverlay } from "@/components/DarkOverlay";

interface Command {
  path: string;
  description: string;
  code: string;
  category: string;
}

interface InteractiveTerminalProps {
  className?: string;
  onClose?: () => void;
  terminalRef?: React.RefObject<HTMLDivElement | null>;
}

// Available commands with their code
const commands: Command[] = [
  {
    path: "code:login:route",
    description: "Login API route handler",
    category: "API Routes",
    code: `// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation/auth";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = loginSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.errors },
        { status: 400 }
      );
    }
    
    const { email, password } = validationResult.data;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Please verify your email before logging in" },
        { status: 401 }
      );
    }
    
    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // Create session
    const session = await createSession(user.id);
    
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}`,
  },
  {
    path: "code:components:button",
    description: "Button component implementation",
    category: "UI Components",
    code: `// src/components/ui/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };`,
  },
  {
    path: "code:auth:context",
    description: "Authentication context provider",
    category: "Context Providers",
    code: `// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        await refreshUser();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}`,
  },
  {
    path: "code:lib:prisma",
    description: "Prisma database configuration",
    category: "Database",
    code: `// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;`,
  },
  {
    path: "code:validation:auth",
    description: "Authentication validation schemas",
    category: "Validation",
    code: `// src/lib/validation/auth.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  telephone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});`,
  },
];

export function InteractiveTerminal({
  className = "",
  onClose,
  terminalRef: externalTerminalRef,
}: InteractiveTerminalProps) {
  const [currentCommand, setCurrentCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentCode, setCurrentCode] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [animatedOutput, setAnimatedOutput] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const internalTerminalRef = useRef<HTMLDivElement>(null);
  const terminalRef = externalTerminalRef || internalTerminalRef;

  // Scroll to bottom when new output is added
  useEffect(() => {
    if (terminalRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      });
    }
  }, [terminalOutput, animatedOutput, terminalRef]);

  // Animate terminal output
  const animateOutput = useCallback((newOutput: string[]) => {
    if (newOutput.length === 0) {
      setAnimatedOutput([]);
      return;
    }

    setIsAnimating(true);
    setAnimatedOutput([]);

    const totalLines = newOutput.length;
    let currentLineIndex = 0;
    let currentCharIndex = 0;
    const currentAnimatedOutput: string[] = [];

    const typeNextChar = () => {
      if (currentLineIndex >= totalLines) {
        setIsAnimating(false);
        return;
      }

      const currentLine = newOutput[currentLineIndex];

      if (currentCharIndex < currentLine.length) {
        currentAnimatedOutput[currentLineIndex] = currentLine.substring(
          0,
          currentCharIndex + 1
        );
        currentCharIndex++;
        setAnimatedOutput([...currentAnimatedOutput]);
        setTimeout(typeNextChar, 20); // 20ms delay between characters
      } else {
        // Move to next line
        currentLineIndex++;
        currentCharIndex = 0;
        if (currentLineIndex < totalLines) {
          currentAnimatedOutput[currentLineIndex] = "";
        }
        setAnimatedOutput([...currentAnimatedOutput]);
        setTimeout(typeNextChar, 50); // 50ms delay between lines
      }
    };

    typeNextChar();
  }, []);

  // Trigger animation when terminalOutput changes
  useEffect(() => {
    if (terminalOutput.length > 0) {
      animateOutput(terminalOutput);
    }
  }, [terminalOutput, animateOutput]);

  // Generate suggestions based on current input
  const updateSuggestions = useCallback((input: string) => {
    if (input.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = commands
      .map((cmd) => cmd.path)
      .filter((path) => path.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 5);

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, []);

  // Handle command execution
  const executeCommand = useCallback(
    (command: string) => {
      const trimmedCommand = command.trim();

      if (trimmedCommand === "") return;

      // Add to history
      setCommandHistory((prev) => [...prev, trimmedCommand]);
      setHistoryIndex(-1);

      // Clear current command
      setCurrentCommand("");
      setShowSuggestions(false);

      // Handle special commands
      if (trimmedCommand === "help") {
        setTerminalOutput((prev) => [
          ...prev,
          "Interactive Code Terminal",
          "",
          "Available commands:",
          "  help        - Show this help message",
          "  commands    - List all available code commands",
          "  clear       - Clear terminal output",
          "  exit        - Close the terminal",
          "  code:path   - Show code for specific component/route",
          "",
          "Examples:",
          "  code:login:route",
          "  code:components:button",
          "  code:auth:context",
          "",
          "Use ↑/↓ arrows to navigate command history",
          "Use Tab for autocomplete suggestions",
        ]);
        return;
      }

      if (trimmedCommand === "commands") {
        const categories = [...new Set(commands.map((cmd) => cmd.category))];
        const output = ["Available Commands:", ""];

        categories.forEach((category) => {
          output.push(`${category}:`);
          commands
            .filter((cmd) => cmd.category === category)
            .forEach((cmd) => {
              output.push(`  ${cmd.path} - ${cmd.description}`);
            });
          output.push("");
        });

        setTerminalOutput((prev) => [...prev, ...output]);
        return;
      }

      if (trimmedCommand === "clear") {
        setTerminalOutput([]);
        return;
      }

      if (trimmedCommand === "exit") {
        if (onClose) {
          onClose();
        }
        return;
      }

      // Handle code commands
      if (trimmedCommand.startsWith("code:")) {
        const command = commands.find((cmd) => cmd.path === trimmedCommand);
        if (command) {
          setTerminalOutput((prev) => [...prev, `${command.description}:`, ""]);
          setCurrentCode(command.code);
          setIsTyping(true);

          // Stop typing after a delay
          setTimeout(() => {
            setIsTyping(false);
            setCurrentCode("");
          }, 5000);
        } else {
          setTerminalOutput((prev) => [
            ...prev,
            `Command not found: ${trimmedCommand}`,
            "Type 'commands' to see available options",
          ]);
        }
        return;
      }

      // Unknown command
      setTerminalOutput((prev) => [
        ...prev,
        `Unknown command: ${trimmedCommand}`,
        "Type 'help' for available commands",
      ]);
    },
    [onClose]
  );

  // Handle key press
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        executeCommand(currentCommand);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex =
            historyIndex === -1
              ? commandHistory.length - 1
              : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex]);
          setShowHistory(true);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1;
          if (newIndex >= commandHistory.length) {
            setHistoryIndex(-1);
            setCurrentCommand("");
          } else {
            setHistoryIndex(newIndex);
            setCurrentCommand(commandHistory[newIndex]);
          }
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        if (suggestions.length > 0) {
          setCurrentCommand(suggestions[0]);
          setShowSuggestions(false);
        }
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
        setShowHistory(false);
      } else if (e.key.length === 1) {
        // Regular character input
        setCurrentCommand((prev) => prev + e.key);
        setShowSuggestions(true);
      } else if (e.key === "Backspace") {
        setCurrentCommand((prev) => prev.slice(0, -1));
        if (currentCommand.length <= 1) {
          setShowSuggestions(false);
        }
      }
    },
    [currentCommand, commandHistory, historyIndex, suggestions, executeCommand]
  );

  // Add global keyboard listener (desktop only - mobile uses input field)
  useEffect(() => {
    const isMobile =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (!isMobile) {
      document.addEventListener("keydown", handleKeyPress);
    }
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  // Handle paste events
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      e.preventDefault();
      const pastedText = e.clipboardData?.getData("text") || "";

      // Split pasted text by lines and execute each command
      const lines = pastedText.split("\n").filter((line) => line.trim());

      if (lines.length === 1) {
        // Single line - replace current command
        setCurrentCommand(lines[0]);
        setShowSuggestions(true);
      } else {
        // Multiple lines - execute each command
        lines.forEach((line, index) => {
          setTimeout(() => {
            executeCommand(line.trim());
          }, index * 100); // Small delay between commands
        });
      }
    },
    [executeCommand]
  );

  // Add paste listener
  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  // Update suggestions when command changes
  useEffect(() => {
    updateSuggestions(currentCommand);
  }, [currentCommand, updateSuggestions]);

  return (
    <div className={`h-full flex flex-col relative ${className}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-30 overflow-hidden">
        <HeroBackground />
        <DarkOverlay />
      </div>

      {/* Terminal Output */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-2 sm:p-4 font-mono text-xs sm:text-sm text-gray-300 bg-gray-900/80 backdrop-blur-sm relative z-10 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800 dark:scrollbar-thumb-gray-400 dark:scrollbar-track-gray-900 select-text touch-pan-y"
        style={{ height: "calc(100% - 60px)" }}
      >
        {animatedOutput.map((line, index) => (
          <div key={index} className="mb-1 flex">
            <span className="text-green-400 mr-2 select-none">$</span>
            <span className="flex-1">{line}</span>
          </div>
        ))}

        {/* Code Display */}
        {isTyping && currentCode && (
          <div className="mt-4 mb-6 p-4 bg-gray-800/90 backdrop-blur-sm rounded border-l-4 border-green-500">
            <pre className="text-green-400 text-xs overflow-x-auto">
              <code>{currentCode}</code>
            </pre>
          </div>
        )}

        {/* Current Command Input with Blinking Cursor */}
        <div className="flex items-center relative">
          <span className="text-green-400 mr-2">$</span>
          <span className="text-gray-300">{currentCommand}</span>
          {!isAnimating && (
            <motion.span
              className="w-2 h-5 bg-green-400 ml-1"
              animate={{ opacity: [1, 0, 1] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
          
          {/* Mobile typing indicator */}
          {currentCommand === "" && (
            <span className="text-gray-500 text-sm ml-2">
              Tap to type...
            </span>
          )}

          {/* Mobile Input Area - Visible input for mobile typing */}
          <input
            type="text"
            value={currentCommand}
            onChange={(e) => {
              setCurrentCommand(e.target.value);
              updateSuggestions(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                executeCommand(currentCommand);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (commandHistory.length > 0) {
                  const newIndex =
                    historyIndex === -1
                      ? commandHistory.length - 1
                      : Math.max(0, historyIndex - 1);
                  setHistoryIndex(newIndex);
                  setCurrentCommand(commandHistory[newIndex]);
                  setShowHistory(true);
                }
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                if (historyIndex !== -1) {
                  const newIndex = historyIndex + 1;
                  if (newIndex >= commandHistory.length) {
                    setHistoryIndex(-1);
                    setCurrentCommand("");
                  } else {
                    setHistoryIndex(newIndex);
                    setCurrentCommand(commandHistory[newIndex]);
                  }
                }
              } else if (e.key === "Tab") {
                e.preventDefault();
                if (suggestions.length > 0) {
                  setCurrentCommand(suggestions[0]);
                  setShowSuggestions(false);
                }
              } else if (e.key === "Escape") {
                setShowSuggestions(false);
                setShowHistory(false);
              }
            }}
            className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-transparent border-none outline-none"
            style={{ fontSize: "inherit", fontFamily: "inherit" }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            placeholder=""
          />

          {/* Suggestions Panel - Mobile responsive */}
          {showSuggestions && suggestions.length > 0 && !isAnimating && (
            <div className="absolute top-8 left-0 right-0 sm:left-0 sm:right-auto sm:w-80 bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
              <div className="p-2 border-b border-gray-700">
                <span className="text-xs text-gray-400">Suggestions</span>
              </div>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-3 hover:bg-gray-700/50 active:bg-gray-700/70 cursor-pointer text-sm text-gray-300 border-b border-gray-700 last:border-b-0 touch-manipulation"
                  onClick={() => {
                    setCurrentCommand(suggestion);
                    setShowSuggestions(false);
                  }}
                >
                  <span className="text-green-400">$</span> {suggestion}
                </div>
              ))}
            </div>
          )}

          {/* History Panel - Mobile responsive */}
          {showHistory && commandHistory.length > 0 && !isAnimating && (
            <div className="absolute top-72 left-0 right-0 sm:left-0 sm:right-auto sm:w-80 bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
              <div className="p-2 border-b border-gray-700">
                <span className="text-xs text-gray-400">Command History</span>
              </div>
              {commandHistory.map((command, index) => (
                <div
                  key={index}
                  className={`px-4 py-3 hover:bg-gray-700/50 active:bg-gray-700/70 cursor-pointer text-sm text-gray-300 border-b border-gray-700 last:border-b-0 touch-manipulation ${
                    index === historyIndex ? "bg-gray-700/30" : ""
                  }`}
                  onClick={() => {
                    setCurrentCommand(command);
                    setHistoryIndex(index);
                    setShowHistory(false);
                  }}
                >
                  <span className="text-green-400">$</span> {command}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
