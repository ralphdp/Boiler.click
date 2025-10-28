"use client";

import dynamic from "next/dynamic";

// Lazy load non-critical components with proper client-side handling
export const LazyFloatingSocialIcons = dynamic(
  () =>
    import("@/components/FloatingSocialIcons").then((mod) => ({
      default: mod.FloatingSocialIcons,
    })),
  {
    ssr: false,
    loading: () => null,
  }
);

export const LazyCookieManager = dynamic(
  () => import("@/components/CookieManager"),
  {
    ssr: false,
    loading: () => null,
  }
);
