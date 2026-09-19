import { describe, expect, it } from 'vitest';
import { buildPurchaseFilter, escapeRegExp } from './purchase-filter.js';

describe('purchase history filters', () => {
  it('escapa caracteres especiais antes da busca por vendedor', () => {
    expect(escapeRegExp('João (filho) +')).toBe('João \\(filho\\) \\+');
  });

  it('calcula o início do período sem alterar a data recebida', () => {
    const now = new Date('2026-09-19T12:00:00.000Z');
    const filter = buildPurchaseFilter({ days: 7 }, now);

    expect(filter.createdAt).toEqual({ $gte: new Date('2026-09-12T12:00:00.000Z') });
    expect(now.toISOString()).toBe('2026-09-19T12:00:00.000Z');
  });
});
