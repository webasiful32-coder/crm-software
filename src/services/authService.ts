const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/auth';

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  avatar?: string;
  title?: string;
  department?: string;
  phone?: string;
  registered_at?: string;
  password?: string;
}

export const loginUser = async (email: string, password: string): Promise<ApiUser> => {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data.user;
};

export const quickLoginUser = async (email: string): Promise<ApiUser> => {
  const res = await fetch(`${API_BASE}/quick-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Quick login failed');
  return data.user;
};

export const registerUser = async (userData: {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar?: string;
  title?: string;
  department?: string;
  phone?: string;
}): Promise<ApiUser> => {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data.user;
};