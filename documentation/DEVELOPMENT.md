# Development Guide

Complete development guide for working with Boiler.click.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (local or cloud)
- Git

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/ralphdp/boiler-click.git
cd boiler-click

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run Prisma migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## 🛠️ Development Scripts

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

## 🏗️ Project Structure

```text
src/
├── app/                    # Next.js App Router
│   ├── about/              # About page
│   ├── account/            # Account management pages
│   ├── api/                # API routes
│   ├── articles/           # Articles system
│   ├── auth/               # Authentication pages
│   ├── dev/                # Development tools
│   ├── documentation/      # Documentation system
│   ├── faq/                # FAQ page
│   ├── legal/              # Legal information page
│   ├── mission/            # Mission page
│   ├── support/            # Support page
│   ├── error.tsx           # Global error boundary
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── not-found.tsx       # 404 page
│   ├── page.tsx            # Homepage
│   ├── robots.ts           # Robots.txt generator
│   └── sitemap.ts          # Sitemap generator
├── components/             # Reusable components
│   ├── auth/               # Authentication components
│   ├── ui/                 # UI components (shadcn/ui)
│   └── [other components]  # Feature-specific components
├── contexts/               # React contexts
│   ├── AuthContext.tsx     # Authentication context
│   ├── CookieContext.tsx   # Cookie consent context
│   ├── LanguageContext.tsx # Internationalization context
│   └── ToastContext.tsx    # Toast notifications context
├── data/                   # Data files
│   └── articles.json       # Articles content
├── languages/              # Translation files
│   ├── ar.json             # Arabic translations
│   ├── en.json             # English translations
│   ├── es.json             # Spanish translations
│   ├── fr.json             # French translations
│   └── jp.json             # Japanese translations
├── lib/                    # Utility libraries
│   ├── analytics.ts        # Analytics and performance monitoring
│   ├── auth/               # Authentication utilities
│   ├── email/              # Email utilities
│   ├── validation/         # Validation schemas
│   └── [other utilities]   # General utilities
├── proxy.ts                # Proxy configuration
└── types/                  # TypeScript type definitions (empty)
```

## 🎨 Code Quality

### ESLint Configuration

The project uses ESLint with Next.js recommended rules:

- **TypeScript-specific rules**
- **React-specific rules**
- **Accessibility rules**
- **Performance rules**

### Prettier Configuration

Consistent code formatting with:

- **Consistent formatting**
- **Proper line breaks**
- **Consistent quotes**
- **Proper indentation**

### TypeScript

- **Strict type checking** enabled
- **Proper type annotations** for functions
- **Interface definitions** for data structures
- **Type over interface** for simple objects

## 🔧 Development Workflow

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push to staging
git push origin staging

# Merge to main when ready
git checkout main
git merge staging --no-edit
git push origin main
```

### Branch Strategy

- **`main`**: Production-ready code
- **`staging`**: Testing and staging environment
- **`feature/*`**: Feature development branches

### Commit Convention

Use conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Build process or auxiliary tool changes

## 🧪 Testing

### OAuth Testing

```bash
# Test OAuth configuration
npm run test:oauth

# Test session configuration
npm run test:session

# Run complete OAuth test suite
npm run test:complete
```

### Environment Testing

```bash
# Test environment setup
npm run setup:env

# Generate OAuth URIs
npm run oauth:uris
```

## 📊 Performance Monitoring

### Bundle Analysis

```bash
# Analyze bundle size
npm run analyze
npm run analyze:server
npm run analyze:browser
```

### Performance Metrics

The project includes:

- **Web Vitals monitoring** (LCP, FID, CLS)
- **Performance tracking** with custom metrics
- **Error tracking** and reporting
- **Resource loading monitoring**

## 🌐 Internationalization

### Adding New Languages

1. **Create new JSON file** in `src/languages/`
2. **Add language to `LanguageContext.tsx`**
3. **Update language switcher component**

### Translation Keys

Use descriptive, hierarchical keys:

```json
{
  "account": {
    "profile": {
      "firstName": "First Name",
      "lastName": "Last Name"
    }
  }
}
```

## 🔐 Authentication Development

### OAuth Provider Setup

For detailed OAuth setup, see [OAuth Provider Setup](OAUTH.md).

### Session Management

The project uses:

- **JWT tokens** for authentication
- **Secure session cookies**
- **Remember me functionality**
- **Configurable session expiry**

## 📧 Email Development

### Email Templates

Email templates are located in `src/lib/email/templates.ts`:

- **Welcome email**
- **Email verification**
- **Password reset**
- **Custom templates**

### Email Preview

```bash
# Start development server
npm run dev

# Visit email preview
http://localhost:3000/dev/email-preview
```

## 🎨 UI Development

### Component Library

The project uses shadcn/ui components:

- **Consistent design system**
- **Accessible components**
- **Custom variants** and themes
- **Dark mode support**

### Adding New Components

1. **Use shadcn/ui CLI** to add components
2. **Follow naming conventions**
3. **Add proper TypeScript types**
4. **Include accessibility features**

## 🐛 Debugging

### Common Issues

#### TypeScript Errors

- Check type definitions
- Verify imports and exports
- Ensure proper type annotations

#### Build Errors

- Check for syntax errors
- Verify environment variables
- Check dependency versions

#### Runtime Errors

- Check browser console
- Verify API endpoints
- Check database connections

### Debug Tools

- **Browser DevTools**
- **Next.js built-in debugging**
- **Prisma Studio** for database debugging
- **Vercel CLI** for deployment debugging

## 📚 API Development

### API Routes

API routes are located in `src/app/api/`:

- **Authentication endpoints**
- **Account management**
- **Analytics endpoints**
- **BotID verification**

### API Conventions

- **RESTful design**
- **Proper HTTP status codes**
- **Input validation** with Zod
- **Error handling**
- **Rate limiting**

## 🚀 Deployment

For deployment instructions, see [Deployment Guide](DEPLOYMENT.md).

## 📞 Support

If you encounter any issues during development:

- **GitHub Issues**: [Create an issue](https://github.com/ralphdp/boiler-click/issues)
- **Email**: [hi@boiler.click](mailto:hi@boiler.click)
- **Documentation**: Check other guides in the `documentation/` folder
