import { Outlet } from 'react-router-dom';
import { Header } from '@/components/composed/Header/Header';
import { Footer } from '@/components/composed/Footer/Footer';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { AlertContainer } from '@/components/alerts/AlertContainer';
import { PageViewTracker } from '@/features/analytics/PageViewTracker';
import { SessionTracker } from '@/features/analytics/SessionTracker';

export function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary font-dm-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-blueprint-blue focus:text-white focus:px-4 focus:py-2 focus:font-bold"
      >
        Skip to main content
      </a>
      <PageViewTracker />
      <SessionTracker />
      <Header />
      <main id="main-content" className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
      <AlertContainer />
    </div>
  );
}
