import { api } from '../lib/axios';
import type { User } from '../types';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async register(data: RegisterPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/api/auth/register', data);
    return res.data;
  },

  async login(data: LoginPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/api/auth/login', data);
    return res.data;
  },

  async logout(): Promise<void> {
    await api.post('/api/auth/logout');
  },
};
