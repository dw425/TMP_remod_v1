import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { RootLayout } from '@/layouts/RootLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { Spinner } from '@/components/ui';
import { ROUTES } from '@/config/routes';

const MarketplacePage = lazy(() => import('@/pages/marketplace/MarketplacePage'));
const CartPage = lazy(() => import('@/pages/cart/CartPage'));
const ProductDetailPage = lazy(() => import('@/pages/products/ProductDetailPage'));
const MigrationLandingPage = lazy(() => import('@/pages/migration/MigrationLandingPage'));
const MigrationAssessmentPage = lazy(() => import('@/pages/migration/MigrationAssessmentPage'));
const ROMCalculatorPage = lazy(() => import('@/pages/migration/ROMCalculatorPage'));
const ROMAdminPage = lazy(() => import('@/pages/admin/ROMAdminPage'));
const AIFactoryPage = lazy(() => import('@/pages/content/AIFactoryPage'));
const WhitepaperPage = lazy(() => import('@/pages/content/WhitepaperPage'));
const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage'));

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));

// Account pages (protected)
const DashboardPage = lazy(() => import('@/pages/account/DashboardPage'));
const SettingsPage = lazy(() => import('@/pages/account/SettingsPage'));
const OrderHistoryPage = lazy(() => import('@/pages/account/OrderHistoryPage'));
const DownloadsPage = lazy(() => import('@/pages/account/DownloadsPage'));

const SuspenseWrap = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<Spinner className="min-h-[60vh]" />}>{children}</Suspense>
);

const Protected = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <SuspenseWrap>{children}</SuspenseWrap>
  </ProtectedRoute>
);

const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: (
            <SuspenseWrap>
              <MarketplacePage />
            </SuspenseWrap>
          ),
        },
        {
          path: ROUTES.CART,
          element: (
            <SuspenseWrap>
              <CartPage />
            </SuspenseWrap>
          ),
        },
        {
          path: ROUTES.PRODUCT,
          element: (
            <SuspenseWrap>
              <ProductDetailPage />
            </SuspenseWrap>
          ),
        },
        {
          path: ROUTES.MIGRATION_HOME,
          element: (
            <SuspenseWrap>
              <MigrationLandingPage />
            </SuspenseWrap>
          ),
        },
        {
          path: ROUTES.ROM_CALCULATOR,
          element: (
            <SuspenseWrap>
              <ROMCalculatorPage />
            </SuspenseWrap>
          ),
        },
        {
          path: ROUTES.ROM_ADMIN,
          element: (
            <SuspenseWrap>
              <ROMAdminPage />
            </SuspenseWrap>
          ),
        },
        {
          path: ROUTES.AI_FACTORY,
          element: (
            <SuspenseWrap>
              <AIFactoryPage />
            </SuspenseWrap>
          ),
        },
        {
          path: ROUTES.WHITEPAPER,
          element: (
            <SuspenseWrap>
              <WhitepaperPage />
            </SuspenseWrap>
          ),
        },
        {
          path: ROUTES.MIGRATION_ASSESS,
          element: (
            <SuspenseWrap>
              <MigrationAssessmentPage />
            </SuspenseWrap>
          ),
        },
        // Protected account routes
        {
          path: ROUTES.DASHBOARD,
          element: (
            <Protected>
              <DashboardPage />
            </Protected>
          ),
        },
        {
          path: ROUTES.ORDERS,
          element: (
            <Protected>
              <OrderHistoryPage />
            </Protected>
          ),
        },
        {
          path: ROUTES.SETTINGS,
          element: (
            <Protected>
              <SettingsPage />
            </Protected>
          ),
        },
        {
          path: ROUTES.DOWNLOADS,
          element: (
            <Protected>
              <DownloadsPage />
            </Protected>
          ),
        },
        {
          path: '*',
          element: (
            <SuspenseWrap>
              <NotFoundPage />
            </SuspenseWrap>
          ),
        },
      ],
    },
    // Auth layout (no header/footer)
    {
      element: <AuthLayout />,
      children: [
        {
          path: ROUTES.LOGIN,
          element: (
            <SuspenseWrap>
              <LoginPage />
            </SuspenseWrap>
          ),
        },
        {
          path: ROUTES.SIGNUP,
          element: (
            <SuspenseWrap>
              <SignupPage />
            </SuspenseWrap>
          ),
        },
        {
          path: ROUTES.FORGOT_PASSWORD,
          element: (
            <SuspenseWrap>
              <ForgotPasswordPage />
            </SuspenseWrap>
          ),
        },
      ],
    },
  ],
  { basename: '/TMP_remod_v1' }
);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
