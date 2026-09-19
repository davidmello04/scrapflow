export function calculatePreviewSubtotal(weightInGrams: number, pricePerKgInCents: number) {
  return Math.round((weightInGrams * pricePerKgInCents) / 1000);
}
