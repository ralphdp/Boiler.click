# OAuth Provider Setup

Complete guide for setting up OAuth providers with Boiler.click.

## 🔐 Supported OAuth Providers

Boiler.click supports the following OAuth providers:

- **Google** - Google Cloud Console
- **GitHub** - GitHub Developer Settings
- **Discord** - Discord Developer Portal
- **Facebook** - Facebook Developers
- **Twitter** - Twitter Developer Portal

## 🔧 Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API

### Step 2: Create OAuth Credentials

1. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
2. Select "Web application"
3. Add these redirect URIs:
   - **Development**: `http://localhost:3000/api/auth/google/callback`
   - **Production**: `https://your-domain.com/api/auth/google/callback`

### Step 3: Configure Environment Variables

```bash
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 🐙 GitHub OAuth Setup

### Step 1: Create GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: Your app name
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**: `https://your-domain.com/api/auth/github/callback`

### Step 2: Configure Environment Variables

```bash
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## 🎮 Discord OAuth Setup

### Step 1: Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Fill in the application details

### Step 2: Configure OAuth2

1. Go to OAuth2 → General
2. Add redirect URIs:
   - **Development**: `http://localhost:3000/api/auth/discord/callback`
   - **Production**: `https://your-domain.com/api/auth/discord/callback`

### Step 3: Configure Environment Variables

```bash
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
```

## 📘 Facebook OAuth Setup

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App"
3. Select "Consumer" or "Business" app type

### Step 2: Add Facebook Login

1. Add Facebook Login product
2. Go to Facebook Login → Settings
3. Set Valid OAuth Redirect URIs:
   - **Development**: `http://localhost:3000/api/auth/facebook/callback`
   - **Production**: `https://your-domain.com/api/auth/facebook/callback`

### Step 3: Configure Environment Variables

```bash
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"
```

## 🐦 Twitter OAuth Setup

### Step 1: Create Twitter App

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Fill in the application details

### Step 2: Configure OAuth Settings

1. Go to App Settings → Authentication settings
2. Set Callback URL:
   - **Development**: `http://localhost:3000/api/auth/twitter/callback`
   - **Production**: `https://your-domain.com/api/auth/twitter/callback`

### Step 3: Configure Environment Variables

```bash
TWITTER_CLIENT_ID="your-twitter-client-id"
TWITTER_CLIENT_SECRET="your-twitter-client-secret"
```

## 🔧 Environment Configuration

### Complete OAuth Environment Variables

Add these to your `.env` file:

```bash
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
```

## 🧪 Testing OAuth Configuration

### Test Commands

```bash
# Test OAuth configuration
npm run test:oauth

# Test session configuration
npm run test:session

# Run complete OAuth test suite
npm run test:complete

# Generate OAuth callback URIs
npm run oauth:uris
```

### Manual Testing

1. **Start development server**: `npm run dev`
2. **Visit login page**: `http://localhost:3000/auth/login`
3. **Test each OAuth provider**
4. **Verify callback handling**
5. **Check user data retrieval**

## 🔄 OAuth Flow

### 1. User Authentication

```typescript
// User clicks OAuth button
<OAuthButtons />

// Redirects to provider
/api/auth/google

// Provider handles authentication
// Redirects back to callback
/api/auth/google/callback
```

### 2. Callback Handling

```typescript
// Callback route handles:
// 1. Exchange code for access token
// 2. Fetch user profile
// 3. Create or update user account
// 4. Create session
// 5. Redirect to dashboard
```

### 3. Session Management

```typescript
// Session is created with:
// - User ID
// - Provider information
// - Access/refresh tokens
// - Expiry time
```

## 🛡️ Security Considerations

### OAuth Security

1. **Use HTTPS** in production
2. **Validate state parameter** to prevent CSRF
3. **Store tokens securely**
4. **Implement proper session management**
5. **Use secure cookies**

### Environment Security

1. **Never commit secrets** to version control
2. **Use environment-specific apps** (dev/prod)
3. **Rotate secrets regularly**
4. **Use strong, unique secrets**

## 🐛 Troubleshooting

### Common Issues

#### Redirect URI Mismatch

**Error**: `redirect_uri_mismatch`

**Solution**:

- Ensure redirect URIs in OAuth provider settings match exactly
- Check that `NEXT_PUBLIC_DEVELOPMENT_SITE_URL` is set correctly
- Verify the domain in production matches your OAuth app settings

#### Invalid Client ID/Secret

**Error**: `invalid_client`

**Solution**:

- Verify client ID and secret are correct
- Check that the OAuth app is properly configured
- Ensure environment variables are set correctly

#### Access Denied

**Error**: `access_denied`

**Solution**:

- Check OAuth app permissions
- Verify user consent flow
- Ensure app is not in development mode (for Facebook)

### Debug Commands

```bash
# Check OAuth configuration
npm run test:oauth

# Generate callback URIs
npm run oauth:uris

# Test complete OAuth flow
npm run test:complete
```

## 📚 OAuth Provider Documentation

### Official Documentation

- **[Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)**
- **[GitHub OAuth](https://docs.github.com/en/developers/apps/building-oauth-apps)**
- **[Discord OAuth2](https://discord.com/developers/docs/topics/oauth2)**
- **[Facebook Login](https://developers.facebook.com/docs/facebook-login/)**
- **[Twitter OAuth 2.0](https://developer.twitter.com/en/docs/authentication/oauth-2-0)**

### Scopes and Permissions

Each provider has different scopes available:

- **Google**: `profile`, `email`, `openid`
- **GitHub**: `user:email`, `read:user`
- **Discord**: `identify`, `email`
- **Facebook**: `email`, `public_profile`
- **Twitter**: `tweet.read`, `users.read`

## 🔄 Migration and Updates

### Updating OAuth Apps

1. **Update redirect URIs** when changing domains
2. **Rotate secrets** regularly
3. **Update scopes** as needed
4. **Test thoroughly** after changes

### Adding New Providers

1. **Create OAuth app** with provider
2. **Add environment variables**
3. **Update OAuth buttons component**
4. **Add callback route**
5. **Test integration**

## 📞 Support

If you encounter issues with OAuth setup:

- **GitHub Issues**: [Create an issue](https://github.com/ralphdp/boiler-click/issues)
- **Email**: [hi@boiler.click](mailto:hi@boiler.click)
- **OAuth Provider Support**: Check official documentation links above
