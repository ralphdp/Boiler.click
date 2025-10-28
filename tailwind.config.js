/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
  // Optimize CSS for production
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    options: {
      safelist: [
        // Keep dynamic classes that might be missed
        "dark",
        "light",
        /^bg-.*$/,
        /^text-.*$/,
        /^border-.*$/,
        /^hover:.*$/,
        /^focus:.*$/,
        /^active:.*$/,
        /^group-hover:.*$/,
        /^group-focus:.*$/,
      ],
    },
  },
  // Remove unused CSS
  corePlugins: {
    // Disable unused features to reduce bundle size
    float: false,
    clear: false,
    skew: false,
    caretColor: false,
    sepia: false,
  },
};
