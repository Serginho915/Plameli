const DEFAULT_BROWSER_API_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api' : '/api';
const DEFAULT_SERVER_API_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api' : 'https://ledgerlab.tech/api';

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function resolveRelativeServerUrl(value: string): string {
  const baseUrl = (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.FRONTEND_URL ||
    'https://ledgerlab.tech'
  ).replace(/\/$/, '');

  return `${baseUrl}${value.startsWith('/') ? value : `/${value}`}`;
}

function resolveApiBaseUrl(): string {
  const isServer = typeof window === 'undefined';
  const serverApiUrl = process.env.INTERNAL_API_URL;
  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (isServer && serverApiUrl) {
    return serverApiUrl.replace(/\/$/, '');
  }

  if (publicApiUrl) {
    if (isServer && !isAbsoluteUrl(publicApiUrl)) {
      return resolveRelativeServerUrl(publicApiUrl).replace(/\/$/, '');
    }

    return publicApiUrl.replace(/\/$/, '');
  }

  return (isServer ? DEFAULT_SERVER_API_URL : DEFAULT_BROWSER_API_URL).replace(/\/$/, '');
}

const API_BASE_URL = resolveApiBaseUrl();

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

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
    const errorBody = await response.json().catch(() => ({})) as {
      code?: string;
      detail?: string;
    };
    throw new ApiError(
      response.status,
      errorBody.code || 'api_error',
      errorBody.detail || `API request failed with ${response.status} ${response.statusText}`,
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
