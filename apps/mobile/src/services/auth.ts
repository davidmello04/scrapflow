import type { AuthUser, LoginResponse } from '../types/user';
import { apiRequest } from './api';

export const authService = {
  login: (email: string, password: string) => apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  me: () => apiRequest<AuthUser>('/api/auth/me'),
  changePassword: (currentPassword: string, newPassword: string) => apiRequest<void>('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  }),
};
