import type { Material, MaterialInput } from '../types/material';
import { apiRequest } from './api';

export const materialsService = {
  list: () => apiRequest<Material[]>('/api/materials'),
  create: (input: MaterialInput) => apiRequest<Material>('/api/materials', {
    method: 'POST',
    body: JSON.stringify(input),
  }),
  update: (id: string, input: MaterialInput) => apiRequest<Material>(`/api/materials/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  }),
  deactivate: (id: string) => apiRequest<void>(`/api/materials/${id}`, { method: 'DELETE' }),
};
