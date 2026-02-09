import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { RootLayout } from '@/layouts/RootLayout';
import { Spinner } from '@/components/ui';
import { ROUTES } from '@/config/routes';

const MarketplacePage = lazy(() => import('@/pages/marketplace/MarketplacePage'));
const CartPage = lazy(() => import('@/pages/cart/CartPage'));
const ProductDetailPage = lazy(() => import('@/pages/products/ProductDetailPage'));
const MigrationLandingPage = lazy(() => import('@/pages/migration/MigrationLandingPage'));
const MigrationAssessmentPage = lazy(() => import('@/pages/migration/MigrationAssessmentPage'));
const ROMCalculatorPage = lazy(() => import('@/pages/migration/ROMCalculatorPage'));
const ROMAdminPage = lazy(() => import('@/pages/admin/ROMAdminPage'));
const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage'));

const SuspenseWrap = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<Spinner className="min-h-[60vh]" />}>{children}</Suspense>
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
          path: ROUTES.MIGRATION_ASSESS,
          element: (
            <SuspenseWrap>
              <MigrationAssessmentPage />
            </SuspenseWrap>
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
  ],
  { basename: '/TMP_remod_v1' }
);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
