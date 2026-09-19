export type Material = {
  _id: string;
  name: string;
  pricePerKgInCents: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MaterialInput = Pick<Material, 'name' | 'pricePerKgInCents'>;
