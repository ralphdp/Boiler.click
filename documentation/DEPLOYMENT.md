# Deployment Guide

Complete deployment guide for Boiler.click to various hosting platforms.

## 🚀 Vercel Deployment (Recommended)

Boiler.click is optimized for Vercel deployment with zero configuration required.

### Option 1: GitHub Integration (Recommended)

#### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Add remote origin (replace with your GitHub repo)
git remote add origin https://github.com/ralphdp/boiler-click.git

# Create and push main branch
git branch -M main
git push -u origin main

# Create and push staging branch
git checkout -b staging
git push -u origin staging

# Switch back to main for development
git checkout main
```

#### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings

#### Step 3: Configure Environment Variables

In Vercel dashboard, go to Project Settings → Environment Variables and add:

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
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=your_api_key"

# Authentication
JWT_SECRET="your-jwt-secret"
SESSION_SECRET="your-session-secret"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Email - Resend
RESEND_API_KEY="re_your-resend-api-key"
RESEND_FROM_EMAIL="hi@boiler.click"
```

### Option 2: Vercel CLI

#### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Step 4: Configure Environment Variables

```bash
# Set environment variables
vercel env add NEXT_PUBLIC_SITE_TITLE
vercel env add NEXT_PUBLIC_SITE_URL
# ... add all required variables
```

### Vercel Configuration

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

## 🔄 Staging Environment Workflow

For ongoing development with staging environment:

```bash
# Make changes and commit to staging
git add -A
git commit -m "Your commit message"
git push origin staging

# Deploy staging changes to main
sleep 2
git checkout main
git merge staging --no-edit
git push origin main
git checkout staging
```

### One-liner Workflow

For quick staging-to-production deployment:

```bash
git add -A && git commit -m "Your commit message" && git push origin staging && sleep 2 && git checkout main && git merge staging --no-edit && git push origin main && git checkout staging
```

### Branch Strategy

- **`main`**: Production-ready code
- **`staging`**: Testing and staging environment
- **Feature branches**: Optional, can be created from `staging`

## 🌐 Other Deployment Platforms

### Netlify

Boiler.click is compatible with Netlify deployment:

1. **Connect GitHub repository** to Netlify
2. **Set build command**: `npm run build`
3. **Set publish directory**: `.next`
4. **Configure environment variables** in Netlify dashboard
5. **Deploy**

### AWS Amplify

For AWS deployment:

1. **Connect GitHub repository** to AWS Amplify
2. **Configure build settings**:
   - Build command: `npm run build`
   - Base directory: `/`
3. **Set environment variables**
4. **Deploy**

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t boiler-click .
docker run -p 3000:3000 boiler-click
```

## 🔧 Environment Variables for Production

### Required Variables

Set these in your hosting provider's dashboard:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_TITLE="Boiler.click"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
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
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=your_api_key"

# Authentication
JWT_SECRET="your-jwt-secret"
SESSION_SECRET="your-session-secret"

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
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email - Resend
RESEND_API_KEY="re_your-resend-api-key"
RESEND_FROM_EMAIL="hi@boiler.click"
```

## 🚀 Build Process

### Production Build

```bash
# Production build
npm run build

# Analyze bundle size
npm run analyze
npm run analyze:server
npm run analyze:browser
```

### Build Optimization

The project includes several build optimizations:

- **Turbopack support** for faster builds
- **Bundle analysis** tools
- **Code splitting** and lazy loading
- **Image optimization** with Next.js
- **Critical CSS inlining**

## 🔍 Monitoring & Analytics

### Built-in Analytics

- **Google Analytics 4** integration
- **Vercel Analytics** (automatic with Vercel)
- **Web Vitals monitoring**
- **Performance tracking**

### Custom Monitoring

Add custom monitoring by:

1. **Setting up error tracking** (Sentry, LogRocket)
2. **Configuring uptime monitoring** (UptimeRobot, Pingdom)
3. **Setting up log aggregation** (LogDNA, Papertrail)

## 🐛 Troubleshooting Deployment

### Common Issues

#### Build Failures

- Check Node.js version compatibility
- Verify all environment variables are set
- Check for TypeScript errors
- Ensure all dependencies are installed

#### Database Connection Issues

- Verify `DATABASE_URL` is set correctly
- Check Prisma Accelerate connection string
- Ensure database is accessible from hosting platform

#### OAuth Issues

- Verify redirect URIs match production domain
- Check OAuth app settings in provider dashboards
- Ensure environment variables are set correctly

### Debug Commands

```bash
# Check build locally
npm run build

# Test production build
npm run start

# Check environment variables
npm run setup:env
```

## 📚 Related Documentation

- **[Setup Guide](SETUP.md)** - Initial setup and configuration
- **[Environment Configuration](ENVIRONMENT.md)** - Environment variables
- **[Development Guide](DEVELOPMENT.md)** - Development workflow
- **[API Documentation](API.md)** - API endpoints and usage
