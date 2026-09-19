import type { FilterQuery } from 'mongoose';
import type { Purchase } from '../models/purchase.js';

export type PurchaseHistoryFilters = {
  search?: string;
  days?: 7 | 30;
};

export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function buildPurchaseFilter(
  filters: PurchaseHistoryFilters,
  now = new Date(),
): FilterQuery<InstanceType<typeof Purchase>> {
  const query: FilterQuery<InstanceType<typeof Purchase>> = {};

  if (filters.search) {
    query.sellerName = { $regex: escapeRegExp(filters.search), $options: 'i' };
  }

  if (filters.days) {
    const from = new Date(now);
    from.setUTCDate(from.getUTCDate() - filters.days);
    query.createdAt = { $gte: from };
  }

  return query;
}
