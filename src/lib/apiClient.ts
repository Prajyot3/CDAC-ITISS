export class ApiError extends Error {
  status: number;

  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

/**
 * Small fetch wrapper for the `/api/*` serverless endpoints.
 * Clerk session tokens are sent as `Authorization: Bearer <token>`.
 */
export async function apiRequest<T>(
  path: string,
  token: string | null,
  init: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...((init.headers as Record<string, string> | undefined) ?? {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;
  if (init.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';

  const response = await fetch(path, { ...init, headers });
  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { raw: text };
    }
  }

  if (!response.ok) {
    const message =
      (payload as { error?: string } | null)?.error ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}
