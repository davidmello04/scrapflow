import { Router } from 'express';
import { z } from 'zod';
import { validateUserAccessChange } from '../domain/user-access.js';
import { authorize } from '../middleware/auth.js';
import { User, userRoles } from '../models/user.js';
import { hashPassword } from '../services/password.js';

const createInput = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(10).max(200),
  role: z.enum(userRoles).default('OPERATOR'),
});

const updateInput = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  role: z.enum(userRoles).optional(),
  active: z.boolean().optional(),
}).refine((value) => Object.keys(value).length > 0, 'Informe ao menos uma alteração.');

function publicUser(user: { _id: { toString(): string }; name: string; email: string; role: string; active: boolean; createdAt: Date; updatedAt: Date }) {
  return { id: user._id.toString(), name: user.name, email: user.email, role: user.role, active: user.active, createdAt: user.createdAt, updatedAt: user.updatedAt };
}

export const usersRouter = Router();
usersRouter.use(authorize('ADMIN'));

usersRouter.get('/', async (_request, response) => {
  const users = await User.find().sort({ active: -1, name: 1 });
  response.json(users.map(publicUser));
});

usersRouter.post('/', async (request, response) => {
  const input = createInput.parse(request.body);
  if (await User.exists({ email: input.email })) {
    response.status(409).json({ message: 'Já existe uma conta com este e-mail.' });
    return;
  }

  const user = await User.create({
    name: input.name,
    email: input.email,
    passwordHash: await hashPassword(input.password),
    role: input.role,
  });
  response.status(201).json(publicUser(user));
});

usersRouter.patch('/:id', async (request, response) => {
  const input = updateInput.parse(request.body);
  const user = await User.findById(request.params.id);
  if (!user) {
    response.status(404).json({ message: 'Usuário não encontrado.' });
    return;
  }

  const activeAdminCount = await User.countDocuments({ role: 'ADMIN', active: true });
  const violation = validateUserAccessChange({
    actorId: request.user!.id,
    targetId: user.id,
    targetRole: user.role,
    targetActive: user.active,
    nextRole: input.role,
    nextActive: input.active,
    activeAdminCount,
  });
  if (violation) {
    response.status(409).json({ message: violation });
    return;
  }

  if (input.name !== undefined) user.name = input.name;
  if (input.role !== undefined) user.role = input.role;
  if (input.active !== undefined) user.active = input.active;
  await user.save();
  response.json(publicUser(user));
});
