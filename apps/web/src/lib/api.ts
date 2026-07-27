const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api';

export interface ApiError {
  error: string;
  details?: unknown;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  }).catch((err: unknown) => {
    const hint =
      'Network error talking to the API (connection reset or timeout). Generation can take a minute — wait and retry, or check the API terminal for Mistral errors.';
    if (err instanceof TypeError) {
      throw new Error(hint);
    }
    throw err;
  });

  if (!response.ok) {
    let message = 'An error occurred';
    try {
      const errBody = (await response.json()) as ApiError & { message?: string };
      message = errBody.error || errBody.message || message;
    } catch {
      message = `${response.status} ${response.statusText}`;
    }
    throw new Error(message);
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  postForm: async <T>(endpoint: string, formData: FormData): Promise<T> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    }).catch((err: unknown) => {
      const hint =
        'Network error talking to the API (connection reset or timeout). Ensure the API is running on http://127.0.0.1:3001.';
      if (err instanceof TypeError) {
        throw new Error(hint);
      }
      throw err;
    });
    if (!response.ok) {
      let message = 'An error occurred';
      try {
        const errBody = (await response.json()) as ApiError & { message?: string };
        message = errBody.error || errBody.message || message;
      } catch {
        message = `${response.status} ${response.statusText}`;
      }
      throw new Error(message);
    }
    return response.json();
  },
  put: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};


