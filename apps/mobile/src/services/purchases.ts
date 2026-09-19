import type { CreatePurchaseInput, Purchase } from '../types/purchase';
import { apiRequest } from './api';

export const purchasesService = {
  create: (input: CreatePurchaseInput) => apiRequest<Purchase>('/api/purchases', {
    method: 'POST',
    body: JSON.stringify(input),
  }),
  list: () => apiRequest<Purchase[]>('/api/purchases'),
  get: (id: string) => apiRequest<Purchase>(`/api/purchases/${id}`),
};
