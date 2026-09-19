import { Schema, model } from 'mongoose';

export const userRoles = ['ADMIN', 'OPERATOR'] as const;
export type UserRole = (typeof userRoles)[number];

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: userRoles, required: true },
    active: { type: Boolean, default: true, index: true },
    sessionVersion: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

export const User = model('User', userSchema);
