import { getGitHubCloneCommand } from "./github";

export interface DocumentationStep {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: {
    sections: {
      title: string;
      content: string;
      codeBlocks?: {
        language: string;
        code: string;
        description?: string;
      }[];
      images?: {
        src: string;
        alt: string;
        caption?: string;
      }[];
    }[];
  };
}

export const documentationSteps: DocumentationStep[] = [
  {
    id: 1,
    slug: "welcome",
    title: "Welcome",
    description:
      "Get started with Boiler™ and understand what you're building",
    content: {
      sections: [
        {
          title: "What is Boiler™?",
          content:
            "Boiler™ is a comprehensive, production-ready Next.js boilerplate designed to accelerate your SaaS development. It's more than just a starter template – it's a complete foundation that includes everything you need to build, deploy, and scale modern web applications.",
        },
        {
          title: "Why Choose Boiler™?",
          content:
            "Built with enterprise-grade practices and modern development standards, Boiler™ eliminates the tedious setup process and lets you focus on building your unique features. Whether you're creating a SaaS platform, e-commerce site, or any web application, this boilerplate provides a solid, scalable foundation that grows with your project. The boilerplate is specifically optimized for Vercel deployment but works seamlessly with other hosting platforms. It includes built-in performance optimizations, security best practices, and developer experience enhancements that would typically take weeks to implement from scratch.",
        },
        {
          title: "What's Included",
          content:
            "Our boilerplate comes with a complete set of modern tools and features:",
          codeBlocks: [
            {
              language: "text",
              code: "• Next.js 16 with App Router\n• TypeScript for type safety\n• Tailwind CSS for styling\n• Shadcn/ui components\n• Authentication system\n• Database integration\n• API routes\n• SEO optimization\n• Performance monitoring",
              description: "Key features included in the boilerplate",
            },
          ],
        },
      ],
    },
  },
  {
    id: 2,
    slug: "install",
    title: "Install & Configure",
    description:
      "Install dependencies and configure your environment to get started",
    content: {
      sections: [
        {
          title: "Prerequisites",
          content:
            "Before you begin, make sure you have the following installed on your system:",
          codeBlocks: [
            {
              language: "bash",
              code: "# Check Node.js version (18+ required)\nnode --version\n\n# Check npm version\nnpm --version\n\n# Check Git version\ngit --version",
              description: "Verify your development environment",
            },
          ],
        },
        {
          title: "Installation Steps",
          content:
            "Follow these steps to get Boiler™ running on your machine:",
          codeBlocks: [
            {
              language: "bash",
              code: `# 1. Clone the repository\n${getGitHubCloneCommand()}\ncd boiler\n\n# 2. Install dependencies\nnpm install\n\n# 3. Set up environment variables\ncp .env.example .env\n\n# 4. Start the development server\nnpm run dev`,
              description: "Complete installation process",
            },
          ],
        },
        {
          title: "Environment Variables",
          content:
            "Copy the .env.example file to .env and configure your environment variables including database URL, authentication secrets, and API keys.",
          codeBlocks: [
            {
              language: "bash",
              code: "# Copy environment file\ncp .env.example .env",
              description: "Create your local environment configuration",
            },
            {
              language: "env",
              code: '# Maintenance Mode\nMAINTENANCE_MODE=false\n\nNEXT_PUBLIC_VERSION="0.0.1"\nNEXT_PUBLIC_BUILD_TIME="Jan. 01, 2025"\nNEXT_PUBLIC_GITHUB_USER=""\nNEXT_PUBLIC_GITHUB_REPO=""\n\n# Brand\nNEXT_PUBLIC_SITE_TITLE=""\nNEXT_PUBLIC_SITE_EMAIL_SUPPORT=""\nNEXT_PUBLIC_SITE_PHYSICAL_ADDRESS=""\nNEXT_PUBLIC_SITE_TELEPHONE=""\nNEXT_PUBLIC_SOCIAL_GITHUB=""\nNEXT_PUBLIC_SOCIAL_X=""\nNEXT_PUBLIC_SOCIAL_FACEBOOK=""\nNEXT_PUBLIC_SOCIAL_YOUTUBE=""\nNEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"\n\n# Database Connections\n# Database\nDATABASE_LOCAL_URL="postgresql://username:password@localhost:5432/boiler"\nDATABASE_REMOTE_URL="postgresql://neondb_owner:[password]@[server].c-2.us-east-1.aws.neon.tech/[database_name]?sslmode=require"\n# Redis\nREDIS_LOCAL_URL="redis://localhost:6379"\nREDIS_REMOTE_URL="redis://default:[password]@redis-[server_id]].c323.us-east-1-2.ec2.redns.redis-cloud.com:[server_id]"\n\n# Authentication & Security\n# JWT Secret for token signing (if using JWT auth)\nJWT_SECRET=""\n\n# Session Configuration\nSESSION_SECRET=""\n\n# Third-Party Services\n# OAuth Providers\nGOOGLE_CLIENT_ID=[602141741836]-[id].apps.googleusercontent.com\nGOOGLE_CLIENT_SECRET=""\nGITHUB_CLIENT_ID=""\nGITHUB_CLIENT_SECRET=""\nDISCORD_CLIENT_ID="your-discord-client-id"\nDISCORD_CLIENT_SECRET="your-discord-client-secret"\nFACEBOOK_CLIENT_ID="your-facebook-client-id"\nFACEBOOK_CLIENT_SECRET="your-facebook-client-secret"\nTWITTER_CLIENT_ID="your-twitter-client-id"\nTWITTER_CLIENT_SECRET="your-twitter-client-secret"\n# Payment Processing\nSTRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"\nSTRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"\nSTRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"\n\n# Email\nSMTP_HOST="smtp.example.com"\nSMTP_PORT="587"\nSMTP_USER=""\nSMTP_PASS=""',
              description: "Complete environment variables configuration",
            },
          ],
        },
        {
          title: "Database Setup",
          content:
            "Set up your PostgreSQL database and run migrations to create the necessary tables and relationships.",
          codeBlocks: [
            {
              language: "bash",
              code: "# Install PostgreSQL (if not already installed)\n# macOS with Homebrew\nbrew install postgresql\nbrew services start postgresql\n\n# Create database\ncreatedb boilerclick\n\n# Run migrations\nnpx prisma migrate dev\n\n# Generate Prisma client\nnpx prisma generate",
              description: "Database setup and migration process",
            },
          ],
        },
        {
          title: "Authentication Configuration",
          content: "Configure Passport.js for user authentication:",
          codeBlocks: [
            {
              language: "typescript",
              code: `// src/lib/auth.ts\nimport passport from 'passport';\nimport { Strategy as GoogleStrategy } from 'passport-google-oauth20';\nimport { Strategy as GitHubStrategy } from 'passport-github2';\n\nexport const authConfig = {\n  google: {\n    clientID: process.env.GOOGLE_CLIENT_ID!,\n    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,\n    callbackURL: '/auth/google/callback'\n  },\n  github: {\n    clientID: process.env.GITHUB_CLIENT_ID!,\n    clientSecret: process.env.GITHUB_CLIENT_SECRET!,\n    callbackURL: '/auth/github/callback'\n  }\n};\n\n// Configure Google OAuth\npassport.use(new GoogleStrategy(authConfig.google, async (accessToken, refreshToken, profile, done) => {\n  // Your authentication logic here\n  return done(null, profile);\n}));\n\n// Configure GitHub OAuth\npassport.use(new GitHubStrategy(authConfig.github, async (accessToken, refreshToken, profile, done) => {\n  // Your authentication logic here\n  return done(null, profile);\n}));`,
              description: "Passport.js configuration with OAuth providers",
            },
          ],
        },
        {
          title: "Customization",
          content: "Customize your application's appearance and functionality:",
          codeBlocks: [
            {
              language: "css",
              code: "/* src/app/globals.css */\n:root {\n  --primary: 222.2 84% 4.9%;\n  --primary-foreground: 210 40% 98%;\n  --secondary: 210 40% 96%;\n  --secondary-foreground: 222.2 84% 4.9%;\n  /* Add your custom colors */\n}",
              description: "Customize your color scheme",
            },
          ],
        },
      ],
    },
  },
  {
    id: 3,
    slug: "development",
    title: "Development Workflow",
    description:
      "Learn about the development workflow and available scripts for building your application",
    content: {
      sections: [
        {
          title: "Available Scripts",
          content: "Use these npm scripts to manage your development workflow:",
          codeBlocks: [
            {
              language: "bash",
              code: "# Start the development server with hot reload\nnpm run dev\n\n# Build the application for production\nnpm run build\n\n# Start the production server\nnpm run start\n\n# Run ESLint to check code quality\nnpm run lint",
              description: "Essential development commands",
            },
          ],
        },
        {
          title: "Development Workflow",
          content: "Follow this workflow for efficient development:",
          codeBlocks: [
            {
              language: "text",
              code: "1. Start the development server: npm run dev\n2. Make your changes in the src/ directory\n3. Test your changes in the browser\n4. Run linting: npm run lint\n5. Build for production: npm run build\n6. Test production build: npm run start",
              description: "Step-by-step development process",
            },
          ],
        },
        {
          title: "Hot Reload",
          content:
            "The development server automatically reloads when you make changes to your code. This includes:\n\n• React components\n• CSS and Tailwind classes\n• TypeScript files\n• API routes\n• Configuration files",
          codeBlocks: [
            {
              language: "bash",
              code: "# Start development with hot reload\nnpm run dev\n\n# The server will start on http://localhost:${NEXT_PUBLIC_PORT_FRONTEND}\n# Changes will be reflected automatically",
              description: "Development server with hot reload",
            },
          ],
        },
      ],
    },
  },
  {
    id: 4,
    slug: "building-patterns",
    title: "Building & Coding Patterns",
    description:
      "Learn essential building patterns, coding conventions, and best practices for scalable applications",
    content: {
      sections: [
        {
          title: "Component Architecture",
          content:
            "Understanding how to structure components for maintainability and reusability. Learn about atomic design principles, component composition, and when to create custom hooks.",
          codeBlocks: [
            {
              language: "typescript",
              code: `// Atomic Design Structure
// atoms/Button.tsx
export const Button = ({ variant, size, children, ...props }) => {
  return (
    <button 
      className={cn(buttonVariants({ variant, size }))} 
      {...props}
    >
      {children}
    </button>
  );
};

// molecules/FormField.tsx
export const FormField = ({ label, error, children }) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

// organisms/ContactForm.tsx
export const ContactForm = () => {
  const [formData, setFormData] = useState({});
  
  return (
    <form className="space-y-4">
      <FormField label="Name" error={errors.name}>
        <Input {...register("name")} />
      </FormField>
      <FormField label="Email" error={errors.email}>
        <Input type="email" {...register("email")} />
      </FormField>
      <Button type="submit">Submit</Button>
    </form>
  );
};`,
              description:
                "Atomic design structure for scalable component architecture",
            },
          ],
        },
        {
          title: "Custom Hooks Pattern",
          content:
            "Creating reusable custom hooks for state management, API calls, and side effects. This pattern promotes code reusability and separation of concerns.",
          codeBlocks: [
            {
              language: "typescript",
              code: `// hooks/useApi.ts
export const useApi = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// hooks/useLocalStorage.ts
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
};`,
              description:
                "Custom hooks for API calls and local storage management",
            },
          ],
        },
        {
          title: "Error Boundary Pattern",
          content:
            "Implementing error boundaries to catch JavaScript errors anywhere in the component tree and display fallback UI instead of crashing the entire application.",
          codeBlocks: [
            {
              language: "typescript",
              code: `// components/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <h2 className="text-lg font-semibold text-red-800">
            Something went wrong
          </h2>
          <p className="text-red-600">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage in App
export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}`,
              description:
                "Error boundary implementation for graceful error handling",
            },
          ],
        },
        {
          title: "Compound Component Pattern",
          content:
            "Creating compound components that work together to provide a flexible and intuitive API. This pattern is commonly used in UI libraries like Radix UI.",
          codeBlocks: [
            {
              language: "typescript",
              code: `// components/Modal.tsx
interface ModalContextType {
  isOpen: boolean;
  onClose: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a Modal');
  }
  return context;
};

export const Modal = ({ children, isOpen, onClose }: ModalProps) => {
  return (
    <ModalContext.Provider value={{ isOpen, onClose }}>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <div className="relative bg-white rounded-lg shadow-xl">
            {children}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const ModalHeader = ({ children }: { children: React.ReactNode }) => {
  const { onClose } = useModal();
  return (
    <div className="flex items-center justify-between p-6 border-b">
      <h2 className="text-xl font-semibold">{children}</h2>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        <X className="h-6 w-6" />
      </button>
    </div>
  );
};

export const ModalBody = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-6">{children}</div>;
};

export const ModalFooter = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex justify-end gap-2 p-6 border-t">{children}</div>;
};

// Usage
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <ModalHeader>Confirm Action</ModalHeader>
  <ModalBody>
    <p>Are you sure you want to proceed?</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="outline" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button onClick={handleConfirm}>Confirm</Button>
  </ModalFooter>
</Modal>`,
              description:
                "Compound component pattern for flexible modal implementation",
            },
          ],
        },
        {
          title: "Render Props Pattern",
          content:
            "Using render props to share code between components by passing a function as a prop. This pattern provides maximum flexibility and reusability.",
          codeBlocks: [
            {
              language: "typescript",
              code: `// components/DataFetcher.tsx
interface DataFetcherProps<T> {
  url: string;
  children: (state: {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
  }) => React.ReactNode;
}

export const DataFetcher = <T,>({ url, children }: DataFetcherProps<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <>{children({ data, loading, error, refetch: fetchData })}</>;
};

// Usage
<DataFetcher url="/api/users">
  {({ data, loading, error, refetch }) => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    
    return (
      <div>
        <h2>Users</h2>
        <button onClick={refetch}>Refresh</button>
        <ul>
          {data?.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
    );
  }}
</DataFetcher>`,
              description: "Render props pattern for flexible data fetching",
            },
          ],
        },
        {
          title: "Higher-Order Component (HOC) Pattern",
          content:
            "Creating higher-order components to add functionality to existing components without modifying their structure. HOCs are useful for cross-cutting concerns like authentication, logging, and analytics.",
          codeBlocks: [
            {
              language: "typescript",
              code: `// HOCs/withAuth.tsx
interface WithAuthProps {
  isAuthenticated: boolean;
  user: User | null;
}

export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P & WithAuthProps>
) => {
  return (props: P) => {
    const { user, isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
      return <LoginPage />;
    }

    return <WrappedComponent {...props} isAuthenticated={isAuthenticated} user={user} />;
  };
};

// HOCs/withAnalytics.tsx
export const withAnalytics = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  eventName: string
) => {
  return (props: P) => {
    useEffect(() => {
      // Track page view or component mount
      analytics.track(eventName, {
        component: WrappedComponent.name,
        timestamp: new Date().toISOString(),
      });
    }, []);

    return <WrappedComponent {...props} />;
  };
};

// Usage
const ProtectedDashboard = withAuth(Dashboard);
const TrackedHomePage = withAnalytics(HomePage, 'home_page_viewed');

// Multiple HOCs can be composed
const ProtectedTrackedProfile = withAuth(withAnalytics(Profile, 'profile_viewed'));`,
              description:
                "Higher-order components for authentication and analytics",
            },
          ],
        },
        {
          title: "State Management Patterns",
          content:
            "Implementing effective state management using Context API, Zustand, or Redux Toolkit. Choose the right pattern based on your application's complexity and requirements.",
          codeBlocks: [
            {
              language: "typescript",
              code: `// Context API Pattern
interface AppState {
  theme: 'light' | 'dark';
  user: User | null;
  notifications: Notification[];
}

interface AppContextType extends AppState {
  setTheme: (theme: 'light' | 'dark') => void;
  setUser: (user: User | null) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AppState>({
    theme: 'light',
    user: null,
    notifications: [],
  });

  const setTheme = (theme: 'light' | 'dark') => {
    setState(prev => ({ ...prev, theme }));
  };

  const setUser = (user: User | null) => {
    setState(prev => ({ ...prev, user }));
  };

  const addNotification = (notification: Notification) => {
    setState(prev => ({
      ...prev,
      notifications: [...prev.notifications, notification],
    }));
  };

  const removeNotification = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id),
    }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setTheme,
        setUser,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Zustand Pattern (Alternative)
import { create } from 'zustand';

interface AppStore {
  theme: 'light' | 'dark';
  user: User | null;
  setTheme: (theme: 'light' | 'dark') => void;
  setUser: (user: User | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  theme: 'light',
  user: null,
  setTheme: (theme) => set({ theme }),
  setUser: (user) => set({ user }),
}));`,
              description:
                "State management patterns with Context API and Zustand",
            },
          ],
        },
      ],
    },
  },
  {
    id: 5,
    slug: "shadcn-components",
    title: "Shadcn/UI Components",
    description:
      "Learn how to use the most common shadcn/ui components with practical code examples",
    content: {
      sections: [
        {
          title: "Introduction",
          content:
            "This boilerplate includes shadcn/ui components for building beautiful, accessible user interfaces. Visit the official shadcn/ui website: ui.shadcn.com",
        },
        {
          title: "Button Component",
          content:
            "Versatile button component with multiple variants for different use cases:",
          codeBlocks: [
            {
              language: "tsx",
              code: 'import { Button } from "@/components/ui/button"\n\n<Button variant="default">Click me</Button>\n<Button variant="outline">Outline</Button>\n<Button variant="ghost">Ghost</Button>\n<Button variant="destructive">Delete</Button>',
              description: "Button component with different variants",
            },
          ],
        },
        {
          title: "Card Component",
          content:
            "Flexible card component for displaying content in a structured layout:",
          codeBlocks: [
            {
              language: "tsx",
              code: 'import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"\n\n<Card>\n  <CardHeader>\n    <CardTitle>Card Title</CardTitle>\n  </CardHeader>\n  <CardContent>\n    <p>Card content goes here</p>\n  </CardContent>\n</Card>',
              description: "Card component with header and content",
            },
          ],
        },
        {
          title: "Badge Component",
          content:
            "Small status indicators and labels with different variants:",
          codeBlocks: [
            {
              language: "tsx",
              code: 'import { Badge } from "@/components/ui/badge"\n\n<Badge variant="default">Default</Badge>\n<Badge variant="secondary">Secondary</Badge>\n<Badge variant="outline">Outline</Badge>\n<Badge variant="destructive">Destructive</Badge>',
              description: "Badge component with different variants",
            },
          ],
        },
        {
          title: "Installation Commands",
          content:
            "Essential commands to set up shadcn/ui components and required dependencies:",
          codeBlocks: [
            {
              language: "bash",
              code: "# Install shadcn/ui CLI\nnpx shadcn@latest init\n\n# Add components\nnpx shadcn@latest add button\nnpx shadcn@latest add card\nnpx shadcn@latest add badge\nnpx shadcn@latest add tooltip\nnpx shadcn@latest add dropdown-menu",
              description: "Shadcn/UI setup and component installation",
            },
            {
              language: "bash",
              code: "# Install required dependencies\nnpm install @radix-ui/react-slot\nnpm install class-variance-authority\nnpm install clsx tailwind-merge\nnpm install lucide-react",
              description: "Required dependencies for shadcn/ui components",
            },
          ],
        },
        {
          title: "Additional Components",
          content: "The boilerplate includes several other useful components:",
          codeBlocks: [
            {
              language: "text",
              code: "• Tooltip - Hover tooltips for better UX\n• Dropdown Menu - Contextual menus\n• Modal - Overlay dialogs\n• Input - Form input fields\n• Separator - Visual dividers\n• Scroll Area - Custom scrollable areas\n• Sheet - Slide-out panels",
              description: "Additional available components",
            },
          ],
        },
      ],
    },
  },
  {
    id: 6,
    slug: "vercel-optimization",
    title: "Vercel Optimization",
    description:
      "This boilerplate is specifically optimized for Vercel deployment with built-in features and configurations",
    content: {
      sections: [
        {
          title: "Why Vercel?",
          content:
            "Vercel provides several advantages for modern web applications:",
          codeBlocks: [
            {
              language: "text",
              code: "• Lightning-fast global CDN and edge computing\n• Seamless developer experience with instant deployments\n• Built-in performance monitoring and error tracking\n• Enterprise-grade security and compliance\n• Pay-as-you-scale pricing with generous free tier",
              description: "Key benefits of using Vercel",
            },
          ],
        },
        {
          title: "Vercel-Specific Features",
          content:
            "This boilerplate includes several Vercel-optimized features out of the box:",
          codeBlocks: [
            {
              language: "text",
              code: "• Built-in BotID bot detection (automatic in production)\n• Edge Runtime optimization for faster response times\n• Vercel Analytics integration for performance monitoring\n• Automatic image optimization and CDN delivery\n• Zero-config deployment with automatic builds\n• Serverless functions with optimal cold start performance\n• Automatic HTTPS and security headers\n• Automatic scaling based on traffic patterns",
              description: "Built-in Vercel optimizations",
            },
          ],
        },
        {
          title: "Deployment Configuration",
          content:
            "The boilerplate includes optimized Vercel configuration files:",
          codeBlocks: [
            {
              language: "json",
              code: '{\n  "functions": {\n    "src/app/api/**/*.ts": {\n      "runtime": "nodejs18.x"\n    }\n  },\n  "headers": [\n    {\n      "source": "/(.*)",\n      "headers": [\n        {\n          "key": "X-Content-Type-Options",\n          "value": "nosniff"\n        },\n        {\n          "key": "X-Frame-Options",\n          "value": "DENY"\n        },\n        {\n          "key": "X-XSS-Protection",\n          "value": "1; mode=block"\n        }\n      ]\n    }\n  ]\n}',
              description: "vercel.json configuration for optimal performance",
            },
          ],
        },
      ],
    },
  },
];

export function getStepBySlug(slug: string): DocumentationStep | undefined {
  return documentationSteps.find((step) => step.slug === slug);
}

export function getStepByNumber(
  stepNumber: number
): DocumentationStep | undefined {
  return documentationSteps.find((step) => step.id === stepNumber);
}

export function getAllSteps(): DocumentationStep[] {
  return documentationSteps;
}
