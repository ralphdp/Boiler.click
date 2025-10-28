# Setup Guide

Complete setup guide for Boiler.click - a production-ready Next.js boilerplate.

## 📋 Prerequisites

Before setting up Boiler.click, ensure you have:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **PostgreSQL** - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/downloads)

## 🔑 Required Accounts & API Credentials

You'll need to create accounts and obtain API credentials from the following services:

### 🗄️ Database Services

- **[PostgreSQL](https://www.postgresql.org/)** - Primary database (local installation or cloud service)
- **[Neon](https://neon.tech/)** - Serverless PostgreSQL (recommended for production)
- **[Prisma Accelerate](https://www.prisma.io/accelerate)** - Database connection pooling and caching

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
- [ ] Google OAuth credentials
- [ ] GitHub OAuth app
- [ ] Resend API key
- [ ] Stripe account (for payments)
- [ ] Vercel account (for deployment)
- [ ] GitHub repository

## 🚀 Installation

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/ralphdp/boiler-click.git
cd boiler-click

# Install dependencies
npm install
```

### Step 2: Environment Configuration

```bash
# Copy environment variables
cp .env.example .env

# Setup environment variables
npm run setup:env
```

For detailed environment configuration, see [Environment Configuration](ENVIRONMENT.md).

### Step 3: Database Setup

```bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt install postgresql  # Ubuntu

# Start PostgreSQL service
brew services start postgresql  # macOS
sudo systemctl start postgresql  # Ubuntu

# Set up environment variables in .env file
DATABASE_LOCAL_URL="postgresql://postgres@localhost:5432/boiler_dev"
DATABASE_REMOTE_URL="prisma://accelerate.prisma-data.net/?api_key=bkie..."

# Run the setup script to configure DATABASE_URL
npm run setup:env

# Run Prisma migrations (this will create database and tables automatically)
npx prisma migrate dev
```

### Step 4: OAuth Provider Setup

For detailed OAuth setup instructions, see [OAuth Provider Setup](OAUTH.md).

### Step 5: Email Setup

For detailed email configuration, see [Email Setup](EMAIL.md).

### Step 6: Start Development Server

```bash
# Start development server
npm run dev
```

Your application will be available at `http://localhost:3000`.

## 🔧 Development Scripts

### Development

- `npm run dev` - Start development server with Turbopack
- `npm run dev:webpack` - Start development server with webpack
- `npm run build` - Build for production
- `npm run start` - Start production server

### Code Quality & Analysis

- `npm run lint` - Run ESLint
- `npm run analyze` - Analyze bundle size (browser)
- `npm run analyze:server` - Analyze server bundle size
- `npm run analyze:browser` - Analyze browser bundle size

### Configuration & Testing

- `npm run setup:env` - Setup environment variables from .env file
- `npm run oauth:uris` - Generate OAuth callback URIs
- `npm run test:oauth` - Test OAuth configuration
- `npm run test:session` - Test session configuration
- `npm run test:complete` - Run complete OAuth test suite

### Post-install

- `npm run postinstall` - Automatically runs `prisma generate --accelerate` on npm install

## 🚀 Deployment

For detailed deployment instructions, see [Deployment Guide](DEPLOYMENT.md).

## 🐛 Troubleshooting

### Common Issues

#### OAuth Redirect URI Mismatch

- Ensure redirect URIs in OAuth provider settings match exactly
- Check that `NEXT_PUBLIC_DEVELOPMENT_SITE_URL` is set correctly
- Verify the domain in production matches your OAuth app settings

#### Database Connection Issues

- Check database URL format
- Ensure database server is running
- Verify credentials and permissions

#### Email Sending Issues

- Verify Resend API key is correct
- Check domain verification in Resend dashboard
- Ensure DNS records are properly configured
- Verify `RESEND_FROM_EMAIL` is set correctly

## 📚 Next Steps

After completing the setup:

1. **Configure OAuth Providers** - See [OAuth Provider Setup](OAUTH.md)
2. **Set up Email Service** - See [Email Setup](EMAIL.md)
3. **Deploy to Production** - See [Deployment Guide](DEPLOYMENT.md)
4. **Start Development** - See [Development Guide](DEVELOPMENT.md)

## 📞 Support

If you encounter any issues during setup:

- **GitHub Issues**: [Create an issue](https://github.com/ralphdp/boiler-click/issues)
- **Email**: [hi@boiler.click](mailto:hi@boiler.click)
- **Documentation**: Check other guides in the `documentation/` folder
