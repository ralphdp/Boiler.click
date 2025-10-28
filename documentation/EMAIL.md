# Email Setup Guide

Complete guide for setting up email services with Boiler.click using Resend.

## 📧 Email Service Overview

Boiler.click uses **Resend** as the primary email service provider, offering:

- **High deliverability** rates
- **Developer-friendly** API
- **Vercel integration**
- **Template management**
- **Analytics and tracking**

## 🚀 Resend Setup

### Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### Step 2: Verify Your Domain

1. **Add your domain** in the Resend dashboard
2. **Add DNS records** in your domain provider:
   - **CNAME**: `resend.boiler.click` → `resend.net`
   - **TXT**: `v=spf1 include:resend.net ~all`
3. **Wait for verification** (usually takes a few minutes)

### Step 3: Get API Key

1. Go to **API Keys** in Resend dashboard
2. Click **Create API Key**
3. Copy the API key (starts with `re_`)

### Step 4: Configure Environment Variables

```bash
# Email - Resend
RESEND_API_KEY="re_your-resend-api-key-here"
RESEND_FROM_EMAIL="hi@boiler.click"
```

## 📧 Email Templates

### Available Templates

Boiler.click includes the following email templates:

1. **Welcome Email** - Sent after user registration
2. **Email Verification** - Sent for email verification
3. **Password Reset** - Sent for password reset requests
4. **Password Changed** - Confirmation of password change

### Template Structure

Email templates are located in `src/lib/email/templates.ts`:

```typescript
export const emailTemplates = {
  welcome: {
    subject: "Welcome to Boiler.click!",
    html: `<!-- HTML template -->`,
    text: `<!-- Plain text template -->`,
  },
  verifyEmail: {
    subject: "Verify Your Email Address",
    html: `<!-- HTML template -->`,
    text: `<!-- Plain text template -->`,
  },
  resetPassword: {
    subject: "Reset Your Password",
    html: `<!-- HTML template -->`,
    text: `<!-- Plain text template -->`,
  },
  passwordChanged: {
    subject: "Password Changed Successfully",
    html: `<!-- HTML template -->`,
    text: `<!-- Plain text template -->`,
  },
};
```

## 🔧 Email Configuration

### Environment Variables

```bash
# Email Configuration
RESEND_API_KEY="re_your-resend-api-key-here"
RESEND_FROM_EMAIL="hi@boiler.click"

# Site Configuration (for email templates)
NEXT_PUBLIC_SITE_TITLE="Boiler.click"
NEXT_PUBLIC_SITE_URL="https://boiler.click"
NEXT_PUBLIC_SITE_EMAIL_SUPPORT="hi@boiler.click"
```

### Email Sender Configuration

The `RESEND_FROM_EMAIL` should match your verified domain:

- ✅ **Valid**: `hi@boiler.click` (if boiler.click is verified)
- ❌ **Invalid**: `noreply@gmail.com` (external email)

## 📨 Email Sending

### Using the Email Service

```typescript
import { sendEmail } from "@/lib/email/mailer";

// Send welcome email
await sendEmail({
  to: "user@example.com",
  template: "welcome",
  data: {
    firstName: "John",
    lastName: "Doe",
  },
});

// Send verification email
await sendEmail({
  to: "user@example.com",
  template: "verifyEmail",
  data: {
    firstName: "John",
    verificationLink: "https://boiler.click/auth/verify-email/token",
  },
});
```

### Email API Endpoints

The project includes API endpoints for email functionality:

- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/verify-email` - Verify email address

## 🎨 Email Preview

### Development Preview

```bash
# Start development server
npm run dev

# Visit email preview page
http://localhost:3000/dev/email-preview
```

### Preview Features

- **Template rendering** with sample data
- **Dark/light mode** support
- **Mobile responsive** preview
- **HTML and text** versions

## 🔄 Email Workflows

### User Registration Flow

1. **User registers** with email/password
2. **Welcome email** sent automatically
3. **Verification email** sent with token
4. **User clicks verification link**
5. **Email verified** and user activated

### Password Reset Flow

1. **User requests** password reset
2. **Reset email** sent with secure token
3. **User clicks reset link**
4. **Password reset form** displayed
5. **New password** set and confirmation sent

### Email Verification Flow

1. **User registers** or updates email
2. **Verification email** sent
3. **User clicks verification link**
4. **Email verified** and user notified

## 🛡️ Security Considerations

### Email Security

1. **Use HTTPS** for all email links
2. **Implement rate limiting** for email sending
3. **Validate email addresses** before sending
4. **Use secure tokens** for verification/reset
5. **Implement proper expiry** for tokens

### Token Security

```typescript
// Secure token generation
const token = crypto.randomBytes(32).toString("hex");
const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
```

### Rate Limiting

```typescript
// Rate limiting for email sending
export const emailRateLimit = createRateLimit({
  limit: 5, // 5 emails per hour
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Email rate limit exceeded",
});
```

## 🧪 Testing Email

### Test Commands

```bash
# Test email configuration
npm run test:email

# Preview email templates
npm run dev
# Visit: http://localhost:3000/dev/email-preview
```

### Manual Testing

1. **Register a new user** and check for welcome email
2. **Request password reset** and verify email is sent
3. **Update email address** and check verification email
4. **Test email templates** in preview mode

## 📊 Email Analytics

### Resend Analytics

Resend provides built-in analytics:

- **Delivery rates**
- **Open rates**
- **Click rates**
- **Bounce rates**
- **Spam complaints**

### Custom Analytics

You can add custom analytics:

```typescript
// Track email events
analytics.track("email_sent", {
  template: "welcome",
  recipient: "user@example.com",
});
```

## 🐛 Troubleshooting

### Common Issues

#### Email Not Sending

**Possible Causes**:

- Invalid API key
- Unverified domain
- Incorrect from email
- Rate limiting

**Solutions**:

- Verify API key is correct
- Check domain verification status
- Ensure from email matches verified domain
- Check rate limits

#### Email Going to Spam

**Possible Causes**:

- Poor email content
- Missing SPF/DKIM records
- Low sender reputation

**Solutions**:

- Improve email content
- Add proper DNS records
- Use verified domain
- Monitor sender reputation

#### Verification Links Not Working

**Possible Causes**:

- Expired tokens
- Incorrect URL format
- Missing environment variables

**Solutions**:

- Check token expiry
- Verify URL format
- Ensure environment variables are set

### Debug Commands

```bash
# Check email configuration
npm run test:email

# Preview email templates
npm run dev
# Visit: http://localhost:3000/dev/email-preview
```

## 🔄 Migration from Other Services

### From SMTP

If migrating from SMTP:

1. **Update environment variables**
2. **Replace SMTP calls** with Resend API
3. **Update email templates**
4. **Test thoroughly**

### From SendGrid

If migrating from SendGrid:

1. **Export templates** from SendGrid
2. **Convert to Resend format**
3. **Update API calls**
4. **Test delivery**

## 📚 Resend Documentation

### Official Resources

- **[Resend Documentation](https://resend.com/docs)**
- **[Resend API Reference](https://resend.com/docs/api-reference)**
- **[Resend Templates](https://resend.com/docs/templates)**
- **[Resend Analytics](https://resend.com/docs/analytics)**

### Best Practices

- **Use verified domains** for better deliverability
- **Implement proper error handling**
- **Add rate limiting** to prevent abuse
- **Monitor email metrics**
- **Keep templates simple** and mobile-friendly

## 📞 Support

If you encounter issues with email setup:

- **GitHub Issues**: [Create an issue](https://github.com/ralphdp/boiler-click/issues)
- **Email**: [hi@boiler.click](mailto:hi@boiler.click)
- **Resend Support**: [Resend Help Center](https://resend.com/help)
