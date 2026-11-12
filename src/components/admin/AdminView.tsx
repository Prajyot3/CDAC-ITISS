import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth, useUser } from '@clerk/react';
import {
  AlertTriangle,
  Ban,
  ChevronDown,
  ChevronRight,
  Crown,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserX,
  Users,
  WifiOff,
} from 'lucide-react';
import { apiRequest } from '../../lib/apiClient';
import type { GuardSession } from '../auth/SessionLimitGate';
import { ACCESS_LABELS, ACCESS_LEVELS, type AccessLevel } from '../../lib/access';

interface AdminUser {
  id: string;
  email: string | null;
  emails: string[];
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  role: string | null;
  access: { level: AccessLevel; maxDevices: number };
  banned: boolean;
  createdAt: string;
  lastSignInAt: string | null;
  sessions: GuardSession[];
  activeSessionCount: number;
}

interface UsersResponse {
  users: AdminUser[];
  totalCount: number;
  limit: number;
  offset: number;
}

const PAGE_SIZE = 10;

const formatDate = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const isAdminUser = (
  user:
    | { publicMetadata?: Record<string, unknown> | null; primaryEmailAddress?: { emailAddress: string } | null }
    | null
    | undefined,
) => {
  if (!user) return false;
  if (user.publicMetadata?.role === 'admin') return true;
  const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();
  return email === 'pujariprajyot00@gmail.com';
};

export const AdminView: React.FC = () => {
  const auth = useAuth();
  const { user } = useUser();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const admin = useMemo(() => isAdminUser(user), [user]);
  const token = auth.isLoaded ? auth.getToken : null;
  const myId = user?.id;

  const load = useCallback(
    async (targetPage = page, searchTerm = search) => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const bearer = await token();
        const params = new URLSearchParams({
          limit: String(PAGE_SIZE),
          offset: String(targetPage * PAGE_SIZE),
        });
        if (searchTerm.trim()) params.set('query', searchTerm.trim());
        const result = await apiRequest<UsersResponse>(`/api/admin/users?${params}`, bearer);
        setUsers(result.users);
        setTotal(result.totalCount);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load users.');
      } finally {
        setLoading(false);
      }
    },
    [page, search, token],
  );

  useEffect(() => {
    void load(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const mutate = async (
    userId: string,
    action: () => Promise<string>,
    successMessage: string,
  ) => {
    setBusyUserId(userId);
    setError(null);
    setNotice(null);
    try {
      const message = await action();
      setNotice(message || successMessage);
      await load(page, search);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed.');
    } finally {
      setBusyUserId(null);
    }
  };

  const withToken = async () => {
    if (!token) throw new Error('Not signed in.');
    return token();
  };

  const toggleBan = (entry: AdminUser) =>
    mutate(
      entry.id,
      async () => {
        const bearer = await withToken();
        await apiRequest(`/api/admin/users`, bearer, {
          method: 'PATCH',
          body: JSON.stringify({ userId: entry.id, banned: !entry.banned }),
        });
        return entry.banned ? 'Account unbanned.' : 'Account banned and signed out.';
      },
      'Account updated.',
    );

  const toggleAdmin = (entry: AdminUser) =>
    mutate(
      entry.id,
      async () => {
        const bearer = await withToken();
        await apiRequest(`/api/admin/users`, bearer, {
          method: 'PATCH',
          body: JSON.stringify({ userId: entry.id, role: entry.role === 'admin' ? '' : 'admin' }),
        });
        return entry.role === 'admin' ? 'Administrator access removed.' : 'Administrator access granted.';
      },
      'Role updated.',
    );

  const revokeSessions = (entry: AdminUser) =>
    mutate(
      entry.id,
      async () => {
        const bearer = await withToken();
        const result = await apiRequest<{ revoked: string[] }>(`/api/admin/sessions`, bearer, {
          method: 'POST',
          body: JSON.stringify({ userId: entry.id, revokeAll: true }),
        });
        return `${result.revoked.length} session(s) revoked.`;
      },
      'Sessions revoked.',
    );

  const saveAccess = (
    entry: AdminUser,
    patch: Partial<{ level: AccessLevel; maxDevices: number }>,
  ) => {
    const next = { ...entry.access, ...patch };
    void mutate(
      entry.id,
      async () => {
        const bearer = await withToken();
        await apiRequest(`/api/admin/users`, bearer, {
          method: 'PATCH',
          body: JSON.stringify({ userId: entry.id, access: next }),
        });
        return `${entry.email || entry.id}: ${ACCESS_LABELS[next.level]} · ${next.maxDevices} device${next.maxDevices === 1 ? '' : 's'}.`;
      },
      'Access updated.',
    );
  };

  const deleteUser = (entry: AdminUser) => {
    if (!window.confirm(`Delete ${entry.email || entry.id}? This cannot be undone.`)) return;
    void mutate(
      entry.id,
      async () => {
        const bearer = await withToken();
        await apiRequest(`/api/admin/users?userId=${encodeURIComponent(entry.id)}`, bearer, {
          method: 'DELETE',
        });
        return 'Account deleted.';
      },
      'Account deleted.',
    );
  };

  if (!admin) {
    return (
      <div className="mx-auto max-w-lg space-y-3 rounded-xl border border-red-500/30 bg-[#141C24] p-6 text-center">
        <UserX className="mx-auto h-6 w-6 text-red-400" />
        <h2 className="text-sm font-bold text-white">Administrator access required</h2>
        <p className="text-xs text-[#9CA3AF]">
          This area is restricted to CDAC ITISS administrators. Your account does not have the
          <code className="mx-1 font-mono text-[#76B900]">admin</code> role.
        </p>
      </div>
    );
  }

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 border-b border-[#1F2933] pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded border border-[#76B900]/30 bg-[#76B900]/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-[#76B900]">
              ADMIN
            </span>
            <span className="text-[11px] font-mono text-[#8C98A6]">Clerk user directory</span>
          </div>
          <h1 className="mt-1.5 flex items-center gap-2 text-2xl font-extrabold text-white">
            <Users className="h-5 w-5 text-[#76B900]" />
            User management
          </h1>
          <p className="mt-1 text-xs text-[#9CA3AF]">
            {total} account{total === 1 ? '' : 's'} · session limit 2 devices per account
          </p>
        </div>

        <form
          onSubmit={event => {
            event.preventDefault();
            setPage(0);
            setSearch(query);
          }}
          className="flex w-full items-center gap-2 md:w-auto"
        >
          <div className="relative flex-1 md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#637282]" />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search email, name or user id"
              className="w-full rounded-lg border border-[#243240] bg-[#0C1014] py-2 pl-9 pr-3 text-xs text-white placeholder:text-[#556372] outline-none focus:border-[#76B900]"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[#76B900] px-3 py-2 text-xs font-bold text-black transition-colors hover:bg-[#68a500]"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => void load(page, search)}
            title="Refresh"
            className="rounded-lg border border-[#2A3848] p-2 text-[#C4CDD6] transition-colors hover:border-[#76B900] hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </form>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-200">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {notice && !error && (
        <div className="flex items-start gap-2 rounded-lg border border-[#76B900]/30 bg-[#76B900]/10 px-3 py-2.5 text-xs text-[#B9E36B]">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-[#232F3B] bg-[#10171E]">
        <div className="hidden grid-cols-12 gap-3 border-b border-[#1F2933] px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider text-[#718092] md:grid">
          <span className="col-span-3">Student</span>
          <span className="col-span-3">Access</span>
          <span className="col-span-2">Devices</span>
          <span className="col-span-2">Last sign-in</span>
          <span className="col-span-2 text-right">Actions</span>
        </div>

        {loading && users.length === 0 ? (
          <div className="flex items-center justify-center gap-2 px-4 py-10 text-xs font-mono text-[#8C98A6]">
            <Loader2 className="h-4 w-4 animate-spin text-[#76B900]" />
            Loading users…
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
            <WifiOff className="h-5 w-5 text-[#556372]" />
            <p className="text-xs text-[#8C98A6]">No accounts match this search.</p>
          </div>
        ) : (
          users.map(entry => {
            const name =
              [entry.firstName, entry.lastName].filter(Boolean).join(' ') || entry.email || entry.id;
            const isOpen = expanded === entry.id;
            const isSelf = entry.id === myId;
            return (
              <div key={entry.id} className="border-b border-[#1A232E] last:border-0">
                <div className="grid grid-cols-1 items-center gap-3 px-4 py-3 md:grid-cols-12">
                  <div className="col-span-3 flex min-w-0 items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : entry.id)}
                      className="text-[#637282] transition-colors hover:text-white"
                      aria-label="Toggle sessions"
                    >
                      {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                    </button>
                    <img src={entry.imageUrl} alt="" className="h-7 w-7 rounded-full border border-[#2A3848]" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-xs font-semibold text-white">{name}</span>
                        {isSelf && (
                          <span className="rounded bg-[#76B900]/15 px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase text-[#76B900]">
                            you
                          </span>
                        )}
                        {entry.role === 'admin' && (
                          <span className="inline-flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-1 py-0.5 font-mono text-[9px] font-semibold text-amber-300">
                            <Crown className="h-2.5 w-2.5" /> admin
                          </span>
                        )}
                        {entry.banned && (
                          <span className="rounded border border-red-500/30 bg-red-500/10 px-1 py-0.5 font-mono text-[9px] font-semibold text-red-300">
                            banned
                          </span>
                        )}
                      </div>
                      <div className="truncate text-[11px] font-mono text-[#8C98A6]">
                        {entry.email || entry.id}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-3 flex items-center gap-1.5">
                    <select
                      value={entry.access.level}
                      disabled={busyUserId === entry.id || isSelf}
                      onChange={event => saveAccess(entry, { level: event.target.value as AccessLevel })}
                      title="Portal access level"
                      className="min-w-0 flex-1 rounded-md border border-[#2A3848] bg-[#0C1014] px-2 py-1.5 text-[11px] text-white outline-none transition-colors hover:border-[#76B900] focus:border-[#76B900] disabled:opacity-50"
                    >
                      {ACCESS_LEVELS.map(level => (
                        <option key={level} value={level}>
                          {ACCESS_LABELS[level]}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={entry.access.maxDevices}
                      disabled={busyUserId === entry.id || isSelf}
                      onChange={event => {
                        const next = Number(event.target.value);
                        if (Number.isFinite(next) && next >= 1 && next <= 5) {
                          saveAccess(entry, { maxDevices: Math.round(next) });
                        }
                      }}
                      title="Devices allowed"
                      className="w-14 rounded-md border border-[#2A3848] bg-[#0C1014] px-2 py-1.5 text-[11px] font-mono text-white outline-none transition-colors hover:border-[#76B900] focus:border-[#76B900] disabled:opacity-50"
                    />
                  </div>

                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : entry.id)}
                      className={`text-[11px] font-mono ${entry.activeSessionCount > 0 ? 'text-[#76B900]' : 'text-[#718092]'}`}
                    >
                      {entry.activeSessionCount} active
                    </button>
                  </div>

                  <div className="col-span-2 text-[11px] font-mono text-[#8C98A6]">
                    {formatDate(entry.lastSignInAt)}
                  </div>

                  <div className="col-span-2 flex flex-wrap items-center justify-end gap-1.5">
                    <button
                      type="button"
                      disabled={busyUserId === entry.id}
                      onClick={() => void revokeSessions(entry)}
                      title="Sign out all devices"
                      className="rounded-md border border-[#2A3848] p-1.5 text-[#C4CDD6] transition-colors hover:border-[#76B900] hover:text-white disabled:opacity-40"
                    >
                      <WifiOff className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={busyUserId === entry.id || isSelf}
                      onClick={() => void toggleAdmin(entry)}
                      title={entry.role === 'admin' ? 'Remove admin' : 'Make admin'}
                      className="rounded-md border border-[#2A3848] p-1.5 text-[#C4CDD6] transition-colors hover:border-amber-400 hover:text-amber-300 disabled:opacity-40"
                    >
                      <Crown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={busyUserId === entry.id || isSelf}
                      onClick={() => void toggleBan(entry)}
                      title={entry.banned ? 'Unban user' : 'Ban user'}
                      className="rounded-md border border-[#2A3848] p-1.5 text-[#C4CDD6] transition-colors hover:border-red-400 hover:text-red-300 disabled:opacity-40"
                    >
                      <Ban className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={busyUserId === entry.id || isSelf}
                      onClick={() => deleteUser(entry)}
                      title="Delete user"
                      className="rounded-md border border-[#2A3848] p-1.5 text-[#C4CDD6] transition-colors hover:border-red-400 hover:text-red-300 disabled:opacity-40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-[#1A232E] bg-[#0C1014] px-4 py-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#718092]">
                        Active sessions
                      </span>
                      <button
                        type="button"
                        onClick={() => void revokeSessions(entry)}
                        className="text-[10px] font-semibold text-red-300 hover:text-red-200"
                      >
                        Sign out all
                      </button>
                    </div>
                    {entry.sessions.length === 0 ? (
                      <p className="text-[11px] text-[#556372]">No active sessions.</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {entry.sessions.map(session => (
                          <li
                            key={session.id}
                            className="flex items-center justify-between rounded border border-[#1F2933] px-2.5 py-1.5 text-[11px]"
                          >
                            <span className="text-[#C4CDD6]">
                              {[session.browser, session.os].filter(Boolean).join(' on ') || 'Unknown device'}
                              <span className="ml-2 text-[#556372]">
                                {[session.city, session.country].filter(Boolean).join(', ') || session.ip || ''}
                              </span>
                            </span>
                            <span className="font-mono text-[#718092]">{formatDate(session.lastActiveAt)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between text-[11px] font-mono text-[#8C98A6]">
          <span>
            Page {page + 1} of {pageCount}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage(current => Math.max(0, current - 1))}
              className="rounded-md border border-[#2A3848] px-2.5 py-1 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page + 1 >= pageCount}
              onClick={() => setPage(current => current + 1)}
              className="rounded-md border border-[#2A3848] px-2.5 py-1 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
