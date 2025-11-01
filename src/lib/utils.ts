import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Translation utility for server-side use
export async function getTranslations(lang: string = "en") {
  try {
    let messages;
    switch (lang) {
      case "ar":
        messages = (await import("../languages/ar.json")).default;
        break;
      default:
        messages = (await import("../languages/en.json")).default;
    }
    return messages;
  } catch (error) {
    console.error("Failed to load translations:", error);
    // Fallback to English
    const fallback = (await import("../languages/en.json")).default;
    return fallback;
  }
}

// Helper function to get nested translation value
export function getTranslationValue(
  messages: Record<string, unknown>,
  key: string
): string {
  const keys = key.split(".");
  let value: unknown = messages;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      console.warn(`Translation not found for key: ${key}`);
      return key; // Return the key if translation not found
    }
  }

  return value as string;
}

// Create a translation function compatible with t() pattern
export function createTranslator(messages: Record<string, unknown>) {
  return (key: string): string => {
    return getTranslationValue(messages, key);
  };
}
