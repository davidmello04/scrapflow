import type { Material } from '../types/material';
import type { Purchase } from '../types/purchase';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Materials: undefined;
  MaterialForm: { material?: Material } | undefined;
  NewPurchase: undefined;
  PurchaseReceipt: { purchase: Purchase };
  PurchaseHistory: undefined;
  PurchaseDetail: { purchaseId: string };
  Users: undefined;
  NewUser: undefined;
};
