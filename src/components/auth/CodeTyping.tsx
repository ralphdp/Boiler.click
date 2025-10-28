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

// Syntax highlighting function
const highlightCode = (code: string, language: string) => {
  if (language === "typescript" || language === "tsx") {
    return code
      .split("\n")
      .map((line) => {
        // Skip empty lines
        if (!line.trim()) return line;

        // Handle comments first
        if (line.trim().startsWith("//")) {
          return `<span class="text-gray-500 dark:text-gray-400">${line}</span>`;
        }

        // Handle strings (protect them first)
        let processedLine = line;
        const stringMatches: string[] = [];

        processedLine = processedLine.replace(
          /(['"`][^'"`]*['"`])/g,
          (match) => {
            const index = stringMatches.length;
            stringMatches.push(match);
            return `__STRING_${index}__`;
          }
        );

        // Handle keywords
        processedLine = processedLine.replace(
          /\b(import|export|from|const|let|var|function|async|await|return|if|else|for|while|class|interface|type|extends|implements|public|private|protected|static|readonly|abstract|enum|namespace|module|declare|as|is|in|of|typeof|instanceof|new|this|super|void|null|undefined|true|false|break|continue|switch|case|default|try|catch|finally|throw|with|debugger)\b/g,
          '<span class="text-blue-500 dark:text-blue-400">$1</span>'
        );

        // Handle numbers
        processedLine = processedLine.replace(
          /\b(\d+)\b/g,
          '<span class="text-orange-500 dark:text-orange-400">$1</span>'
        );

        // Handle decorators
        processedLine = processedLine.replace(
          /@(\w+)/g,
          '<span class="text-purple-500 dark:text-purple-400">@$1</span>'
        );

        // Restore strings
        stringMatches.forEach((match, index) => {
          processedLine = processedLine.replace(
            `__STRING_${index}__`,
            `<span class="text-green-500 dark:text-green-400">${match}</span>`
          );
        });

        return processedLine;
      })
      .join("\n");
  }

  if (language === "prisma") {
    return code
      .split("\n")
      .map((line) => {
        // Skip empty lines
        if (!line.trim()) return line;

        // Handle comments first
        if (line.trim().startsWith("//")) {
          return `<span class="text-gray-500 dark:text-gray-400">${line}</span>`;
        }

        // Handle strings (protect them first)
        let processedLine = line;
        const stringMatches: string[] = [];

        processedLine = processedLine.replace(
          /(['"`][^'"`]*['"`])/g,
          (match) => {
            const index = stringMatches.length;
            stringMatches.push(match);
            return `__STRING_${index}__`;
          }
        );

        // Handle keywords
        processedLine = processedLine.replace(
          /\b(model|enum|String|Int|Float|Boolean|DateTime|Json|Bytes|Decimal|BigInt|Unsupported|@id|@default|@unique|@map|@relation|@index|@@map|@@index|@@unique)\b/g,
          '<span class="text-blue-500 dark:text-blue-400">$1</span>'
        );

        // Handle field names
        processedLine = processedLine.replace(
          /(\w+)(?=\s*:)/g,
          '<span class="text-yellow-500 dark:text-yellow-400">$1</span>'
        );

        // Restore strings
        stringMatches.forEach((match, index) => {
          processedLine = processedLine.replace(
            `__STRING_${index}__`,
            `<span class="text-green-500 dark:text-green-400">${match}</span>`
          );
        });

        return processedLine;
      })
      .join("\n");
  }

  return code;
};

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
        }, 10000);
      }
    }, 10);

    return () => clearInterval(typingInterval);
  }, [currentSnippetIndex, isTyping]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-4"
    >
      <div className="flex border-l border-purple-300/40 dark:border-purple-300/40 pl-4">
        {/* Line Numbers */}
        <div className="text-sm font-mono leading-relaxed text-gray-400/30 dark:text-gray-300/30 pr-4 select-none w-12 text-left">
          {displayedCode.split("\n").map((_, index) => (
            <div key={index}>{index + 1}</div>
          ))}
        </div>

        {/* Code Content */}
        <pre className="text-sm font-mono leading-relaxed text-purple-800 dark:text-purple-100">
          <code>
            {displayedCode.split("\n").map((line, index) => (
              <span key={index}>
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
