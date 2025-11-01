import { config, features } from "./config";

// Safety check for analytics config
if (!config || !config.analytics) {
  console.warn("Analytics configuration is missing");
}

// Safe feature check function
const isAnalyticsEnabled = () => {
  try {
    // Check cookie preferences first
    const cookieStatus = localStorage.getItem("boiler-click-cookies");
    const cookiePreferences = localStorage.getItem(
      "boiler-click-cookie-preferences"
    );

    // If user has declined cookies, disable analytics
    if (cookieStatus === "declined") {
      return false;
    }

    // If user has custom preferences, check analytics setting
    if (cookieStatus === "custom" && cookiePreferences) {
      try {
        const preferences = JSON.parse(cookiePreferences);
        if (!preferences.analytics) {
          return false;
        }
      } catch (e) {
        console.warn("Failed to parse cookie preferences:", e);
        return false;
      }
    }

    // If no cookie choice made yet, disable analytics by default
    if (!cookieStatus) {
      return false;
    }

    // Check if features object exists and has analytics property
    if (!features || typeof features !== "object") {
      return false;
    }

    // Check if analytics is enabled in features
    if (!features.analytics) {
      return false;
    }

    // Check if config and analytics config exist
    if (!config || !config.analytics) {
      return false;
    }

    // Check if GA ID is provided and not empty
    return config.analytics.gaId && config.analytics.gaId.trim() !== "";
  } catch (error) {
    console.warn("Analytics configuration error:", error);
    return false;
  }
};

// Web Vitals types
interface WebVitalMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  navigationType: string;
}

// Performance monitoring
export function reportWebVitals(metric: WebVitalMetric) {
  try {
    // Early return if we're not in a browser environment
    if (typeof window === "undefined") {
      return;
    }

    // Early return if config is not available
    if (!config) {
      console.warn("Config not available, skipping web vitals reporting");
      return;
    }

    if (config.isDevelopment) {
      console.log("Web Vital:", metric);
    }

    // Send to Google Analytics if configured
    if (
      isAnalyticsEnabled() &&
      typeof window !== "undefined" &&
      (window as any).gtag &&
      config.analytics?.gaId
    ) {
      (window as any).gtag("event", metric.name, {
        event_category: "Web Vitals",
        event_label: metric.id,
        value: Math.round(
          metric.name === "CLS" ? metric.value * 1000 : metric.value
        ),
        non_interaction: true,
      });
    }

    // Send to custom analytics endpoint
    if (config.isProduction) {
      fetch("/api/analytics/web-vitals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metric),
      }).catch(console.error);
    }
  } catch (error) {
    console.warn("Error in reportWebVitals:", error);
  }
}

// Page view tracking
export function trackPageView(url: string, title?: string) {
  try {
    if (
      isAnalyticsEnabled() &&
      typeof window !== "undefined" &&
      (window as any).gtag
    ) {
      (window as any).gtag("config", config.analytics.gaId, {
        page_title: title,
        page_location: url,
      });
    }
  } catch (error) {
    console.warn("Error in trackPageView:", error);
  }
}

// Event tracking
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  try {
    if (
      isAnalyticsEnabled() &&
      typeof window !== "undefined" &&
      (window as any).gtag
    ) {
      (window as any).gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  } catch (error) {
    console.warn("Error in trackEvent:", error);
  }
}

// Error tracking
export function trackError(error: Error, context?: string) {
  console.error("Error tracked:", error, context);

  if (config.isProduction) {
    fetch("/api/analytics/errors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        context,
        url: typeof window !== "undefined" ? window.location.href : "",
        userAgent:
          typeof window !== "undefined" ? window.navigator.userAgent : "",
        timestamp: new Date().toISOString(),
      }),
    }).catch(console.error);
  }
}

// Performance monitoring
export function measurePerformance(
  name: string,
  fn: () => void | Promise<void>
) {
  const start = performance.now();

  const result = fn();

  if (result instanceof Promise) {
    return result.finally(() => {
      const duration = performance.now() - start;
      console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);

      if (config.isProduction) {
        fetch("/api/analytics/performance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            duration,
            timestamp: new Date().toISOString(),
          }),
        }).catch(console.error);
      }
    });
  } else {
    const duration = performance.now() - start;
    console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
    return result;
  }
}

// Resource loading monitoring
export function monitorResourceLoading() {
  // Temporarily disabled to prevent errors
  console.log("Resource loading monitoring disabled");
  return;

  try {
    const observer = new PerformanceObserver((list) => {
      try {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "resource") {
            const resource = entry as PerformanceResourceTiming;
            console.log(
              `Resource loaded: ${resource.name} in ${resource.duration.toFixed(
                2
              )}ms`
            );

            if (config.isProduction && resource.duration > 1000) {
              // Log slow resources
              fetch("/api/analytics/slow-resources", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: resource.name,
                  duration: resource.duration,
                  size: resource.transferSize,
                  timestamp: new Date().toISOString(),
                }),
              }).catch(console.error);
            }
          }
        }
      } catch (error) {
        console.warn("Resource monitoring error:", error);
      }
    });

    // Validate observer was created successfully before calling observe
    if (observer && typeof observer.observe === "function") {
      observer.observe({ entryTypes: ["resource"] });
    } else {
      console.warn(
        "Failed to create PerformanceObserver for resource monitoring"
      );
    }
  } catch (error) {
    console.warn("Resource loading monitoring initialization error:", error);
  }
}

// Core Web Vitals monitoring
export function monitorCoreWebVitals() {
  // Temporarily disabled to prevent errors
  console.log("Core Web Vitals monitoring disabled");
  return;

  try {
    // Monitor Largest Contentful Paint
    if (
      PerformanceObserver.supportedEntryTypes?.includes(
        "largest-contentful-paint"
      )
    ) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          try {
            for (const entry of list.getEntries()) {
              reportWebVitals({
                name: "LCP",
                value: entry.startTime,
                delta: entry.startTime,
                id: "lcp",
                navigationType: "navigate",
              });
            }
          } catch (error) {
            console.warn("LCP monitoring error:", error);
          }
        });

        if (lcpObserver && typeof lcpObserver.observe === "function") {
          lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
        } else {
          console.warn("Failed to create LCP PerformanceObserver");
        }
      } catch (error) {
        console.warn("Failed to create LCP PerformanceObserver:", error);
      }
    }

    // Monitor First Input Delay
    if (PerformanceObserver.supportedEntryTypes?.includes("first-input")) {
      try {
        const fidObserver = new PerformanceObserver((list) => {
          try {
            for (const entry of list.getEntries()) {
              const fidEntry = entry as any;
              reportWebVitals({
                name: "FID",
                value: fidEntry.processingStart - fidEntry.startTime,
                delta: fidEntry.processingStart - fidEntry.startTime,
                id: "fid",
                navigationType: "navigate",
              });
            }
          } catch (error) {
            console.warn("FID monitoring error:", error);
          }
        });

        if (fidObserver && typeof fidObserver.observe === "function") {
          fidObserver.observe({ entryTypes: ["first-input"] });
        } else {
          console.warn("Failed to create FID PerformanceObserver");
        }
      } catch (error) {
        console.warn("Failed to create FID PerformanceObserver:", error);
      }
    }

    // Monitor Cumulative Layout Shift
    if (PerformanceObserver.supportedEntryTypes?.includes("layout-shift")) {
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          try {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
                reportWebVitals({
                  name: "CLS",
                  value: clsValue,
                  delta: (entry as any).value,
                  id: "cls",
                  navigationType: "navigate",
                });
              }
            }
          } catch (error) {
            console.warn("CLS monitoring error:", error);
          }
        });

        if (clsObserver && typeof clsObserver.observe === "function") {
          clsObserver.observe({ entryTypes: ["layout-shift"] });
        } else {
          console.warn("Failed to create CLS PerformanceObserver");
        }
      } catch (error) {
        console.warn("Failed to create CLS PerformanceObserver:", error);
      }
    }
  } catch (error) {
    console.warn("Core Web Vitals monitoring initialization error:", error);
  }
}

// Initialize analytics
export function initializeAnalytics() {
  // Safety check for config existence first
  if (!config || typeof config !== "object") {
    console.warn("Config not available, skipping analytics initialization");
    return;
  }

  // Safety check for analytics config
  if (!config.analytics) {
    console.warn("Analytics configuration is missing, skipping initialization");
    return;
  }

  // Completely disabled to prevent all analytics errors
  console.log("Analytics initialization disabled");
  return;
}

// Global error handler
export function setupErrorHandling() {
  if (typeof window === "undefined") return;

  window.addEventListener("error", (event) => {
    trackError(new Error(event.message), "JavaScript Error");
  });

  window.addEventListener("unhandledrejection", (event) => {
    trackError(new Error(event.reason), "Unhandled Promise Rejection");
  });
}
