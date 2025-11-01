"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface CodeSnippet {
  title: string;
  language: string;
  code: string;
}

interface CodeTypingProps {
  currentSnippetIndex?: number;
}

export function CodeTyping({
  currentSnippetIndex: propSnippetIndex = 0,
}: CodeTypingProps) {
  const { t } = useLanguage();

  const getCodeSnippets = (t: (key: string) => string): CodeSnippet[] => [
    {
      title: t("documentation.codeSnippets.apiRoute"),
      language: "typescript",
      code:
        "// src/app/api/auth/login/route.ts\n" +
        'import { NextResponse } from "next/server";\n\n' +
        "export async function POST(\n" +
        "  request: Request\n" +
        ") {\n" +
        "  const body = await request.json();\n" +
        "  \n" +
        "  // " +
        t("documentation.codeSnippets.comments.validateCredentials") +
        "\n" +
        "  const user = await authenticateUser(\n" +
        "    body.email,\n" +
        "    body.password\n" +
        "  );\n" +
        "  \n" +
        "  if (!user) {\n" +
        "    return NextResponse.json(\n" +
        '      { error: "' +
        t("terminal.invalidCredentials") +
        '" },\n' +
        "      { status: 401 }\n" +
        "    );\n" +
        "  }\n" +
        "  \n" +
        "  return NextResponse.json({\n" +
        '    message: "' +
        t("api.errors.loginSuccessful") +
        '",\n' +
        "    user: { id: user.id, email: user.email }\n" +
        "  });\n" +
        "}",
    },
    {
      title: t("documentation.codeSnippets.prismaSchema"),
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
      title: t("documentation.codeSnippets.reactComponent"),
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
      title: t("documentation.codeSnippets.middleware"),
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
      title: t("documentation.codeSnippets.serverAction"),
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

  const codeSnippets: CodeSnippet[] = useMemo(() => getCodeSnippets(t), [t]);

  const [currentSnippetIndex, setCurrentSnippetIndex] =
    useState(propSnippetIndex);
  const [displayedCode, setDisplayedCode] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [currentSnippet, setCurrentSnippet] = useState(
    codeSnippets[propSnippetIndex]
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCurrentSnippet(codeSnippets[currentSnippetIndex]);
    setDisplayedCode("");
    setIsTyping(true);
  }, [currentSnippetIndex, codeSnippets]);

  // ${t("documentation.codeSnippets.comments.updateSnippetWhenPropChanges")}
  useEffect(() => {
    if (propSnippetIndex !== currentSnippetIndex) {
      // ${t("documentation.codeSnippets.comments.clearExistingTimeout")}
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setCurrentSnippetIndex(propSnippetIndex);
      setDisplayedCode("");
      setIsTyping(true);
    }
  }, [propSnippetIndex, currentSnippetIndex]);

  useEffect(() => {
    if (!isTyping) return;

    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < currentSnippet.code.length) {
        setDisplayedCode(currentSnippet.code.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);

        // ${t("documentation.codeSnippets.comments.waitBeforeSwitching")}
        timeoutRef.current = setTimeout(() => {
          setCurrentSnippetIndex((prev) => (prev + 1) % codeSnippets.length);
        }, 10000);
      }
    }, 10);

    return () => {
      clearInterval(typingInterval);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [currentSnippetIndex, isTyping, currentSnippet, codeSnippets.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-16 w-full h-full flex items-center justify-start"
      dir="ltr"
    >
      <div className="flex w-full h-full border-l border-purple-300/40 dark:border-purple-300/40 pl-4 pr-4">
        {/* Line Numbers */}
        <div className="text-sm font-mono leading-relaxed text-gray-400/30 dark:text-gray-300/30 pr-4 select-none w-12 text-left flex-shrink-0">
          {displayedCode.split("\n").map((_, index) => (
            <div key={index}>{index + 1}</div>
          ))}
        </div>

        {/* Code Content */}
        <pre className="text-sm font-mono leading-relaxed text-purple-800 dark:text-purple-100 text-left flex-1 overflow-x-auto w-full">
          <code className="block w-full">
            {displayedCode.split("\n").map((line, index) => (
              <span key={index} className="block w-full">
                {line.trim().startsWith("//") ? (
                  <span className="text-gray-500 dark:text-gray-400">
                    {line}
                  </span>
                ) : (
                  line
                )}
                {index < displayedCode.split("\n").length - 1 && "\n"}
              </span>
            ))}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-5 bg-purple-900 dark:bg-purple-100 text-purple-900 dark:text-purple-100 ml-1"
            >
              |
            </motion.span>
          </code>
        </pre>
      </div>
    </motion.div>
  );
}
