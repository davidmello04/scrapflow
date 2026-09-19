import { describe, expect, it } from 'vitest';
import { formatWeightFromGrams, parseKgToGrams } from './weight';

describe('weight helpers', () => {
  it('aceita vírgula decimal e converte quilogramas em gramas', () => {
    expect(parseKgToGrams('2,750')).toBe(2750);
  });

  it('formata gramas em quilogramas no padrão brasileiro', () => {
    expect(formatWeightFromGrams(2750)).toBe('2,75 kg');
  });

  it('rejeita conteúdo que não representa peso', () => {
    expect(parseKgToGrams('peso')).toBeNaN();
  });
});
