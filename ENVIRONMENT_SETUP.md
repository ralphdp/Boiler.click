# Environment Configuration Guide

## Required Environment Variables

### Development Environment (.env.local)

```bash
# Port Configuration
NEXT_PUBLIC_PORT_FRONTEND=3000
NEXT_PUBLIC_PORT_BACKEND=5050

# Site URLs
NEXT_PUBLIC_DEVELOPMENT_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_PRODUCTION_SITE_URL="https://boiler.click"

# Database Configuration
DATABASE_LOCAL_URL="postgresql://username:password@localhost:5432/boiler_dev"
DATABASE_REMOTE_URL="postgresql://username:password@your-production-db:5432/boiler_prod"

# Redis Configuration
REDIS_LOCAL_URL="redis://localhost:6379"
REDIS_REMOTE_URL="redis://your-production-redis:6379"

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

# Email Configuration (Resend)
RESEND_API_KEY="re_your-resend-api-key-here"
RESEND_FROM_EMAIL="hi@boiler.click"

# Site Branding (Optional)
NEXT_PUBLIC_SITE_TITLE="Boiler.click"
NEXT_PUBLIC_SITE_EMAIL_SUPPORT="hi@boiler.click"
NEXT_PUBLIC_SITE_PHYSICAL_ADDRESS="123 Oak St."
NEXT_PUBLIC_SITE_TELEPHONE="+18885551234"

# Social Media Links (Optional)
NEXT_PUBLIC_SOCIAL_GITHUB="https://github.com/your-org/boiler-click"
NEXT_PUBLIC_SOCIAL_X="https://x.com/your-handle"
NEXT_PUBLIC_SOCIAL_FACEBOOK="https://facebook.com/your-page"
NEXT_PUBLIC_SOCIAL_YOUTUBE="https://youtube.com/your-channel"
```

## OAuth Provider Setup

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Add these redirect URIs:
   - **Development**: `http://localhost:3000/api/auth/google/callback`
   - **Production**: `https://boiler.click/api/auth/google/callback`

### GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL:
   - **Development**: `http://localhost:3000/api/auth/github/callback`
   - **Production**: `https://boiler.click/api/auth/github/callback`

### Discord OAuth Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 → General
4. Add redirect URIs:
   - **Development**: `http://localhost:3000/api/auth/discord/callback`
   - **Production**: `https://boiler.click/api/auth/discord/callback`

### Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Set Valid OAuth Redirect URIs:
   - **Development**: `http://localhost:3000/api/auth/facebook/callback`
   - **Production**: `https://boiler.click/api/auth/facebook/callback`

### Twitter OAuth Setup

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Set Callback URL:
   - **Development**: `http://localhost:3000/api/auth/twitter/callback`
   - **Production**: `https://boiler.click/api/auth/twitter/callback`

## Email Setup (Resend)

### Resend Account Setup

1. Sign up for a Resend account at [resend.com](https://resend.com)
2. Verify your domain `boiler.click` in the Resend dashboard
3. Add the required DNS records in Vercel:
   - CNAME: `resend.boiler.click` → `resend.net`
   - TXT: `v=spf1 include:resend.net ~all`
4. Get your API key from the Resend dashboard
5. Set `RESEND_API_KEY` in your environment variables

### Email Configuration

- **From Email**: Set `RESEND_FROM_EMAIL` to `hi@boiler.click`
- **API Key**: Use your Resend API key in `RESEND_API_KEY`
- **Domain**: Ensure `boiler.click` is verified in Resend

## Database Setup

### PostgreSQL Setup

```bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt install postgresql  # Ubuntu

# Create database
createdb boiler_dev
createdb boiler_prod

# Run migrations
npx prisma migrate dev
```

### Redis Setup

```bash
# Install Redis
brew install redis  # macOS
sudo apt install redis-server  # Ubuntu

# Start Redis
redis-server
```

## Development vs Production

### Development

- Uses `NEXT_PUBLIC_DEVELOPMENT_SITE_URL`
- Connects to local database and Redis
- OAuth redirects to `localhost:3000`

### Production

- Uses `NEXT_PUBLIC_PRODUCTION_SITE_URL`
- Connects to remote database and Redis
- OAuth redirects to production domain

## Security Notes

1. **Never commit `.env` files** to version control
2. **Use strong, unique secrets** for JWT_SECRET and SESSION_SECRET
3. **Rotate secrets regularly** in production
4. **Use environment-specific OAuth apps** (separate dev/prod)
5. **Enable HTTPS** in production
6. **Use secure session cookies** (httpOnly, secure, sameSite)

## Troubleshooting

### OAuth Redirect URI Mismatch

- Ensure redirect URIs in OAuth provider settings match exactly
- Check that `NEXT_PUBLIC_DEVELOPMENT_SITE_URL` is set correctly
- Verify the domain in production matches your OAuth app settings

### Database Connection Issues

- Check database URL format
- Ensure database server is running
- Verify credentials and permissions

### Email Sending Issues

- Verify Resend API key is correct
- Check domain verification in Resend dashboard
- Ensure DNS records are properly configured
- Verify `RESEND_FROM_EMAIL` is set correctly
