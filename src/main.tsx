import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { migrateFromLocalStorage } from './lib/db';
import './styles/globals.css';

// Migrate localStorage data to IndexedDB on first load (best-effort)
migrateFromLocalStorage();

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Promise Rejection]', event.reason);
});

window.addEventListener('error', (event) => {
  console.error('[Uncaught Error]', event.error);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
