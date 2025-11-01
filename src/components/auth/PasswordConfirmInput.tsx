"use client";

import { useState, useId } from "react";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getPasswordStrengthColor,
  getPasswordStrengthTranslationKey,
} from "@/lib/auth/password";

// Synchronous password validation function
function validatePasswordSync(password: string) {
  const errors: string[] = [];
  let score = 0;

  // Length
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  } else {
    score++;
  }

  // Uppercase
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  } else {
    score++;
  }

  // Lowercase
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  } else {
    score++;
  }

  // Number
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  } else {
    score++;
  }

  // Special character
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character");
  } else {
    score++;
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength: {
      score: Math.min(score, 4),
      label: "",
    },
  };
}

// Synchronous password match check
function checkPasswordMatchSync(password: string, confirmPassword: string) {
  const isMatch = password === confirmPassword;
  return {
    isMatch,
    error: isMatch ? "" : "Passwords do not match",
  };
}

interface PasswordConfirmInputProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  placeholder?: string;
  confirmPlaceholder?: string;
}

export function PasswordConfirmInput({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  disabled = false,
  className,
  required = false,
  placeholder,
  confirmPlaceholder,
}: PasswordConfirmInputProps) {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordId = useId();
  const confirmPasswordId = useId();

  const validation = password ? validatePasswordSync(password) : null;
  const matchValidation = password && confirmPassword ? checkPasswordMatchSync(password, confirmPassword) : null;

  const getStrengthIcon = () => {
    if (!validation) return null;

    if (validation.isValid) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getMatchIcon = () => {
    if (!matchValidation) return null;

    if (matchValidation.isMatch && confirmPassword) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="space-y-4">
      {/* Password Field */}
      <div className="space-y-2">
        <Label
          htmlFor={passwordId}
          className="text-gray-700 dark:text-gray-300"
        >
          {t("auth.password.passwordLabel")}{" "}
          {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="relative">
          <Input
            id={passwordId}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder={placeholder || t("auth.password.placeholder")}
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
              {showPassword
                ? t("auth.password.hidePassword")
                : t("auth.password.showPassword")}
            </span>
          </Button>
        </div>

        {password.length > 0 && validation && validation.strength && (
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
                    "text-sm font-medium whitespace-nowrap",
                    getPasswordStrengthColor(validation.strength.score)
                  )}
                >
                  {t(
                    getPasswordStrengthTranslationKey(validation.strength.score)
                  )}
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
                  <span>{t("auth.password.meetsRequirements")}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label
          htmlFor={confirmPasswordId}
          className="text-gray-700 dark:text-gray-300"
        >
          {t("auth.password.confirmPasswordLabel")}{" "}
          {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="relative">
          <Input
            id={confirmPasswordId}
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            placeholder={
              confirmPlaceholder || t("auth.password.confirmPlaceholder")
            }
            disabled={disabled}
            required={required}
            className={cn(
              "pr-10",
              matchValidation &&
                !matchValidation.isMatch &&
                confirmPassword &&
                "border-red-500 focus:border-red-500",
              matchValidation &&
                matchValidation.isMatch &&
                confirmPassword &&
                "border-green-500 focus:border-green-500",
              className
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            disabled={disabled}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
            <span className="sr-only">
              {showConfirmPassword
                ? t("auth.password.hidePassword")
                : t("auth.password.showPassword")}
            </span>
          </Button>
        </div>

        {confirmPassword.length > 0 && matchValidation && (
          <div className="flex items-center gap-2">
            {getMatchIcon()}
            <span
              className={cn(
                "text-sm",
                matchValidation.isMatch
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {matchValidation.isMatch
                ? t("auth.password.passwordsMatch")
                : matchValidation.error}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
