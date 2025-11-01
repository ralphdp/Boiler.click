# ™ Development Instructions

## Project Context

This is a production-ready Next.js boilerplate for SaaS applications with:

- Next.js 16.0.0 with App Router
- TypeScript with strict typing
- Tailwind CSS + Shadcn/ui components
- PostgreSQL + Prisma ORM
- 5-language i18n support (EN, AR)
- Vercel-optimized deployment

## Development Guidelines

### Component Development

- Use functional components with TypeScript interfaces
- Follow Shadcn/ui patterns for consistency
- Implement proper error boundaries
- Use React.memo for performance optimization
- Always include proper ARIA attributes

### Styling Approach

- Mobile-first responsive design
- Use Tailwind utility classes
- Implement dark mode support
- Follow consistent spacing scale (4px base)
- Use CSS variables for theming

### Internationalization

- All user-facing text must be translatable
- Use descriptive translation keys
- Maintain all 5 language files synchronized
- Support RTL layout for Arabic
- Use proper date/number formatting

### Database Patterns

- Use Prisma for all database operations
- Implement proper error handling
- Use transactions for related operations
- Add proper indexes for performance
- Follow migration best practices

### Security Requirements

- Validate all inputs with Zod schemas
- Implement proper authentication flows
- Use HTTPS in production
- Follow OWASP security guidelines
- Implement rate limiting

### Performance Standards

- Bundle size under 500KB gzipped
- Lighthouse score 90+ for performance
- Use Next.js Image optimization
- Implement proper code splitting
- Optimize Core Web Vitals

## File Structure Rules

- Components in `/src/components/`
- Pages in `/src/app/` (App Router)
- Utilities in `/src/lib/`
- Types in `/src/types/`
- Translations in `/src/languages/`
- Use kebab-case for files, PascalCase for components

## Code Quality

- ESLint + Prettier configured
- TypeScript strict mode enabled
- Prefer type over interface for simple objects
- Use proper error handling patterns
- Implement comprehensive testing

## Future Features (Planned)

- Admin panel implementation
- OAuth integration (Google, GitHub)
- Advanced user management
- Real-time features
- Payment integration (Stripe)
- Email system integration

Always prioritize security, performance, and accessibility in implementations.
