import { describe, expect, it } from 'vitest';
import { calculateSubtotal } from './money.js';

describe('calculateSubtotal', () => {
  it('calcula o valor de 2,5 kg sem usar ponto flutuante monetário', () => {
    expect(calculateSubtotal(2500, 375)).toBe(938);
  });
});
