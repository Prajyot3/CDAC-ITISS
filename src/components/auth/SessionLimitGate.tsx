import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@clerk/react';
import { AlertTriangle, Laptop, LogOut, MonitorSmartphone, RefreshCw, ShieldAlert } from 'lucide-react';
import { apiRequest } from '../../lib/apiClient';

export interface GuardSession {
  id: string;
  status?: string;
  lastActiveAt?: string | null;
  createdAt?: string | null;
  browser?: string | null;
  browserVersion?: string | null;
  os?: string | null;
  deviceType?: string | null;
  ip?: string | null;
  city?: string | null;
  country?: string | null;
  isCurrent?: boolean;
}

export interface GuardResponse {
  allowed: boolean;
  max: number;
  currentSessionId?: string;
  sessions: GuardSession[];
  revoked?: string[];
}

type GuardState = 'checking' | 'ok' | 'blocked' | 'offline';

const CHECK_INTERVAL_MS = 120_000;

const describeSession = (session: GuardSession) => {
  const device = [session.browser, session.os].filter(Boolean).join(' on ');
  const place = [session.city, session.country].filter(Boolean).join(', ');
  return {
    device: device || session.deviceType || 'Unknown device',
    place: place || session.ip || 'Unknown location',
  };
};

const relativeTime = (value?: string | null) => {
  if (!value) return 'unknown';
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return 'unknown';
  const diff = Math.max(0, Date.now() - then);
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.floor(hours / 24)} d ago`;
};

const SessionCard: React.FC<{
  session: GuardSession;
  busy: boolean;
  onRevoke: (sessionId: string) => void;
}> = ({ session, busy, onRevoke }) => {
  const { device, place } = describeSession(session);
  return (
    <li className="flex items-start justify-between gap-3 rounded-lg border border-[#232F3E] bg-[#0C1014] p-3">
      <div className="flex min-w-0 items-start gap-2.5">
        <Laptop className="mt-0.5 h-4 w-4 shrink-0 text-[#76B900]" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-xs font-semibold text-white">{device}</span>
            {session.isCurrent && (
              <span className="rounded bg-[#76B900]/15 px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase text-[#76B900]">
                this device
              </span>
            )}
          </div>
          <div className="truncate text-[11px] text-[#8C98A6]">{place}</div>
          <div className="text-[10px] font-mono text-[#556372]">
            active {relativeTime(session.lastActiveAt)}
          </div>
        </div>
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={() => onRevoke(session.id)}
        className="shrink-0 rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-50"
      >
        Sign out
      </button>
    </li>
  );
};

/**
 * Blocks the app when the account is signed in on more devices than allowed and
 * lets the student sign one of them out. Uses the Clerk session list via
 * `/api/session-guard`.
 */
export const SessionLimitGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const [state, setState] = useState<GuardState>('checking');
  const [data, setData] = useState<GuardResponse | null>(null);
  const [busySessionId, setBusySessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastCheckRef = useRef(0);

  const isLoaded = auth.isLoaded;
  const isSignedIn = auth.isLoaded ? auth.isSignedIn : false;
  const getToken = auth.isLoaded ? auth.getToken : null;
  const signOut = auth.isLoaded ? auth.signOut : null;
  const sessionId = auth.isLoaded ? auth.sessionId : null;

  const runCheck = useCallback(
    async (options: { silent?: boolean } = {}) => {
      if (!getToken) return;
      if (!options.silent) setState(previous => (previous === 'ok' ? previous : 'checking'));
      try {
        const token = await getToken();
        const result = await apiRequest<GuardResponse>('/api/session-guard', token, {
          method: 'POST',
          body: JSON.stringify({ sessionId }),
        });
        setData(result);
        setState(result.allowed ? 'ok' : 'blocked');
        setError(null);
      } catch (err) {
        // The session guard is a business rule, not authentication: if the API is
        // unreachable (local dev, offline) we let the student keep studying.
        console.warn('[session-limit] guard unavailable', err);
        setState('offline');
      } finally {
        lastCheckRef.current = Date.now();
      }
    },
    [getToken, sessionId],
  );

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    void runCheck();
  }, [isLoaded, isSignedIn, runCheck]);

  // Re-check when the student comes back to the tab (another device may have signed in).
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - lastCheckRef.current < 20_000) return;
      void runCheck({ silent: true });
    };
    const timer = window.setInterval(() => void runCheck({ silent: true }), CHECK_INTERVAL_MS);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [isLoaded, isSignedIn, runCheck]);

  const revoke = async (targetSessionId: string) => {
    if (!getToken) return;
    setBusySessionId(targetSessionId);
    setError(null);
    try {
      const token = await getToken();
      const result = await apiRequest<GuardResponse>('/api/session-guard', token, {
        method: 'POST',
        body: JSON.stringify({ action: 'revoke', sessionId: targetSessionId }),
      });
      setData(result);
      setState(result.allowed ? 'ok' : 'blocked');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign that device out.');
    } finally {
      setBusySessionId(null);
    }
  };

  const currentIsListed = useMemo(
    () => Boolean(data?.sessions?.some(session => session.isCurrent)),
    [data],
  );

  if (!isLoaded || !isSignedIn) return <>{children}</>;
  // No blocking spinner while the guard resolves — the app renders and the limit
  // screen only takes over once we actually know the account is over the limit.
  if (state !== 'blocked') return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#0A0D0F] text-[#F3F4F6] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg space-y-5 rounded-2xl border border-amber-500/30 bg-[#10171E] p-6 shadow-2xl shadow-black/70 sm:p-8">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10">
            <ShieldAlert className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Device limit reached</h1>
            <p className="mt-1 text-xs leading-relaxed text-[#9CA3AF]">
              This account can be used on {data?.max ?? 2} devices at a time. Sign out one of the
              sessions below to keep studying here.
            </p>
          </div>
        </div>

        <ul className="space-y-2">
          {(data?.sessions ?? []).map(session => (
            <SessionCard
              key={session.id}
              session={session}
              busy={busySessionId === session.id}
              onRevoke={revoke}
            />
          ))}
        </ul>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[11px] text-red-200">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-2 border-t border-[#1F2933] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => void runCheck()}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-[#2A3848] px-3 py-2 text-[11px] font-semibold text-[#C4CDD6] transition-colors hover:border-[#76B900] hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Check again
          </button>

          {signOut && (
            <button
              type="button"
              onClick={() => void signOut({ redirectUrl: '/' })}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[11px] font-semibold text-red-300 transition-colors hover:bg-red-500/20"
            >
              <LogOut className="h-3.5 w-3.5" />
              {currentIsListed ? 'Sign out on this device' : 'Sign out'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#556372]">
          <MonitorSmartphone className="h-3.5 w-3.5" />
          Session limit enforced by Clerk · {data?.max ?? 2} concurrent devices
        </div>
      </div>
    </div>
  );
};

export default SessionLimitGate;
