export type PurchaseItem = {
  materialId: string;
  materialName: string;
  weightInGrams: number;
  pricePerKgInCents: number;
  subtotalInCents: number;
};

export type Purchase = {
  _id: string;
  sellerName: string;
  items: PurchaseItem[];
  totalInCents: number;
  createdAt: string;
  updatedAt: string;
};

export type CreatePurchaseInput = {
  sellerName: string;
  items: Array<{ materialId: string; weightInGrams: number }>;
};

export type PurchaseHistoryFilters = {
  search?: string;
  days?: 7 | 30;
};
