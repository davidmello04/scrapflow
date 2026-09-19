import { Schema, model } from 'mongoose';

const purchaseItemSchema = new Schema(
  {
    materialId: { type: Schema.Types.ObjectId, ref: 'Material', required: true },
    materialName: { type: String, required: true },
    weightInGrams: { type: Number, required: true, min: 1 },
    pricePerKgInCents: { type: Number, required: true, min: 0 },
    subtotalInCents: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const purchaseSchema = new Schema(
  {
    sellerName: { type: String, required: true, trim: true },
    items: { type: [purchaseItemSchema], required: true },
    totalInCents: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

export const Purchase = model('Purchase', purchaseSchema);
