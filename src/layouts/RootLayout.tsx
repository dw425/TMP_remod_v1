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
      <PageViewTracker />
      <SessionTracker />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
      <AlertContainer />
    </div>
  );
}
