const DEFAULT_API_URL = 'http://localhost:8000/api';

function resolveApiBaseUrl(): string {
  const isServer = typeof window === 'undefined';
  const serverApiUrl = process.env.INTERNAL_API_URL;
  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (isServer && serverApiUrl) {
    return serverApiUrl.replace(/\/$/, '');
  }

  return (publicApiUrl || DEFAULT_API_URL).replace(/\/$/, '');
}

const API_BASE_URL = resolveApiBaseUrl();

function buildApiUrl(endpoint: string): string {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  return `${API_BASE_URL}${normalizedEndpoint}`;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const requestInit: RequestInit = {
    ...options,
    method: options.method || 'GET',
    headers,
    credentials: options.credentials || 'include',
  };

  const response = await fetch(buildApiUrl(endpoint), {
    ...requestInit,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(
      `API request failed with ${response.status} ${response.statusText}${errorBody ? `: ${errorBody}` : ''}`
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}
