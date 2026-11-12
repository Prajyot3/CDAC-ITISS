import { createClerkClient, verifyToken } from '@clerk/backend';

const SECRET_KEY = process.env.CLERK_SECRET_KEY;

export const clerk = createClerkClient({ secretKey: SECRET_KEY });

/** Accounts that always have admin powers, in addition to `publicMetadata.role === 'admin'`. */
export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'pujariprajyot00@gmail.com')
  .split(',')
  .map(value => value.trim().toLowerCase())
  .filter(Boolean);

/** Concurrent sessions allowed per account (password-sharing guard). */
export const MAX_ACTIVE_SESSIONS = Math.max(1, Number(process.env.MAX_ACTIVE_SESSIONS || 2));

export const send = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

export const readBody = req => {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
};

const bearerToken = req => {
  const header = req.headers?.authorization || req.headers?.Authorization || '';
  if (typeof header !== 'string') return '';
  return header.startsWith('Bearer ') ? header.slice(7).trim() : '';
};

/** Verifies the Clerk session token sent by the browser. */
export const authenticate = async req => {
  const token = bearerToken(req);
  if (!token || !SECRET_KEY) return null;
  try {
    const claims = await verifyToken(token, { secretKey: SECRET_KEY });
    if (!claims?.sub) return null;
    return { userId: claims.sub, sessionId: claims.sid || null };
  } catch {
    return null;
  }
};

export const requireUser = async (req, res) => {
  const auth = await authenticate(req);
  if (!auth) {
    send(res, 401, { error: 'Session token missing or invalid. Please sign in again.' });
    return null;
  }
  return auth;
};

export const isAdmin = user => {
  const role = user?.publicMetadata?.role;
  if (role === 'admin') return true;
  const emails = (user?.emailAddresses || []).map(entry =>
    (entry.emailAddress || '').toLowerCase(),
  );
  return emails.some(email => ADMIN_EMAILS.includes(email));
};

export const requireAdmin = async (req, res) => {
  const auth = await requireUser(req, res);
  if (!auth) return null;
  const user = await clerk.users.getUser(auth.userId);
  if (!isAdmin(user)) {
    send(res, 403, { error: 'Administrator access required.' });
    return null;
  }
  return { ...auth, user };
};

export const summarizeSession = session => {
  const activity = session.latestActivity || {};
  return {
    id: session.id,
    status: session.status,
    lastActiveAt: session.lastActiveAt || null,
    createdAt: session.createdAt || null,
    browser: activity.browserName || null,
    browserVersion: activity.browserVersion || null,
    os: activity.osName || null,
    deviceType: activity.deviceType || null,
    ip: activity.ipAddress || null,
    city: activity.city || null,
    country: activity.country || null,
  };
};

export const summarizeUser = (user, sessions = []) => ({
  id: user.id,
  email: user.emailAddresses?.[0]?.emailAddress || null,
  emails: (user.emailAddresses || []).map(entry => entry.emailAddress),
  firstName: user.firstName,
  lastName: user.lastName,
  imageUrl: user.imageUrl,
  role: user.publicMetadata?.role || null,
  banned: Boolean(user.banned),
  createdAt: user.createdAt,
  lastSignInAt: user.lastSignInAt || null,
  sessions: sessions.map(summarizeSession),
  activeSessionCount: sessions.length,
});

export const sortByLastActive = sessions =>
  [...sessions].sort(
    (a, b) => new Date(b.lastActiveAt || 0).getTime() - new Date(a.lastActiveAt || 0).getTime(),
  );

export const errorResponse = (res, error) => {
  const message =
    error?.errors?.[0]?.longMessage ||
    error?.errors?.[0]?.message ||
    error?.message ||
    'Unexpected server error.';
  send(res, error?.status || error?.statusCode || 500, { error: message });
};

// Vercel treats every file under /api as a route; keep the shared module inert.
export default function handler(_req, res) {
  send(res, 404, { error: 'not_found' });
}
