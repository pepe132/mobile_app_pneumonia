import { sessionStorage } from '../storage/sessionStorage';

const API_VERSION_PREFIX = '/api/v1';

type ApiErrorBody = { error?: { code?: string; message?: string; details?: unknown } };

export type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | Record<string, unknown> | null;
  authenticated?: boolean;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code = 'HTTP_ERROR',
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getApiBaseUrl() {
  const origin = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/$/, '');
  if (!origin) throw new Error('Falta configurar EXPO_PUBLIC_API_URL.');
  return `${origin}${API_VERSION_PREFIX}`;
}

function normalizeBody(body: ApiRequestOptions['body'], headers: Headers) {
  if (body == null || typeof body === 'string' || body instanceof FormData || body instanceof Blob) {
    return body as BodyInit | null | undefined;
  }
  headers.set('Content-Type', 'application/json');
  return JSON.stringify(body);
}

async function readError(response: Response) {
  try {
    return (await response.json()) as ApiErrorBody;
  } catch {
    return undefined;
  }
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { authenticated = true, body, headers: initialHeaders, ...init } = options;
  const headers = new Headers(initialHeaders);
  headers.set('Accept', 'application/json');

  if (authenticated) {
    const token = await sessionStorage.getAccessToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    body: normalizeBody(body, headers),
    headers,
  });

  if (!response.ok) {
    const payload = await readError(response);
    throw new ApiError(
      payload?.error?.message ?? 'No fue posible completar la solicitud.',
      response.status,
      payload?.error?.code,
      payload?.error?.details,
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
