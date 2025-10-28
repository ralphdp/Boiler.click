"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthFormContainerProps {
  title: string;
  description?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function AuthFormContainer({
  title,
  description,
  subtitle,
  children,
  className,
}: AuthFormContainerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className={cn("shadow-lg", className)}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {title}
            </CardTitle>
            {subtitle && (
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                {subtitle}
              </CardDescription>
            )}
            {description && (
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                {description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">{children}</CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
