# Boiler.click - Full-Stack SaaS Boilerplate

A comprehensive, production-ready Next.js boilerplate for building modern SaaS applications with internationalization, analytics, and performance monitoring.

## 🔑 Required Accounts & API Credentials

Before setting up Boiler.click, you'll need to create accounts and obtain API credentials from the following services:

### 🗄️ Database Services

- **[PostgreSQL](https://www.postgresql.org/)** - Primary database (local installation or cloud service)
- **[Neon](https://neon.tech/)** - Serverless PostgreSQL (recommended for production)
- **[Prisma Accelerate](https://www.prisma.io/accelerate)** - Database connection pooling and caching
- **[Redis Cloud](https://redis.com/)** - Caching and session storage

### 🔐 Authentication Providers

- **[Google Cloud Console](https://console.cloud.google.com/)** - Google OAuth credentials
- **[GitHub Developer Settings](https://github.com/settings/developers)** - GitHub OAuth app
- **[Discord Developer Portal](https://discord.com/developers/applications)** - Discord OAuth app
- **[Facebook Developers](https://developers.facebook.com/)** - Facebook OAuth app
- **[Twitter Developer Portal](https://developer.twitter.com/)** - Twitter OAuth app

### 📧 Email Services

- **[Resend](https://resend.com/)** - Transactional email service

### 💳 Payment Processing

- **[Stripe](https://stripe.com/)** - Payment processing and webhooks

### 📊 Analytics & Monitoring

- **[Google Analytics](https://analytics.google.com/)** - Website analytics
- **[Vercel Analytics](https://vercel.com/analytics)** - Performance monitoring (built-in with Vercel)

### 🚀 Hosting & Deployment

- **[Vercel](https://vercel.com/)** - Primary hosting platform (recommended)
- **[GitHub](https://github.com/)** - Code repository hosting

### 📝 Optional Services

- **[Google Search Console](https://search.google.com/search-console)** - SEO monitoring
- **[Google Tag Manager](https://tagmanager.google.com/)** - Advanced analytics tracking

## 📋 Setup Checklist

- [ ] PostgreSQL database (local or Neon)
- [ ] Redis instance (local or Redis Cloud)
- [ ] Google OAuth credentials
- [ ] GitHub OAuth app
- [ ] Resend API key
- [ ] Stripe account (for payments)
- [ ] Vercel account (for deployment)
- [ ] GitHub repository

## 📁 Project Structure

```text
src/
├── app/                         # Next.js App Router
│   ├── about/                   # About page
│   ├── account/                 # Account management pages
│   │   ├── page.tsx             # Account dashboard
│   │   ├── profile/             # Profile management
│   │   │   └── page.tsx         # Profile settings
│   │   └── settings/            # Account settings
│   │       └── page.tsx         # Settings page
│   ├── api/                     # API routes
│   │   ├── account/             # Account API endpoints
│   │   │   ├── change-password/ # Password change API
│   │   │   └── profile/         # Profile API
│   │   ├── analytics/           # Analytics endpoints
│   │   ├── auth/                # Authentication API
│   │   │   ├── change-password/ # Password change
│   │   │   ├── discord/         # Discord OAuth
│   │   │   ├── facebook/        # Facebook OAuth
│   │   │   ├── forgot-password/ # Password reset
│   │   │   ├── github/          # GitHub OAuth
│   │   │   ├── google/          # Google OAuth
│   │   │   ├── login/           # Login API
│   │   │   ├── logout/          # Logout API
│   │   │   ├── me/              # User info API
│   │   │   ├── profile/         # Profile API
│   │   │   ├── register/        # Registration API
│   │   │   ├── resend-verification/ # Email resend
│   │   │   ├── reset-password/  # Password reset
│   │   │   ├── session/         # Session management
│   │   │   ├── twitter/         # Twitter OAuth
│   │   │   └── verify-email/    # Email verification
│   │   └── botid/               # BotID verification
│   │       └── verify/          # Bot detection API
│   ├── articles/                # Articles system
│   │   ├── [slug]/              # Dynamic article pages
│   │   └── page.tsx             # Articles listing
│   ├── auth/                    # Authentication pages
│   │   ├── forgot-password/     # Password reset request
│   │   ├── login/               # User login
│   │   ├── register/            # User registration
│   │   ├── resend-activation/   # Resend verification
│   │   ├── reset-password/      # Password reset form
│   │   │   └── [token]/         # Token-based reset
│   │   └── verify-email/        # Email verification
│   │       ├── [token]/         # Token-based verification
│   │       └── page.tsx         # Verification page
│   ├── dev/                     # Development tools
│   │   └── email-preview/       # Email template preview
│   ├── documentation/           # Documentation system
│   │   ├── [step-number]/       # Dynamic step pages
│   │   │   └── [step-name]/     # Step content pages
│   │   └── page.tsx             # Documentation overview
│   ├── faq/                     # FAQ page
│   ├── legal/                   # Legal information page
│   ├── mission/                 # Mission page
│   ├── support/                 # Support page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── robots.ts                # Robots.txt generator
│   └── sitemap.ts               # Sitemap generator
├── components/                  # Reusable components
│   ├── auth/                    # Authentication components
│   │   ├── AuthFormContainer.tsx # Auth form wrapper
│   │   ├── CodeTyping.tsx        # Code typing animation
│   │   ├── OAuthButtons.tsx      # OAuth provider buttons
│   │   ├── PasswordConfirmInput.tsx # Password confirmation
│   │   └── PasswordInput.tsx     # Password input field
│   ├── ui/                      # UI components (shadcn/ui)
│   │   ├── alert.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── modal.tsx
│   │   ├── scroll-area.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   └── tooltip.tsx
│   ├── CookieBanner.tsx         # Cookie consent banner
│   ├── CookieManager.tsx         # Cookie management orchestrator
│   ├── CookieSettings.tsx        # Cookie preferences modal
│   ├── CookieToggle.tsx          # Cookie status toggle
│   ├── Copyright.tsx             # Copyright component
│   ├── DocumentationSidebar.tsx  # Documentation navigation
│   ├── ErrorDisplay.tsx          # Error display component
│   ├── FloatingSocialIcons.tsx   # Social media icons
│   ├── Footer.tsx                # Site footer
│   ├── LanguageAttributes.tsx    # Language attributes
│   ├── LazyComponents.tsx        # Lazy loading components
│   ├── Navigation.tsx            # Site navigation
│   ├── OptimizedImage.tsx        # Image optimization
│   ├── QuickStart.tsx            # Quick start component
│   ├── BotId.tsx                 # BotID component
│   ├── BotIdExample.tsx          # BotID usage example
│   ├── ScrollRestoration.tsx     # Scroll position restoration
│   ├── SimpleLanguageSwitcher.tsx # Language switcher
│   ├── SocialShare.tsx           # Social sharing
│   ├── TechnologyShowcase.tsx    # Technology display
│   ├── theme-toggle.tsx          # Dark/light mode toggle
│   └── Toast.tsx                 # Toast notifications
├── contexts/                    # React contexts
│   ├── AuthContext.tsx          # Authentication context
│   ├── CookieContext.tsx        # Cookie consent context
│   ├── LanguageContext.tsx      # Internationalization context
│   └── ToastContext.tsx          # Toast notifications context
├── data/                        # Data files
│   └── articles.json            # Articles content
├── languages/                   # Translation files
│   ├── ar.json                 # Arabic translations
│   ├── en.json                 # English translations
│   ├── es.json                 # Spanish translations
│   ├── fr.json                 # French translations
│   └── jp.json                 # Japanese translations
├── lib/                        # Utility libraries
│   ├── analytics.ts            # Analytics and performance monitoring
│   ├── api-validation.ts       # API request validation
│   ├── api-versioning.ts       # API versioning utilities
│   ├── articles.ts             # Articles management
│   ├── auth/                   # Authentication utilities
│   │   ├── passport.ts         # Passport.js configuration
│   │   ├── password.ts         # Password utilities
│   │   ├── session.ts          # Session management
│   │   └── tokens.ts           # JWT token utilities
│   ├── botid.ts                # BotID utilities
│   ├── config.ts               # Configuration management
│   ├── documentation-steps.ts  # Documentation content
│   ├── email/                  # Email utilities
│   │   ├── mailer.ts           # Email sending
│   │   ├── preview.ts          # Email preview
│   │   └── templates.ts        # Email templates
│   ├── github.ts               # GitHub URL utilities
│   ├── prisma.ts               # Database connection
│   ├── rate-limit.ts           # Rate limiting utilities
│   ├── utils.ts                # General utilities
│   ├── validation/             # Validation schemas
│   │   └── auth.ts             # Authentication validation
│   └── validation.ts           # General validation schemas
├── CHANGELOG.md                # Project changelog
└── i18n.ts                     # Internationalization setup
```

## 🌟 Features

### Core Features

- **Next.js 16.0.0** with App Router and Turbopack
- **TypeScript** with strict type checking
- **Tailwind CSS 4** for styling
- **Framer Motion** for animations
- **shadcn/ui** components
- **Lucide React** icons
- **Prisma ORM** with PostgreSQL and Prisma Accelerate for serverless environments
- **Authentication System** with email/password and OAuth (Google, GitHub, Discord, Facebook, Twitter)
- **Account Management** with profile, settings, and password management pages
- **Email Verification** with JWT tokens and resend functionality
- **Password Reset** with secure token generation and expiry
- **Remember Me** functionality with configurable session expiry
- **Global Toast Notifications** with React Context
- **Articles System** with JSON-based content management and image support
- **Documentation System** with step-by-step guides and changelog
- **Admin Panel Setup** for analytics integration
- **Google Analytics 4** integration with development controls
- **BotID** with advanced bot detection and environment-aware configuration
- **Cookie Consent System** with granular preferences
- **GitHub Integration** with dynamic repository links
- **Performance Optimization Suite** with preconnect hints and critical CSS
- **Bundle Analysis** with Turbopack and webpack support
- **Lazy Loading Components** for improved performance
- **Technology Showcase** with close button and localStorage persistence

### v1.0.0 Features (Production Release)

- **Production-Ready SaaS Boilerplate** - Complete full-stack application with comprehensive features
- **Multi-language Support** - English, Spanish, French, Arabic, Japanese with complete translations
- **Authentication System** - Email/password and OAuth (Google, GitHub, Discord, Facebook, Twitter)
- **Account Management** - Profile, settings, password management with secure session handling
- **Performance Optimization** - Critical path optimization, lazy loading, bundle analysis
- **UI/UX Excellence** - Consistent design system, dark mode support, responsive layouts
- **Security Features** - BotID integration, rate limiting, security headers, input validation
- **Developer Experience** - Comprehensive documentation, error handling, TypeScript support
- **Production Features** - Prisma Accelerate, Vercel optimization, analytics integration
- **Accessibility** - WCAG compliance, ARIA labels, keyboard navigation, screen reader support
- **SEO Optimization** - Meta tags, sitemap, robots.txt, structured data, Open Graph
- **Cookie Management** - GDPR-compliant consent system with granular preferences
- **Articles & Documentation** - Dynamic content management with search and filtering
- **Error Handling** - Comprehensive error pages with internationalization support
- **Reusable Components** - Modular architecture with consistent copyright and UI components
- **Brand Consistency** - Authentic OAuth provider colors and clickable brand links
- **Background Styling** - Unified visual consistency across all pages
- **Database Integration** - Prisma ORM with PostgreSQL and serverless optimization
- **Email System** - Resend API integration for verification, password reset, and notification templates
- **Analytics** - Google Analytics 4, Web Vitals monitoring, performance tracking
- **Bundle Optimization** - Turbopack support, webpack splitting, critical CSS inlining
- **Technology Showcase** - Animated component with close functionality and persistence
- **FAQ System** - Searchable content with categories and dynamic management
- **Changelog System** - Interactive version tracking with animated entries
- **Rate Limiting** - API protection with IP-based blocking and configurable limits
- **PWA Support** - Manifest, service worker, offline functionality, and icon configuration
- **Advanced Features** - RTL support, building patterns, coding conventions, best practices
- **Environment Management** - Flexible database configuration for local and production
- **Proxy Automation** - Automatic route protection for admin and account pages
- **Toast Notifications** - Global notification system with React Context
- **Remember Me** - Configurable session expiry with persistent login options
- **Email Verification** - JWT-based verification with resend functionality
- **Password Reset** - Secure token generation with expiry and validation
- **OAuth Integration** - Multiple providers with proper redirect handling
- **Account Pages** - Header/footer integration for consistent UI/UX
- **Suspense Boundaries** - Proper handling of search params and async components
- **Postinstall Scripts** - Automatic Prisma generation for serverless environments
- **Copyright Component** - Reusable copyright display for authentication pages
- **Clickable Brand Links** - Interactive navigation in authentication subtitles
- **Multi-language Auth** - Updated language files for split subtitle structure
- **Background Unification** - Consistent styling between homepage and auth pages
- **OAuth Dark Mode** - Proper dark mode colors for all OAuth providers
- **Layout Improvements** - Better visual hierarchy with copyright positioning
- **Brand Colors** - Authentic Facebook blue and Twitter sky blue
- **Visual Consistency** - Resolved styling inconsistencies across pages

### Internationalization

- **Multi-language support**: English, Spanish, French, Arabic, Japanese
- **Dynamic language switching**
- **Context-based translation system**
- **Fallback to English** for missing translations

### Performance & Analytics

- **Web Vitals monitoring** (LCP, FID, CLS)
- **Performance tracking** with custom metrics
- **Error tracking** and reporting
- **Resource loading monitoring**
- **Rate limiting** for API endpoints
- **Google Analytics 4** with cookie consent integration
- **Development environment controls** (disabled in dev, enabled in production)
- **Cookie preference management** with localStorage persistence
- **Critical Path Optimization** (reduced latency from 146ms to 80-100ms)
- **Preconnect hints** for external domains
- **DNS prefetch** for improved loading
- **Critical CSS inlining** for above-the-fold content
- **Dynamic imports** for non-critical components
- **Bundle optimization** with Turbopack and webpack splitting

### SEO & Accessibility

- **Meta tags** optimization
- **Open Graph** and Twitter cards
- **Sitemap** generation
- **Robots.txt** configuration
- **ARIA labels** and semantic HTML
- **Dark/light theme** support

### Articles & Documentation

- **JSON-based content management** for articles
- **Dynamic routing** for articles and documentation
- **Search and filtering** capabilities
- **SEO optimization** with meta tags and structured data
- **Step-by-step documentation** system
- **Responsive sidebar** navigation
- **Featured articles** support with image display
- **Related articles** functionality
- **Tag-based categorization**
- **Image support** with responsive layout
- **Mobile-optimized** image display (full-width on mobile)
- **Changelog system** with version history and interactive modal
- **Version tracking** with detailed feature documentation

### Security

- **Content Security Policy** headers
- **Rate limiting** with IP blocking
- **Input validation** with Zod
- **Secure headers** configuration
- **BotID** integration for advanced bot protection
- **Cookie consent system** with GDPR compliance
- **Environment-aware security** (disabled in development)

## 🛠️ Configuration

### Environment Variables

Create a `.env` file with the following variables:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_TITLE="Boiler.click"
NEXT_PUBLIC_SITE_URL="https://boiler.click"
NEXT_PUBLIC_SITE_EMAIL_SUPPORT="hi@boiler.click"
NEXT_PUBLIC_SITE_PHYSICAL_ADDRESS="123 Oak St."

# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# BotID (Bot Detection) - No environment variables needed!
# BotID is automatically enabled when deployed to Vercel

# GitHub Repository
NEXT_PUBLIC_GITHUB_USER="ralphdp"
NEXT_PUBLIC_GITHUB_REPO="boiler"

# Social Media
NEXT_PUBLIC_SOCIAL_GITHUB="https://github.com/your-org"
NEXT_PUBLIC_SOCIAL_X="https://x.com/your-handle"

# Database (for future features)
DATABASE_LOCAL_URL="postgresql://user:password@localhost:5432/dbname"
DATABASE_REMOTE_URL="postgresql://user:password@your-remote-db.com:5432/dbname"
REDIS_LOCAL_URL="redis://localhost:6379"
REDIS_REMOTE_URL="redis://user:password@your-remote-redis.com:6379"

# Authentication (for future features)
JWT_SECRET="your-jwt-secret"
SESSION_SECRET="your-session-secret"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Payment Processing (for future features)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email - Resend
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="example@example.com"
```

> **Important for Hosting Providers**:
>
> When deploying to hosting platforms (Vercel, Netlify, Railway, etc.), you **must** set the `DATABASE_URL` environment variable in your hosting provider's dashboard or configuration.
>
> - **Local Development**: The `scripts/setup-env.js` script automatically sets `DATABASE_URL` from `DATABASE_LOCAL_URL` or `DATABASE_REMOTE_URL`
> - **Production Deployment**: Your hosting provider needs `DATABASE_URL` set to your Prisma Accelerate connection string or direct database URL
> - **Prisma Schema**: The `prisma/schema.prisma` file uses `env("DATABASE_URL")` directly, which is the Prisma standard
> - **Example for Vercel**: Set `DATABASE_URL` to your Prisma Accelerate connection string (e.g., `prisma://accelerate.prisma-data.net/?api_key=...`)
> - **Postinstall**: The `postinstall` script runs `prisma generate --accelerate` to ensure Prisma Client is properly configured

### Database Configuration

The boilerplate uses a flexible database configuration system with Prisma ORM and Prisma Accelerate for serverless-optimized database connections:

- **Development**: Uses `DATABASE_LOCAL_URL` and `REDIS_LOCAL_URL` for local development
- **Production**: Uses `DATABASE_REMOTE_URL` and `REDIS_REMOTE_URL` with Prisma Accelerate for production deployment
- **Prisma Accelerate**: Optimized for serverless environments with connection pooling and query caching
- **Automatic Environment Selection**: Automatically selects the appropriate database connection based on environment
- **Fallback**: If the primary URL is not available, it falls back to the alternative URL

**Prisma Schema Configuration**:

- Uses `DATABASE_URL` environment variable in schema.prisma
- Extended with `@prisma/extension-accelerate` for serverless optimization
- Postinstall script automatically runs `prisma generate --accelerate`

This approach allows you to:

- Develop locally with a local database
- Deploy to production with a remote database via Prisma Accelerate
- Switch between environments without code changes
- Maintain separate database instances for different environments
- Leverage Prisma Accelerate's connection pooling and query caching

## 📄 Pages Overview

### Homepage (`/`)

- Hero section with animated elements
- Technology showcase
- Call-to-action buttons
- Responsive design

### About Page (`/about`)

- Company information
- Technology stack
- Core features overview
- Developer experience highlights

### Articles System (`/articles`)

- **Articles listing** with search and filtering
- **Featured articles** section
- **Tag-based categorization**
- **Dynamic article pages** (`/articles/[slug]`)
- **SEO optimization** with meta tags and structured data
- **Related articles** functionality

### Documentation System (`/documentation`)

- **Step-by-step guides** with dynamic routing
- **Responsive sidebar** navigation
- **Rich content** with code blocks and images
- **Mobile-friendly** collapsible navigation
- **Theme toggle** integration

### Mission Page (`/mission`)

- Company mission statement
- Goals and objectives
- GitHub repository link

### Support Page (`/support`)

- GitHub repository access
- Email support contact
- Dynamic contact information from environment variables

### Legal Page (`/legal`)

- Privacy Policy
- Terms of Service
- Cookie Policy
- Contact Information
- Multi-language support

### FAQ Page (`/faq`)

- Frequently asked questions
- Searchable content
- Responsive design

## 🔧 API Endpoints

### Analytics API

- `POST /api/analytics/web-vitals` - Web Vitals tracking
- `POST /api/analytics/errors` - Error reporting
- `POST /api/analytics/performance` - Performance metrics
- `POST /api/analytics/slow-resources` - Slow resource tracking

### BotID API

- `POST /api/botid/verify` - BotID token verification

All endpoints include:

- Rate limiting (100 requests per 15 minutes)
- Input validation
- Error handling
- Logging

## 🎨 Styling & Theming

### Tailwind CSS Configuration

- **Tailwind CSS 4** with PostCSS
- **Custom color palette**
- **Dark mode** support
- **Responsive design** utilities
- **Animation** utilities

### Component Styling

- **shadcn/ui** component library
- **Consistent design system**
- **Accessible components**
- **Custom variants** and themes

## 🌐 Internationalization

### Language Support

- **English (en)** - Default language
- **Spanish (es)** - Complete translation
- **French (fr)** - Complete translation
- **Arabic (ar)** - Complete translation
- **Japanese (jp)** - Complete translation

### Translation System

- **Context-based** translations
- **Nested key** support (`legal.privacyPolicy.title`)
- **Fallback** to English for missing translations
- **Dynamic language switching**

### Adding New Languages

1. Create new JSON file in `src/languages/`
2. Add language to `LanguageContext.tsx`
3. Update language switcher component

## 📊 Analytics & Performance Monitoring

### Web Vitals

- **Largest Contentful Paint (LCP)**
- **First Input Delay (FID)**
- **Cumulative Layout Shift (CLS)**

### Performance Monitoring

- **Resource loading times**
- **Custom performance metrics**
- **Error tracking**
- **User interaction tracking**

### Analytics Integration

- **Google Analytics 4** with environment controls
- **Custom analytics** endpoints
- **Performance reporting**
- **Error logging**
- **Cookie consent integration** with GDPR compliance
- **Development environment controls** (disabled in dev)

### Cookie Consent System

- **Granular cookie preferences** (necessary, analytics, marketing)
- **GDPR-compliant** consent management
- **localStorage persistence** for user preferences
- **Multi-language support** for all cookie-related text
- **Footer toggle** for easy access to settings
- **Modal-based settings** with fixed header/footer
- **Development-friendly** with clear status indicators

### BotID Integration

- **Environment-aware configuration** (disabled in development)
- **Advanced bot detection** with machine learning algorithms
- **Server-side verification** with API endpoint
- **Development bypass** for testing
- **Invisible protection** - no user interaction required
- **Risk scoring** with low/medium/high levels
- **Error handling** and user feedback
- **Seamless user experience** - no CAPTCHA challenges

## 🔒 Security Features

### Headers

- **Content Security Policy**
- **X-Frame-Options: DENY**
- **X-Content-Type-Options: nosniff**
- **Strict-Transport-Security**
- **Referrer-Policy**

### Rate Limiting

- **API rate limiting** (100 req/15min)
- **Authentication rate limiting** (5 req/15min)
- **Contact form rate limiting** (3 req/hour)
- **IP-based blocking**

## 🚀 Deployment

### Build Process

```bash
# Production build
npm run build

# Analyze bundle size
npm run analyze
npm run analyze:server
npm run analyze:browser
```

### Vercel Deployment (Recommended)

Boiler.click is optimized for Vercel deployment with zero configuration required.

#### Option 1: GitHub Integration (Recommended)

1. **Push to GitHub**

   ```bash
   # Initialize git (if not already done)
   git init

   # Add all files
   git add .

   # Commit changes
   git commit -m "Initial commit"

   # Add remote origin (replace with your GitHub repo)
   git remote add origin https://github.com/your-username/boiler-click.git

   # Push to GitHub
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add all required variables from the `.env` section below

#### Option 2: Vercel CLI

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy**

   ```bash
   # Deploy to preview
   vercel

   # Deploy to production
   vercel --prod
   ```

4. **Configure Environment Variables**

   ```bash
   # Set environment variables
   vercel env add NEXT_PUBLIC_SITE_TITLE
   vercel env add NEXT_PUBLIC_SITE_URL
   # ... add all required variables
   ```

#### Vercel Configuration

Create a `vercel.json` file for advanced configuration:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "regions": ["iad1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=300"
        }
      ]
    }
  ]
}
```

### Environment Variables for Production

Set these in your Vercel dashboard or via CLI:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_TITLE="Boiler.click"
NEXT_PUBLIC_SITE_URL="https://your-domain.vercel.app"
NEXT_PUBLIC_SITE_EMAIL_SUPPORT="hi@boiler.click"
NEXT_PUBLIC_SITE_PHYSICAL_ADDRESS="123 Oak St."
NEXT_PUBLIC_SITE_TELEPHONE="+18885551234"

# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Social Media
NEXT_PUBLIC_SOCIAL_GITHUB="https://github.com/your-org"
NEXT_PUBLIC_SOCIAL_X="https://x.com/your-handle"
NEXT_PUBLIC_SOCIAL_FACEBOOK="https://facebook.com/your-page"
NEXT_PUBLIC_SOCIAL_YOUTUBE="https://youtube.com/your-channel"

# Database Connections
# NEON DB URL: postgresql://neondb_owner:npg_Q5RCyUKdOe1Y@ep-billowing-thunder-ahqc7lvp-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
DATABASE_LOCAL_URL=""
DATABASE_REMOTE_URL=""
# Redis - redis://localhost:6379
REDIS_LOCAL_URL=""
REDIS_REMOTE_URL=""

# Authentication (for future features)
JWT_SECRET="your-jwt-secret"
SESSION_SECRET="your-session-secret"

# OAuth Providers (for future features)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Payment Processing (for future features)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email - Resend
RESEND_API_KEY=re_K4B2CTFi_5fPNpoacccquPGBmXpZVAbba
RESEND_FROM_EMAIL=no-reply@boiler.click
```

### Other Deployment Platforms

- **Netlify**: Compatible with Next.js static export
- **AWS**: Use AWS Amplify or custom server setup
- **Docker**: Use the included Dockerfile for containerized deployment

## 📊 Admin Panel Setup

### Analytics & Advertising Integration

Boiler.click includes comprehensive setup guides for analytics and advertising platforms:

- **Google Analytics 4** integration
- **Google Ads API** connection
- **Bing Ads API** (Microsoft Advertising) integration
- **Performance monitoring** setup
- **Custom dashboard** creation

### Setup Guide

See `ADMIN_PANEL_SETUP.md` for detailed instructions on:

1. **Google Analytics Setup**
   - GA4 property creation
   - API key generation
   - Event tracking configuration

2. **Google Ads Integration**
   - API credentials setup
   - Campaign data retrieval
   - Performance metrics

3. **Bing Ads Integration**
   - Microsoft Advertising API setup
   - Campaign management
   - Cross-platform analytics

4. **Environment Configuration**
   - Required API keys
   - Security best practices
   - Rate limiting setup

## 🧪 Development

### Scripts

#### Development

- `npm run dev` - Start development server with Turbopack
- `npm run dev:webpack` - Start development server with webpack
- `npm run build` - Build for production
- `npm run start` - Start production server

#### Code Quality & Analysis

- `npm run lint` - Run ESLint
- `npm run analyze` - Analyze bundle size (browser)
- `npm run analyze:server` - Analyze server bundle size
- `npm run analyze:browser` - Analyze browser bundle size

#### Configuration & Testing

- `npm run setup:env` - Setup environment variables from .env file
- `npm run oauth:uris` - Generate OAuth callback URIs
- `npm run test:oauth` - Test OAuth configuration
- `npm run test:session` - Test session configuration
- `npm run test:complete` - Run complete OAuth test suite

#### Post-install

- `npm run postinstall` - Automatically runs `prisma generate --accelerate` on npm install

### Code Quality

- **ESLint** configuration
- **TypeScript** strict mode
- **Prettier** formatting
- **Husky** git hooks (optional)

## 📈 Performance

### Optimizations

- **Image optimization** with Next.js
- **Code splitting** and lazy loading
- **Bundle analysis** tools with Turbopack and webpack support
- **Performance monitoring** with Web Vitals
- **Critical path optimization** (146ms → 80-100ms)
- **Preconnect hints** for external domains
- **DNS prefetch** for improved loading
- **Critical CSS inlining** for above-the-fold content
- **Dynamic imports** for non-critical components
- **Bundle splitting** with vendor, common, and style chunks

### Metrics

- **Core Web Vitals** compliance
- **Lighthouse** scores
- **Bundle size** optimization
- **Loading performance**

## 📋 Version History

### v1.0.0 (January 2025) - Production Release

- ✅ **Production-Ready SaaS Boilerplate** - Complete full-stack application with comprehensive features
- ✅ **Multi-language Support** - English, Spanish, French, Arabic, Japanese with complete translations
- ✅ **Authentication System** - Email/password and OAuth (Google, GitHub, Discord, Facebook, Twitter)
- ✅ **Account Management** - Profile, settings, password management with secure session handling
- ✅ **Performance Optimization** - Critical path optimization, lazy loading, bundle analysis
- ✅ **UI/UX Excellence** - Consistent design system, dark mode support, responsive layouts
- ✅ **Security Features** - BotID integration, rate limiting, security headers, input validation
- ✅ **Developer Experience** - Comprehensive documentation, error handling, TypeScript support
- ✅ **Production Features** - Prisma Accelerate, Vercel optimization, analytics integration
- ✅ **Accessibility** - WCAG compliance, ARIA labels, keyboard navigation, screen reader support
- ✅ **SEO Optimization** - Meta tags, sitemap, robots.txt, structured data, Open Graph
- ✅ **Cookie Management** - GDPR-compliant consent system with granular preferences
- ✅ **Articles & Documentation** - Dynamic content management with search and filtering
- ✅ **Error Handling** - Comprehensive error pages with internationalization support
- ✅ **Reusable Components** - Modular architecture with consistent copyright and UI components
- ✅ **Brand Consistency** - Authentic OAuth provider colors and clickable brand links
- ✅ **Background Styling** - Unified visual consistency across all pages
- ✅ **Database Integration** - Prisma ORM with PostgreSQL and serverless optimization
- ✅ **Email System** - Resend API integration for verification, password reset, and notification templates
- ✅ **Analytics** - Google Analytics 4, Web Vitals monitoring, performance tracking
- ✅ **Bundle Optimization** - Turbopack support, webpack splitting, critical CSS inlining
- ✅ **Technology Showcase** - Animated component with close functionality and persistence
- ✅ **FAQ System** - Searchable content with categories and dynamic management
- ✅ **Changelog System** - Interactive version tracking with animated entries
- ✅ **Rate Limiting** - API protection with IP-based blocking and configurable limits
- ✅ **PWA Support** - Manifest, service worker, offline functionality, and icon configuration
- ✅ **Advanced Features** - RTL support, building patterns, coding conventions, best practices
- ✅ **Environment Management** - Flexible database configuration for local and production
- ✅ **Proxy Automation** - Automatic route protection for admin and account pages
- ✅ **Toast Notifications** - Global notification system with React Context
- ✅ **Remember Me** - Configurable session expiry with persistent login options
- ✅ **Email Verification** - JWT-based verification with resend functionality
- ✅ **Password Reset** - Secure token generation with expiry and validation
- ✅ **OAuth Integration** - Multiple providers with proper redirect handling
- ✅ **Account Pages** - Header/footer integration for consistent UI/UX
- ✅ **Suspense Boundaries** - Proper handling of search params and async components
- ✅ **Postinstall Scripts** - Automatic Prisma generation for serverless environments
- ✅ **Copyright Component** - Reusable copyright display for authentication pages
- ✅ **Clickable Brand Links** - Interactive navigation in authentication subtitles
- ✅ **Multi-language Auth** - Updated language files for split subtitle structure
- ✅ **Background Unification** - Consistent styling between homepage and auth pages
- ✅ **OAuth Dark Mode** - Proper dark mode colors for all OAuth providers
- ✅ **Layout Improvements** - Better visual hierarchy with copyright positioning
- ✅ **Brand Colors** - Authentic Facebook blue and Twitter sky blue
- ✅ **Visual Consistency** - Resolved styling inconsistencies across pages
- ✅ **Comprehensive Testing** - Production-ready with extensive error handling
- ✅ **Documentation** - Step-by-step guides, API documentation, component examples
- ✅ **Performance** - Optimized loading, caching, and resource management
- ✅ **Security** - Advanced bot detection, input validation, secure headers
- ✅ **Accessibility** - Full WCAG 2.1 AA compliance with proper ARIA support
- ✅ **Internationalization** - Complete multi-language support with fallbacks
- ✅ **Production Deployment** - Vercel-optimized with zero configuration required
- ✅ **Developer Tools** - Bundle analysis, performance monitoring, error tracking
- ✅ **User Experience** - Intuitive navigation, responsive design, consistent theming
- ✅ **Code Quality** - TypeScript strict mode, ESLint, Prettier, comprehensive testing
- ✅ **Scalability** - Modular architecture, reusable components, flexible configuration
- ✅ **Maintainability** - Clear documentation, consistent patterns, comprehensive changelog
- ✅ **Future-Ready** - Extensible architecture for additional features and integrations

## 🔮 Future Enhancements

### Planned Features

- **Payment processing** with Stripe
- **Admin dashboard**
- **User management**
- **API documentation**

### Roadmap

- [x] Account management system (v1.0.0)
- [x] Account pages integration (v1.0.0)
- [x] Accessibility compliance (v1.0.0)
- [x] Advanced features documentation (v1.0.0)
- [x] Analytics error handling (v1.0.0)
- [x] Articles system enhancement (v1.0.0)
- [x] Authentication implementation (v1.0.0)
- [x] Background styling unification (v1.0.0)
- [x] Background unification (v1.0.0)
- [x] Brand color consistency (v1.0.0)
- [x] Bundle analysis and optimization (v1.0.0)
- [x] Changelog system (v1.0.0)
- [x] Clickable brand links (v1.0.0)
- [x] Cookie management system (v1.0.0)
- [x] Copyright component (v1.0.0)
- [x] Critical path optimization (v1.0.0)
- [x] Database schema design (v1.0.0)
- [x] Documentation system (v1.0.0)
- [x] Email system setup (v1.0.0)
- [x] Email verification (v1.0.0)
- [x] Environment management (v1.0.0)
- [x] Error handling system (v1.0.0)
- [x] FAQ system (v1.0.0)
- [x] Lazy loading components (v1.0.0)
- [x] Layout improvements (v1.0.0)
- [x] Multi-language auth support (v1.0.0)
- [x] Multi-language authentication support (v1.0.0)
- [x] OAuth button styling enhancements (v1.0.0)
- [x] OAuth dark mode (v1.0.0)
- [x] OAuth integration (v1.0.0)
- [x] Password reset system (v1.0.0)
- [x] Performance optimization suite (v1.0.0)
- [x] Postinstall scripts (v1.0.0)
- [x] Proxy automation (v1.0.0)
- [x] PWA configuration (v1.0.0)
- [x] Rate limiting implementation (v1.0.0)
- [x] Remember me functionality (v1.0.0)
- [x] Reusable component architecture (v1.0.0)
- [x] SEO optimization (v1.0.0)
- [x] Security features implementation (v1.0.0)
- [x] Suspense boundaries (v1.0.0)
- [x] Technology showcase improvements (v1.0.0)
- [x] Toast notifications (v1.0.0)
- [x] UI/UX improvements and visual consistency (v1.0.0)
- [x] Visual consistency (v1.0.0)
- [ ] Admin panel development
- [ ] API documentation
- [ ] CI/CD pipeline
- [ ] Payment integration
- [ ] Testing suite

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

- **GitHub Issues**: [Create an issue](https://github.com/your-org/boiler-click/issues)
- **Email**: [hi@boiler.click](mailto:hi@boiler.click)
- **Documentation**: [https://boiler.click/documentation](https://boiler.click/documenation)

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Passport.js** for making auth simple
- **Prisma** for the database configuration
- **Vercel** for hosting and deployment
- **Tailwind CSS** for the utility-first CSS framework
- **shadcn/ui** for the component library
- **Framer Motion** for animations
- **Lucide** for the icon library

---

## Built with ❤️ by the Boiler.click team
