const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export interface ApiClientError extends Error {
  status?: number;
  data?: any;
}

interface ClientOptions extends RequestInit {
  data?: unknown;
  body?: BodyInit | null;
  token?: string | null;
  headers?: Record<string, string>;
  responseType?: 'json' | 'blob' | 'text'; // Add responseType option
}

// Only try to access cookies if we're in the browser
function getToken(): string | null {
  if (typeof window !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }
  return null;
}

async function client<T = any>(
  endpoint: string,
  {
    data,
    body,
    token,
    headers: customHeaders,
    responseType = 'json', // Default to JSON
    ...customConfig
  }: ClientOptions = {}
): Promise<T> {
  const finalBody = body ?? (data ? JSON.stringify(data) : undefined);

  const config: RequestInit = {
    method: finalBody ? 'POST' : 'GET',
    body: finalBody,
    credentials: 'include',
    headers: {
      ...(finalBody instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customHeaders,
    },
    ...customConfig,
  };

  if (typeof window !== 'undefined') {
    config.credentials = 'include';
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }

      const error: ApiClientError = new Error(
        errorData.detail || errorData.message || 'Request failed'
      );
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    if (response.status === 204) {
      return null as T;
    }

    // Handle different response types
    switch (responseType) {
      case 'blob':
        return response.blob() as Promise<T>;
      case 'text':
        return response.text() as Promise<T>;
      case 'json':
      default:
        return response.json() as Promise<T>;
    }
  } catch (error) {
    if (error instanceof Error) {
      const enhancedError: ApiClientError = new Error(
        error.message || 'Network request failed'
      );
      enhancedError.name = 'NetworkError';
      throw enhancedError;
    }
    throw error;
  }
}

// Server-side specific client
export async function serverClient<T = any>(
  endpoint: string,
  {
    data,
    body,
    token,
    headers: customHeaders,
    responseType = 'json',
    ...customConfig
  }: ClientOptions & { token?: string } = {}
): Promise<T> {
  return client<T>(endpoint, {
    data,
    body,
    token: token || undefined,
    headers: customHeaders,
    responseType,
    ...customConfig,
  });
}

export default client;