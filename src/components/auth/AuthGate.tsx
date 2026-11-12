import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/react';
import { AlertTriangle, Loader2, Lock, RefreshCw, Shield, ShieldCheck } from 'lucide-react';
import { SimpleAuthForm } from './SimpleAuthForm';

/**
 * How long we wait for Clerk to report a session before we fail closed.
 * Without this, a broken/blocked Clerk script leaves `isLoaded === false` forever,
 * and a naive gate (`if (!isLoaded) return null`) would leave the app wide open.
 */
const CLERK_LOAD_TIMEOUT_MS = 15_000;

const HASH_PREFIXES_TO_CLEAR = ['#/sign-in', '#/sign-up', '#/sso-callback', '#/factor', '#/verify'];

/* -------------------------------------------------------------------------- */
/*  Boot / failure screens                                                     */
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

const GateErrorScreen: React.FC = () => (
  <div className="min-h-screen bg-[#0A0D0F] text-[#F3F4F6] flex items-center justify-center p-6">
    <div className="w-full max-w-md rounded-2xl bg-[#10171E] border border-amber-500/30 p-6 sm:p-8 space-y-5 shadow-2xl shadow-black/60">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 shrink-0 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white">Authentication service unavailable</h1>
          <p className="mt-1 text-xs leading-relaxed text-[#9CA3AF]">
            The access gate could not verify your session. The study platform stays locked until
            Clerk responds, so no exam content is exposed.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-[#0C1014] border border-[#1E2933] p-3 text-[11px] font-mono text-[#718092] space-y-1">
        <div className="flex justify-between gap-3">
          <span>Gate policy</span>
          <span className="text-amber-400">fail-closed</span>
        </div>
        <div className="flex justify-between gap-3">
          <span>Identity provider</span>
          <span className="text-white">Clerk Cloud</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.location.reload()}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#76B900] hover:bg-[#68a500] text-black text-xs font-bold transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Retry secure sign-in
      </button>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Signed-out gate (blocking)                                                 */
/* -------------------------------------------------------------------------- */

const SignInGate: React.FC = () => (
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
 * - `stuck`    → fail-closed error screen after {@link CLERK_LOAD_TIMEOUT_MS}
 * - `signedOut`→ custom credential screen (children never mount)
 * - `signedIn` → renders `children`
 */
export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();
  const [timedOut, setTimedOut] = useState(false);

  // Fail closed if Clerk never reports a result.
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
  if (!isLoaded) return timedOut ? <GateErrorScreen /> : <BootScreen />;
  return <SignInGate />;
};

/**
 * Backwards-compatible alias kept for existing imports.
 * @deprecated The gate now wraps the app tree — render `<AuthGate>{app}</AuthGate>`.
 */
export const AuthGateModal = AuthGate;

export default AuthGate;
