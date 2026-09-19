import { describe, expect, it } from 'vitest';
import { calculatePreviewSubtotal } from './purchase';

describe('calculatePreviewSubtotal', () => {
  it('usa a mesma unidade monetária e de peso da API', () => {
    expect(calculatePreviewSubtotal(2500, 375)).toBe(938);
  });
});
