import { describe, expect, it } from 'vitest';
import type { Purchase } from '../types/purchase';
import { buildReceiptHtml, escapeHtml } from './receipt-html';

const purchase: Purchase = {
  _id: '507f1f77bcf86cd799439011',
  sellerName: '<script>alert("x")</script>',
  items: [{
    materialId: '507f1f77bcf86cd799439012',
    materialName: 'Alumínio & cobre',
    weightInGrams: 2500,
    pricePerKgInCents: 375,
    subtotalInCents: 938,
  }],
  totalInCents: 938,
  createdAt: '2026-09-19T15:30:00.000Z',
  updatedAt: '2026-09-19T15:30:00.000Z',
};

describe('receipt HTML', () => {
  it('escapa conteúdo dinâmico antes de inseri-lo no documento', () => {
    expect(escapeHtml('<b>R&D</b>')).toBe('&lt;b&gt;R&amp;D&lt;/b&gt;');
    const html = buildReceiptHtml(purchase);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('Alumínio &amp; cobre');
  });

  it('inclui identificação, total e aviso não fiscal', () => {
    const html = buildReceiptHtml(purchase);
    expect(html).toContain('#99439011');
    expect(html).toContain('R$\u00a09,38');
    expect(html).toContain('Não possui valor fiscal');
  });
});
