# Environment Configuration

Complete guide for configuring environment variables and settings for Boiler.click.

## 📋 Environment Variables Overview

Boiler.click uses a flexible environment configuration system that automatically selects the appropriate settings based on your environment (development vs production).

## 🔧 Development Environment (.env)

Create a `.env` file in your project root with the following variables:

```bash
# Port Configuration
NEXT_PUBLIC_PORT_FRONTEND=3000
NEXT_PUBLIC_PORT_BACKEND=5050

# Site URLs
NEXT_PUBLIC_DEVELOPMENT_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_PRODUCTION_SITE_URL="https://boiler.click"

# Site Configuration
NEXT_PUBLIC_SITE_TITLE="Boiler.click"
NEXT_PUBLIC_SITE_URL="https://boiler.click"
NEXT_PUBLIC_SITE_EMAIL_SUPPORT="hi@boiler.click"
NEXT_PUBLIC_SITE_PHYSICAL_ADDRESS="123 Oak St."
NEXT_PUBLIC_SITE_TELEPHONE="+18885551234"

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
NEXT_PUBLIC_SOCIAL_FACEBOOK="https://facebook.com/your-page"
NEXT_PUBLIC_SOCIAL_YOUTUBE="https://youtube.com/your-channel"

# Database Configuration
DATABASE_LOCAL_URL="postgresql://username:password@localhost:5432/boiler_dev"
DATABASE_REMOTE_URL="postgresql://username:password@your-production-db:5432/boiler_prod"

# Authentication Secrets
JWT_SECRET="your-super-secret-jwt-key-here"
SESSION_SECRET="your-super-secret-session-key-here"

# Super Admin Emails (comma-separated)
AUTH_SUPER_ADMIN="admin@boiler.click,superadmin@boiler.click"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"

FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"

TWITTER_CLIENT_ID="your-twitter-client-id"
TWITTER_CLIENT_SECRET="your-twitter-client-secret"

# Payment Processing (for future features)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email - Resend
RESEND_API_KEY="re_your-resend-api-key-here"
RESEND_FROM_EMAIL="hi@boiler.click"
```

## 🗄️ Database Configuration

The boilerplate uses a flexible database configuration system with Prisma ORM and Prisma Accelerate for serverless-optimized database connections:

- **Development**: Uses `DATABASE_LOCAL_URL` for local development
- **Production**: Uses `DATABASE_REMOTE_URL` with Prisma Accelerate for production deployment
- **Prisma Accelerate**: Optimized for serverless environments with connection pooling and query caching
- **Automatic Environment Selection**: Automatically selects the appropriate database connection based on environment
- **Fallback**: If the primary URL is not available, it falls back to the alternative URL

### Prisma Schema Configuration

- Uses `DATABASE_URL` environment variable in schema.prisma
- Extended with `@prisma/extension-accelerate` for serverless optimization
- Postinstall script automatically runs `prisma generate --accelerate`

> **Important for Hosting Providers**:
>
> When deploying to hosting platforms (Vercel, Netlify, Railway, etc.), you **must** set the `DATABASE_URL` environment variable in your hosting provider's dashboard or configuration.
>
> - **Local Development**: The `scripts/setup-env.js` script automatically sets `DATABASE_URL` from `DATABASE_LOCAL_URL` or `DATABASE_REMOTE_URL`
> - **Production Deployment**: Your hosting provider needs `DATABASE_URL` set to your Prisma Accelerate connection string or direct database URL
> - **Prisma Schema**: The `prisma/schema.prisma` file uses `env("DATABASE_URL")` directly, which is the Prisma standard
> - **Example for Vercel**: Set `DATABASE_URL` to your Prisma Accelerate connection string (e.g., `prisma://accelerate.prisma-data.net/?api_key=...`)
> - **Postinstall**: The `postinstall` script runs `prisma generate --accelerate` to ensure Prisma Client is properly configured

## 🚀 Prisma Accelerate Setup (Recommended for Production)

For production deployments, especially on Vercel, Prisma Accelerate provides:

- **Connection Pooling**: Optimized for serverless environments
- **Query Caching**: Improved performance with intelligent caching
- **Global Edge Network**: Reduced latency worldwide
- **Zero Configuration**: Works seamlessly with Vercel deployments

### Setting up Prisma Accelerate:

1. **Sign up** at [Prisma Accelerate](https://www.prisma.io/accelerate)
2. **Create a new project** and connect your database
3. **Get your connection string** (starts with `prisma://accelerate.prisma-data.net/`)
4. **Set `DATABASE_REMOTE_URL`** to your Prisma Accelerate connection string
5. **Deploy to Vercel** - Accelerate works automatically with zero configuration

### Environment Configuration:

```bash
# Development (local PostgreSQL)
DATABASE_LOCAL_URL="postgresql://postgres@localhost:5432/boiler_dev"

# Production (Prisma Accelerate)
DATABASE_REMOTE_URL="prisma://accelerate.prisma-data.net/?api_key=your_api_key"

# The setup script automatically selects the appropriate URL
npm run setup:env
```

### Benefits of Prisma Accelerate:

- **Serverless Optimized**: Perfect for Vercel, Netlify, and other serverless platforms
- **Connection Pooling**: Handles concurrent connections efficiently
- **Query Caching**: Reduces database load and improves response times
- **Global Edge**: Deployments closer to your users
- **Monitoring**: Built-in query performance insights

## 🔐 Security Notes

1. **Never commit `.env` files** to version control
2. **Use strong, unique secrets** for JWT_SECRET and SESSION_SECRET
3. **Rotate secrets regularly** in production
4. **Use environment-specific OAuth apps** (separate dev/prod)
5. **Enable HTTPS** in production
6. **Use secure session cookies** (httpOnly, secure, sameSite)

## 🔧 Setup Script

The project includes a `scripts/setup-env.js` script that:

- Automatically sets `DATABASE_URL` based on environment
- Selects local or remote database URL
- Provides helpful error messages
- Works seamlessly with Vercel deployment

### Usage:

```bash
# Run the setup script
npm run setup:env
```

### What it does:

1. **Loads environment variables** from `.env` file
2. **Determines environment** (development vs production)
3. **Selects appropriate database URL** (local vs remote)
4. **Sets DATABASE_URL** for Prisma to use
5. **Provides feedback** on configuration status

## 🐛 Troubleshooting

### Common Environment Issues

#### Database Connection Issues

- Check database URL format
- Ensure database server is running
- Verify credentials and permissions
- Check if `DATABASE_URL` is set correctly

#### OAuth Configuration Issues

- Verify OAuth client IDs and secrets
- Check redirect URIs match exactly
- Ensure environment variables are set correctly

#### Email Configuration Issues

- Verify Resend API key is correct
- Check domain verification in Resend dashboard
- Ensure `RESEND_FROM_EMAIL` is set correctly

### Environment Variable Validation

The project includes validation to ensure required environment variables are set:

```bash
# Check if environment is properly configured
npm run setup:env
```

## 📚 Related Documentation

- **[Setup Guide](SETUP.md)** - Complete setup instructions
- **[OAuth Setup](OAUTH.md)** - OAuth provider configuration
- **[Email Setup](EMAIL.md)** - Email service configuration
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment
