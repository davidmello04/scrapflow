import { Schema, model } from 'mongoose';

const materialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    pricePerKgInCents: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export const Material = model('Material', materialSchema);
