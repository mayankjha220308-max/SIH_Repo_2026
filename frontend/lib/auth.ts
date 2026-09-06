const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export type UserOut = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type Token = {
  access_token: string;
  token_type: string;
};

export async function register(name: string, email: string, password: string, role = 'ARTISAN') {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
    throw new Error(err.detail || 'Registration failed');
  }
  const data: UserOut = await res.json();
  return data;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // important to receive HttpOnly cookie
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Login failed' }));
    throw new Error(err.detail || 'Login failed');
  }
  const data: Token = await res.json();
  return data;
}

export async function getCurrentUser(): Promise<UserOut> {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Not authenticated');
  }
  const data: UserOut = await res.json();
  return data;
}

export async function logout() {
  // Backend may or may not implement logout; call endpoint to clear cookie
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Logout failed');
  }
  return true;
}
