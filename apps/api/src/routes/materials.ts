import { Router } from 'express';
import { z } from 'zod';
import { Material } from '../models/material.js';
import { authorize } from '../middleware/auth.js';

const input = z.object({
  name: z.string().trim().min(2).max(80),
  pricePerKgInCents: z.number().int().nonnegative(),
});

export const materialsRouter = Router();

materialsRouter.get('/', async (_request, response) => {
  const materials = await Material.find({ active: true }).sort({ name: 1 });
  response.json(materials);
});

materialsRouter.post('/', authorize('ADMIN'), async (request, response) => {
  const material = await Material.create(input.parse(request.body));
  response.status(201).json(material);
});

materialsRouter.patch('/:id', authorize('ADMIN'), async (request, response) => {
  const material = await Material.findByIdAndUpdate(
    request.params.id,
    input.partial().parse(request.body),
    { new: true, runValidators: true },
  );
  if (!material) return response.status(404).json({ message: 'Material não encontrado.' });
  response.json(material);
});

materialsRouter.delete('/:id', authorize('ADMIN'), async (request, response) => {
  const material = await Material.findByIdAndUpdate(request.params.id, { active: false }, { new: true });
  if (!material) return response.status(404).json({ message: 'Material não encontrado.' });
  response.status(204).send();
});
