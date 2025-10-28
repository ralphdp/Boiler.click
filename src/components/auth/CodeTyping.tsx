"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CodeSnippet {
  title: string;
  language: string;
  code: string;
}

const codeSnippets: CodeSnippet[] = [
  {
    title: "API Route",
    language: "typescript",
    code: `// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {
  const body = await request.json();
  
  // Validate credentials
  const user = await authenticateUser(
    body.email,
    body.password
  );
  
  if (!user) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }
  
  return NextResponse.json({
    message: "Login successful",
    user: { id: user.id, email: user.email }
  });
}`,
  },
  {
    title: "Prisma Schema",
    language: "prisma",
    code: `// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String?
  firstName String
  lastName  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("users")
}

enum Role {
  USER
  ADMIN
}`,
  },
  {
    title: "React Component",
    language: "tsx",
    code: `// src/components/Button.tsx
"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg font-medium",
        variant === "primary" && "bg-blue-600 text-white",
        variant === "secondary" && "bg-gray-200 text-gray-900",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}`,
  },
  {
    title: "Middleware",
    language: "typescript",
    code: `// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("session");
  
  if (!token && request.nextUrl.pathname.startsWith("/protected")) {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/protected/:path*"]
};`,
  },
  {
    title: "Server Action",
    language: "typescript",
    code: `// src/actions/user.ts
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function updateUserProfile(
  userId: string,
  data: { firstName?: string; lastName?: string }
) {
  const updatedUser = await db.user.update({
    where: { id: userId },
    data,
  });
  
  revalidatePath("/profile");
  
  return updatedUser;
}`,
  },
];

export function CodeTyping() {
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState(0);
  const [displayedCode, setDisplayedCode] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [currentSnippet, setCurrentSnippet] = useState(codeSnippets[0]);

  useEffect(() => {
    setCurrentSnippet(codeSnippets[currentSnippetIndex]);
    setDisplayedCode("");
    setIsTyping(true);
  }, [currentSnippetIndex]);

  useEffect(() => {
    if (!isTyping) return;

    const snippet = codeSnippets[currentSnippetIndex];
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < snippet.code.length) {
        setDisplayedCode(snippet.code.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);

        // Wait before switching to next snippet
        setTimeout(() => {
          setCurrentSnippetIndex((prev) => (prev + 1) % codeSnippets.length);
        }, 3000);
      }
    }, 20);

    return () => clearInterval(typingInterval);
  }, [currentSnippetIndex, isTyping]);

  return (
    <div className="h-full flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-sm text-gray-400">{currentSnippet.title}</div>
            <div className="text-xs text-gray-500">
              {currentSnippet.language}
            </div>
          </div>

          {/* Code Content */}
          <div className="p-6 overflow-y-auto bg-gray-950">
            <pre className="text-sm font-mono">
              <code className="text-green-400">
                {displayedCode}
                {isTyping && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2 h-5 bg-green-400 ml-1"
                  >
                    |
                  </motion.span>
                )}
              </code>
            </pre>
          </div>

          {/* Footer Indicator */}
          <div className="px-4 py-2 bg-gray-800 border-t border-gray-700">
            <div className="text-xs text-gray-400 flex items-center justify-between">
              <span>
                {currentSnippetIndex + 1} / {codeSnippets.length}
              </span>
              <span className="flex items-center gap-1">
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
                Live
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
