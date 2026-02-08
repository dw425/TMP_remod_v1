# Blueprint Marketplace 2.0 — Master Build Plan

## Document Purpose
This is the single source of truth for converting the Blueprint Technology Marketplace from a static HTML site into a production-grade, modular React application. Every architectural decision is made to support **100+ pages, multi-tenant user accounts, security frameworks, Slack integration, analytics, chatbot, and easy GitHub-based deployment** without requiring structural rewrites.

---

## PART 1: ARCHITECTURE OVERVIEW

### 1.1 Current State vs. Target State

```
CURRENT (v1)                              TARGET (v2)
─────────────────────                     ─────────────────────
30 standalone HTML files                  1 React SPA with router
Tailwind via CDN (no build)               Tailwind compiled (PostCSS)
Cart in raw localStorage                  Zustand store + localStorage sync
Header/footer fetched via JS              React layout components
Modals injected via innerHTML             Portal-based React modals
Forms scattered per page                  Centralized form system
No auth                                   JWT auth + role-based access
No analytics                              PostHog/GA4 event tracking
No error handling                         Global error boundaries
16 innerHTML calls (XSS risk)             Zero innerHTML, JSX only
4 Formspree endpoints (hardcoded)         Centralized API service layer
Inline event handlers (38 instances)      React event system
No tests                                  Vitest + React Testing Library
Manual deploy                             GitHub Actions CI/CD
```

### 1.2 Tech Stack Decision

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | React 18 + TypeScript | Type safety, ecosystem, team familiarity |
| **Build** | Vite 5 | Fast HMR, native TS support, tree-shaking |
| **Routing** | React Router v6 | Nested routes, lazy loading, data loaders |
| **Styling** | Tailwind CSS v3 (PostCSS) | Keeps existing class names, compiled output |
| **State (Global)** | Zustand | Lightweight, no boilerplate, DevTools support |
| **State (Server)** | TanStack Query (React Query) | Cache, retry, loading states for API calls |
| **Forms** | React Hook Form + Zod | Validation, performance, schema-based |
| **Auth** | Auth0 or Supabase Auth | JWT, OAuth, role-based, session management |
| **Analytics** | PostHog (self-hostable) | Event tracking, session replay, feature flags |
| **Chat** | Custom component + future LLM API | Persistent across routes, expandable |
| **Testing** | Vitest + React Testing Library | Fast, Vite-native |
| **CI/CD** | GitHub Actions | Auto build, test, deploy on push |
| **Hosting** | GitHub Pages (SPA mode) or Vercel | Free, CDN, handles SPA routing |

---

## PART 2: PROJECT STRUCTURE

This structure is designed so a developer can clone the repo, understand the layout in 30 seconds, and add a new page/feature without touching existing code.

```
blueprint-marketplace/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint + test on PR
│       └── deploy.yml                # Build + deploy on merge to main
│
├── public/
│   ├── images/                       # Static images (logos, arch diagrams)
│   │   ├── products/
│   │   ├── platforms/
│   │   └── branding/
│   ├── 404.html                      # SPA redirect for GitHub Pages
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── App.tsx                   # Root component — providers + router
│   │   ├── Router.tsx                # All route definitions (single file)
│   │   ├── Providers.tsx             # Auth, Query, Cart, Analytics wrappers
│   │   └── ErrorBoundary.tsx         # Global error catching
│   │
│   ├── config/
│   │   ├── routes.ts                 # Route path constants (never hardcode paths)
│   │   ├── env.ts                    # Environment variable validation
│   │   ├── formspree.ts             # Form endpoint IDs (centralized)
│   │   ├── analytics.ts             # Tracking event name constants
│   │   └── features.ts              # Feature flags
│   │
│   ├── data/
│   │   ├── products.ts              # All marketplace product definitions
│   │   ├── categories.ts            # Industry filter categories
│   │   ├── navigation.ts            # Header nav + mega-menu structure
│   │   ├── platforms.ts             # Migration platform configs (SAP, Snow, etc.)
│   │   └── migration-schemas/       # Per-platform form field definitions
│   │       ├── sap.ts
│   │       ├── snowflake.ts
│   │       ├── oracle.ts
│   │       ├── redshift.ts
│   │       ├── sql-server.ts
│   │       ├── informatica.ts
│   │       ├── synapse.ts
│   │       ├── teradata.ts
│   │       ├── talend.ts
│   │       ├── gcp.ts
│   │       └── unity-catalog.ts
│   │
│   ├── layouts/
│   │   ├── RootLayout.tsx           # Header + Footer + Outlet + Chat + Alerts
│   │   ├── MarketplaceLayout.tsx    # Marketplace-specific wrapper
│   │   ├── MigrationLayout.tsx      # Migration suite wrapper
│   │   └── AuthLayout.tsx           # Login/signup pages (no header nav)
│   │
│   ├── components/
│   │   ├── ui/                      # Pure, stateless design system primitives
│   │   │   ├── SharpCard.tsx
│   │   │   ├── Button.tsx           # Primary, secondary, ghost variants
│   │   │   ├── Modal.tsx            # Portal-based, animated, scroll-lock
│   │   │   ├── FilterButton.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Toast.tsx            # Screen alert system
│   │   │   ├── Tooltip.tsx
│   │   │   ├── FormField.tsx        # Label + input + error, integrated w/ RHF
│   │   │   ├── YouTubeEmbed.tsx     # Lazy-loaded responsive iframe
│   │   │   ├── Skeleton.tsx         # Loading placeholders
│   │   │   └── index.ts            # Barrel export
│   │   │
│   │   ├── composed/               # Multi-component, stateful pieces
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── MegaMenu.tsx
│   │   │   │   ├── MobileNav.tsx
│   │   │   │   ├── CartBadge.tsx
│   │   │   │   └── UserMenu.tsx     # Post-login avatar/dropdown
│   │   │   │
│   │   │   ├── Footer/
│   │   │   │   └── Footer.tsx
│   │   │   │
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductModal.tsx     # Tabbed detail view
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── PricingSidebar.tsx   # Reused on all product detail pages
│   │   │   ├── ReadinessChecklist.tsx
│   │   │   ├── PlatformTile.tsx     # Migration landing page tiles
│   │   │   └── AssessmentSection.tsx # Single collapsible form section
│   │   │
│   │   ├── modals/                  # All application modals
│   │   │   ├── ContactSalesModal.tsx
│   │   │   ├── ImageLightbox.tsx    # Tech arch viewer
│   │   │   ├── CheckoutModal.tsx    # PO request form
│   │   │   ├── ConfirmationModal.tsx
│   │   │   └── ModalManager.tsx     # Global modal state coordinator
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatWidget.tsx       # FAB + window, persistent across routes
│   │   │   ├── ChatMessage.tsx
│   │   │   └── ChatInput.tsx
│   │   │
│   │   └── alerts/
│   │       ├── AlertProvider.tsx     # Context for screen alerts / toasts
│   │       └── AlertContainer.tsx   # Renders stacked toast notifications
│   │
│   ├── pages/
│   │   ├── marketplace/
│   │   │   └── MarketplacePage.tsx   # Homepage grid with filters + modal
│   │   │
│   │   ├── products/
│   │   │   └── ProductDetailPage.tsx # Shared layout — renders from config
│   │   │
│   │   ├── migration/
│   │   │   ├── MigrationLandingPage.tsx
│   │   │   ├── MigrationAssessmentPage.tsx  # THE parameterized form
│   │   │   └── ROMCalculatorPage.tsx
│   │   │
│   │   ├── content/
│   │   │   ├── AIFactoryPage.tsx
│   │   │   └── WhitepaperPage.tsx
│   │   │
│   │   ├── cart/
│   │   │   └── CartPage.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   │
│   │   ├── account/
│   │   │   ├── DashboardPage.tsx    # User-specific content post-login
│   │   │   ├── DownloadsPage.tsx    # Purchased/accessible downloads
│   │   │   ├── SettingsPage.tsx
│   │   │   └── OrderHistoryPage.tsx
│   │   │
│   │   └── errors/
│   │       ├── NotFoundPage.tsx     # 404
│   │       └── ErrorPage.tsx        # 500 / generic
│   │
│   ├── features/                    # Business logic modules
│   │   ├── auth/
│   │   │   ├── AuthProvider.tsx     # Context with login/logout/user state
│   │   │   ├── useAuth.ts          # Hook for consuming auth
│   │   │   ├── ProtectedRoute.tsx  # Wraps routes requiring login
│   │   │   ├── RoleGate.tsx        # Conditional render by role
│   │   │   └── authService.ts      # API calls for auth endpoints
│   │   │
│   │   ├── cart/
│   │   │   ├── cartStore.ts        # Zustand store
│   │   │   ├── useCart.ts          # Convenience hook
│   │   │   └── cartTypes.ts
│   │   │
│   │   ├── analytics/
│   │   │   ├── AnalyticsProvider.tsx
│   │   │   ├── useTrack.ts         # Hook: track('event_name', { props })
│   │   │   ├── PageViewTracker.tsx  # Auto-tracks route changes
│   │   │   ├── SessionTracker.tsx   # Tracks session duration, idle timeout
│   │   │   └── events.ts           # Event name constants
│   │   │
│   │   ├── notifications/
│   │   │   ├── useAlerts.ts        # Hook for triggering screen alerts
│   │   │   └── alertStore.ts       # Zustand store for toast queue
│   │   │
│   │   ├── downloads/
│   │   │   ├── useDownload.ts      # Hook for triggering file downloads
│   │   │   └── downloadService.ts  # Handles auth'd download requests
│   │   │
│   │   └── integrations/
│   │       ├── slack/
│   │       │   ├── slackService.ts  # Webhook calls for notifications
│   │       │   └── useSlackNotify.ts
│   │       └── formspree/
│   │           └── formService.ts   # Centralized form submission
│   │
│   ├── hooks/                       # Shared custom hooks
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useScrollLock.ts
│   │   ├── useIdleTimeout.ts        # Session timeout after inactivity
│   │   ├── useLocalStorage.ts
│   │   ├── useClickOutside.ts
│   │   └── useKeyboardShortcut.ts
│   │
│   ├── lib/                         # Pure utility functions (no React)
│   │   ├── api.ts                   # Fetch wrapper with auth headers
│   │   ├── cn.ts                    # Tailwind class merge utility
│   │   ├── formatCurrency.ts
│   │   ├── validators.ts           # Zod schemas
│   │   ├── romCalculator.ts        # Migration ROM logic (extracted)
│   │   └── security.ts             # Sanitize, CSP helpers
│   │
│   ├── styles/
│   │   ├── globals.css             # Tailwind directives + design tokens
│   │   ├── animations.css          # Modal enter/leave, popIn, fadeIn
│   │   └── components.css          # Sharp card, filter-btn, article-body
│   │
│   └── types/
│       ├── product.ts
│       ├── cart.ts
│       ├── user.ts
│       ├── migration.ts
│       └── api.ts
│
├── .env.example                     # Template for env vars
├── .eslintrc.cjs
├── .prettierrc
├── tailwind.config.ts               # Blueprint design tokens
├── tsconfig.json
├── vite.config.ts                   # Aliases, proxy, build config
├── vitest.config.ts
├── package.json
└── README.md
```

---

## PART 3: ROUTING ARCHITECTURE

### 3.1 Route Map (single source of truth: `src/config/routes.ts`)

```typescript
// src/config/routes.ts
export const ROUTES = {
  // Public
  HOME: '/',
  CART: '/cart',
  PRODUCT: '/products/:slug',
  MIGRATION_HOME: '/migration',
  MIGRATION_ASSESS: '/migration/:platform',
  MIGRATION_PHASE: '/migration/:platform/:phase',
  ROM_CALCULATOR: '/migration/calculator',
  AI_FACTORY: '/content/ai-factory',
  WHITEPAPER: '/content/:slug',

  // Auth
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',

  // Protected (requires login)
  DASHBOARD: '/account',
  DOWNLOADS: '/account/downloads',
  ORDERS: '/account/orders',
  SETTINGS: '/account/settings',

  // Future
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_USERS: '/admin/users',
  ADMIN_ANALYTICS: '/admin/analytics',
} as const;
```

### 3.2 Router Setup (`src/app/Router.tsx`)

```typescript
// src/app/Router.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { RootLayout } from '@/layouts/RootLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { Spinner } from '@/components/ui';
import { ROUTES } from '@/config/routes';

// Lazy-load every page (code splitting per route)
const MarketplacePage = lazy(() => import('@/pages/marketplace/MarketplacePage'));
const CartPage = lazy(() => import('@/pages/cart/CartPage'));
const ProductDetailPage = lazy(() => import('@/pages/products/ProductDetailPage'));
const MigrationLandingPage = lazy(() => import('@/pages/migration/MigrationLandingPage'));
const MigrationAssessmentPage = lazy(() => import('@/pages/migration/MigrationAssessmentPage'));
const ROMCalculatorPage = lazy(() => import('@/pages/migration/ROMCalculatorPage'));
const AIFactoryPage = lazy(() => import('@/pages/content/AIFactoryPage'));
const WhitepaperPage = lazy(() => import('@/pages/content/WhitepaperPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const DashboardPage = lazy(() => import('@/pages/account/DashboardPage'));
const DownloadsPage = lazy(() => import('@/pages/account/DownloadsPage'));
const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage'));

const router = createBrowserRouter([
  {
    element: <RootLayout />,      // Header + Footer + Chat + Alerts on ALL pages
    errorElement: <ErrorPage />,
    children: [
      // Public routes
      { index: true, element: <MarketplacePage /> },
      { path: ROUTES.CART, element: <CartPage /> },
      { path: ROUTES.PRODUCT, element: <ProductDetailPage /> },
      { path: ROUTES.MIGRATION_HOME, element: <MigrationLandingPage /> },
      { path: ROUTES.MIGRATION_ASSESS, element: <MigrationAssessmentPage /> },
      { path: ROUTES.MIGRATION_PHASE, element: <MigrationAssessmentPage /> },
      { path: ROUTES.ROM_CALCULATOR, element: <ROMCalculatorPage /> },
      { path: ROUTES.AI_FACTORY, element: <AIFactoryPage /> },
      { path: ROUTES.WHITEPAPER, element: <WhitepaperPage /> },

      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
          { path: ROUTES.DOWNLOADS, element: <DownloadsPage /> },
          { path: ROUTES.ORDERS, element: <OrderHistoryPage /> },
          { path: ROUTES.SETTINGS, element: <SettingsPage /> },
        ],
      },

      // Catch-all
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  // Auth pages (no header/footer)
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.SIGNUP, element: <SignupPage /> },
      { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
    ],
  },
]);

export function AppRouter() {
  return (
    <Suspense fallback={<Spinner fullScreen />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
```

### 3.3 Adding a New Route (the 30-second workflow)

To add a new page (e.g., `/partners`):

1. Add path to `src/config/routes.ts`: `PARTNERS: '/partners'`
2. Create `src/pages/partners/PartnersPage.tsx`
3. Add lazy import + route entry in `src/app/Router.tsx`
4. Done. No other files touched.

---

## PART 4: CORE SYSTEMS

### 4.1 App.tsx — The Entry Point

```typescript
// src/app/App.tsx
import { Providers } from './Providers';
import { AppRouter } from './Router';

export default function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}
```

### 4.2 Providers.tsx — All Context Wrappers

```typescript
// src/app/Providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { AnalyticsProvider } from '@/features/analytics/AnalyticsProvider';
import { AlertProvider } from '@/components/alerts/AlertProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 2 },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AnalyticsProvider>
          <AlertProvider>
            {children}
          </AlertProvider>
        </AnalyticsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

### 4.3 RootLayout.tsx — Persistent Shell

```typescript
// src/layouts/RootLayout.tsx
import { Outlet, useNavigation } from 'react-router-dom';
import { Header } from '@/components/composed/Header/Header';
import { Footer } from '@/components/composed/Footer/Footer';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { AlertContainer } from '@/components/alerts/AlertContainer';
import { PageViewTracker } from '@/features/analytics/PageViewTracker';
import { SessionTracker } from '@/features/analytics/SessionTracker';
import { Spinner } from '@/components/ui';

export function RootLayout() {
  const navigation = useNavigation();

  return (
    <div className="flex flex-col min-h-screen bg-[#eef2f6] font-dm-sans text-gray-900">
      <Header />

      <main className="flex-grow">
        {navigation.state === 'loading' ? <Spinner /> : <Outlet />}
      </main>

      <Footer />

      {/* Always-present systems */}
      <ChatWidget />
      <AlertContainer />
      <PageViewTracker />
      <SessionTracker timeoutMinutes={30} />
    </div>
  );
}
```

---

## PART 5: SECURITY FRAMEWORK

### 5.1 Current Vulnerabilities (v1 Audit)

| Issue | Severity | Count | Fix |
|-------|----------|-------|-----|
| `innerHTML` assignment with user data | HIGH | 16 | JSX rendering (zero innerHTML) |
| Inline `onclick` handlers | MEDIUM | 38 | React event system |
| Global `window.*` objects | MEDIUM | 3 | Module-scoped stores |
| Tailwind via CDN (no SRI) | MEDIUM | 30 pages | Compiled Tailwind, local bundle |
| No CSP headers | MEDIUM | - | Meta tag + deploy headers |
| No input sanitization | HIGH | All forms | Zod validation + DOMPurify |
| `localStorage` unencrypted | LOW | Cart data | Acceptable for cart; encrypt sensitive data |
| Formspree IDs in source | LOW | 4 | Move to env vars |
| No rate limiting on forms | MEDIUM | 4 forms | Client-side throttle + Formspree limits |
| No session timeout | HIGH | - | `useIdleTimeout` hook |

### 5.2 Security Architecture

```
┌─────────────────────────────────────────────────────┐
│                    BROWSER                           │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐│
│  │ Auth Context  │  │ CSP Meta Tag │  │ HttpOnly   ││
│  │ JWT in memory │  │ script-src   │  │ Cookies    ││
│  │ Refresh via   │  │ style-src    │  │ (refresh   ││
│  │ httpOnly      │  │ frame-src    │  │  token)    ││
│  │ cookie        │  │ connect-src  │  │            ││
│  └──────────────┘  └──────────────┘  └────────────┘│
│                                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │              INPUT VALIDATION LAYER              ││
│  │  Zod schemas → validate BEFORE any processing    ││
│  │  DOMPurify   → sanitize any rendered user input  ││
│  │  Rate limit  → useThrottle on form submissions   ││
│  └──────────────────────────────────────────────────┘│
│                                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │              API SERVICE LAYER                   ││
│  │  src/lib/api.ts                                  ││
│  │  • Auto-attach JWT to Authorization header       ││
│  │  • Auto-refresh on 401                           ││
│  │  • Request/response interceptors                 ││
│  │  • Timeout after 30 seconds                      ││
│  └──────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

### 5.3 Auth Flow

```
LOGIN:
  1. User submits email/password
  2. Auth provider returns { accessToken, refreshToken }
  3. accessToken stored in memory (Zustand) — NEVER localStorage
  4. refreshToken stored in httpOnly cookie (set by server)
  5. AuthProvider sets user state, ProtectedRoute allows access

PROTECTED ROUTE:
  1. ProtectedRoute checks auth store for user
  2. No user? Redirect to /login with ?returnTo=<current_path>
  3. Has user? Render child route

SESSION TIMEOUT:
  1. useIdleTimeout tracks mouse/keyboard activity
  2. After 30 min idle → show warning modal (2 min countdown)
  3. No activity → clear auth, redirect to /login
  4. Activity → reset timer

TOKEN REFRESH:
  1. api.ts interceptor catches 401 response
  2. Calls /auth/refresh with httpOnly cookie
  3. Gets new accessToken, retries original request
  4. If refresh fails → logout
```

### 5.4 Environment Variables

```bash
# .env.example
VITE_APP_NAME=Blueprint Marketplace
VITE_API_URL=https://api.blueprintmarketplace.com
VITE_AUTH0_DOMAIN=blueprint.auth0.com
VITE_AUTH0_CLIENT_ID=xxxx
VITE_FORMSPREE_CONTACT=mgozdqkj
VITE_FORMSPREE_PO=xwpgdwbd
VITE_FORMSPREE_AIFACTORY=xjkavwle
VITE_FORMSPREE_CALC=mnnoelgb
VITE_POSTHOG_KEY=phc_xxxx
VITE_POSTHOG_HOST=https://app.posthog.com
VITE_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
VITE_ENABLE_CHAT=true
VITE_ENABLE_ANALYTICS=true
VITE_SESSION_TIMEOUT_MINUTES=30
```

```typescript
// src/config/env.ts — validated at startup
import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_FORMSPREE_CONTACT: z.string().min(1),
  VITE_POSTHOG_KEY: z.string().optional(),
  VITE_SESSION_TIMEOUT_MINUTES: z.coerce.number().default(30),
  // ... etc
});

export const env = envSchema.parse(import.meta.env);
```

---

## PART 6: FEATURE SYSTEMS

### 6.1 Cart Store (Zustand)

```typescript
// src/features/cart/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  title: string;
  price: number | 'Custom';
  type: string;
  billing: 'monthly' | 'onetime' | 'annual';
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  add: (item: Omit<CartItem, 'quantity'>) => void;
  remove: (id: string) => void;
  clear: () => void;
  totalCount: () => number;
  monthlyTotal: () => number;
  onetimeTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => set((state) => {
        const existing = state.items.find(i => i.id === item.id);
        if (existing) {
          return { items: state.items.map(i =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )};
        }
        return { items: [...state.items, { ...item, quantity: 1 }] };
      }),
      remove: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),
      clear: () => set({ items: [] }),
      totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      monthlyTotal: () => get().items
        .filter(i => i.billing === 'monthly' && i.price !== 'Custom')
        .reduce((sum, i) => sum + (i.price as number) * i.quantity, 0),
      onetimeTotal: () => get().items
        .filter(i => i.billing === 'onetime' && i.price !== 'Custom')
        .reduce((sum, i) => sum + (i.price as number) * i.quantity, 0),
    }),
    { name: 'blueprint_cart_v2' }
  )
);
```

### 6.2 Analytics & Tracking System

```typescript
// src/features/analytics/useTrack.ts
import { useCallback } from 'react';
import posthog from 'posthog-js';
import { useAuth } from '@/features/auth/useAuth';

export function useTrack() {
  const { user } = useAuth();

  return useCallback((event: string, properties?: Record<string, any>) => {
    posthog.capture(event, {
      ...properties,
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });
  }, [user]);
}

// Usage in any component:
// const track = useTrack();
// track('product_viewed', { productId: 'ciq', source: 'homepage_modal' });
// track('cart_item_added', { productId: 'ciq', price: 1000 });
// track('form_submitted', { formType: 'contact_sales', page: 'campaigniq' });
// track('migration_assessment_started', { platform: 'sap' });
```

```typescript
// src/features/analytics/PageViewTracker.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import posthog from 'posthog-js';

export function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    posthog.capture('$pageview', {
      path: location.pathname,
      search: location.search,
    });
  }, [location]);

  return null; // Invisible component
}
```

### 6.3 Session Timeout

```typescript
// src/hooks/useIdleTimeout.ts
import { useEffect, useRef, useCallback } from 'react';

export function useIdleTimeout(
  onIdle: () => void,
  onWarning: () => void,
  timeoutMs = 30 * 60 * 1000,     // 30 min
  warningMs = 2 * 60 * 1000        // 2 min warning before timeout
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const warningRef = useRef<ReturnType<typeof setTimeout>>();

  const resetTimer = useCallback(() => {
    clearTimeout(timeoutRef.current);
    clearTimeout(warningRef.current);

    warningRef.current = setTimeout(onWarning, timeoutMs - warningMs);
    timeoutRef.current = setTimeout(onIdle, timeoutMs);
  }, [onIdle, onWarning, timeoutMs, warningMs]);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      clearTimeout(timeoutRef.current);
      clearTimeout(warningRef.current);
    };
  }, [resetTimer]);
}
```

### 6.4 Screen Alerts / Toast System

```typescript
// src/features/notifications/alertStore.ts
import { create } from 'zustand';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message?: string;
  duration?: number;    // ms, default 5000
  action?: { label: string; onClick: () => void };
}

interface AlertStore {
  alerts: Alert[];
  push: (alert: Omit<Alert, 'id'>) => void;
  dismiss: (id: string) => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  push: (alert) => set((state) => ({
    alerts: [...state.alerts, { ...alert, id: crypto.randomUUID() }]
  })),
  dismiss: (id) => set((state) => ({
    alerts: state.alerts.filter(a => a.id !== id)
  })),
}));

// Usage:
// const { push } = useAlertStore();
// push({ type: 'success', title: 'Added to cart', message: 'CampaignIQ - Single User' });
// push({ type: 'error', title: 'Session expired', action: { label: 'Log in', onClick: () => navigate('/login') } });
```

### 6.5 Slack Integration

```typescript
// src/features/integrations/slack/slackService.ts
import { env } from '@/config/env';

interface SlackNotification {
  channel?: string;
  text: string;
  blocks?: any[];
}

export async function sendSlackNotification(notification: SlackNotification) {
  if (!env.VITE_SLACK_WEBHOOK_URL) return;

  try {
    await fetch(env.VITE_SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: notification.text,
        blocks: notification.blocks,
      }),
    });
  } catch (error) {
    console.error('Slack notification failed:', error);
  }
}

// Example: notify sales on new PO request
// sendSlackNotification({
//   text: `🛒 New PO Request from ${email}`,
//   blocks: [
//     { type: 'header', text: { type: 'plain_text', text: '🛒 New PO Request' } },
//     { type: 'section', text: { type: 'mrkdwn', text: `*Customer:* ${name}\n*Total:* ${total}` } },
//   ]
// });
```

### 6.6 Downloads System

```typescript
// src/features/downloads/useDownload.ts
import { useAuth } from '@/features/auth/useAuth';
import { useTrack } from '@/features/analytics/useTrack';
import { useAlertStore } from '@/features/notifications/alertStore';

export function useDownload() {
  const { user, isAuthenticated } = useAuth();
  const track = useTrack();
  const { push } = useAlertStore();

  async function download(fileId: string, fileName: string) {
    if (!isAuthenticated) {
      push({ type: 'warning', title: 'Login required', message: 'Please log in to download files.' });
      return;
    }

    track('file_downloaded', { fileId, fileName });

    try {
      const response = await fetch(`/api/downloads/${fileId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

      push({ type: 'success', title: 'Download started', message: fileName });
    } catch {
      push({ type: 'error', title: 'Download failed', message: 'Please try again.' });
    }
  }

  return { download };
}
```

### 6.7 Chat System

```typescript
// src/components/chat/ChatWidget.tsx
// Persistent across ALL routes — rendered in RootLayout

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useLocation } from 'react-router-dom';
import { useTrack } from '@/features/analytics/useTrack';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: '0',
  text: "Hi! I'm Blue. How can I help you navigate the Blueprint Marketplace?",
  sender: 'bot',
  timestamp: new Date(),
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const track = useTrack();

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend(text: string) {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    track('chat_message_sent', { page: location.pathname });

    // Bot response (replace with LLM API call in future)
    setTimeout(() => {
      const botMsg: Message = {
        id: crypto.randomUUID(),
        text: getBotResponse(text),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
    }, 800);
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => { setIsOpen(!isOpen); track('chat_toggled', { open: !isOpen }); }}
        className="fixed bottom-6 right-6 z-50 bg-blueprint-blue text-white p-4 shadow-lg
                   hover:bg-blue-800 transition-transform hover:scale-105"
        aria-label="Open chat"
      >
        <ChatIcon />
      </button>

      {/* Window */}
      <div className={`fixed bottom-24 right-6 z-50 bg-white w-80 h-96 shadow-2xl
                        flex flex-col border border-gray-200 transition-all origin-bottom-right
                        ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        {/* Header */}
        <div className="bg-black text-white p-4 flex justify-between items-center">
          <h5 className="font-bold text-sm uppercase tracking-wide">Blue Assistant</h5>
          <button onClick={() => setIsOpen(false)} className="opacity-70 hover:opacity-100">×</button>
        </div>

        {/* Messages */}
        <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-gray-50">
          {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput onSend={handleSend} />
      </div>
    </>
  );
}
```

---

## PART 7: MODULARITY PATTERNS

### 7.1 Adding a New Product (5 minutes)

Edit ONE file — `src/data/products.ts`:

```typescript
{
  id: 'new-product',
  slug: 'new-product',
  assetType: 'tool',
  title: 'NewProductIQ',
  description: 'Description here...',
  tags: ['AI', 'Analytics'],
  categories: ['financial-services', 'gaming'],
  pricing: { subscription: { monthly: 1000, annual: 10000 } },
  prerequisites: 'Databricks Workspace.',
  videoUrl: 'https://youtube.com/embed/xxx',
}
```

It auto-appears in: homepage grid, category filters, product modal, product detail page route.

### 7.2 Adding a New Migration Platform (10 minutes)

1. Create config: `src/data/migration-schemas/newplatform.ts`
2. Add entry to `src/data/platforms.ts`
3. Route auto-resolves via `:platform` param — no router change needed.

```typescript
// src/data/migration-schemas/newplatform.ts
import { MigrationSchema } from '@/types/migration';

export const newplatformSchema: MigrationSchema = {
  platform: 'newplatform',
  title: 'NewPlatform to Databricks Migration Assessment',
  brandColor: '#FF6600',
  sections: [
    {
      id: 'exec',
      title: 'Executive Summary',
      canMarkNA: true,
      fields: [
        { name: 'projectName', label: 'Project Name', type: 'text', required: true },
        { name: 'stakeholder', label: 'Stakeholder', type: 'text', required: true },
        // ...
      ],
    },
    // ... more sections
  ],
  romCalculation: (formData) => {
    // Platform-specific ROM logic
    return { totalHours: 0, estimatedCost: 0, breakdown: {} };
  },
};
```

### 7.3 Adding a New Page Type (2 minutes)

```
1. Create src/pages/newtype/NewPage.tsx
2. Add route to src/config/routes.ts
3. Add lazy import + route in src/app/Router.tsx
4. Done.
```

### 7.4 Cloning for a Client/Tenant

The entire marketplace can be white-labeled by changing:

```typescript
// src/config/theme.ts
export const theme = {
  brandName: 'Blueprint',
  brandColor: '#1d4ed8',
  logoUrl: '/images/branding/logo.png',
  bgColor: '#eef2f6',
  fontFamily: 'DM Sans',
};
```

Every component reads from this config. Change 5 values → entirely new brand.

---

## PART 8: CI/CD & DEPLOYMENT

### 8.1 GitHub Actions — CI Pipeline

```yaml
# .github/workflows/ci.yml
name: CI
on: [pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test -- --run
      - run: npm run build
```

### 8.2 GitHub Actions — Deploy Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

permissions:
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_POSTHOG_KEY: ${{ secrets.VITE_POSTHOG_KEY }}
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 8.3 GitHub Pages SPA Fix

```html
<!-- public/404.html — redirects all routes to index.html -->
<!DOCTYPE html>
<html>
<head>
  <script>
    // Converts /products/ciq → /?/products/ciq → index.html handles it
    const path = window.location.pathname;
    window.location.replace(window.location.origin + '/?p=' + encodeURIComponent(path));
  </script>
</head>
</html>
```

```typescript
// In App.tsx — read redirect param on mount
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const redirectPath = params.get('p');
  if (redirectPath) {
    window.history.replaceState(null, '', redirectPath);
  }
}, []);
```

### 8.4 Deploy Workflow (Developer Experience)

```
git checkout -b feature/new-product
# Edit src/data/products.ts
git add . && git commit -m "feat: add NewProductIQ"
git push origin feature/new-product
# CI runs → lint, type-check, test, build
# Open PR → review → merge to main
# Deploy workflow runs → live in ~90 seconds
```

---

## PART 9: ANALYTICS & USER TRACKING

### 9.1 Event Taxonomy

```typescript
// src/config/analytics.ts
export const EVENTS = {
  // Navigation
  PAGE_VIEW: '$pageview',
  NAV_CLICK: 'nav_link_clicked',
  MEGA_MENU_OPENED: 'mega_menu_opened',

  // Marketplace
  CATEGORY_FILTERED: 'category_filtered',
  PRODUCT_CARD_CLICKED: 'product_card_clicked',
  PRODUCT_MODAL_OPENED: 'product_modal_opened',
  PRODUCT_MODAL_TAB_CHANGED: 'product_modal_tab_changed',

  // Product Detail
  PRODUCT_PAGE_VIEWED: 'product_page_viewed',
  VIDEO_PLAYED: 'video_played',
  TECH_ARCH_VIEWED: 'tech_arch_viewed',
  READINESS_CHECKLIST_STARTED: 'readiness_checklist_started',
  READINESS_CHECKLIST_COMPLETED: 'readiness_checklist_completed',

  // Cart
  CART_ITEM_ADDED: 'cart_item_added',
  CART_ITEM_REMOVED: 'cart_item_removed',
  CART_VIEWED: 'cart_viewed',
  CHECKOUT_STARTED: 'checkout_started',
  CHECKOUT_COMPLETED: 'checkout_completed',

  // Migration
  MIGRATION_ASSESSMENT_STARTED: 'migration_assessment_started',
  MIGRATION_SECTION_COMPLETED: 'migration_section_completed',
  MIGRATION_ROM_GENERATED: 'migration_rom_generated',

  // Auth
  LOGIN_STARTED: 'login_started',
  LOGIN_COMPLETED: 'login_completed',
  SIGNUP_COMPLETED: 'signup_completed',
  SESSION_TIMEOUT_WARNING: 'session_timeout_warning',
  SESSION_EXPIRED: 'session_expired',

  // Chat
  CHAT_OPENED: 'chat_opened',
  CHAT_MESSAGE_SENT: 'chat_message_sent',

  // Forms
  CONTACT_FORM_OPENED: 'contact_form_opened',
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',

  // Downloads
  FILE_DOWNLOADED: 'file_downloaded',
} as const;
```

### 9.2 Website Usage Metrics (Tag Implementation)

```typescript
// src/features/analytics/AnalyticsProvider.tsx
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { env } from '@/config/env';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (env.VITE_POSTHOG_KEY) {
      posthog.init(env.VITE_POSTHOG_KEY, {
        api_host: env.VITE_POSTHOG_HOST,
        capture_pageview: false,        // We handle manually via PageViewTracker
        capture_pageleave: true,
        autocapture: true,              // Auto-tracks clicks, inputs, page views
        session_recording: {
          maskAllInputs: true,           // Privacy: mask form inputs in recordings
          maskTextSelector: '.sensitive', // Mask elements with .sensitive class
        },
        persistence: 'localStorage+cookie',
      });
    }
  }, []);

  return (
    <PostHogProvider client={posthog}>
      {children}
    </PostHogProvider>
  );
}
```

### 9.3 User Behavior Tracking

PostHog provides out of the box:
- **Session recordings** — replay exactly what users did
- **Heatmaps** — where users click on each page
- **Funnels** — track conversion: homepage → product modal → add to cart → checkout
- **Retention** — how often users return
- **Feature flags** — toggle features for specific users/segments

---

## PART 10: BUILD PHASES & TIMELINE

### Phase 1: Foundation (Week 1-2)
**Goal**: Deployable shell with homepage parity

| Task | Components |
|------|-----------|
| Vite + React + TS + Tailwind setup | `vite.config.ts`, `tailwind.config.ts`, `globals.css` |
| Design tokens + preserved styles | `animations.css`, `components.css` |
| App shell | `App.tsx`, `Providers.tsx`, `Router.tsx` |
| Root layout | `RootLayout.tsx`, `Header.tsx`, `Footer.tsx`, `MegaMenu.tsx` |
| Product data extraction | `products.ts`, `categories.ts`, `navigation.ts` |
| Homepage | `MarketplacePage`, `ProductGrid`, `ProductCard`, `CategoryFilter` |
| Homepage modal | `ProductModal` with tabs |
| Cart store | Zustand store, `CartBadge`, `AddToCartButton` |
| Chat widget | `ChatWidget` (static responses, persistent) |
| GitHub Actions deploy | `ci.yml`, `deploy.yml`, `404.html` SPA fix |
| Alert system | `AlertProvider`, `AlertContainer`, `Toast` |

**Deliverable**: Full homepage + header/footer + cart + chat + alerts, deployed to GitHub Pages.

### Phase 2: Product & Cart Pages (Week 3)
**Goal**: All product detail pages + full cart flow

| Task | Components |
|------|-----------|
| Shared product layout | `ProductDetailPage` — renders from `products.ts` |
| Pricing sidebar | `PricingSidebar`, `ReadinessChecklist` |
| Contact sales modal | `ContactSalesModal` + Formspree |
| Image lightbox | `ImageLightbox` |
| Cart page | `CartPage`, `CartTable` |
| Checkout flow | `CheckoutModal` + PO form + Formspree |
| Confirmation modal | `ConfirmationModal` |

**Deliverable**: All 6 IQ product pages + cart + checkout working.

### Phase 3: Migration Suite (Week 4-5)
**Goal**: All migration forms as one parameterized component

| Task | Components |
|------|-----------|
| Migration landing | `MigrationLandingPage`, `PlatformTile` |
| Assessment engine | `MigrationAssessmentPage`, `AssessmentSection` |
| Per-platform configs | 11 schema files in `migration-schemas/` |
| ROM calculation logic | `romCalculator.ts` (extracted from inline JS) |
| ROM calculator page | `ROMCalculatorPage` |
| Form validation | Zod schemas per platform |

**Deliverable**: All 11+ migration platforms rendered from config.

### Phase 4: Content Pages (Week 5)
**Goal**: Remaining content pages

| Task | Components |
|------|-----------|
| AI Factory page | `AIFactoryPage` |
| Whitepaper page | `WhitepaperPage` (reusable for future articles) |
| 404 page | `NotFoundPage` |

### Phase 5: Auth & Security (Week 6-7)
**Goal**: Login, protected routes, session management

| Task | Components |
|------|-----------|
| Auth provider setup | Auth0/Supabase integration |
| Login/signup pages | `LoginPage`, `SignupPage`, `ForgotPasswordPage` |
| Protected routes | `ProtectedRoute`, `RoleGate` |
| Session timeout | `useIdleTimeout`, warning modal |
| API service layer | `api.ts` with auth headers, token refresh |
| User dashboard | `DashboardPage`, `SettingsPage` |
| Download system | `DownloadsPage`, `useDownload` |
| Order history | `OrderHistoryPage` |

### Phase 6: Integrations & Analytics (Week 7-8)
**Goal**: Full tracking, Slack, polished UX

| Task | Components |
|------|-----------|
| PostHog integration | `AnalyticsProvider`, `PageViewTracker` |
| Event tracking | `useTrack` hook + event taxonomy |
| Session recording | PostHog config |
| Slack webhooks | `slackService.ts` for form submissions |
| CSP headers | Meta tag + Vercel/GH Pages headers |
| Performance audit | Lighthouse, bundle analysis |
| Mobile nav | `MobileNav` hamburger menu |

### Phase 7: Chat Enhancement (Week 9+)
**Goal**: Upgrade chat from hardcoded to intelligent

| Task | Components |
|------|-----------|
| Chat message history | Persist in Zustand |
| Context-aware responses | Pass current route/product to bot |
| LLM API integration | Claude/OpenAI API call from chat |
| Typing indicators | Animated "..." while waiting |
| Quick action buttons | Suggested prompts per page |

---

## PART 11: QUALITY GATES

Every PR must pass before merge:

```
✅ TypeScript — zero errors (npm run type-check)
✅ ESLint — zero warnings (npm run lint)
✅ Tests — all passing (npm run test)
✅ Build — succeeds (npm run build)
✅ Bundle — < 500KB initial load
✅ Lighthouse — Performance > 90, A11y > 90
✅ No innerHTML, no eval, no dangerouslySetInnerHTML
✅ All form inputs validated with Zod
✅ All new events tracked in analytics taxonomy
✅ Responsive — works at 375px, 768px, 1280px, 1920px
```

---

## APPENDIX A: Design Token Reference

```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --blueprint-blue: #1d4ed8;
    --bg-primary: #eef2f6;
    --text-primary: #111827;
    --border-card: #d1d5db;
    --red-badge: #dc2626;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background-color: var(--bg-primary);
    color: var(--text-primary);
  }

  /* Global sharp corners — preserve the Blueprint aesthetic */
  button, input, select, textarea {
    border-radius: 0px !important;
  }
}
```

```typescript
// tailwind.config.ts
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'blueprint-blue': '#1d4ed8',
      },
      fontFamily: {
        'dm-sans': ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'pop-in': 'popIn 0.4s ease-out forwards',
        'modal-enter': 'fadeIn 0.3s ease-out',
        'modal-leave': 'fadeOut 0.3s ease-in',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0', transform: 'scale(0.98)' }, to: { opacity: '1', transform: 'scale(1)' } },
        fadeOut: { from: { opacity: '1', transform: 'scale(1)' }, to: { opacity: '0', transform: 'scale(0.98)' } },
        popIn: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
};
```

## APPENDIX B: Key File Counts (Before vs. After)

| Metric | v1 (Current) | v2 (React) |
|--------|-------------|------------|
| HTML files to maintain | 30 | 1 (`index.html`) |
| Lines of duplicated boilerplate | ~5,000 | 0 |
| Migration form files | 22 (11 platforms × 2 phases) | 11 config files + 1 component |
| Product detail pages | 6 separate HTML files | 1 component + data config |
| JS files with global state | 3 | 0 (all module-scoped) |
| `innerHTML` calls (XSS surface) | 16 | 0 |
| Inline event handlers | 38 | 0 |
| Build step | None | Vite (auto via CI) |
| Deploy process | Manual git push of HTML | Auto on merge to main |
| Time to add new product | 30+ min (copy HTML, edit) | 2 min (add to `products.ts`) |
| Time to add migration platform | 2+ hours (copy 700-line file) | 10 min (add schema config) |
