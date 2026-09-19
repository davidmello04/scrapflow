export function parseKgToGrams(value: string) {
  const normalized = value.trim().replace(',', '.');
  const kilograms = Number(normalized);
  return Number.isFinite(kilograms) ? Math.round(kilograms * 1000) : Number.NaN;
}

export function formatWeightFromGrams(value: number) {
  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3 }).format(value / 1000)} kg`;
}
