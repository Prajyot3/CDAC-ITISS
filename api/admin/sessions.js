import {
  clerk,
  errorResponse,
  readBody,
  requireAdmin,
  send,
  sortByLastActive,
  summarizeSession,
} from '../_lib.js';

/**
 * Admin session management.
 *   GET  ?userId=                    → active sessions for one user
 *   POST { userId, sessionId }       → revoke one session
 *   POST { userId, revokeAll: true } → revoke every active session for a user
 */
export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return undefined;

  try {
    if (req.method === 'GET') {
      const url = new URL(req.url, 'http://localhost');
      const userId = url.searchParams.get('userId');
      if (!userId) return send(res, 400, { error: 'userId is required.' });

      const list = await clerk.sessions.getSessionList({ userId, status: 'active', limit: 100 });
      return send(res, 200, {
        userId,
        sessions: sortByLastActive(list.data || []).map(summarizeSession),
      });
    }

    if (req.method === 'POST') {
      const { userId, sessionId, revokeAll } = readBody(req);
      if (!userId) return send(res, 400, { error: 'userId is required.' });

      const list = await clerk.sessions.getSessionList({ userId, status: 'active', limit: 100 });
      const sessions = list.data || [];

      if (revokeAll) {
        const revoked = [];
        for (const session of sessions) {
          try {
            await clerk.sessions.revokeSession(session.id);
            revoked.push(session.id);
          } catch {
            /* already gone */
          }
        }
        return send(res, 200, { revoked });
      }

      if (!sessionId) return send(res, 400, { error: 'sessionId or revokeAll is required.' });
      if (!sessions.some(session => session.id === sessionId)) {
        return send(res, 404, { error: 'That session is not active for this user.' });
      }

      await clerk.sessions.revokeSession(sessionId);
      return send(res, 200, { revoked: [sessionId] });
    }

    return send(res, 405, { error: 'method_not_allowed' });
  } catch (error) {
    return errorResponse(res, error);
  }
}
