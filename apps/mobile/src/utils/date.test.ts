import { describe, expect, it } from 'vitest';
import { formatDateTime } from './date';

describe('formatDateTime', () => {
  it('trata datas inválidas sem quebrar a tela', () => {
    expect(formatDateTime('invalid')).toBe('Data indisponível');
  });

  it('exibe data e hora no padrão brasileiro', () => {
    expect(formatDateTime('2026-09-19T15:30:00.000Z')).toMatch(/19\/09\/2026/);
  });
});
