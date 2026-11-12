import {
  clerk,
  errorResponse,
  MAX_ACTIVE_SESSIONS,
  readBody,
  requireUser,
  resolveAccess,
  send,
  sortByLastActive,
  summarizeSession,
} from './_lib.js';

/**
 * Enforces the per-account concurrent session limit.
 *
 * POST { action?: 'revoke', sessionId?: string }
 *   - no action       → report whether this session is still allowed
 *   - action 'revoke' → revoke one of the caller's own sessions, then re-check
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });

  const auth = await requireUser(req, res);
  if (!auth) return undefined;

  try {
    const body = readBody(req);
    const currentSessionId = body.sessionId || auth.sessionId;

    if (body.action === 'revoke' && body.sessionId) {
      const target = await clerk.sessions.getSession(body.sessionId);
      if (!target || target.userId !== auth.userId) {
        return send(res, 403, { error: 'That session does not belong to your account.' });
      }
      await clerk.sessions.revokeSession(body.sessionId);
    }

    const list = await clerk.sessions.getSessionList({
      userId: auth.userId,
      status: 'active',
      limit: 100,
    });

    // Per-student device allowance, set by an administrator (default 2).
    const user = await clerk.users.getUser(auth.userId);
    const { maxDevices } = resolveAccess(user.publicMetadata);
    const max = Math.min(Math.max(maxDevices || MAX_ACTIVE_SESSIONS, 1), 5);

    const sessions = sortByLastActive(list.data || []);
    const currentIndex = sessions.findIndex(session => session.id === currentSessionId);
    const allowed = currentIndex === -1 || currentIndex < max;

    // Trim sessions beyond the limit, but never the caller's own session.
    const overflow = sessions.slice(max);
    const revoked = [];
    for (const session of overflow) {
      if (session.id === currentSessionId) continue;
      try {
        await clerk.sessions.revokeSession(session.id);
        revoked.push(session.id);
      } catch {
        /* session may already be gone */
      }
    }

    const kept = sortByLastActive(list.data || []).slice(0, max);

    return send(res, 200, {
      allowed,
      max,
      currentSessionId,
      sessions: kept.map(session => ({
        ...summarizeSession(session),
        isCurrent: session.id === currentSessionId,
      })),
      revoked,
    });
  } catch (error) {
    return errorResponse(res, error);
  }
}
