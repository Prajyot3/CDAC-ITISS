import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/react';
import { AlertTriangle, Loader2, Lock, RefreshCw, Shield, ShieldCheck } from 'lucide-react';
import { SimpleAuthForm } from './SimpleAuthForm';

/**
 * How long we wait for Clerk to report a session before showing the sign-in
 * screen with a connection notice. The app never renders while `isLoaded` is false.
 */
const CLERK_LOAD_TIMEOUT_MS = 15_000;

const HASH_PREFIXES_TO_CLEAR = ['#/sign-in', '#/sign-up', '#/sso-callback', '#/factor', '#/verify'];

/* -------------------------------------------------------------------------- */
/*  Boot screen                                                                */
/* -------------------------------------------------------------------------- */

const BootScreen: React.FC = () => (
  <div className="min-h-screen bg-[#0A0D0F] text-[#F3F4F6] flex items-center justify-center p-6">
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-[#76B900]/20 blur-xl" />
        <div className="relative w-14 h-14 rounded-2xl bg-[#10171E] border border-[#76B900]/40 flex items-center justify-center">
          <Shield className="w-7 h-7 text-[#76B900]" />
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-[#A2AFBD] font-mono">
        <Loader2 className="w-4 h-4 animate-spin text-[#76B900]" />
        <span>Verifying secure access…</span>
      </div>
      <p className="max-w-xs text-[11px] text-[#637282] font-mono">
        CDAC ITISS Preparation Platform · Clerk Identity
      </p>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Signed-out gate (blocking)                                                 */
/* -------------------------------------------------------------------------- */

const SignInGate: React.FC<{ degraded?: boolean }> = ({ degraded = false }) => (
  <div
    className="min-h-screen bg-[#0A0D0F] text-[#F3F4F6] flex flex-col"
    role="dialog"
    aria-modal="true"
    aria-label="Sign in required to access the CDAC ITISS preparation platform"
  >
    <header className="border-b border-[#19222B] px-4 sm:px-8 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#10171E] border border-[#76B900]/40 flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#76B900]" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-white">CDAC ITISS</div>
            <div className="text-[10px] font-mono text-[#76B900] uppercase tracking-wider">
              Exam preparation platform
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8C98A6]">
          <Lock className="w-3.5 h-3.5 text-[#76B900]" />
          <span className="hidden sm:inline">Private student access</span>
        </div>
      </div>
    </header>

    <main className="flex-1 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Sign in to continue
          </h1>
          <p className="mt-1.5 text-xs text-[#8C98A6]">
            Your question bank, mock exams and progress are behind this gate.
          </p>
        </div>

        <div className="rounded-2xl border border-[#232F3E] bg-[#10171E] p-5 sm:p-7 shadow-2xl shadow-black/70">
          {degraded && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-[11px] leading-relaxed text-amber-200">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span className="flex-1">
                Can&apos;t reach the sign-in service right now. Check your connection and retry.
              </span>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex shrink-0 items-center gap-1 font-semibold text-amber-100 hover:text-white"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </button>
            </div>
          )}
          <SimpleAuthForm />
        </div>

        <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#556372]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#76B900]" />
          <span>Protected by Clerk · 256-bit TLS</span>
        </div>
      </div>
    </main>

    <footer className="border-t border-[#19222B] px-4 sm:px-8 py-4 text-center text-[11px] font-mono text-[#556372]">
      cdacitissacademy.tech · CDAC ITISS Preparation Platform v1.0
    </footer>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Gate                                                                       */
/* -------------------------------------------------------------------------- */

export interface AuthGateProps {
  children: React.ReactNode;
}

/**
 * Blocks the entire application tree until Clerk reports a signed-in session.
 *
 * - `loading`  → boot screen while Clerk initialises
 * - `stuck`    → sign-in screen with a connection notice after {@link CLERK_LOAD_TIMEOUT_MS}
 * - `signedOut`→ custom credential screen (children never mount)
 * - `signedIn` → renders `children`
 */
export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setTimedOut(false);
      return;
    }
    const timer = window.setTimeout(() => setTimedOut(true), CLERK_LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [isLoaded]);

  // Strip Clerk's hash-routing artefacts once a session exists so the app's own
  // hash router (tabs) starts from a clean URL.
  useEffect(() => {
    if (!isSignedIn) return;
    const { hash, pathname, search } = window.location;
    if (HASH_PREFIXES_TO_CLEAR.some(prefix => hash.startsWith(prefix))) {
      window.history.replaceState(null, '', `${pathname}${search}`);
    }
  }, [isSignedIn]);

  if (isSignedIn) return <>{children}</>;
  if (!isLoaded) return timedOut ? <SignInGate degraded /> : <BootScreen />;
  return <SignInGate />;
};

/**
 * Backwards-compatible alias kept for existing imports.
 * @deprecated The gate now wraps the app tree — render `<AuthGate>{app}</AuthGate>`.
 */
export const AuthGateModal = AuthGate;

export default AuthGate;
