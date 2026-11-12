import {
  clerk,
  errorResponse,
  readBody,
  requireAdmin,
  send,
  summarizeUser,
} from '../_lib.js';

const clampLimit = value => Math.min(Math.max(Number(value) || 20, 1), 50);
const clampOffset = value => Math.max(Number(value) || 0, 0);

const activeSessionsFor = async userId => {
  try {
    const list = await clerk.sessions.getSessionList({ userId, status: 'active', limit: 20 });
    return list.data || [];
  } catch {
    return [];
  }
};

/**
 * Admin user management.
 *   GET    ?query=&limit=&offset=   → list users with active sessions
 *   POST   { email, password, firstName?, lastName?, role? } → create user
 *   PATCH  { userId, banned?, role? } → ban/unban or change role
 *   DELETE ?userId=                 → delete user
 */
export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return undefined;

  try {
    if (req.method === 'GET') {
      const url = new URL(req.url, 'http://localhost');
      const query = (url.searchParams.get('query') || '').trim();
      const limit = clampLimit(url.searchParams.get('limit'));
      const offset = clampOffset(url.searchParams.get('offset'));

      const result = await clerk.users.getUserList({
        ...(query ? { query } : {}),
        limit,
        offset,
        orderBy: '-created_at',
      });

      const users = result.data || [];
      const sessions = await Promise.all(users.map(user => activeSessionsFor(user.id)));

      return send(res, 200, {
        totalCount: result.totalCount ?? users.length,
        limit,
        offset,
        users: users.map((user, index) => summarizeUser(user, sessions[index])),
      });
    }

    if (req.method === 'POST') {
      const { email, password, firstName, lastName, role } = readBody(req);
      if (!email || !password) {
        return send(res, 400, { error: 'Email and password are required.' });
      }
      const user = await clerk.users.createUser({
        emailAddress: [email.trim()],
        password,
        ...(firstName ? { firstName } : {}),
        ...(lastName ? { lastName } : {}),
        ...(role ? { publicMetadata: { role } } : {}),
        skipPasswordChecks: true,
      });
      return send(res, 201, { user: summarizeUser(user) });
    }

    if (req.method === 'PATCH') {
      const { userId, banned, role, access } = readBody(req);
      if (!userId) return send(res, 400, { error: 'userId is required.' });
      if (userId === admin.userId && banned === true) {
        return send(res, 400, { error: 'You cannot ban your own administrator account.' });
      }

      const current = await clerk.users.getUser(userId);
      const params = {};
      const metadata = { ...(current.publicMetadata || {}) };
      let metadataChanged = false;

      if (typeof banned === 'boolean') params.banned = banned;

      if (typeof role === 'string') {
        if (role) metadata.role = role;
        else delete metadata.role;
        metadataChanged = true;
      }

      if (access && typeof access === 'object') {
        const level = ['full', 'study', 'fcn', 'none'].includes(access.level) ? access.level : 'full';
        const rawDevices = Number(access.maxDevices);
        const maxDevices = Number.isFinite(rawDevices) && rawDevices > 0
          ? Math.min(Math.max(Math.round(rawDevices), 1), 5)
          : 2;
        metadata.access = { ...(metadata.access || {}), level, maxDevices };
        metadataChanged = true;
      }

      if (metadataChanged) params.publicMetadata = metadata;

      const updated = await clerk.users.updateUser(userId, params);
      return send(res, 200, { user: summarizeUser(updated, await activeSessionsFor(userId)) });
    }

    if (req.method === 'DELETE') {
      const url = new URL(req.url, 'http://localhost');
      const userId = url.searchParams.get('userId');
      if (!userId) return send(res, 400, { error: 'userId is required.' });
      if (userId === admin.userId) {
        return send(res, 400, { error: 'You cannot delete your own administrator account.' });
      }
      await clerk.users.deleteUser(userId);
      return send(res, 200, { deleted: userId });
    }

    return send(res, 405, { error: 'method_not_allowed' });
  } catch (error) {
    return errorResponse(res, error);
  }
}
