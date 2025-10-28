"use client";

import { useState, useId } from "react";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  validatePassword,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
} from "@/lib/auth/password";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  placeholder?: string;
}

export function PasswordInput({
  value,
  onChange,
  disabled = false,
  className,
  required = false,
  placeholder,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = useId();

  const validation = validatePassword(value);

  const getStrengthIcon = () => {
    if (!validation) return null;

    if (validation.isValid) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={inputId}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Enter your password"}
          disabled={disabled}
          required={required}
          className={cn(
            "pr-10",
            validation &&
              !validation.isValid &&
              "border-red-500 focus:border-red-500",
            validation &&
              validation.isValid &&
              "border-green-500 focus:border-green-500",
            className
          )}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-500" />
          ) : (
            <Eye className="h-4 w-4 text-gray-500" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>

      {value.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  validation.strength.score < 2 && "bg-red-500",
                  validation.strength.score >= 2 &&
                    validation.strength.score < 3 &&
                    "bg-orange-500",
                  validation.strength.score >= 3 &&
                    validation.strength.score < 4 &&
                    "bg-yellow-500",
                  validation.strength.score >= 4 && "bg-green-500"
                )}
                style={{ width: `${(validation.strength.score / 4) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-1">
              {getStrengthIcon()}
              <span
                className={cn(
                  "text-sm font-medium",
                  getPasswordStrengthColor(validation.strength.score)
                )}
              >
                {getPasswordStrengthLabel(validation.strength.score)}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            {validation.errors.map((error: string, index: number) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
              >
                <XCircle className="h-3 w-3 flex-shrink-0" />
                <span>{error}</span>
              </div>
            ))}
            {validation.isValid && (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="h-3 w-3 flex-shrink-0" />
                <span>Password meets all requirements</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
