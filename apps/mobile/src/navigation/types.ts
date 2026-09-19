import type { Material } from '../types/material';
import type { Purchase } from '../types/purchase';

export type RootStackParamList = {
  Home: undefined;
  Materials: undefined;
  MaterialForm: { material?: Material } | undefined;
  NewPurchase: undefined;
  PurchaseReceipt: { purchase: Purchase };
};
