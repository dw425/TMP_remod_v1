# BLUEPRINT MARKETPLACE 2.0 — COMPLETE BUILD SPECIFICATION
## Standalone Handoff Document — Zero Context Required

**Document Version**: 1.0
**Date**: February 8, 2026
**Status**: Ready for Development
**Original Repo**: github.com/dw425/TMP_Dev_v4
**New Repo**: github.com/dw425/TMP_remod_v1

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Current State Audit](#2-current-state-audit)
3. [Two-Repo Strategy](#3-two-repo-strategy)
4. [Tech Stack](#4-tech-stack)
5. [Design System Reference](#5-design-system-reference)
6. [Complete Project Structure](#6-complete-project-structure)
7. [Data Extraction Reference](#7-data-extraction-reference)
8. **Build Phases (Detailed)**
   - [Phase 0: Repository & Infrastructure Setup](#phase-0-repository--infrastructure-setup)
   - [Phase 1: Foundation Shell](#phase-1-foundation-shell)
   - [Phase 2: Cart & Product Detail Pages](#phase-2-cart--product-detail-pages)
   - [Phase 3: Migration Assessment Suite](#phase-3-migration-assessment-suite)
   - [Phase 4: Content & Utility Pages](#phase-4-content--utility-pages)
   - [Phase 5: Authentication & User Accounts](#phase-5-authentication--user-accounts)
   - [Phase 6: Analytics, Tracking & Integrations](#phase-6-analytics-tracking--integrations)
   - [Phase 7: Secure Content Delivery & Downloads](#phase-7-secure-content-delivery--downloads)
   - [Phase 8: Databricks Deployment Pipeline](#phase-8-databricks-deployment-pipeline)
   - [Phase 9: Chat System & AI Assistant](#phase-9-chat-system--ai-assistant)
9. [CI/CD & Deployment](#9-cicd--deployment)
10. [Quality Gates](#10-quality-gates)
11. [Security Checklist](#11-security-checklist)
12. [Risk Register](#12-risk-register)

---

# 1. EXECUTIVE SUMMARY

## What We're Building

Converting the Blueprint Technology Marketplace from a 30-file static HTML website into a production-grade React SPA. The new platform must support 100+ pages, user authentication, secure product delivery, Databricks notebook deployment, Slack integration, analytics/tracking, a persistent chatbot, and seamless integration with the parent company website (bpcs.com).

## Why

| Problem (Current v1) | Solution (v2) |
|---|---|
| 30 standalone HTML files, ~16,000 lines | 1 React SPA with dynamic routing |
| 12 near-identical 700-line migration forms | 1 parameterized component + 11 config files |
| Header/footer loaded via fetch-and-inject | Proper React layout components |
| 16 innerHTML calls (XSS vulnerability) | Zero innerHTML — JSX only |
| No authentication | JWT auth with role-based access |
| No analytics | Full event tracking + session recording |
| Manual deploy via git push | Auto CI/CD via GitHub Actions |
| Adding a product = copy/edit 150+ lines of HTML | Adding a product = add 1 object to a config array |

## Two Repositories

| Repository | Purpose | Visibility |
|---|---|---|
| `dw425/TMP_remod_v1` | React SPA — the website itself | Public (GitHub Pages) |
| `bpcs/marketplace-content` | Notebooks, wheels, bundles — IP assets | **Private** (never public) |

---

# 2. CURRENT STATE AUDIT

## 2.1 File Inventory

| File | Lines | Purpose | React Equivalent |
|---|---|---|---|
| `index.html` | 509 | Homepage / marketplace grid with inline product data | `MarketplacePage.tsx` + `products.ts` |
| `header.html` | 96 | Shared header (fetched via JS) | `Header.tsx` component |
| `footer.html` | 19 | Shared footer (fetched via JS) | `Footer.tsx` component |
| `cart.html` | 278 | Shopping cart + PO checkout modal | `CartPage.tsx` |
| `cart.js` | 224 | Cart logic (localStorage, badge, events) | `cartStore.ts` (Zustand) |
| `cart.css` | ~150 | Cart drawer, FAB, badge styles | Tailwind classes |
| `style.css` | 187 | Global overrides, animations, design system | `globals.css` + `tailwind.config.ts` |
| `modals.js` | 245 | 4 global modals (innerHTML injection) | React modal components |
| `load-components.js` | 29 | Fetches header/footer at runtime | Eliminated (React layouts) |
| `ciq_pp.html` | 145 | CampaignIQ product detail | `ProductDetailPage.tsx` (shared) |
| `sap_wc.html` | 164 | SAP Working Capital detail | `ProductDetailPage.tsx` (shared) |
| `churn_iq.html` | 147 | ChurnIQ detail | `ProductDetailPage.tsx` (shared) |
| `promotion_iq.html` | 147 | PromotionIQ detail | `ProductDetailPage.tsx` (shared) |
| `cs_iq.html` | 149 | CustomerSupport IQ detail | `ProductDetailPage.tsx` (shared) |
| `lho.html` | 147 | Lakehouse Optimizer detail | `ProductDetailPage.tsx` (shared) |
| `cover_a.html` | ~300 | Migration landing page (11 platform tiles) | `MigrationLandingPage.tsx` |
| `sap.html` | 600 | SAP migration assessment form | `MigrationAssessmentPage.tsx` + `sap.ts` config |
| `snow.html` | 600 | Snowflake migration assessment | Same component + `snowflake.ts` config |
| `oracle.html` | 600 | Oracle migration assessment | Same component + `oracle.ts` config |
| `red.html` | 650 | Redshift (AWS) migration assessment | Same component + `redshift.ts` config |
| `sql.html` | 680 | SQL Server migration assessment | Same component + `sql-server.ts` config |
| `infor.html` | 600 | Informatica migration assessment | Same component + `informatica.ts` config |
| `synapse.html` | 600 | Azure Synapse migration assessment | Same component + `synapse.ts` config |
| `td.html` | 600 | Teradata migration assessment | Same component + `teradata.ts` config |
| `talend.html` | 600 | Talend migration assessment | Same component + `talend.ts` config |
| `gcp.html` | 600 | GCP migration assessment | Same component + `gcp.ts` config |
| `ucm.html` | 600 | Unity Catalog migration assessment | Same component + `unity-catalog.ts` config |
| `sap2.html` / `snow2.html` / etc. | ~600 each | Phase 2 variants (not linked) | Same component, `phase` param |
| `aifactory.html` | ~500 | AI Factory landing page | `AIFactoryPage.tsx` |
| `wp_trending.html` | ~400 | Whitepaper / trending insight | `WhitepaperPage.tsx` |
| `calc.html` | ~500 | ROM calculator | `ROMCalculatorPage.tsx` |
| `tmp_overlay` | ~200 | Overlay/alternate homepage | Evaluate for inclusion |

## 2.2 Interactive Systems to Preserve

### Shopping Cart (`cart.js`)
- `localStorage` key: `blueprint_cart_v1`
- Operations: `Cart.get()`, `Cart.add(item)`, `Cart.remove(id)`, `Cart.clear()`
- Global click listener on `.add-to-cart-btn` elements
- Header badge updates via 100ms polling (workaround for async header load)
- Cart items have: `id`, `title`, `price`, `type`, `billing` (monthly/onetime/annual)

### Modal System (`modals.js`)
- `window.BlueprintModals` global object
- 4 modals injected via innerHTML:
  - `techArchModal` — image lightbox for architecture diagrams
  - `amIReadyModal` — 9-item readiness checklist with checkboxes
  - `contactSalesModal` — Formspree form (endpoint: `mgozdqkj`)
  - `messageSentModal` — confirmation message

### Homepage Product Modal (inline in `index.html`)
- Tabbed modal: Overview / Video Demo / Pricing / Prerequisites
- Opens on product card click
- Contact Sales sub-modal with Formspree
- Blue Chat FAB widget with hardcoded Q&A responses

### Category Filtering (inline in `index.html`)
- 10 categories: All Industries, Financial Services, Healthcare, Gaming, Media, Oil & Gas, Defense, Accelerators, Videos, Demos, Migration Tools
- Re-renders entire product grid via string concatenation

### Migration Form Logic (inline `<script>` per form)
- Multi-section questionnaires with N/A toggle (disables section inputs)
- Client-side validation with `.is-invalid` class + error spans
- ROM calculation: `distribute(total, sliderVal)` function allocates across Simple/Medium/Complex/Very Complex
- Stores form data in `sessionStorage` key `lastAssessmentReport`
- Redirects to `calc.html` for ROM output

## 2.3 External Integrations

| Integration | Endpoint | Used In |
|---|---|---|
| Formspree (Contact Sales) | `https://formspree.io/f/mgozdqkj` | `modals.js` — global contact form |
| Formspree (PO Checkout) | `https://formspree.io/f/xwpgdwbd` | `cart.html` — purchase order form |
| Formspree (AI Factory) | `https://formspree.io/f/xjkavwle` | `aifactory.html` — contact form |
| Formspree (ROM Calculator) | `https://formspree.io/f/mnnoelgb` | `calc.html` — ROM submission |
| YouTube | Various embed URLs | Product modals + detail pages |
| bpcs.com | 20+ subpage links | Header mega-menu, footer, throughout |
| GitHub Pages | `dw425.github.io/TMP_Dev_v4` | Current hosting |

## 2.4 Security Vulnerabilities (Current)

| Issue | Severity | Count | Location |
|---|---|---|---|
| `innerHTML` assignment | HIGH | 16 | `modals.js`, `index.html` grid rendering |
| Inline `onclick` handlers | MEDIUM | 38 | Throughout HTML files |
| Global `window.*` objects | MEDIUM | 3 | `window.BlueprintModals`, `window.Cart` |
| Tailwind CDN (no SRI hash) | MEDIUM | 30 pages | Every HTML `<head>` |
| No input sanitization | HIGH | All forms | Migration assessments, contact forms |
| No CSP headers | MEDIUM | - | GitHub Pages default |
| No session timeout | HIGH | - | No auth exists yet |
| Formspree IDs in source HTML | LOW | 4 | Hardcoded in markup |
| No rate limiting | MEDIUM | - | All forms submittable unlimited times |

---

# 3. TWO-REPO STRATEGY

## Repo 1: `dw425/TMP_remod_v1` (Public)

The React SPA. Contains all UI code, styling, configuration, and build tooling. Deployed to GitHub Pages (or Vercel). This is what users see and interact with.

**Contains**: React components, Tailwind styles, product catalog data (titles, descriptions, pricing), route definitions, analytics config, CI/CD workflows.

**Does NOT contain**: Notebooks, proprietary code, wheel files, GitHub PATs, API secrets.

## Repo 2: `bpcs/marketplace-content` (Private)

The product vault. Contains all IP-protected deliverables: Databricks notebooks, Python wheels, Asset Bundles, migration accelerators. Never directly accessible from the browser.

**Contains**: `.py` notebooks, `.ipynb` files, `.dbc` archives, `.whl` compiled packages, `databricks.yml` bundle configs, product manifests.

**Accessed via**: Server-side download proxy that authenticates users, checks entitlements, injects license watermarks, and streams files. The GitHub PAT lives only on the server.

### Why Two Repos

1. **Security**: The marketplace SPA is public (GitHub Pages). Product IP must be private. Mixing them means either the site can't be on GitHub Pages or the products are exposed.
2. **Separation of concerns**: UI developers work in repo 1. Data engineers add notebooks to repo 2. Neither blocks the other.
3. **Independent versioning**: Products can be updated (new notebook versions) without redeploying the website, and vice versa.
4. **Scalability**: Repo 2 can grow to 100+ products without affecting website build times.

---

# 4. TECH STACK

| Layer | Technology | Version | Why |
|---|---|---|---|
| Framework | React | 18.x | Component model, ecosystem, TypeScript support |
| Language | TypeScript | 5.x | Type safety, better IDE support, catches bugs at compile time |
| Build Tool | Vite | 5.x | Fast HMR, native TS/JSX, tree-shaking, smaller bundles than Webpack |
| Routing | React Router | v6.x | Nested routes, lazy loading, data loaders, SPA navigation |
| Styling | Tailwind CSS | v3.x | Keeps existing class names from v1, compiled via PostCSS (not CDN) |
| Global State | Zustand | 4.x | Lightweight (1KB), no boilerplate, DevTools, persist middleware |
| Server State | TanStack Query | 5.x | Cache, retry, loading/error states for API calls |
| Forms | React Hook Form + Zod | Latest | Performance (uncontrolled inputs), schema-based validation |
| Auth | Supabase Auth (or Auth0) | Latest | JWT, OAuth, role-based, magic links, social login |
| Analytics | PostHog | Latest | Event tracking, session replay, heatmaps, feature flags, self-hostable |
| Testing | Vitest + RTL | Latest | Fast (Vite-native), React Testing Library for component tests |
| CI/CD | GitHub Actions | - | Auto lint/test on PR, auto deploy on merge to main |
| Hosting | GitHub Pages + Vercel Edge | - | SPA hosting + serverless functions for download proxy |
| Chat (future) | Custom + Claude API | - | Persistent widget, upgradeable to AI |

---

# 5. DESIGN SYSTEM REFERENCE

Every visual detail from v1 must be preserved exactly. These are the non-negotiable design tokens:

## 5.1 Colors

```
Blueprint Blue (primary):     #1d4ed8
Background:                   #eef2f6
Text Primary:                 #111827 (gray-900)
Text Secondary:               #6b7280 (gray-500)
Card Border:                  #d1d5db (gray-300)
Card Top Accent:              4px solid #1d4ed8
Badge Red:                    #dc2626
Black (header bg, sections):  #000000
White (cards, modals):        #ffffff
```

## 5.2 Typography

```
Font Family:    'DM Sans', sans-serif
Weights:        400 (body), 500 (medium), 700 (bold)
Import:         Google Fonts — https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap
```

## 5.3 Sharp Corners Rule

```css
/* CRITICAL: Blueprint uses zero border-radius everywhere */
button, input, select, textarea, .card, .modal, .badge, .alert {
  border-radius: 0px !important;
}
```

This is a core brand identity element. No rounded corners anywhere except the cart badge circle.

## 5.4 Card Pattern (SharpCard)

```
Background:     white
Border:         1px solid #d1d5db
Top accent:     4px solid #1d4ed8 (optional, controlled by prop)
Shadow:         none by default, shadow-sm on hover
Padding:        p-6
Corner radius:  0px
```

## 5.5 Logo Filter

The Blueprint logo is white PNG. This CSS filter recolors it to Blueprint Blue:

```css
.blue-logo-filter {
  filter: brightness(0) saturate(100%) invert(25%) sepia(98%) saturate(1600%) hue-rotate(219deg) brightness(96%) contrast(95%);
}
```

## 5.6 Animations

```css
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes popIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Product cards stagger on load */
.pop-in { animation: popIn 0.4s ease-out forwards; }
```

## 5.7 Migration Platform Brand Colors

```
SAP:            #008FD3
Snowflake:      #29B5E8
Oracle:         #C74634
AWS/Redshift:   #232F3E
SQL Server:     #737373
Informatica:    #FF4D00
Azure Synapse:  #0078D4
Teradata:       #F37421
Talend:         #FF6D70
GCP:            #4285F4
Databricks:     #FF3621
```

---

# 6. COMPLETE PROJECT STRUCTURE

```
dw425/TMP_remod_v1/
│
├── .github/
│   └── workflows/
│       ├── ci.yml                         # Lint + type-check + test on PR
│       └── deploy.yml                     # Build + deploy on merge to main
│
├── public/
│   ├── images/
│   │   ├── products/                      # Product screenshots, arch diagrams
│   │   ├── platforms/                     # Local copies of platform logos
│   │   └── branding/                      # Blueprint logo, favicon
│   ├── 404.html                           # SPA redirect trick for GitHub Pages
│   └── favicon.ico
│
├── api/                                    # Serverless functions (Vercel Edge)
│   ├── downloads/
│   │   └── [assetId].ts                   # Secure download proxy
│   ├── deploy/
│   │   └── notebook.ts                    # Databricks workspace import
│   └── telemetry/
│       └── notebook-run.ts                # Runtime license check endpoint
│
├── src/
│   ├── app/
│   │   ├── App.tsx                        # Root — wraps Providers + Router
│   │   ├── Router.tsx                     # ALL route definitions (single file)
│   │   ├── Providers.tsx                  # Auth, Query, Analytics, Alert wrappers
│   │   └── ErrorBoundary.tsx              # Global catch for render errors
│   │
│   ├── config/
│   │   ├── routes.ts                      # Route path constants
│   │   ├── env.ts                         # Env var validation (Zod)
│   │   ├── bpcs.ts                        # ALL bpcs.com URLs and API hooks
│   │   ├── formspree.ts                   # Form endpoint IDs
│   │   ├── analytics.ts                   # Event name constants
│   │   └── features.ts                    # Feature flags
│   │
│   ├── data/
│   │   ├── products.ts                    # Product catalog (10 items)
│   │   ├── categories.ts                  # Filter categories (10)
│   │   ├── navigation.ts                  # Header nav + mega-menu structure
│   │   ├── platforms.ts                   # Migration platform list + metadata
│   │   └── migration-schemas/             # Per-platform form definitions
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
│   │   ├── RootLayout.tsx                 # Header + Footer + Chat + Alerts + Outlet
│   │   ├── MarketplaceLayout.tsx          # Optional marketplace-specific wrapper
│   │   ├── MigrationLayout.tsx            # Migration suite wrapper
│   │   └── AuthLayout.tsx                 # Login/signup (no header/footer nav)
│   │
│   ├── components/
│   │   ├── ui/                            # Stateless design system primitives
│   │   │   ├── SharpCard.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── FilterButton.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── FormField.tsx
│   │   │   ├── YouTubeEmbed.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── index.ts                   # Barrel export
│   │   │
│   │   ├── composed/                      # Stateful multi-component pieces
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── MegaMenu.tsx
│   │   │   │   ├── MobileNav.tsx
│   │   │   │   ├── CartBadge.tsx
│   │   │   │   └── UserMenu.tsx
│   │   │   ├── Footer/
│   │   │   │   └── Footer.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductModal.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── PricingSidebar.tsx
│   │   │   ├── ReadinessChecklist.tsx
│   │   │   ├── PlatformTile.tsx
│   │   │   └── AssessmentSection.tsx
│   │   │
│   │   ├── modals/
│   │   │   ├── ContactSalesModal.tsx
│   │   │   ├── ImageLightbox.tsx
│   │   │   ├── CheckoutModal.tsx
│   │   │   ├── ConfirmationModal.tsx
│   │   │   ├── DownloadTermsModal.tsx
│   │   │   └── ModalManager.tsx
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatWidget.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   └── ChatInput.tsx
│   │   │
│   │   └── alerts/
│   │       ├── AlertProvider.tsx
│   │       └── AlertContainer.tsx
│   │
│   ├── pages/
│   │   ├── marketplace/
│   │   │   └── MarketplacePage.tsx
│   │   ├── products/
│   │   │   └── ProductDetailPage.tsx
│   │   ├── migration/
│   │   │   ├── MigrationLandingPage.tsx
│   │   │   ├── MigrationAssessmentPage.tsx
│   │   │   └── ROMCalculatorPage.tsx
│   │   ├── content/
│   │   │   ├── AIFactoryPage.tsx
│   │   │   └── WhitepaperPage.tsx
│   │   ├── cart/
│   │   │   └── CartPage.tsx
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   ├── account/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── DownloadsPage.tsx
│   │   │   ├── DeploymentsPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── OrderHistoryPage.tsx
│   │   └── errors/
│   │       ├── NotFoundPage.tsx
│   │       └── ErrorPage.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── useAuth.ts
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── RoleGate.tsx
│   │   │   └── authService.ts
│   │   ├── cart/
│   │   │   ├── cartStore.ts
│   │   │   ├── useCart.ts
│   │   │   └── cartTypes.ts
│   │   ├── analytics/
│   │   │   ├── AnalyticsProvider.tsx
│   │   │   ├── useTrack.ts
│   │   │   ├── PageViewTracker.tsx
│   │   │   ├── SessionTracker.tsx
│   │   │   └── events.ts
│   │   ├── notifications/
│   │   │   ├── useAlerts.ts
│   │   │   └── alertStore.ts
│   │   ├── downloads/
│   │   │   ├── useSecureDownload.ts
│   │   │   ├── useEntitlements.ts
│   │   │   └── downloadService.ts
│   │   ├── databricks/
│   │   │   ├── useDatabricksAuth.ts
│   │   │   ├── useDatabricksDeploy.ts
│   │   │   ├── DatabricksCallbackPage.tsx
│   │   │   └── DatabricksConnectionModal.tsx
│   │   └── integrations/
│   │       ├── slack/
│   │       │   ├── slackService.ts
│   │       │   └── useSlackNotify.ts
│   │       ├── formspree/
│   │       │   └── formService.ts
│   │       └── bpcs/
│   │           ├── leadService.ts
│   │           └── useBPCSAuth.ts
│   │
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useScrollLock.ts
│   │   ├── useIdleTimeout.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useClickOutside.ts
│   │   └── useKeyboardShortcut.ts
│   │
│   ├── lib/
│   │   ├── api.ts                         # Fetch wrapper with auth headers
│   │   ├── cn.ts                          # Tailwind class merge (clsx + twMerge)
│   │   ├── formatCurrency.ts
│   │   ├── validators.ts                  # Shared Zod schemas
│   │   ├── romCalculator.ts               # Extracted ROM logic
│   │   └── security.ts                    # DOMPurify, CSP helpers
│   │
│   ├── styles/
│   │   ├── globals.css                    # Tailwind directives + design tokens
│   │   ├── animations.css                 # fadeIn, popIn, modal transitions
│   │   └── components.css                 # Sharp card, filter, article-body
│   │
│   └── types/
│       ├── product.ts
│       ├── cart.ts
│       ├── user.ts
│       ├── migration.ts
│       └── api.ts
│
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── package.json
└── README.md
```

---

# 7. DATA EXTRACTION REFERENCE

All data currently hardcoded in HTML must be extracted into TypeScript config files. Here is every data set:

## 7.1 Product Catalog

Source: `index.html` lines ~50–250 (inline `allContent` array)

```typescript
// src/data/products.ts
export interface Product {
  id: number;
  slug: string;
  assetType: 'tool' | 'content' | 'accelerator';
  title: string;
  description: string;
  tags: string[];
  categories: string[];
  pricing: {
    subscription?: { monthly: number; annual: number };
    payg?: string;
    byol?: boolean;
  };
  prerequisites: string;
  videoUrl: string;
  link: string;                    // Legacy HTML page (for reference only)
  assets?: DownloadableAsset[];     // Phase 7
  deployment?: DeploymentConfig;    // Phase 8
}

export const products: Product[] = [
  {
    id: 7,
    slug: 'top-trending-insight',
    assetType: 'content',
    title: 'Top Trending Insight',
    description: 'Stop Guessing: Winning in today\'s market requires a shift from hindsight to foresight...',
    tags: ['AI Strategy', 'Marketing', 'Forecasting'],
    categories: ['media', 'videos'],
    pricing: {},
    prerequisites: '',
    videoUrl: 'https://www.youtube.com/embed/48gEgOcCaKo',
    link: 'wp_trending.html',
  },
  {
    id: 1,
    slug: 'lakehouse-optimizer',
    assetType: 'tool',
    title: 'Lakehouse Optimizer',
    description: 'Control costs, optimize architecture, and forecast value...',
    tags: ['FinOps', 'Optimization', 'Databricks'],
    categories: ['financial-services', 'gaming', 'media', 'oil-gas', 'defense', 'accelerators', 'demos', 'migration-tools'],
    pricing: { subscription: { monthly: 1000, annual: 10000 }, payg: 'Contact Sales for Team/Enterprise' },
    prerequisites: 'Databricks Workspace with system tables enabled.',
    videoUrl: 'https://www.youtube.com/embed/OREruNWafPE',
    link: 'lho.html',
  },
  {
    id: 15,
    slug: 'campaign-iq',
    assetType: 'tool',
    title: 'CampaignIQ',
    description: 'AI-powered media planning...',
    tags: ['AI', 'Marketing', 'ROAS'],
    categories: ['gaming', 'media', 'accelerators', 'demos'],
    pricing: { subscription: { monthly: 1000, annual: 10000 }, payg: 'Contact Sales for Team/Enterprise' },
    prerequisites: 'Databricks Workspace.',
    videoUrl: 'https://www.youtube.com/embed/smNEBimkSGI',
    link: 'ciq_pp.html',
  },
  {
    id: 16,
    slug: 'sap-working-capital',
    assetType: 'tool',
    title: 'SAP Working Capital',
    description: 'Real-Time Working Capital Intelligence Powered by SAP and Databricks...',
    tags: ['Finance', 'SAP', 'Manufacturing'],
    categories: ['financial-services', 'accelerators'],
    pricing: { subscription: { monthly: 1000, annual: 10000 }, payg: 'Contact Sales for Team/Enterprise' },
    prerequisites: 'Databricks Workspace, SAP ERP system.',
    videoUrl: '',
    link: 'sap_wc.html',
  },
  {
    id: 17,
    slug: 'promotion-iq',
    assetType: 'tool',
    title: 'PromotionIQ',
    description: 'Analyze, Optimize, and Recommend Promotions...',
    tags: ['Marketing', 'Promotion', 'Sportsbook'],
    categories: ['gaming', 'media', 'accelerators'],
    pricing: { subscription: { monthly: 1000, annual: 10000 }, payg: 'Contact Sales for Team/Enterprise' },
    prerequisites: 'Databricks Workspace.',
    videoUrl: '',
    link: 'promotion_iq.html',
  },
  {
    id: 18,
    slug: 'churn-iq',
    assetType: 'tool',
    title: 'ChurnIQ',
    description: 'Predict, Segment, and Retain Customers with Databricks...',
    tags: ['Customer Success', 'Churn', 'Gaming'],
    categories: ['financial-services', 'gaming', 'media', 'accelerators'],
    pricing: { subscription: { monthly: 1000, annual: 10000 }, payg: 'Contact Sales for Team/Enterprise' },
    prerequisites: 'Databricks Workspace.',
    videoUrl: '',
    link: 'churn_iq.html',
  },
  {
    id: 19,
    slug: 'customer-support-iq',
    assetType: 'tool',
    title: 'CustomerSupport IQ',
    description: 'Real-Time Transcript Intelligence and Agent Coaching with GenAI...',
    tags: ['Customer Support', 'GenAI', 'Sentiment Analysis'],
    categories: ['healthcare', 'accelerators'],
    pricing: { subscription: { monthly: 1000, annual: 10000 }, payg: 'Contact Sales for Team/Enterprise' },
    prerequisites: 'Databricks Workspace.',
    videoUrl: '',
    link: 'cs_iq.html',
  },
  {
    id: 13,
    slug: 'ai-factory',
    assetType: 'accelerator',
    title: "Blueprint's AI Factory",
    description: 'The assembly line for business-ready AI...',
    tags: ['GenAI', 'RAG', 'Tutorial'],
    categories: ['accelerators'],
    pricing: {},
    prerequisites: '',
    videoUrl: 'https://www.youtube.com/embed/48gEgOcCaKo',
    link: 'aifactory.html',
  },
  {
    id: 20,
    slug: 'data-migration-suite',
    assetType: 'tool',
    title: 'The Blueprint Data Migration Suite',
    description: 'Assess, transform, and enhance your data migration initiative...',
    tags: ['Migration', 'ETL', 'Data Engineering'],
    categories: ['migration-tools', 'accelerators'],
    pricing: {},
    prerequisites: 'Databricks Workspace.',
    videoUrl: '',
    link: 'cover_a.html',
  },
];
```

## 7.2 Categories

```typescript
// src/data/categories.ts
export const categories = [
  { id: 'all', name: 'All Industries' },
  { id: 'financial-services', name: 'Financial Services' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'media', name: 'Media' },
  { id: 'oil-gas', name: 'Oil & Gas' },
  { id: 'defense', name: 'Defense' },
  { id: 'accelerators', name: 'Accelerators' },
  { id: 'videos', name: 'Videos' },
  { id: 'demos', name: 'Demos' },
  { id: 'migration-tools', name: 'Migration Tools' },
];
```

## 7.3 Migration Platforms

Source: `cover_a.html` tile grid

```typescript
// src/data/platforms.ts
export const platforms = [
  { id: 'sap', slug: 'sap', name: 'SAP', brandColor: '#008FD3', logo: 'sap-logo.svg', formFile: 'sap.html' },
  { id: 'snowflake', slug: 'snowflake', name: 'Snowflake', brandColor: '#29B5E8', logo: 'snowflake-logo.svg', formFile: 'snow.html' },
  { id: 'oracle', slug: 'oracle', name: 'Oracle', brandColor: '#C74634', logo: 'oracle-logo.svg', formFile: 'oracle.html' },
  { id: 'redshift', slug: 'redshift', name: 'AWS Redshift', brandColor: '#232F3E', logo: 'aws-logo.svg', formFile: 'red.html' },
  { id: 'sql-server', slug: 'sql-server', name: 'SQL Server', brandColor: '#737373', logo: 'microsoft-logo.svg', formFile: 'sql.html' },
  { id: 'informatica', slug: 'informatica', name: 'Informatica', brandColor: '#FF4D00', logo: 'informatica.png', formFile: 'infor.html' },
  { id: 'synapse', slug: 'synapse', name: 'Azure Synapse', brandColor: '#0078D4', logo: 'azure-logo.svg', formFile: 'synapse.html' },
  { id: 'teradata', slug: 'teradata', name: 'Teradata', brandColor: '#F37421', logo: 'teradata.png', formFile: 'td.html' },
  { id: 'talend', slug: 'talend', name: 'Talend', brandColor: '#FF6D70', logo: null, formFile: 'talend.html' },
  { id: 'gcp', slug: 'gcp', name: 'Google Cloud', brandColor: '#4285F4', logo: 'gcp-logo.svg', formFile: 'gcp.html' },
  { id: 'unity-catalog', slug: 'unity-catalog', name: 'Unity Catalog', brandColor: '#FF3621', logo: 'databricks-logo.png', formFile: 'ucm.html' },
];
```

## 7.4 Header Navigation

Source: `header.html`

```typescript
// src/data/navigation.ts
import { BPCS } from '@/config/bpcs';

export const headerNav = {
  logo: {
    src: 'https://bpcs.com/wp-content/uploads/2021/02/BlueprintLogo_White_Tiles-400x81.png',
    alt: 'Blueprint',
    href: BPCS.nav.home,
  },
  mainLinks: [
    { label: 'AI-Migration', href: '/migration', icon: '+' },
    {
      label: 'What we do', icon: '+',
      megaMenu: {
        columns: [
          {
            title: 'AI & Analytics',
            links: [
              { label: 'Generative AI', href: BPCS.services.genai },
              { label: 'Intelligent SOP', href: BPCS.services.intelligentSop },
              { label: 'Video Analytics', href: BPCS.services.videoAnalytics },
              { label: 'Data Science', href: BPCS.services.dataScience },
            ],
          },
          {
            title: 'Modern Platforms',
            links: [
              { label: 'Platform Modernization', href: BPCS.services.dataPlatform },
              { label: 'Lakehouse Optimization', href: BPCS.services.lakehouse },
              { label: 'Cloud & Infrastructure', href: BPCS.services.cloud },
              { label: 'Data Migration', href: BPCS.services.dataMigration },
            ],
          },
          {
            title: 'Data Management',
            links: [
              { label: 'Data Governance', href: BPCS.services.dataGovernance },
              { label: 'Data Management', href: BPCS.services.dataManagement },
              { label: 'TCO Planning', href: BPCS.services.tcoPlanning },
            ],
          },
          {
            title: 'App & Strategy',
            links: [
              { label: 'Application Development', href: BPCS.services.appDev },
              { label: 'Productization', href: BPCS.services.productization },
              { label: 'Future Proofing', href: BPCS.services.futureProofing },
            ],
          },
        ],
      },
    },
    {
      label: 'Databricks', icon: '+',
      megaMenu: {
        columns: [
          { title: null, links: [
            { label: 'Databricks + Blueprint', href: BPCS.services.databricks, desc: 'Our partnership with Databricks...' },
            { label: 'Migration Accelerators', href: '/migration', desc: 'Assess your environment...' },
            { label: 'Lakehouse Optimization', href: BPCS.services.lakehouse, desc: 'Optimize for performance...' },
            { label: 'Unity Catalog Migration', href: '/migration/unity-catalog', desc: 'Upgrade to Unity Catalog...' },
            { label: 'Databricks SQL', href: BPCS.services.databricksSql, desc: 'Run BI workloads...' },
          ]},
        ],
      },
    },
    { label: 'Our Work', href: BPCS.nav.caseStudies },
    { label: 'StrategyHub', href: 'https://dw425.github.io/StrategyHub_test/' },
  ],
  cta: { label: 'Connect', href: BPCS.nav.contact },
};
```

## 7.5 Formspree Endpoints

```typescript
// src/config/formspree.ts
export const FORMSPREE = {
  contactSales: import.meta.env.VITE_FORMSPREE_CONTACT || 'mgozdqkj',
  poCheckout: import.meta.env.VITE_FORMSPREE_PO || 'xwpgdwbd',
  aiFactory: import.meta.env.VITE_FORMSPREE_AIFACTORY || 'xjkavwle',
  romCalculator: import.meta.env.VITE_FORMSPREE_CALC || 'mnnoelgb',
} as const;
```

## 7.6 bpcs.com Link Registry

```typescript
// src/config/bpcs.ts
export const BPCS = {
  baseUrl: 'https://bpcs.com',
  nav: {
    home: 'https://bpcs.com',
    contact: 'https://bpcs.com/contact',
    caseStudies: 'https://bpcs.com/case-studies',
  },
  services: {
    dataMigration: 'https://bpcs.com/data-migration',
    dataGovernance: 'https://bpcs.com/data-governance',
    dataManagement: 'https://bpcs.com/data-management',
    dataPlatform: 'https://bpcs.com/data-platform-modernization',
    dataScience: 'https://bpcs.com/data-science',
    appDev: 'https://bpcs.com/application-development',
    cloud: 'https://bpcs.com/cloud-and-infrastructure',
    genai: 'https://bpcs.com/genai',
    databricks: 'https://bpcs.com/databricks',
    databricksSql: 'https://bpcs.com/databricks-sql',
    lakehouse: 'https://bpcs.com/lakehouse-optimization',
    futureProofing: 'https://bpcs.com/future-proofing',
    productization: 'https://bpcs.com/productization',
    tcoPlanning: 'https://bpcs.com/tco-planning',
    intelligentSop: 'https://bpcs.com/intelligent-sop',
    videoAnalytics: 'https://bpcs.com/video-analytics',
  },
  api: {
    baseUrl: 'https://api.bpcs.com',
    leads: '/v1/leads',
    sso: '/v1/auth/sso',
    crm: '/v1/crm/sync',
  },
} as const;
```

---

# PHASE 0: REPOSITORY & INFRASTRUCTURE SETUP

**Duration**: 2-3 hours
**Prerequisites**: GitHub account, Node.js 20+, npm 9+
**Output**: Empty but fully configured project, building, deploying to GitHub Pages

## 0.1 Create Repo 1 (Marketplace SPA)

```bash
# New repo on GitHub: dw425/TMP_remod_v1
# Clone locally
git clone git@github.com:dw425/TMP_remod_v1.git
cd TMP_remod_v1

# Initialize Vite + React + TypeScript
npm create vite@latest . -- --template react-ts

# Install core dependencies
npm install react-router-dom zustand @tanstack/react-query
npm install react-hook-form zod @hookform/resolvers
npm install clsx tailwind-merge

# Install dev dependencies
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/react @types/react-dom
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

## 0.2 Configure Tailwind

```bash
npx tailwindcss init -p
```

**File: `tailwind.config.ts`**
```typescript
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'blueprint-blue': '#1d4ed8',
        'bg-primary': '#eef2f6',
      },
      fontFamily: {
        'dm-sans': ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'pop-in': 'popIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'scale(0.98)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        popIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
```

## 0.3 Configure Vite

**File: `vite.config.ts`**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/TMP_remod_v1/',  // GitHub Pages subdirectory
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          state: ['zustand', '@tanstack/react-query'],
        },
      },
    },
  },
});
```

## 0.4 Configure TypeScript Aliases

**File: `tsconfig.json`** — add paths:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## 0.5 Create Global Styles

**File: `src/styles/globals.css`**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');

@layer base {
  :root {
    --blueprint-blue: #1d4ed8;
    --bg-primary: #eef2f6;
    --text-primary: #111827;
    --border-card: #d1d5db;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    -webkit-font-smoothing: antialiased;
  }

  /* CRITICAL: Blueprint sharp corners everywhere */
  *, *::before, *::after {
    border-radius: 0px !important;
  }

  /* Exception: cart badge is circular */
  .badge-circle { border-radius: 9999px !important; }
}

@layer components {
  .blue-logo-filter {
    filter: brightness(0) saturate(100%) invert(25%) sepia(98%) saturate(1600%) hue-rotate(219deg) brightness(96%) contrast(95%);
  }
}
```

## 0.6 Create Environment Config

**File: `.env.example`**
```bash
# App
VITE_APP_NAME=Blueprint Marketplace
VITE_APP_URL=https://dw425.github.io/TMP_remod_v1

# API (Vercel Edge Functions or external backend)
VITE_API_URL=https://marketplace-api.bpcs.com

# Auth (Supabase or Auth0)
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxx

# Formspree
VITE_FORMSPREE_CONTACT=mgozdqkj
VITE_FORMSPREE_PO=xwpgdwbd
VITE_FORMSPREE_AIFACTORY=xjkavwle
VITE_FORMSPREE_CALC=mnnoelgb

# Analytics
VITE_POSTHOG_KEY=phc_xxxx
VITE_POSTHOG_HOST=https://app.posthog.com

# Integrations
VITE_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
VITE_BPCS_API_URL=https://api.bpcs.com
VITE_BPCS_SSO_ENABLED=false

# Databricks OAuth
VITE_DATABRICKS_CLIENT_ID=xxxx

# Feature Flags
VITE_ENABLE_CHAT=true
VITE_ENABLE_ANALYTICS=false
VITE_SESSION_TIMEOUT_MINUTES=30
```

**File: `src/config/env.ts`**
```typescript
import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_NAME: z.string().default('Blueprint Marketplace'),
  VITE_API_URL: z.string().url().optional(),
  VITE_FORMSPREE_CONTACT: z.string().default('mgozdqkj'),
  VITE_FORMSPREE_PO: z.string().default('xwpgdwbd'),
  VITE_FORMSPREE_AIFACTORY: z.string().default('xjkavwle'),
  VITE_FORMSPREE_CALC: z.string().default('mnnoelgb'),
  VITE_POSTHOG_KEY: z.string().optional(),
  VITE_SLACK_WEBHOOK_URL: z.string().optional(),
  VITE_ENABLE_CHAT: z.string().transform(v => v === 'true').default('true'),
  VITE_ENABLE_ANALYTICS: z.string().transform(v => v === 'true').default('false'),
  VITE_SESSION_TIMEOUT_MINUTES: z.coerce.number().default(30),
});

export const env = envSchema.parse(import.meta.env);
```

## 0.7 GitHub Pages SPA Redirect

**File: `public/404.html`**
```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<script>
  // Single-page app redirect for GitHub Pages
  // Converts /products/ciq → /?p=/products/ciq → index.html handles it
  var path = window.location.pathname;
  var repo = '/TMP_remod_v1';
  if (path.startsWith(repo)) path = path.slice(repo.length);
  window.location.replace(
    window.location.origin + repo + '/?p=' + encodeURIComponent(path + window.location.search)
  );
</script>
</head>
<body></body>
</html>
```

## 0.8 Setup CI/CD

**File: `.github/workflows/ci.yml`**
```yaml
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
      - run: npx tsc --noEmit
      - run: npm run test -- --run
      - run: npm run build
```

**File: `.github/workflows/deploy.yml`**
```yaml
name: Deploy to GitHub Pages
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
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
      - id: deployment
        uses: actions/deploy-pages@v4
```

## 0.9 Create Repo 2 (Product Content)

```bash
# On GitHub: create bpcs/marketplace-content as PRIVATE repo
# Structure it as follows:

marketplace-content/
├── README.md              # Internal documentation
├── LICENSE                # "Blueprint Proprietary — All Rights Reserved"
├── products/
│   ├── campaign-iq/
│   │   ├── notebooks/
│   │   ├── bundles/
│   │   ├── wheels/
│   │   └── manifest.json
│   ├── lakehouse-optimizer/
│   ├── sap-working-capital/
│   ├── promotion-iq/
│   ├── churn-iq/
│   └── customer-support-iq/
├── accelerators/
│   ├── migration-sap/
│   ├── migration-snowflake/
│   └── ... (one per platform)
├── templates/
│   └── notebook-header.py    # Standard license block template
└── .github/
    └── workflows/
        └── validate.yml      # Lint notebooks on PR
```

## 0.10 Phase 0 Acceptance Criteria

- [ ] `npm run dev` starts Vite dev server with HMR
- [ ] `npm run build` produces `dist/` folder
- [ ] `npm run lint` passes with zero errors
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] GitHub Pages deployment works (shows default Vite page)
- [ ] `@/` import alias works in TypeScript files
- [ ] Tailwind classes compile (test: add `bg-blueprint-blue` to a div)
- [ ] `.env.example` committed, `.env` in `.gitignore`
- [ ] Private content repo created with initial folder structure

---

# PHASE 1: FOUNDATION SHELL

**Duration**: 1-2 weeks
**Prerequisites**: Phase 0 complete
**Replaces**: `index.html`, `header.html`, `footer.html`, `style.css`, `cart.js`, `load-components.js`, `modals.js` (partial)
**Output**: Fully functional homepage with header, footer, product grid, category filters, product modal, cart, chat widget, and alerts — all deployed to GitHub Pages

## 1.1 Files to Create

```
src/app/App.tsx
src/app/Router.tsx
src/app/Providers.tsx
src/app/ErrorBoundary.tsx

src/config/routes.ts
src/config/env.ts (from Phase 0)
src/config/bpcs.ts
src/config/formspree.ts
src/config/features.ts

src/data/products.ts
src/data/categories.ts
src/data/navigation.ts

src/layouts/RootLayout.tsx

src/components/ui/SharpCard.tsx
src/components/ui/Button.tsx
src/components/ui/Modal.tsx
src/components/ui/FilterButton.tsx
src/components/ui/Badge.tsx
src/components/ui/Spinner.tsx
src/components/ui/Toast.tsx
src/components/ui/FormField.tsx
src/components/ui/YouTubeEmbed.tsx
src/components/ui/Skeleton.tsx
src/components/ui/index.ts

src/components/composed/Header/Header.tsx
src/components/composed/Header/MegaMenu.tsx
src/components/composed/Header/MobileNav.tsx
src/components/composed/Header/CartBadge.tsx
src/components/composed/Footer/Footer.tsx
src/components/composed/ProductCard.tsx
src/components/composed/ProductGrid.tsx
src/components/composed/ProductModal.tsx
src/components/composed/CategoryFilter.tsx

src/components/modals/ContactSalesModal.tsx
src/components/modals/ConfirmationModal.tsx

src/components/chat/ChatWidget.tsx
src/components/chat/ChatMessage.tsx
src/components/chat/ChatInput.tsx

src/components/alerts/AlertProvider.tsx
src/components/alerts/AlertContainer.tsx

src/pages/marketplace/MarketplacePage.tsx
src/pages/errors/NotFoundPage.tsx

src/features/cart/cartStore.ts
src/features/cart/cartTypes.ts
src/features/cart/useCart.ts
src/features/notifications/alertStore.ts
src/features/notifications/useAlerts.ts
src/features/integrations/formspree/formService.ts

src/hooks/useScrollLock.ts
src/hooks/useClickOutside.ts
src/hooks/useMediaQuery.ts
src/hooks/useDebounce.ts

src/lib/cn.ts
src/lib/formatCurrency.ts

src/styles/globals.css (from Phase 0)
src/styles/animations.css
src/styles/components.css

src/types/product.ts
src/types/cart.ts
```

## 1.2 Key Implementation Details

### App Entry Point

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

### Route Constants

```typescript
// src/config/routes.ts
export const ROUTES = {
  HOME: '/',
  CART: '/cart',
  PRODUCT: '/products/:slug',
  MIGRATION_HOME: '/migration',
  MIGRATION_ASSESS: '/migration/:platform',
  MIGRATION_PHASE: '/migration/:platform/:phase',
  ROM_CALCULATOR: '/migration/calculator',
  AI_FACTORY: '/content/ai-factory',
  WHITEPAPER: '/content/:slug',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/account',
  DOWNLOADS: '/account/downloads',
  DEPLOYMENTS: '/account/deployments',
  ORDERS: '/account/orders',
  SETTINGS: '/account/settings',
  DATABRICKS_CALLBACK: '/auth/databricks/callback',
} as const;
```

### Router (Lazy Loading)

```typescript
// src/app/Router.tsx — Phase 1 version (only homepage + 404)
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { RootLayout } from '@/layouts/RootLayout';
import { Spinner } from '@/components/ui';
import { ROUTES } from '@/config/routes';

const MarketplacePage = lazy(() => import('@/pages/marketplace/MarketplacePage'));
const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage'));

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <Suspense fallback={<Spinner />}><MarketplacePage /></Suspense> },
      { path: '*', element: <Suspense fallback={<Spinner />}><NotFoundPage /></Suspense> },
    ],
  },
], { basename: '/TMP_remod_v1' });

export function AppRouter() {
  return <RouterProvider router={router} />;
}
```

### RootLayout (Persistent Shell)

```typescript
// src/layouts/RootLayout.tsx
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/composed/Header/Header';
import { Footer } from '@/components/composed/Footer/Footer';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { AlertContainer } from '@/components/alerts/AlertContainer';

export function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary font-dm-sans">
      <Header />
      <main className="flex-grow"><Outlet /></main>
      <Footer />
      <ChatWidget />
      <AlertContainer />
    </div>
  );
}
```

### Cart Store (Zustand + localStorage Persist)

```typescript
// src/features/cart/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types/cart';

interface CartStore {
  items: CartItem[];
  add: (item: Omit<CartItem, 'quantity'>) => void;
  remove: (id: number) => void;
  clear: () => void;
  totalCount: () => number;
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
    }),
    { name: 'blueprint_cart_v2' }
  )
);
```

### Alert Store

```typescript
// src/features/notifications/alertStore.ts
import { create } from 'zustand';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface AlertStore {
  alerts: Alert[];
  push: (alert: Omit<Alert, 'id'>) => void;
  dismiss: (id: string) => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  push: (alert) => {
    const id = crypto.randomUUID();
    set((state) => ({ alerts: [...state.alerts, { ...alert, id }] }));
    // Auto-dismiss after duration
    setTimeout(() => {
      set((state) => ({ alerts: state.alerts.filter(a => a.id !== id) }));
    }, alert.duration || 5000);
  },
  dismiss: (id) => set((state) => ({
    alerts: state.alerts.filter(a => a.id !== id)
  })),
}));
```

### Product Modal Structure

The product modal is the most complex component in Phase 1. It must replicate the tabbed modal from `index.html`:

```
┌──────────────────────────────────────────────┐
│  [X]                                          │
│  PRODUCT TITLE                                │
│  Description text...                          │
│                                               │
│  ┌──────────┬────────────┬─────────┬────────┐│
│  │ Overview │ Video Demo │ Pricing │ Prereq ││
│  └──────────┴────────────┴─────────┴────────┘│
│                                               │
│  [Tab Content Area]                           │
│                                               │
│  ┌──────────────────┐  ┌──────────────────┐  │
│  │ Contact Sales    │  │ Add to Cart      │  │
│  └──────────────────┘  └──────────────────┘  │
└──────────────────────────────────────────────┘
```

Tabs: Overview (description + tags), Video Demo (YouTube embed), Pricing (monthly/annual/PAYG table), Prerequisites (text block).

### Chat Widget (Hardcoded Responses for Phase 1)

Persistent across all routes (rendered in RootLayout). Blue FAB in bottom-right corner. Phase 1 uses hardcoded Q&A. Phase 9 upgrades to LLM.

```typescript
// Hardcoded responses for Phase 1
const RESPONSES: Record<string, string> = {
  'pricing': 'Our IQ products start at $1,000/month. Contact sales for enterprise pricing.',
  'migration': 'Visit our Migration Suite to assess your environment. We support SAP, Snowflake, Oracle, and 8 more platforms.',
  'contact': 'Email us at marketplace@bpcs.com or click Contact Sales on any product.',
  'databricks': 'All our products run on Databricks. You need an active workspace to get started.',
  'default': "I can help with pricing, migration assessments, or product information. What would you like to know?",
};
```

## 1.3 Phase 1 Acceptance Criteria

- [ ] Homepage renders product grid with all 10 products from `products.ts`
- [ ] Category filter buttons filter the grid correctly (10 categories)
- [ ] Clicking a product card opens the tabbed modal (all 4 tabs work)
- [ ] "Add to Cart" button adds item to Zustand store + shows toast alert
- [ ] Cart badge in header shows correct count (updates reactively)
- [ ] Contact Sales modal opens with Formspree form that submits successfully
- [ ] Header matches v1 exactly: logo, nav links, mega-menu, Connect button, cart icon
- [ ] Footer matches v1 exactly
- [ ] Mega-menu opens on hover with correct 4-column layout
- [ ] All bpcs.com links open in new tab
- [ ] Chat widget FAB visible, opens/closes chat window
- [ ] Chat responds to basic queries with hardcoded responses
- [ ] Toast alerts appear and auto-dismiss after 5 seconds
- [ ] 404 page shows for unknown routes
- [ ] Mobile: hamburger menu works at < 1280px breakpoint
- [ ] `npm run build` succeeds, deploys to GitHub Pages
- [ ] Zero `innerHTML` calls in the entire codebase
- [ ] All Tailwind classes compile (no CDN)
- [ ] Sharp corners everywhere (zero border-radius)
- [ ] DM Sans font loads correctly

---

# PHASE 2: CART & PRODUCT DETAIL PAGES

**Duration**: 1 week
**Prerequisites**: Phase 1 complete
**Replaces**: `cart.html`, `cart.css`, `ciq_pp.html`, `sap_wc.html`, `churn_iq.html`, `promotion_iq.html`, `cs_iq.html`, `lho.html`, `modals.js` (remaining modals)
**Output**: All 6 product detail pages (from 1 shared component) + full cart page with checkout

## 2.1 Files to Create

```
src/pages/cart/CartPage.tsx
src/pages/products/ProductDetailPage.tsx

src/components/composed/PricingSidebar.tsx
src/components/composed/ReadinessChecklist.tsx
src/components/modals/ImageLightbox.tsx
src/components/modals/CheckoutModal.tsx

src/components/ui/YouTubeEmbed.tsx (enhanced)
```

## 2.2 Key Implementation Details

### Shared Product Detail Page

This is the single component that replaces all 6 product HTML files. The `:slug` URL param looks up the product from `products.ts`:

```typescript
// src/pages/products/ProductDetailPage.tsx
import { useParams, Navigate } from 'react-router-dom';
import { products } from '@/data/products';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find(p => p.slug === slug);

  if (!product) return <Navigate to="/404" replace />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
          <p className="text-gray-600">{product.description}</p>
          {product.videoUrl && <YouTubeEmbed url={product.videoUrl} />}
          {/* Architecture diagram with lightbox */}
          {/* Feature list */}
        </div>

        {/* Sidebar (1 col) */}
        <div className="space-y-6">
          <PricingSidebar product={product} />
          <ReadinessChecklist product={product} />
        </div>
      </div>
    </div>
  );
}
```

### Routes Added to Router.tsx

```typescript
// Add to Phase 1 router children:
{ path: ROUTES.CART, element: <Suspense fallback={<Spinner />}><CartPage /></Suspense> },
{ path: ROUTES.PRODUCT, element: <Suspense fallback={<Spinner />}><ProductDetailPage /></Suspense> },
```

### Cart Page Structure

```
┌──────────────────────────────────────────────────┐
│ CART                                              │
│                                                   │
│ ┌───────────────────────────────────────────────┐│
│ │ Product Title    │ Type │ Billing │ Qty │ [X] ││
│ │ CampaignIQ       │ Tool │ Monthly │  1  │ [X] ││
│ │ Lakehouse Opt    │ Tool │ Annual  │  1  │ [X] ││
│ └───────────────────────────────────────────────┘│
│                                                   │
│ Monthly Total:  $2,000/mo                         │
│ Annual Total:   $10,000                           │
│                                                   │
│ [Clear Cart]              [Request Purchase Order]│
└──────────────────────────────────────────────────┘
```

PO Request opens `CheckoutModal` with Formspree form (endpoint: `xwpgdwbd`).

## 2.3 Phase 2 Acceptance Criteria

- [ ] `/products/campaign-iq` renders CampaignIQ detail page from config
- [ ] `/products/lakehouse-optimizer` renders LHO detail page from config
- [ ] All 6 product slugs route correctly
- [ ] Invalid slug redirects to 404
- [ ] Pricing sidebar shows monthly/annual prices
- [ ] "Add to Cart" works from detail page
- [ ] Architecture diagram opens in lightbox modal
- [ ] Readiness checklist has checkable items
- [ ] Cart page lists all items with quantities
- [ ] Remove button removes item + shows toast
- [ ] Clear cart empties everything
- [ ] "Request PO" opens checkout modal
- [ ] Checkout form submits to Formspree successfully
- [ ] Confirmation modal shows after submission

---

# PHASE 3: MIGRATION ASSESSMENT SUITE

**Duration**: 1.5-2 weeks
**Prerequisites**: Phase 1 complete (Phase 2 can run in parallel)
**Replaces**: `cover_a.html`, `sap.html`, `snow.html`, `oracle.html`, `red.html`, `sql.html`, `infor.html`, `synapse.html`, `td.html`, `talend.html`, `gcp.html`, `ucm.html`, `sap2.html` (and all v2 variants), `calc.html`
**Output**: Migration landing page + 1 parameterized assessment form serving all 11 platforms + ROM calculator

**THIS IS THE HIGHEST-ROI PHASE: 22 HTML files (15,000+ lines) → 1 component + 11 config files.**

## 3.1 Files to Create

```
src/pages/migration/MigrationLandingPage.tsx
src/pages/migration/MigrationAssessmentPage.tsx
src/pages/migration/ROMCalculatorPage.tsx

src/components/composed/PlatformTile.tsx
src/components/composed/AssessmentSection.tsx

src/data/platforms.ts
src/data/migration-schemas/sap.ts
src/data/migration-schemas/snowflake.ts
src/data/migration-schemas/oracle.ts
src/data/migration-schemas/redshift.ts
src/data/migration-schemas/sql-server.ts
src/data/migration-schemas/informatica.ts
src/data/migration-schemas/synapse.ts
src/data/migration-schemas/teradata.ts
src/data/migration-schemas/talend.ts
src/data/migration-schemas/gcp.ts
src/data/migration-schemas/unity-catalog.ts

src/types/migration.ts
src/lib/romCalculator.ts
```

## 3.2 Migration Schema Type

```typescript
// src/types/migration.ts
export interface MigrationField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'range' | 'checkbox' | 'checkbox-group' | 'date';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];  // For select/checkbox-group
  min?: number;
  max?: number;
  defaultValue?: any;
}

export interface MigrationSection {
  id: string;
  title: string;
  subtitle?: string;
  canMarkNA: boolean;         // N/A toggle to disable entire section
  fields: MigrationField[];
}

export interface MigrationSchema {
  platform: string;           // Matches platforms.ts slug
  title: string;              // "SAP to Databricks Migration Assessment"
  subtitle: string;
  brandColor: string;
  sections: MigrationSection[];
  romCalculation: (formData: Record<string, any>) => ROMResult;
}

export interface ROMResult {
  totalObjects: number;
  breakdown: {
    simple: number;
    medium: number;
    complex: number;
    veryComplex: number;
  };
  estimatedHours: number;
  estimatedCost: { low: number; high: number };
}
```

## 3.3 Example Schema Config (SAP)

Each platform schema is extracted from its respective HTML file. The SAP form has these sections:

1. Executive Summary (project name, stakeholder, timeline, email, business driver)
2. Source ERP & Database Landscape (SAP system type, database, modules, table counts, complexity sliders)
3. HANA/CDS Views & Dependencies (view counts, complexity)
4. ETL & Integration Layer (pipeline counts, tools used)
5. Budget & Costs (current spend, services budget)
6. Form Completion Details (completed by, date)

```typescript
// src/data/migration-schemas/sap.ts
import type { MigrationSchema } from '@/types/migration';

export const sapSchema: MigrationSchema = {
  platform: 'sap',
  title: 'SAP to Databricks Migration Assessment',
  subtitle: 'Inventory your SAP ERP, BW, and HANA landscapes to generate a precise ROM estimate.',
  brandColor: '#008FD3',
  sections: [
    {
      id: 'exec',
      title: 'Executive Summary',
      canMarkNA: true,
      fields: [
        { name: 'projectName', label: 'Project Name', type: 'text', required: true },
        { name: 'stakeholder', label: 'Key Stakeholder', type: 'text', required: true },
        { name: 'timeline', label: 'Target Timeline', type: 'text', placeholder: 'e.g., Q3 2025' },
        { name: 'contactEmail', label: 'Contact Email', type: 'email', required: true },
        { name: 'businessDriver', label: 'Business Driver', type: 'textarea', placeholder: 'e.g., S/4HANA upgrade, cost reduction...' },
      ],
    },
    {
      id: 's1',
      title: 'Source ERP & Database Landscape',
      canMarkNA: true,
      fields: [
        { name: 'sapSystem', label: 'SAP System', type: 'select', options: [
          { value: 'ecc6', label: 'ECC 6.0' },
          { value: 's4hana', label: 'S/4HANA' },
          { value: 'bw4hana', label: 'BW/4HANA' },
          { value: 'bw', label: 'BW on HANA' },
          { value: 'other', label: 'Other' },
        ]},
        { name: 'databaseType', label: 'Database Type', type: 'text', placeholder: 'e.g., Oracle, HANA, DB2' },
        { name: 'modules', label: 'SAP Modules in Scope', type: 'checkbox-group', options: [
          { value: 'fi_co', label: 'FI/CO (Finance)' },
          { value: 'sd', label: 'SD (Sales & Dist)' },
          { value: 'mm', label: 'MM (Materials)' },
          { value: 'pp', label: 'PP (Production)' },
          { value: 'hr', label: 'HR/HCM' },
          { value: 'bw', label: 'BW/BI Reporting' },
        ]},
        { name: 'tableCount', label: 'Estimated Table Count', type: 'number', min: 0, defaultValue: 0 },
        { name: 'tableComplexity', label: 'Table Complexity', type: 'range', min: 1, max: 5, defaultValue: 3 },
        { name: 'bwObjectCount', label: 'BW Object Count', type: 'number', min: 0, defaultValue: 0 },
        { name: 'bwComplexity', label: 'BW Complexity', type: 'range', min: 1, max: 5, defaultValue: 3 },
        { name: 'totalDataSize', label: 'Total Data Size (TB)', type: 'number', min: 0 },
      ],
    },
    // ... sections 2-5 follow same pattern
    // Extract from sap.html lines 100-600
  ],
  romCalculation: (data) => {
    // Extracted from sap.html inline <script> — the distribute() function
    function distribute(total: number, sliderVal: number) {
      const t = total || 0;
      const val = sliderVal || 3;
      let s = 0.4, m = 0.4, c = 0.2, v = 0.0;
      if (val === 1) { s = 0.8; m = 0.2; c = 0; v = 0; }
      else if (val === 2) { s = 0.6; m = 0.3; c = 0.1; v = 0; }
      else if (val === 3) { s = 0.4; m = 0.4; c = 0.2; v = 0; }
      else if (val === 4) { s = 0.2; m = 0.4; c = 0.3; v = 0.1; }
      else if (val === 5) { s = 0.1; m = 0.2; c = 0.4; v = 0.3; }
      return {
        simple: Math.floor(t * s),
        medium: Math.floor(t * m),
        complex: Math.floor(t * c),
        veryComplex: Math.floor(t * v),
      };
    }

    const totalTables = (data.tableCount || 0) + (data.bwObjectCount || 0);
    const tableDist = distribute(totalTables, data.tableComplexity);
    // ... apply to all object types (views, pipelines, etc.)

    return {
      totalObjects: totalTables,
      breakdown: tableDist,
      estimatedHours: 0, // Calculate from breakdown
      estimatedCost: { low: 0, high: 0 },
    };
  },
};
```

## 3.4 Parameterized Assessment Page

```typescript
// src/pages/migration/MigrationAssessmentPage.tsx
import { useParams, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { platforms } from '@/data/platforms';
import { AssessmentSection } from '@/components/composed/AssessmentSection';

// Dynamic import of schema based on URL param
const schemaModules = import.meta.glob('@/data/migration-schemas/*.ts', { eager: true });

export default function MigrationAssessmentPage() {
  const { platform, phase } = useParams();
  const platformConfig = platforms.find(p => p.slug === platform);
  if (!platformConfig) return <Navigate to="/migration" replace />;

  // Load the right schema
  const schemaKey = Object.keys(schemaModules).find(k => k.includes(platformConfig.slug));
  if (!schemaKey) return <Navigate to="/migration" replace />;
  const { [`${platformConfig.slug}Schema`]: schema } = schemaModules[schemaKey] as any;

  const form = useForm({ mode: 'onBlur' });

  function onSubmit(data: Record<string, any>) {
    const rom = schema.romCalculation(data);
    sessionStorage.setItem('lastAssessmentReport', JSON.stringify({ ...data, rom }));
    // Navigate to ROM calculator
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold" style={{ color: schema.brandColor }}>
        {schema.title}
      </h1>
      <p className="text-gray-500 mt-2 mb-8">{schema.subtitle}</p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {schema.sections.map(section => (
          <AssessmentSection key={section.id} section={section} form={form} />
        ))}
        <button type="submit" className="bg-blueprint-blue text-white font-bold py-3 px-8 hover:bg-blue-800">
          Generate ROM & Report
        </button>
      </form>
    </div>
  );
}
```

## 3.5 Phase 3 Acceptance Criteria

- [ ] `/migration` shows landing page with all 11 platform tiles
- [ ] Each tile links to `/migration/{platform-slug}`
- [ ] Each platform renders its unique form sections from config
- [ ] N/A toggle disables all inputs in a section
- [ ] Client-side validation works (required fields, email format)
- [ ] First invalid field scrolls into view on submit
- [ ] ROM calculation produces correct breakdown for SAP (verify against v1)
- [ ] Form data stored in sessionStorage
- [ ] ROM Calculator page reads and displays results
- [ ] Form submission triggers Formspree send
- [ ] Platform brand colors applied correctly
- [ ] Adding a new platform = 1 new config file + 1 entry in platforms.ts (verify this is true)

---

# PHASE 4: CONTENT & UTILITY PAGES

**Duration**: 3-5 days
**Prerequisites**: Phase 1 complete
**Replaces**: `aifactory.html`, `wp_trending.html`
**Output**: AI Factory page, Whitepaper page

## 4.1 Files to Create

```
src/pages/content/AIFactoryPage.tsx
src/pages/content/WhitepaperPage.tsx
```

## 4.2 Notes

- AI Factory page has its own Formspree contact form (endpoint: `xjkavwle`)
- AI Factory has engagement pricing (1-Day Workshop, 6-Week, 12-Week), 90-Day framework, tools section
- Whitepaper page displays article content with images (`wp_image1of2.png`, `wp_image2of2.png`)
- Both pages use the same RootLayout (header/footer/chat)

## 4.3 Phase 4 Acceptance Criteria

- [ ] `/content/ai-factory` renders all sections from aifactory.html
- [ ] AI Factory contact form submits to correct Formspree endpoint
- [ ] Whitepaper page renders article content with images
- [ ] Both pages visually match v1

---

# PHASE 5: AUTHENTICATION & USER ACCOUNTS

**Duration**: 1.5-2 weeks
**Prerequisites**: Phase 1 complete
**Output**: Login/signup, protected routes, session timeout, user dashboard, order history

## 5.1 Files to Create

```
src/features/auth/AuthProvider.tsx
src/features/auth/useAuth.ts
src/features/auth/ProtectedRoute.tsx
src/features/auth/RoleGate.tsx
src/features/auth/authService.ts

src/layouts/AuthLayout.tsx

src/pages/auth/LoginPage.tsx
src/pages/auth/SignupPage.tsx
src/pages/auth/ForgotPasswordPage.tsx

src/pages/account/DashboardPage.tsx
src/pages/account/SettingsPage.tsx
src/pages/account/OrderHistoryPage.tsx

src/hooks/useIdleTimeout.ts

src/components/composed/Header/UserMenu.tsx
src/components/modals/SessionTimeoutModal.tsx
```

## 5.2 Auth Architecture

```
JWT access token:    Stored in memory (Zustand) — NEVER localStorage
Refresh token:       httpOnly cookie (set by Supabase/Auth0)
Session timeout:     30 min idle → warning modal → 2 min countdown → logout
Protected routes:    Redirect to /login?returnTo={current_path}
Role-based access:   RoleGate component shows/hides UI by role
```

## 5.3 Session Timeout Hook

```typescript
// src/hooks/useIdleTimeout.ts
export function useIdleTimeout(onIdle: () => void, onWarning: () => void, timeoutMs = 30 * 60 * 1000, warningMs = 2 * 60 * 1000) {
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

## 5.4 Phase 5 Acceptance Criteria

- [ ] Login page with email/password (styled to match Blueprint brand)
- [ ] Signup page with email, password, company name
- [ ] Forgot password flow sends reset email
- [ ] Successful login redirects to returnTo path or dashboard
- [ ] Header shows user avatar/menu when logged in
- [ ] User menu has: Dashboard, Settings, Logout
- [ ] Protected routes redirect to /login when not authenticated
- [ ] Session timeout warning at 28 minutes idle
- [ ] Auto-logout at 30 minutes idle
- [ ] Dashboard page shows user info + recent activity
- [ ] Order history shows past PO submissions
- [ ] JWT stored in memory only — verify via DevTools (not in localStorage)

---

# PHASE 6: ANALYTICS, TRACKING & INTEGRATIONS

**Duration**: 1 week
**Prerequisites**: Phase 1 + Phase 5 complete
**Output**: Full PostHog tracking, Slack notifications, bpcs.com hooks, CSP headers

## 6.1 Files to Create

```
src/features/analytics/AnalyticsProvider.tsx
src/features/analytics/useTrack.ts
src/features/analytics/PageViewTracker.tsx
src/features/analytics/SessionTracker.tsx
src/features/analytics/events.ts

src/features/integrations/slack/slackService.ts
src/features/integrations/slack/useSlackNotify.ts
src/features/integrations/bpcs/leadService.ts
src/features/integrations/bpcs/useBPCSAuth.ts
```

## 6.2 Event Taxonomy (25+ Events)

```typescript
// src/features/analytics/events.ts
export const EVENTS = {
  PAGE_VIEW: '$pageview',
  NAV_CLICK: 'nav_link_clicked',
  BPCS_LINK_CLICKED: 'bpcs_link_clicked',
  CATEGORY_FILTERED: 'category_filtered',
  PRODUCT_CARD_CLICKED: 'product_card_clicked',
  PRODUCT_MODAL_OPENED: 'product_modal_opened',
  PRODUCT_MODAL_TAB: 'product_modal_tab_changed',
  PRODUCT_PAGE_VIEWED: 'product_page_viewed',
  VIDEO_PLAYED: 'video_played',
  CART_ITEM_ADDED: 'cart_item_added',
  CART_ITEM_REMOVED: 'cart_item_removed',
  CART_VIEWED: 'cart_viewed',
  CHECKOUT_STARTED: 'checkout_started',
  CHECKOUT_COMPLETED: 'checkout_completed',
  MIGRATION_STARTED: 'migration_assessment_started',
  MIGRATION_SECTION_COMPLETED: 'migration_section_completed',
  MIGRATION_ROM_GENERATED: 'migration_rom_generated',
  LOGIN_COMPLETED: 'login_completed',
  SIGNUP_COMPLETED: 'signup_completed',
  SESSION_TIMEOUT: 'session_expired',
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',
  CHAT_OPENED: 'chat_opened',
  CHAT_MESSAGE_SENT: 'chat_message_sent',
  DOWNLOAD_INITIATED: 'download_initiated',
  DOWNLOAD_COMPLETED: 'download_completed',
  DEPLOY_INITIATED: 'deploy_initiated',
  DEPLOY_COMPLETED: 'deploy_completed',
} as const;
```

## 6.3 PostHog Configuration

```typescript
// src/features/analytics/AnalyticsProvider.tsx
import posthog from 'posthog-js';

posthog.init(env.VITE_POSTHOG_KEY, {
  api_host: env.VITE_POSTHOG_HOST,
  capture_pageview: false,         // Manual via PageViewTracker
  capture_pageleave: true,
  autocapture: true,               // Auto-tracks clicks, inputs
  session_recording: {
    maskAllInputs: true,            // Privacy: mask form data in replays
    maskTextSelector: '.sensitive',
  },
});
```

PostHog gives you: page views, session recordings, heatmaps, funnels (homepage → modal → cart → checkout), retention, and feature flags — all out of the box.

## 6.4 Slack Notifications

Triggered on: PO submissions, contact form fills, migration assessments completed, new signups.

```typescript
await sendSlackNotification({
  text: `🛒 New PO Request from ${email} — ${items.length} items, ${total}`,
});
```

## 6.5 Phase 6 Acceptance Criteria

- [ ] PostHog receives page view events on every route change
- [ ] Product click, cart add, form submit events tracked
- [ ] Session recording works (verify in PostHog dashboard)
- [ ] Slack webhook fires on PO submission
- [ ] Slack webhook fires on Contact Sales submission
- [ ] All bpcs.com links tracked via `bpcs_link_clicked` event
- [ ] CSP meta tag added (no eval, restricted script-src)
- [ ] `useBPCSAuth` hook exists and is callable (dormant until bpcs.com ready)
- [ ] `leadService.ts` sends to Formspree + Slack (bpcs.com CRM hook dormant)

---

# PHASE 7: SECURE CONTENT DELIVERY & DOWNLOADS

**Duration**: 1-1.5 weeks
**Prerequisites**: Phase 5 (auth) complete
**Output**: Secure download proxy, user entitlements, Downloads page, license watermarking

## 7.1 Architecture

```
User clicks Download → React hook sends JWT to proxy →
Proxy validates JWT → Checks entitlements → Fetches from private GitHub →
Injects license header with user email → Streams to user
```

GitHub PAT is **server-side only** (Vercel Edge Function env var). Never in React code.

## 7.2 Files to Create

```
api/downloads/[assetId].ts           # Serverless: secure download proxy
src/features/downloads/useSecureDownload.ts
src/features/downloads/useEntitlements.ts
src/features/downloads/downloadService.ts
src/pages/account/DownloadsPage.tsx
src/components/modals/DownloadTermsModal.tsx
```

## 7.3 IP Protection Layers

1. **Access Control**: Private GitHub repo, server-side PAT, JWT + entitlement check, rate limit (5/hour/user)
2. **Content Protection**: License header injected with user email + unique download ID, compiled Python wheels (.pyc not .py)
3. **Legal**: Terms acceptance modal before first download, proprietary license (not open source), DMCA process
4. **Technical Deterrents**: Runtime telemetry (notebook phones home on execution), traceable download IDs, audit trail

## 7.4 Phase 7 Acceptance Criteria

- [ ] Download button visible only for authenticated users
- [ ] Unauthenticated click shows "Login required" toast with action button
- [ ] First-ever download shows license agreement modal (must accept)
- [ ] Download proxy validates JWT
- [ ] Download proxy checks entitlement (returns 403 if not entitled)
- [ ] Downloaded notebook contains license header with user's email
- [ ] GitHub PAT is NEVER in browser network requests (verify in DevTools)
- [ ] Rate limiting works (6th download in an hour returns 429)
- [ ] Audit trail logs: userId, assetId, timestamp, IP
- [ ] Downloads page shows user's available and completed downloads

---

# PHASE 8: DATABRICKS DEPLOYMENT PIPELINE

**Duration**: 1.5-2 weeks
**Prerequisites**: Phase 5 (auth) + Phase 7 (downloads) complete
**Output**: One-click deploy to Databricks workspace, OAuth U2M flow, Asset Bundle download

## 8.1 Three Deployment Options

| Option | Skill Level | Mechanism |
|---|---|---|
| **One-Click Deploy** | Basic | OAuth U2M → Workspace Import API |
| **Download Notebook** | Basic | Secure download from Phase 7 |
| **Asset Bundle** | DevOps | Download .tar.gz + `databricks bundle deploy` |

## 8.2 Databricks OAuth U2M Flow

```
1. User enters workspace URL (e.g., https://adb-123.azuredatabricks.net)
2. Marketplace redirects to Databricks /oidc/v1/authorize with PKCE
3. User authenticates with their Databricks credentials
4. Databricks redirects back with authorization code
5. Marketplace exchanges code for access token (< 1 hour expiry)
6. Marketplace calls POST /api/2.0/workspace/import using user's token
7. Notebook appears in user's workspace at /Users/{email}/Blueprint/
```

## 8.3 Files to Create

```
api/deploy/notebook.ts                # Serverless: fetch from GitHub, import to Databricks
src/features/databricks/useDatabricksAuth.ts
src/features/databricks/useDatabricksDeploy.ts
src/features/databricks/DatabricksCallbackPage.tsx
src/features/databricks/DatabricksConnectionModal.tsx
src/pages/account/DeploymentsPage.tsx
```

## 8.4 Phase 8 Acceptance Criteria

- [ ] "Deploy to Databricks" button on product pages (authenticated users only)
- [ ] Clicking shows modal for workspace URL input
- [ ] OAuth flow redirects to Databricks, returns with token
- [ ] Deploy proxy fetches notebook from private GitHub repo
- [ ] Deploy proxy injects license header
- [ ] Deploy proxy calls Databricks API with user's own OAuth token
- [ ] Success modal shows link to notebook in Databricks workspace
- [ ] Marketplace NEVER stores Databricks credentials (verify: token discarded after use)
- [ ] Asset Bundle download works for CLI users
- [ ] Deployments page shows deployment history

---

# PHASE 9: CHAT SYSTEM & AI ASSISTANT

**Duration**: 1-2 weeks
**Prerequisites**: Phase 1 (basic chat widget exists)
**Output**: Upgrade from hardcoded responses to context-aware AI chat

## 9.1 Upgrade Path

```
Phase 1:  Hardcoded Q&A responses (already built)
Phase 9a: Context-aware responses (knows current page, product)
Phase 9b: Claude API integration (real AI answers)
Phase 9c: Action buttons (suggested prompts per page)
```

## 9.2 Files to Modify/Create

```
src/components/chat/ChatWidget.tsx      # Enhance with context
src/components/chat/ChatMessage.tsx     # Add typing indicator
src/components/chat/ChatInput.tsx       # Add quick action buttons
src/features/chat/chatService.ts        # API call to Claude
src/features/chat/chatStore.ts          # Message history in Zustand
```

## 9.3 Phase 9 Acceptance Criteria

- [ ] Chat persists messages across route changes
- [ ] Chat knows what page user is on (shows relevant prompts)
- [ ] Typing indicator shows while waiting for response
- [ ] Quick action buttons change per page (e.g., "Show pricing" on product pages)
- [ ] Claude API integration returns relevant answers about products
- [ ] Chat history stored in Zustand (survives navigation, not page refresh)

---

# 9. CI/CD & DEPLOYMENT

## Workflow Summary

```
Developer: git push → feature branch
CI (ci.yml): Lint → Type-check → Test → Build → ✅ or ❌
Developer: Open PR → Code review → Merge to main
Deploy (deploy.yml): npm ci → npm run build → Upload to GitHub Pages → Live in ~90 seconds
```

## Deploy Checklist

- [ ] `VITE_*` env vars set in GitHub repo secrets
- [ ] GitHub Pages enabled on the repo (Settings → Pages → GitHub Actions)
- [ ] `vite.config.ts` has correct `base` path
- [ ] `public/404.html` SPA redirect in place
- [ ] First deploy tested manually via `npm run build && npx serve dist`

---

# 10. QUALITY GATES

Every PR must pass before merge:

```
✅ TypeScript           npx tsc --noEmit              (zero errors)
✅ ESLint               npm run lint                   (zero warnings)
✅ Tests                npm run test -- --run           (all passing)
✅ Build                npm run build                   (succeeds)
✅ Bundle Size          < 500KB initial load            (check with vite-bundle-visualizer)
✅ No innerHTML         grep -r "innerHTML" src/        (zero results)
✅ No dangerouslySet    grep -r "dangerouslySet" src/   (zero results)
✅ Zod Validation       All form inputs validated        (code review)
✅ Analytics Events     New features have tracking       (code review)
✅ Responsive           Works at 375px, 768px, 1280px   (manual check)
✅ Sharp Corners        No border-radius anywhere        (visual check)
```

---

# 11. SECURITY CHECKLIST

| Control | Implementation | Phase |
|---|---|---|
| Zero innerHTML | JSX rendering only | 1 |
| Input validation | Zod schemas on all forms | 1, 3 |
| HTTPS only | GitHub Pages / Vercel default | 0 |
| CSP headers | Meta tag restricting script-src | 6 |
| JWT in memory | Zustand (never localStorage) | 5 |
| Refresh token | httpOnly cookie | 5 |
| Session timeout | 30 min idle → auto-logout | 5 |
| GitHub PAT server-only | Vercel Edge Function env var | 7 |
| Download watermarking | License header with user email | 7 |
| Rate limiting | 5 downloads/hour/user | 7 |
| Audit trail | All downloads logged | 7 |
| Formspree IDs in env | Not hardcoded in markup | 1 |
| No eval() | Banned by ESLint rule | 0 |
| Compiled wheels | .pyc distribution for core IP | 7 |
| Terms acceptance | Modal before first download | 7 |
| OAuth PKCE | Code challenge for Databricks flow | 8 |

---

# 12. RISK REGISTER

| Risk | Impact | Mitigation |
|---|---|---|
| GitHub Pages doesn't support SPA routing natively | Broken deep links | `404.html` redirect trick (Phase 0) |
| Formspree rate limits on free tier | Form submissions blocked | Upgrade to paid plan or add client-side throttle |
| YouTube embeds blocked in some corporate networks | Product demos invisible | Add fallback thumbnail + "Watch on YouTube" link |
| PostHog free tier limits | Session recording quota | Self-host PostHog or use GA4 fallback |
| Supabase/Auth0 free tier user limits | Auth breaks at scale | Monitor usage, upgrade plan proactively |
| Databricks OAuth app registration required | One-click deploy won't work | Register app in Databricks Account Console before Phase 8 |
| v2 migration form files (sap2, snow2, etc.) not linked | Unclear if needed | Investigate: are these Transformer/Optimizer phases? If yes, support via `/:phase` URL param |
| Large migration form schemas | Config files may be 200+ lines each | Acceptable — each is self-contained and isolated |
| Bundle size growth with 100+ pages | Slow initial load | Lazy loading per route (already configured) + manual chunks in vite.config |
| bpcs.com redesign changes all URLs | Broken links in marketplace | All URLs centralized in `bpcs.ts` — change once, updates everywhere |

---

# END OF DOCUMENT

This document is self-contained. With this spec, access to the original v1 repo (`github.com/dw425/TMP_Dev_v4`), and the new v2 repo (`github.com/dw425/TMP_remod_v1`), any developer can build Blueprint Marketplace 2.0 from scratch without additional context.
