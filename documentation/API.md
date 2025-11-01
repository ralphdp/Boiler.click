# API Documentation

Complete API documentation for Boiler™ endpoints.

## 🔗 API Overview

Boiler™ provides a comprehensive REST API for authentication, account management, analytics, and more.

### Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

### Authentication

Most API endpoints require authentication via session cookies or JWT tokens.

## 🔐 Authentication API

### POST /api/auth/login

Authenticate user with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": false
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### POST /api/auth/register

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "telephone": "+1234567890"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### POST /api/auth/logout

Logout the current user.

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET /api/auth/me

Get current user information.

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "emailVerified": true,
    "role": "user"
  }
}
```

### POST /api/auth/forgot-password

Request password reset email.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### POST /api/auth/reset-password

Reset user password with token.

**Request Body:**

```json
{
  "token": "reset_token",
  "password": "new_password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### POST /api/auth/verify-email

Verify user email with token.

**Request Body:**

```json
{
  "token": "verification_token"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### POST /api/auth/resend-verification

Resend email verification.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Verification email sent"
}
```

## 🔑 OAuth API

### GET /api/auth/google

Initiate Google OAuth flow.

**Response:** Redirects to Google OAuth

### GET /api/auth/google/callback

Handle Google OAuth callback.

**Response:** Redirects to dashboard or login page

### GET /api/auth/github

Initiate GitHub OAuth flow.

**Response:** Redirects to GitHub OAuth

### GET /api/auth/github/callback

Handle GitHub OAuth callback.

**Response:** Redirects to dashboard or login page

### GET /api/auth/discord

Initiate Discord OAuth flow.

**Response:** Redirects to Discord OAuth

### GET /api/auth/discord/callback

Handle Discord OAuth callback.

**Response:** Redirects to dashboard or login page

### GET /api/auth/facebook

Initiate Facebook OAuth flow.

**Response:** Redirects to Facebook OAuth

### GET /api/auth/facebook/callback

Handle Facebook OAuth callback.

**Response:** Redirects to dashboard or login page

### GET /api/auth/twitter

Initiate Twitter OAuth flow.

**Response:** Redirects to Twitter OAuth

### GET /api/auth/twitter/callback

Handle Twitter OAuth callback.

**Response:** Redirects to dashboard or login page

## 👤 Account Management API

### GET /api/account/profile

Get user profile information.

**Response:**

```json
{
  "success": true,
  "profile": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "telephone": "+1234567890",
    "emailVerified": true,
    "role": "user"
  }
}
```

### PUT /api/account/profile

Update user profile information.

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "telephone": "+1234567890"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "profile": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "telephone": "+1234567890"
  }
}
```

### POST /api/account/change-password

Change user password.

**Request Body:**

```json
{
  "currentPassword": "old_password123",
  "newPassword": "new_password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## 📊 Analytics API

### POST /api/analytics/web-vitals

Track Web Vitals metrics.

**Request Body:**

```json
{
  "name": "LCP",
  "value": 1200,
  "id": "metric_id",
  "delta": 100
}
```

**Response:**

```json
{
  "success": true,
  "message": "Web Vitals tracked"
}
```

### POST /api/analytics/errors

Track JavaScript errors.

**Request Body:**

```json
{
  "message": "Error message",
  "stack": "Error stack trace",
  "url": "https://example.com/page",
  "line": 42,
  "column": 10
}
```

**Response:**

```json
{
  "success": true,
  "message": "Error tracked"
}
```

### POST /api/analytics/performance

Track performance metrics.

**Request Body:**

```json
{
  "name": "page_load",
  "value": 1500,
  "url": "https://example.com/page"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Performance metric tracked"
}
```

### POST /api/analytics/slow-resources

Track slow resource loading.

**Request Body:**

```json
{
  "url": "https://example.com/image.jpg",
  "duration": 3000,
  "size": 1024000
}
```

**Response:**

```json
{
  "success": true,
  "message": "Slow resource tracked"
}
```

## 🤖 BotID API

### POST /api/botid/verify

Verify BotID token.

**Request Body:**

```json
{
  "token": "botid_token"
}
```

**Response:**

```json
{
  "success": true,
  "verified": true,
  "risk": "low"
}
```

## 🔒 Rate Limiting

All API endpoints include rate limiting:

- **API endpoints**: 100 requests per 15 minutes
- **Authentication endpoints**: 5 requests per 15 minutes
- **Contact form**: 3 requests per hour
- **Newsletter**: 1 request per 24 hours

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
Retry-After: 300
```

### Rate Limit Response

```json
{
  "error": "Too many requests",
  "retryAfter": 300
}
```

## 🛡️ Security

### Authentication

- **Session-based authentication** for web clients
- **JWT tokens** for API clients
- **Secure cookies** with httpOnly, secure, sameSite flags
- **CSRF protection** for state-changing operations

### Input Validation

All API endpoints use Zod schemas for input validation:

```typescript
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional(),
});
```

### Error Handling

Consistent error response format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

## 📝 API Testing

### Test Commands

```bash
# Test OAuth configuration
npm run test:oauth

# Test session configuration
npm run test:session

# Run complete OAuth test suite
npm run test:complete
```

### Manual Testing

1. **Start development server**: `npm run dev`
2. **Use API testing tool** (Postman, Insomnia, curl)
3. **Test authentication flow**
4. **Verify rate limiting**
5. **Check error handling**

### Example cURL Commands

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get user profile
curl -X GET http://localhost:3000/api/account/profile \
  -H "Cookie: session=session_cookie"

# Track Web Vitals
curl -X POST http://localhost:3000/api/analytics/web-vitals \
  -H "Content-Type: application/json" \
  -d '{"name":"LCP","value":1200,"id":"metric_id"}'
```

## 🔄 API Versioning

The API uses URL-based versioning:

- **Current version**: `/api/v1/`
- **Future versions**: `/api/v2/`, `/api/v3/`

### Version Headers

```http
API-Version: 1.0
Accept: application/vnd.api+json;version=1
```

## 📚 SDK and Client Libraries

### JavaScript/TypeScript

```typescript
// Example API client
class BoilerClickAPI {
  private baseURL: string;
  private session: string;

  constructor(baseURL: string, session: string) {
    this.baseURL = baseURL;
    this.session = session;
  }

  async login(email: string, password: string) {
    const response = await fetch(`${this.baseURL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  }

  async getProfile() {
    const response = await fetch(`${this.baseURL}/api/account/profile`, {
      headers: {
        Cookie: `session=${this.session}`,
      },
    });
    return response.json();
  }
}
```

## 📞 Support

If you encounter issues with the API:

- **GitHub Issues**: [Create an issue](https://github.com/ralphdp/boiler-click/issues)
- **Email**: [hi@boiler.click](mailto:hi@boiler.click)
- **API Documentation**: This guide
