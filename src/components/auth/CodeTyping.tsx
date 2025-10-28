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
    }, 15);

    return () => clearInterval(typingInterval);
  }, [currentSnippetIndex, isTyping]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute top-8 left-8 z-20"
    >
      <pre className="text-sm font-mono leading-relaxed text-gray-400/50 dark:text-green-300/30">
        <code>
          {displayedCode}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2 h-5 bg-gray-400/80 dark:bg-green-400/80 ml-1"
          >
            |
          </motion.span>
        </code>
      </pre>
    </motion.div>
  );
}
