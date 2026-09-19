import { Router } from 'express';
import { z } from 'zod';
import { calculateSubtotal } from '../domain/money.js';
import { buildPurchaseFilter } from '../domain/purchase-filter.js';
import { Material } from '../models/material.js';
import { Purchase } from '../models/purchase.js';

const input = z.object({
  sellerName: z.string().trim().min(2).max(100),
  items: z.array(z.object({
    materialId: z.string().min(1),
    weightInGrams: z.number().int().positive(),
  })).min(1),
});

export const purchasesRouter = Router();

const historyQuery = z.object({
  search: z.string().trim().max(100).optional(),
  days: z.coerce.number().int().pipe(z.union([z.literal(7), z.literal(30)])).optional(),
});

purchasesRouter.get('/', async (request, response) => {
  const filters = historyQuery.parse(request.query);
  const purchases = await Purchase.find(buildPurchaseFilter(filters)).sort({ createdAt: -1 }).limit(100);
  response.json(purchases);
});

purchasesRouter.get('/:id', async (request, response) => {
  const purchase = await Purchase.findById(request.params.id);
  if (!purchase) return response.status(404).json({ message: 'Compra não encontrada.' });
  response.json(purchase);
});

purchasesRouter.post('/', async (request, response) => {
  const data = input.parse(request.body);
  const ids = [...new Set(data.items.map((item) => item.materialId))];
  const materials = await Material.find({ _id: { $in: ids }, active: true });
  const byId = new Map(materials.map((material) => [material.id, material]));

  const items = data.items.map((item) => {
    const material = byId.get(item.materialId);
    if (!material) throw new z.ZodError([{ code: 'custom', path: ['items'], message: 'Material inválido ou inativo.' }]);
    return {
      materialId: material._id,
      materialName: material.name,
      weightInGrams: item.weightInGrams,
      pricePerKgInCents: material.pricePerKgInCents,
      subtotalInCents: calculateSubtotal(item.weightInGrams, material.pricePerKgInCents),
    };
  });

  const totalInCents = items.reduce((total, item) => total + item.subtotalInCents, 0);
  const purchase = await Purchase.create({ sellerName: data.sellerName, items, totalInCents });
  response.status(201).json(purchase);
});
