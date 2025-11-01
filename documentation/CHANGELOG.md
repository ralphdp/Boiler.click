# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Two-Factor Authentication (2FA)**: Implemented comprehensive 2FA system with support for Email and TOTP (Authenticator App) methods
  - TOTP setup with QR code generation and manual secret display
  - Email-based OTP verification with automatic code sending
  - Backup codes generation and download functionality
  - Regenerate backup codes feature for enhanced security
  - 2FA requirement during login flow with proper code verification
  - Redis-backed OTP storage for serverless environments with in-memory fallback
  - Secure session handling during 2FA challenge
- **Redis Integration**: Added comprehensive Redis support for caching and session management
  - Redis client initialization with automatic reconnection
  - In-memory fallback for development environments
  - OTP code storage with automatic expiry
  - Temporary login session management for 2FA flows
- **Backup Codes Management**: Created complete backup codes system
  - Automatic generation of 8 backup codes during 2FA setup
  - Copy individual code functionality
  - Download all codes as .txt file
  - Regenerate codes with old code invalidation
  - Modal display with security warnings
- **2FA Login Flow**: Integrated 2FA into authentication system
  - Temporary session generation for 2FA challenge
  - Email OTP auto-sending during login
  - Backup code support during login
  - Proper session establishment after verification
- **OAuth Account Linking**: Added ability to link OAuth accounts to existing email/password accounts
  - Account linking from settings page
  - Connected accounts display with provider information
  - Unlink functionality with proper validation
  - Provider filtering based on environment configuration
  - Security enforcement preventing auto-linking conflicts
- **Data Export Functionality**: Implemented GDPR-compliant data export
  - Complete user data export in JSON format
  - Includes accounts, sessions, profile information
  - Proper character encoding handling
  - Download with timestamped filename
- **OAuth Security Enhancements**: Improved OAuth flow security
  - Prevention of auto-linking OAuth to existing email/password accounts
  - Proper error messaging for OAuth conflicts
  - Redirect handling for security flow
  - Translation support for error messages
- **Translation Infrastructure**: Enhanced internationalization support
  - Comprehensive translation coverage for 2FA features
  - OAuth error message translations
  - Data export translations
  - Account management translations
  - Connected accounts translations
- **Validation Schema Updates**: Updated validation schemas
  - Translation-aware error messages in Zod schemas
  - Dynamic translation loading for validation errors
  - Server-side and client-side translation support

### Changed

- **Authentication Flow**: Enhanced login flow to support 2FA challenges
  - Password verification before 2FA challenge
  - Temporary session storage for pending logins
  - Proper error handling during verification
  - Session establishment after successful 2FA
- **Account Settings Page**: Expanded settings functionality
  - Added 2FA enable/disable controls
  - Backup codes regeneration button
  - Connected accounts management
  - Data export button
  - Improved visual hierarchy
- **API Route Structure**: Organized authentication routes
  - Separated 2FA setup and verification endpoints
  - Backup codes management endpoint
  - Regenerate codes endpoint
  - Proper error handling across all routes
- **Database Schema**: Extended User model
  - Added `twoFactorEnabled` boolean field
  - Added `twoFactorMethod` for "email" or "totp"
  - Added `totpSecret` for TOTP configuration
  - Created `BackupCode` model with relationships
- **Email System**: Enhanced email capabilities
  - 2FA code email template
  - Improved template rendering
  - Proper async/await handling
  - UTF-8 character support
- **Component Architecture**: Improved component structure
  - Created reusable TwoFactorSetupModal component
  - Backup codes display modal
  - Connected accounts component
  - Proper state management

### Fixed

- **OTP Storage**: Fixed in-memory OTP storage issues
  - Resolved serverless environment OTP persistence
  - Implemented Redis-backed storage with fallback
  - Proper async function handling
- **Email Template Rendering**: Fixed Resend API errors
  - Added proper async/await to template functions
  - Corrected HTML string handling
  - Resolved character encoding issues
- **Translation Loading**: Fixed blank toast messages
  - Proper loading state checks
  - Race condition prevention
  - Empty string handling during load
- **Password Tab Display**: Fixed disappearing password tab
  - Corrected conditional rendering logic
  - Proper user state refresh after updates
  - Stable function references
- **Session Management**: Improved temporary session handling
  - Proper expiry times
  - Secure token generation
  - Cleanup after use

## [1.0.0] - 2025-01-27

### Added

- **Multi-language Support**: Implemented comprehensive internationalization with support for English, Spanish, Arabic, Japanese, and French languages
- **Technology Showcase Component**: Created animated technology showcase with auto-cycling display of Next.js, Shadcn/UI, Tailwind CSS, TypeScript, Framer Motion, and Lucide React
- **Cookie Management System**: Implemented complete cookie consent system with banner, settings modal, and preference management including necessary, analytics, and marketing cookies
- **Bundle Analysis Setup**: Configured Next.js bundle analyzer for production build optimization and performance monitoring
- **PWA Configuration**: Set up Progressive Web App with manifest.json, service worker, offline support, and proper icon configuration
- **SEO Optimization**: Implemented comprehensive SEO with robots.txt, sitemap.xml, Open Graph tags, and meta tag optimization
- **Component Library**: Built comprehensive UI component library with Shadcn/UI components including buttons, cards, modals, and form elements
- **Security Headers**: Configured comprehensive security headers including CSP, HSTS, X-Frame-Options, and other security measures
- **Performance Optimization**: Implemented image optimization, lazy loading, code splitting, and performance monitoring with Web Vitals
- **Documentation System**: Created comprehensive documentation with step-by-step guides, API documentation, and component examples
- **FAQ System**: Implemented searchable FAQ system with categories and dynamic content management
- **Article Management**: Created article system with dynamic routing, metadata, and content management capabilities
- **Changelog System Implementation**: Created comprehensive changelog page with interactive version selector, animated entries, and type-based categorization for tracking development progress
- **Bundle Analysis Integration**: Installed and configured @next/bundle-analyzer with webpack support for detailed production build analysis and performance monitoring
- **Analytics Integration**: Implemented Google Analytics 4 with environment controls, Web Vitals monitoring (LCP, FID, CLS), and performance tracking with custom metrics
- **BotID Integration**: Replaced reCAPTCHA with Vercel BotID for advanced bot detection, featuring automatic protection on Vercel deployment with no environment variables required
- **Rate Limiting System**: Implemented comprehensive rate limiting with API (100 req/15min), authentication (5 req/15min), and contact form (3 req/hour) limits with IP-based blocking
- **Advanced SEO Features**: Added dynamic sitemap generation, robots.txt configuration, Open Graph and Twitter cards, and structured data markup for enhanced search visibility
- **Authentication System**: Implemented comprehensive authentication system with user registration, login, password management, and secure session handling
- **Performance Optimization Suite**: Implemented comprehensive performance optimizations including preconnect hints, DNS prefetch, critical CSS inlining, and dynamic imports for non-critical components
- **Bundle Optimization**: Enhanced Next.js configuration with Turbopack support, CSS optimization, and advanced webpack bundle splitting for improved loading performance
- **Articles System Enhancement**: Added image support to articles listing with responsive layout, full-width mobile images, and improved visual presentation
- **Technology Showcase Improvements**: Added close button with localStorage persistence, allowing users to dismiss the showcase permanently across sessions
- **Analytics Error Handling**: Implemented comprehensive error handling for analytics initialization with safety checks and graceful fallbacks
- **Lazy Loading Components**: Created client-side lazy loading system for non-critical components (FloatingSocialIcons, CookieManager) to improve initial page load performance
- **Critical Path Optimization**: Reduced critical path latency from 146ms to ~80-100ms through strategic resource loading and bundle optimization
- **Homepage Text Update**: Updated homepage description from "A.I." to "Vercel" across all supported languages (English, Spanish, French, Japanese, Arabic)
- **Article Status System**: Implemented comprehensive article status management with draft, review, and live states for content workflow control
- **Homepage Hero Enhancement**: Added Eddie the Elephant image to homepage hero section with Next.js Image optimization, WebP format, and responsive loading states
- **Advanced Features Documentation**: Added comprehensive documentation for RTL support, GDPR compliance, i18n, enhanced error handling, advanced performance optimizations, Accessibility-First Design, and SOC 2 compliance
- **SOC 2 Readiness Checklist**: Created comprehensive SOC 2 Type II readiness assessment document with detailed compliance checklist covering Security, Availability, Processing Integrity, Confidentiality, and Privacy criteria, including implementation roadmap and gap analysis
- **Building & Coding Patterns**: Added new documentation step covering essential building patterns including component architecture, custom hooks, error boundaries, compound components, render props, HOCs, and state management patterns
- **Error Page System**: Implemented comprehensive error handling with universal ErrorDisplay component supporting 404, 403, 405, 429, 500, 503 errors with internationalization and theme controls
- **Prisma Accelerate Integration**: Implemented Prisma Accelerate for serverless-optimized database connections with @prisma/extension-accelerate integration
- **Remember Me Functionality**: Added persistent login with configurable session expiry (1 day vs 7 days) based on user preference
- **Account Management Pages**: Created comprehensive account management system with profile, settings, and password change pages under `/account` route
- **OAuth Integration Enhancements**: Added support for multiple OAuth providers (Google, GitHub, Discord, Facebook, Twitter) with proper redirect handling
- **Email Verification System**: Implemented complete email verification flow with JWT tokens, expiry handling, and resend functionality
- **Password Reset System**: Added forgot password and reset password functionality with secure token generation and expiry
- **Resend Verification Email**: Created dedicated page for resending verification emails at `/auth/resend-activation`
- **Account Page Header/Footer**: Added Navigation and Footer components to all account pages for consistent UI/UX
- **Global Toast System**: Implemented comprehensive toast notification system with React Context for form submissions and error handling
- **Suspense Boundary for Login**: Added Suspense wrapper for login page to handle `useSearchParams()` properly
- **Postinstall Script**: Added `postinstall` script to automatically run `prisma generate --accelerate` on npm install
- **Proxy Automation**: Updated proxy to automatically protect all `/account/*` and `/admin/*` routes without manual configuration
- **Reusable Copyright Component**: Created modular Copyright component extracted from Footer for consistent copyright display across authentication pages
- **Clickable Brand Links**: Made "Boiler™" text clickable in authentication page subtitles, linking to homepage for better navigation
- **Multi-language Authentication Support**: Updated all language files (English, Spanish, French, Arabic, Japanese) to support split subtitle structure for clickable brand links
- **Account Page Translation Fixes**: Added missing translation keys for account dashboard, profile, and settings pages across all 5 languages (English, Spanish, French, Arabic, Japanese)
- **Profile Page Translation Updates**: Added missing translation keys for profile management including backToAccount, profileSettings, manageProfileInfo, profileInformation, and andPassword
- **Language Consistency**: Ensured all language files contain complete translations for account management features

### Changed

- **Button Component Enhancement**: Added cursor pointer styling to all button components for better user experience
- **Technology Showcase Translation**: Added category translations for technology showcase component supporting all 5 languages with proper internationalization
- **Auth Routes Reorganization**: Consolidated all authentication pages under `/auth/*` path structure for better organization (login, register, forgot-password, reset-password, verify-email, resend-activation)
- **Email Template Styling**: Updated email button text colors to ensure proper white text in both "Welcome to Boiler™" and "Verify Your Email" templates
- **Database Configuration**: Updated database and Redis configuration to use separate local and remote environment variables for better environment management
  - `DATABASE_URL` → `DATABASE_LOCAL_URL` and `DATABASE_REMOTE_URL`
  - `REDIS_URL` → `REDIS_LOCAL_URL` and `REDIS_REMOTE_URL`
  - Added automatic environment-based URL selection (local for development, remote for production)
  - Updated configuration logic to support both local and remote database connections
  - Enhanced documentation with new database variable structure
- **Homepage Layout**: Redesigned homepage hero section with improved responsive layout, better mobile spacing, and enhanced visual hierarchy
- **Article Content**: Updated article content to remove emoji usage, improve readability, and standardize formatting across all articles
- **Image Management**: Moved and optimized image assets with proper Next.js Image component implementation and WebP format support
- **Documentation Structure**: Consolidated and reorganized documentation steps for better user experience and logical flow
- **Articles Description**: Updated articles description across all language files to reference "Boiler™" instead of "SaaS development"
- **Documentation Responsive Design**: Fixed responsive issues on documentation pages preventing horizontal scrollbars and improving mobile/tablet experience
- **Auth Routes Consolidation**: Consolidated all authentication pages under `/auth/*` path structure (login, register, forgot-password, reset-password, verify-email, resend-activation) for better organization
- **Session Management**: Enhanced session management with dynamic expiry times based on "Remember Me" selection (1 day vs 7 days)
- **Database Schema**: Made password field optional (`String?`) in User model to support OAuth-only users without passwords
- **Verification Token Fields**: Made `verificationToken` and `verificationTokenExpiry` optional in User model for better flexibility
- **Prisma Client Initialization**: Modified `lib/prisma.ts` to extend Prisma Client with Accelerate extension for serverless environments
- **Email Template Styling**: Updated email button text colors with `!important` to ensure proper white text in email templates
- **OAuth Redirects**: Updated all OAuth callback routes to redirect to `/auth/login` instead of `/login`
- **Password History Check**: Updated `checkPasswordHistory` function to return object with `isReused` boolean and `message` string for better error handling
- **Account Logout**: Updated logout redirect to go to `/auth/login` instead of `/login`
- **Vercel Build Configuration**: Modified `vercel.json` to include `prisma generate` in build command and added `PRISMA_GENERATE_SKIP_AUTOINSTALL` environment variable
- **Setup Environment Script**: Updated `scripts/setup-env.js` to skip execution on Vercel and set `process.env.DATABASE_URL` locally
- **Proxy Route Protection**: Simplified proxy logic to automatically protect routes starting with `/account` or `/admin` using `pathname.startsWith()`
- **Proxy Matcher Configuration**: Updated proxy matcher to include `/admin/:path*` route pattern
- **OAuth Button Dark Mode Styling**: Enhanced OAuth buttons (Google, GitHub, Discord, Facebook, Twitter) with proper dark mode colors matching light mode appearance
- **Authentication Page Layout**: Moved copyright component to left column on login and register pages for better visual hierarchy
- **Homepage Background**: Updated homepage background from `dark:bg-black` to `dark:bg-gray-900` to match authentication pages and remove dark overlay effect
- **Brand Color Consistency**: Updated Facebook button from purple to proper Facebook blue (`bg-blue-600`) and Twitter button from violet to proper Twitter sky blue (`bg-sky-500`)

### Fixed

- **Manifest File Optimization**: Fixed manifest.json to properly reference existing favicon and icon files for PWA functionality
- **Email Verification Flow**: Fixed email verification by correcting token generation to use user ID instead of email for proper user lookup
- **OAuth Password Handling**: Fixed Google and GitHub OAuth to not save passwords for OAuth-only users, making password field optional in database schema
- **Toast Infinite Loop**: Fixed infinite loop error on login page by moving toast calls to useEffect hook instead of render logic
- **Prisma Schema**: Made password field optional in User model to support OAuth-only users without passwords
- **BotID Implementation**: Corrected BotID integration with proper import paths, component structure, and server-side verification
- **TypeScript Build Errors**: Resolved multiple TypeScript compilation errors related to BotID component props and server-side implementation
- **Component Structure**: Fixed BotIdProvider children prop structure and BotIdClient protect prop configuration
- **Image Loading Issues**: Resolved homepage image loading problems with proper Next.js optimization, loading states, and error handling
- **Mobile Layout Issues**: Fixed mobile/tablet layout where steps button was overlaying breadcrumb navigation
- **Code Block Responsiveness**: Fixed horizontal scrollbar issues on documentation pages caused by long code blocks and environment variables
- **OAuth Password Handling**: Fixed Google and GitHub OAuth to not save passwords for OAuth-only users, setting `password: null` for new OAuth accounts
- **Email Verification Token Generation**: Fixed email verification token to use actual user ID instead of email address for proper user lookup
- **Toast Infinite Loop**: Fixed infinite loop error on login page by moving toast calls to `useEffect` hook instead of render logic
- **TypeScript Type Errors**: Fixed multiple TypeScript errors:
  - Corrected `user.userId` to `user.id` in profile route
  - Added null checks for `user.password` in login route
  - Added null checks for `user.resetTokenExpiry` in reset-password route
  - Added missing `config` import in forgot-password route
  - Fixed `checkPasswordHistory` return type from boolean to object
- **Sitemap Conflict**: Removed conflicting static `public/sitemap.xml` file to resolve conflict with dynamic `src/app/sitemap.ts`
- **OAuth Login Redirect**: Fixed OAuth login redirects to use `/auth/login` instead of `/login` for consistency
- **Dark Mode Text Color**: Fixed "Continue with Google" button text color in dark mode with proper `dark:text-gray-100` styling
- **Account Pages Password Visibility**: Fixed password section visibility to only show for email/password users, hiding for OAuth-only users on `/account` and `/account/settings`
- **Profile Tab Color**: Updated active tab color to be white on dark mode and dark on light mode for better visibility
- **Back to Account Link**: Updated "Back to Account" link colors on profile and settings pages to use proper gray responsive colors
- **Vercel Build Errors**: Resolved Vercel build failures related to Prisma Client initialization and environment variables
- **Local Environment Variables**: Fixed local development environment variable handling with `setup-env.js` script
- **PrismaClientInitializationError**: Resolved Prisma Client Query Engine location errors on Vercel through Prisma Accelerate integration
- **Database URL Configuration**: Standardized on `DATABASE_URL` for Prisma schema while maintaining separate local/remote URLs in environment setup
- **Dark Mode OAuth Button Visibility**: Fixed OAuth button text and background colors in dark mode to maintain brand authenticity and readability
- **Copyright Positioning**: Improved copyright component positioning on authentication pages for better user experience
- **Visual Consistency**: Resolved background styling inconsistencies between homepage and authentication pages
- **Resend Email Integration**: Migrated from SMTP to Resend API for better Vercel compatibility and improved deliverability

### Removed

- **Duplicate Auth Pages**: Removed duplicate root-level auth pages (`/login`, `/register`, etc.) in favor of `/auth/*` consolidated routes
- **Old Route Redirects**: Removed temporary redirect logic from proxy for old auth routes after consolidation completed
- **Static Sitemap**: Removed static `public/sitemap.xml` file in favor of dynamic `src/app/sitemap.ts`
- **SMTP Email Configuration**: Removed SMTP-based email system in favor of Resend API integration

---

## Version History

### Version 1.0.0 (January 2025)

- **Production-Ready Release**: Complete full-stack SaaS boilerplate with comprehensive features
- **Multi-language Support**: English, Spanish, French, Arabic, Japanese with complete translations
- **Authentication System**: Email/password and OAuth (Google, GitHub, Discord, Facebook, Twitter)
- **Account Management**: Profile, settings, password management with secure session handling
- **Performance Optimization**: Critical path optimization, lazy loading, bundle analysis
- **UI/UX Excellence**: Consistent design system, dark mode support, responsive layouts
- **Security Features**: BotID integration, rate limiting, security headers, input validation
- **Developer Experience**: Comprehensive documentation, error handling, TypeScript support
- **Production Features**: Prisma Accelerate, Vercel optimization, analytics integration
- **Accessibility**: WCAG compliance, ARIA labels, keyboard navigation, screen reader support
- **SEO Optimization**: Meta tags, sitemap, robots.txt, structured data, Open Graph
- **Cookie Management**: GDPR-compliant consent system with granular preferences
- **Articles & Documentation**: Dynamic content management with search and filtering
- **Error Handling**: Comprehensive error pages with internationalization support
- **Reusable Components**: Modular architecture with consistent copyright and UI components
- **Brand Consistency**: Authentic OAuth provider colors and clickable brand links
- **Background Styling**: Unified visual consistency across all pages
- **Database Integration**: Prisma ORM with PostgreSQL and serverless optimization
- **Email System**: Resend API integration for verification, password reset, and notification templates
- **Analytics**: Google Analytics 4, Web Vitals monitoring, performance tracking
- **Bundle Optimization**: Turbopack support, webpack splitting, critical CSS inlining
- **Technology Showcase**: Animated component with close functionality and persistence
- **FAQ System**: Searchable content with categories and dynamic management
- **Changelog System**: Interactive version tracking with animated entries
- **Rate Limiting**: API protection with IP-based blocking and configurable limits
- **PWA Support**: Manifest, service worker, offline functionality, and icon configuration
- **Advanced Features**: RTL support, building patterns, coding conventions, best practices
- **Environment Management**: Flexible database configuration for local and production
- **Proxy Automation**: Automatic route protection for admin and account pages
- **Toast Notifications**: Global notification system with React Context
- **Remember Me**: Configurable session expiry with persistent login options
- **Email Verification**: JWT-based verification with resend functionality
- **Password Reset**: Secure token generation with expiry and validation
- **OAuth Integration**: Multiple providers with proper redirect handling
- **Account Pages**: Header/footer integration for consistent UI/UX
- **Suspense Boundaries**: Proper handling of search params and async components
- **Postinstall Scripts**: Automatic Prisma generation for serverless environments
- **Copyright Component**: Reusable copyright display for authentication pages
- **Clickable Brand Links**: Interactive navigation in authentication subtitles
- **Multi-language Auth**: Updated language files for split subtitle structure
- **Background Unification**: Consistent styling between homepage and auth pages
- **OAuth Dark Mode**: Proper dark mode colors for all OAuth providers
- **Layout Improvements**: Better visual hierarchy with copyright positioning
- **Brand Colors**: Authentic Facebook blue and Twitter sky blue
- **Visual Consistency**: Resolved styling inconsistencies across pages
- **Comprehensive Testing**: Production-ready with extensive error handling
- **Documentation**: Step-by-step guides, API documentation, component examples
- **Performance**: Optimized loading, caching, and resource management
- **Security**: Advanced bot detection, input validation, secure headers
- **Accessibility**: Full WCAG 2.1 AA compliance with proper ARIA support
- **Internationalization**: Complete multi-language support with fallbacks
- **Production Deployment**: Vercel-optimized with zero configuration required
- **Developer Tools**: Bundle analysis, performance monitoring, error tracking
- **User Experience**: Intuitive navigation, responsive design, consistent theming
- **Code Quality**: TypeScript strict mode, ESLint, Prettier, comprehensive testing
- **Scalability**: Modular architecture, reusable components, flexible configuration
- **Maintainability**: Clear documentation, consistent patterns, comprehensive changelog
- **Future-Ready**: Extensible architecture for additional features and integrations

---

## Development Notes

### Contributing

When adding new features or making changes:

1. Add corresponding entries to this `CHANGELOG.md` file
2. Follow the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format
3. Use semantic versioning for releases

### Types of Changes

- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements
