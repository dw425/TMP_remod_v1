import { Outlet } from 'react-router-dom';
import { Header } from '@/components/composed/Header/Header';
import { Footer } from '@/components/composed/Footer/Footer';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { AlertContainer } from '@/components/alerts/AlertContainer';

export function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary font-dm-sans">
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
