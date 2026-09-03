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

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/$/, '');
}

function resolvePublicServerApiUrl(publicApiUrl?: string): string {
  if (!publicApiUrl) {
    return DEFAULT_SERVER_API_URL;
  }

  return isAbsoluteUrl(publicApiUrl) ? publicApiUrl : resolveRelativeServerUrl(publicApiUrl);
}

function resolveApiBaseUrls(): string[] {
  const isServer = typeof window === 'undefined';
  const serverApiUrl = process.env.INTERNAL_API_URL;
  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!isServer) {
    return [normalizeBaseUrl(publicApiUrl || DEFAULT_BROWSER_API_URL)];
  }

  const urls: string[] = [];

  if (isServer && serverApiUrl) {
    urls.push(normalizeBaseUrl(serverApiUrl));
  }

  const publicServerApiUrl = normalizeBaseUrl(resolvePublicServerApiUrl(publicApiUrl));
  if (!urls.includes(publicServerApiUrl)) {
    urls.push(publicServerApiUrl);
  }

  return urls;
}

const API_BASE_URLS = resolveApiBaseUrls();

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

function buildApiUrl(baseUrl: string, endpoint: string): string {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  return `${baseUrl}${normalizedEndpoint}`;
}

async function createApiError(response: Response): Promise<ApiError> {
  const errorBody = await response.json().catch(() => ({})) as {
    code?: string;
    detail?: string;
  };

  return new ApiError(
    response.status,
    errorBody.code || 'api_error',
    errorBody.detail || `API request failed with ${response.status} ${response.statusText}`,
  );
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

  const method = requestInit.method?.toUpperCase() || 'GET';
  const baseUrls = method === 'GET' ? API_BASE_URLS : [API_BASE_URLS[0]];
  let lastError: unknown;

  for (const [index, baseUrl] of baseUrls.entries()) {
    try {
      const response = await fetch(buildApiUrl(baseUrl, endpoint), {
        ...requestInit,
      });

      if (!response.ok) {
        const apiError = await createApiError(response);
        if (response.status === 404 || index === baseUrls.length - 1) {
          throw apiError;
        }
        lastError = apiError;
        continue;
      }

      if (response.status === 204) {
        return null as T;
      }

      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        return (await response.json()) as T;
      }

      return (await response.text()) as T;
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        throw err;
      }
      if (index === baseUrls.length - 1) {
        throw err;
      }
      lastError = err;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('API request failed');
}
