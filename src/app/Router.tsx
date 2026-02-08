import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { RootLayout } from '@/layouts/RootLayout';
import { Spinner } from '@/components/ui';

const MarketplacePage = lazy(() => import('@/pages/marketplace/MarketplacePage'));
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
