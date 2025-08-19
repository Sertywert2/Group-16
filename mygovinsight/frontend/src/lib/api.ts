// Centralized API client
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export type SignInBody = { email: string; password: string };
export type RegisterBody = { name: string; email: string; password: string };
export type ActivateBody = { email: string; otp: string };

export async function apiFetch<T>(path: string, opts: RequestInit = {}, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  // handle empty responses
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) return (undefined as unknown) as T;
  return res.json();
}

export const AuthApi = {
  signin: (body: SignInBody) => apiFetch<{ token: string; user: any }>(`/api/auth/signin`, { method: 'POST', body: JSON.stringify(body) }),
  register: (body: RegisterBody) => apiFetch(`/api/auth/register`, { method: 'POST', body: JSON.stringify(body) }),
  activate: (body: ActivateBody) => apiFetch(`/api/auth/activate`, { method: 'POST', body: JSON.stringify(body) }),
  me: (token: string) => apiFetch(`/api/auth/me`, { method: 'GET' }, token),
  logout: () => apiFetch(`/api/auth/logout`, { method: 'POST' }),
};

export const ServicesApi = {
  list: () => apiFetch(`/api/services`, { method: 'GET' }),
};

export const FeedbackApi = {
  list: (page = 1, limit = 10) => apiFetch(`/api/feedback?page=${page}&limit=${limit}`, { method: 'GET' }),
  submit: async (form: FormData, token: string) => {
    const res = await fetch(`${API_BASE_URL}/api/feedback`, {
      method: 'POST',
      body: form,
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};

export const DashboardApi = {
  get: (token: string) => apiFetch(`/api/dashboard`, { method: 'GET' }, token),
};
