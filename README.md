# Boiler.click - Production-Ready Next.js Boilerplate

A comprehensive, production-ready Next.js boilerplate for building modern SaaS applications with internationalization, analytics, and performance monitoring.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/ralphdp/boiler-click.git
cd boiler-click

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Setup environment variables
npm run setup:env

# Run Prisma migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## ✨ Key Features

### 🚀 **Framework & Technology Stack**

- **Next.js 16.0.0** with App Router and Turbopack
- **TypeScript** with strict type checking
- **Tailwind CSS 4** for styling
- **Framer Motion** for animations
- **shadcn/ui** components
- **Lucide React** icons
- **Prisma ORM** with PostgreSQL and Prisma Accelerate

### 🔐 **Authentication & User Management**

- **Authentication System** with email/password and OAuth (Google, GitHub, Discord, Facebook, Twitter)
- **Account Management** with profile, settings, and password management pages
- **Email Verification** with JWT tokens and resend functionality
- **Password Reset** with secure token generation and expiry
- **Remember Me** functionality with configurable session expiry

### 🎨 **User Interface & Experience**

- **Global Toast Notifications** with React Context
- **Cookie Consent System** with granular preferences
- **Technology Showcase** with close button and localStorage persistence

### 📝 **Content Management**

- **Articles System** with JSON-based content management and image support
- **Documentation System** with step-by-step guides and changelog

### 📊 **Analytics & Monitoring**

- **Google Analytics 4** integration with development controls
- **Admin Panel Setup** for analytics integration
- **BotID** with advanced bot detection and environment-aware configuration

### ⚡ **Performance & Optimization**

- **Performance Optimization Suite** with preconnect hints and critical CSS
- **Bundle Analysis** with Turbopack and webpack support
- **Lazy Loading Components** for improved performance

### 🔗 **Integrations**

- **GitHub Integration** with dynamic repository links

## 🌐 Multi-language Support

- **English (en)** - Default language
- **Spanish (es)** - Complete translation
- **French (fr)** - Complete translation
- **Arabic (ar)** - Complete translation
- **Japanese (jp)** - Complete translation

## 📚 Documentation

- **[Complete Setup Guide](documentation/SETUP.md)** - Detailed installation and configuration
- **[Environment Configuration](documentation/ENVIRONMENT.md)** - Environment variables and settings
- **[Deployment Guide](documentation/DEPLOYMENT.md)** - Deploy to Vercel and other platforms
- **[Development Guide](documentation/DEVELOPMENT.md)** - Development workflow and scripts
- **[API Documentation](documentation/API.md)** - API endpoints and usage
- **[Architecture Overview](documentation/ARCHITECTURE.md)** - Project structure and design decisions
- **[Changelog](documentation/CHANGELOG.md)** - Version history and updates

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.0 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS with custom design system
- **Components**: Shadcn/ui component library
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Passport.js (planned)
- **Animations**: Framer Motion
- **Code Quality**: ESLint + Prettier
- **Deployment**: Vercel-optimized

## 🚀 Deployment

Boiler.click is optimized for Vercel deployment with zero configuration required.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ralphdp/boiler-click)

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL (local or cloud)
- Git

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **GitHub Issues**: [Create an issue](https://github.com/ralphdp/boiler-click/issues)
- **Email**: [hi@boiler.click](mailto:hi@boiler.click)
- **Documentation**: [Complete Setup Guide](documentation/SETUP.md)

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
