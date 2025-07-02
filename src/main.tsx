import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AppProvider } from './contexts/AppContext.tsx';
// AuthProvider from useAuth.ts is not a component, useAuth is a hook.
// Firebase initialization should happen in firebase.ts and useAuth hook uses it.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider> {/* AppProvider wraps App and uses useAuth internally */}
      <App />
    </AppProvider>
  </StrictMode>
);