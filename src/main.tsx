import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './lib/supabase/auth/context';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);