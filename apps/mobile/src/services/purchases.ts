import type { CreatePurchaseInput, Purchase, PurchaseHistoryFilters } from '../types/purchase';
import { apiRequest } from './api';

export const purchasesService = {
  create: (input: CreatePurchaseInput) => apiRequest<Purchase>('/api/purchases', {
    method: 'POST',
    body: JSON.stringify(input),
  }),
  list: (filters: PurchaseHistoryFilters = {}) => {
    const query = new URLSearchParams();
    if (filters.search?.trim()) query.set('search', filters.search.trim());
    if (filters.days) query.set('days', String(filters.days));
    const suffix = query.size ? `?${query.toString()}` : '';
    return apiRequest<Purchase[]>(`/api/purchases${suffix}`);
  },
  get: (id: string) => apiRequest<Purchase>(`/api/purchases/${id}`),
};
