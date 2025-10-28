import { Cabin, PT_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CookieProvider } from "@/contexts/CookieContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ScrollRestoration } from "@/components/ScrollRestoration";
import LanguageAttributes from "@/components/LanguageAttributes";
import { Toast } from "@/components/Toast";
import {
  LazyFloatingSocialIcons,
  LazyCookieManager,
} from "@/components/LazyComponents";
import { BotIdProvider } from "@/components/BotId";

const cabin = Cabin({
  subsets: ["latin"],
  variable: "--font-cabin",
  display: "swap",
  preload: true,
});

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-sans",
  display: "swap",
  preload: true,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Basic Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="light dark" />

        {/* SEO Meta Tags */}
        <meta
          name="description"
          content="Boiler.click - Full-Stack SaaS Boilerplate"
        />
        <meta
          name="keywords"
          content="Next.js, SaaS, Boilerplate, TypeScript, Tailwind CSS"
        />
        <meta name="author" content="Boiler.click" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Boiler.click - Full-Stack SaaS Boilerplate"
        />
        <meta
          property="og:description"
          content="A comprehensive, production-ready Next.js boilerplate for building modern SaaS applications."
        />
        <meta property="og:url" content="https://boiler.click" />
        <meta property="og:site_name" content="Boiler.click" />
        <meta property="og:image" content="https://boiler.click/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Boiler.click - Full-Stack SaaS Boilerplate"
        />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Boiler.click - Full-Stack SaaS Boilerplate"
        />
        <meta
          name="twitter:description"
          content="A comprehensive, production-ready Next.js boilerplate for building modern SaaS applications."
        />
        <meta
          name="twitter:image"
          content="https://boiler.click/og-image.svg"
        />
        <meta
          name="twitter:image:alt"
          content="Boiler.click - Full-Stack SaaS Boilerplate"
        />

        {/* Canonical URL */}
        <link rel="canonical" href="https://boiler.click" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.google.com" />

        {/* DNS Prefetch for additional performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.google.com" />

        {/* Fonts are handled by Next.js font optimization */}

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Boiler.click",
              description: "Full-Stack SaaS Boilerplate",
              url: "https://boiler.click",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://boiler.click/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* Critical CSS for above-the-fold content */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Critical above-the-fold styles */
            body { 
              font-family: 'Cabin', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0;
              padding: 0;
              line-height: 1.6;
              color: #1f2937;
              background-color: #ffffff;
            }
            .dark body {
              color: #f9fafb;
              background-color: #111827;
            }
            * { box-sizing: border-box; }
            html { scroll-behavior: smooth; }
            .sr-only { 
              position: absolute; 
              width: 1px; 
              height: 1px; 
              padding: 0; 
              margin: -1px; 
              overflow: hidden; 
              clip: rect(0, 0, 0, 0); 
              white-space: nowrap; 
              border: 0; 
            }
            .focus\\:not-sr-only:focus { 
              position: static; 
              width: auto; 
              height: auto; 
              padding: 0.5rem 1rem; 
              margin: 0; 
              overflow: visible; 
              clip: auto; 
              white-space: normal; 
            }
          `,
          }}
        />

        {/* Google Analytics - Optimized loading */}
        {process.env.NODE_ENV === "production" &&
          process.env.NEXT_PUBLIC_GA_ID && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                      'anonymize_ip': true,
                      'cookie_flags': 'SameSite=None;Secure',
                      'send_page_view': false
                    });
                  `,
                }}
              />
            </>
          )}

        {/* Analytics and Performance Monitoring */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Web Vitals tracking
                function sendToAnalytics(data) {
                  if (typeof gtag !== 'undefined') {
                    gtag('event', data.name, {
                      event_category: 'Web Vitals',
                      event_label: data.id,
                      value: Math.round(data.name === 'CLS' ? data.value * 1000 : data.value),
                      non_interaction: true,
                    });
                  }
                }

                // Performance monitoring
                if ('PerformanceObserver' in window) {
                  const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                      if (entry.entryType === 'largest-contentful-paint') {
                        sendToAnalytics({
                          name: 'LCP',
                          value: entry.startTime,
                          id: entry.id,
                        });
                      }
                    });
                  });
                  observer.observe({ entryTypes: ['largest-contentful-paint'] });
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${cabin.variable} ${ptSans.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Skip to main content
        </a>

        <LanguageProvider>
          <LanguageAttributes />
          <AuthProvider>
            <CookieProvider>
              <ToastProvider>
                <BotIdProvider>
                  <ScrollRestoration>{children}</ScrollRestoration>
                  <LazyFloatingSocialIcons />
                  <LazyCookieManager />
                  <Toast />
                </BotIdProvider>
              </ToastProvider>
            </CookieProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
