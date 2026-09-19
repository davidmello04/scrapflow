import type { CreateUserInput, ManagedUser, UserRole } from '../types/user';
import { apiRequest } from './api';

export const usersService = {
  list: () => apiRequest<ManagedUser[]>('/api/users'),
  create: (input: CreateUserInput) => apiRequest<ManagedUser>('/api/users', {
    method: 'POST',
    body: JSON.stringify(input),
  }),
  update: (id: string, input: { name?: string; role?: UserRole; active?: boolean }) => apiRequest<ManagedUser>(`/api/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  }),
};
