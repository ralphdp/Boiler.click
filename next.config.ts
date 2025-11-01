import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    // Only enable staleTimes in production
    staleTimes:
      process.env.NODE_ENV === "production"
        ? {
            dynamic: 30,
            static: 180,
          }
        : {
            dynamic: 0,
            static: 0,
          },
    // optimizeCss: true, // Disabled due to critters dependency issues
  },
  // Turbopack configuration for Next.js 16
  turbopack: {
    // Turbopack handles bundle optimization automatically
    // No need for custom webpack config
  },
  // Fallback webpack config for when not using Turbopack
  webpack: (config, { dev, isServer }) => {
    // Only apply webpack optimizations when not using Turbopack
    if (!process.env.TURBOPACK && !dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          styles: {
            name: "styles",
            test: /\.(css|scss)$/,
            chunks: "all",
            enforce: true,
          },
          vendor: {
            name: "vendor",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            priority: 10,
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
  headers: async () => {
    const isDev = process.env.NODE_ENV === "development";

    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: isDev
              ? "no-store, no-cache, must-revalidate, proxy-revalidate"
              : "public, max-age=300",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: isDev
              ? "no-store, no-cache, must-revalidate, proxy-revalidate"
              : "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          // Disable caching in development
          ...(isDev
            ? [
                {
                  key: "Cache-Control",
                  value:
                    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
                },
                { key: "Pragma", value: "no-cache" },
                { key: "Expires", value: "0" },
              ]
            : []),
        ],
      },
    ];
  },
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: process.env.NODE_ENV === "development" ? 0 : 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
