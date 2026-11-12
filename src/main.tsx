import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/react';
import { dark } from '@clerk/themes';
import { App } from './App';
import { AuthGate } from './components/auth/AuthGate';
import { ProgressProvider } from './context/ProgressContext';
import './index.css';

/**
 * Vite inlines the raw environment value, and values pasted through a Windows
 * shell can carry a UTF-8 BOM (U+FEFF), CRLF or wrapping quotes. Clerk rejects
 * any of those ("Publishable key not valid"), so sanitize before use.
 */
const sanitizeKey = (value: string | undefined): string =>
  (value ?? '')
    .replace(/^\uFEFF/, '')
    .replace(/^[\s"']+|[\s"']+$/g, '');

const PUBLISHABLE_KEY = sanitizeKey(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

if (import.meta.env.DEV && import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== PUBLISHABLE_KEY) {
  console.warn('[auth] Sanitized whitespace/quotes from VITE_CLERK_PUBLISHABLE_KEY.');
}

const MissingKeyScreen: React.FC = () => (
  <div className="min-h-screen bg-[#0A0D0F] text-[#F3F4F6] flex items-center justify-center p-6">
    <div className="w-full max-w-md rounded-2xl bg-[#10171E] border border-red-500/30 p-6 sm:p-8 space-y-4">
      <h1 className="text-base font-bold text-white">Clerk publishable key missing</h1>
      <p className="text-xs leading-relaxed text-[#9CA3AF]">
        The access gate cannot start without a Clerk publishable key, so the platform is locked.
        Set <code className="font-mono text-[#76B900]">VITE_CLERK_PUBLISHABLE_KEY</code> in{' '}
        <code className="font-mono text-[#76B900]">.env.local</code> (local) or in the Vercel
        project&apos;s environment variables (production), then rebuild.
      </p>
    </div>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root')!);

if (!PUBLISHABLE_KEY) {
  root.render(
    <React.StrictMode>
      <MissingKeyScreen />
    </React.StrictMode>,
  );
} else {
  root.render(
    <React.StrictMode>
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
        <AuthGate>
          <ProgressProvider>
            <App />
          </ProgressProvider>
        </AuthGate>
      </ClerkProvider>
    </React.StrictMode>,
  );
}
