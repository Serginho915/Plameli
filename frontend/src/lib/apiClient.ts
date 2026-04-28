

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    //

    return {} as T; // Fallback
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
