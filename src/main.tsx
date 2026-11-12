import { ClerkProvider } from '@clerk/react';
import { dark } from '@clerk/themes';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ProgressProvider } from './context/ProgressContext';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn('Missing VITE_CLERK_PUBLISHABLE_KEY. Please check your .env.local file.');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/"
        appearance={{
          theme: dark,
          variables: {
            colorPrimary: '#76B900',
            colorBackground: '#10171E',
            colorForeground: '#F3F4F6',
            borderRadius: '0.5rem',
          },
          elements: {
            card: 'border border-[#263544] shadow-2xl bg-[#10171E]',
            formButtonPrimary: 'bg-[#76B900] hover:bg-[#68a500] text-black font-semibold',
            footerActionLink: 'text-[#76B900] hover:text-[#88d100]',
          },
        }}
      >
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </ClerkProvider>
    ) : (
      <ProgressProvider>
        <App />
      </ProgressProvider>
    )}
  </React.StrictMode>
);
