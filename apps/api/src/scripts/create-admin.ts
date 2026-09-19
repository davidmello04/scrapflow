import { z } from 'zod';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { User } from '../models/user.js';
import { hashPassword } from '../services/password.js';

const input = z.object({
  ADMIN_NAME: z.string().trim().min(2).max(100),
  ADMIN_EMAIL: z.string().trim().email().transform((value) => value.toLowerCase()),
  ADMIN_PASSWORD: z.string().min(10).max(200),
}).parse(process.env);

try {
  await connectDatabase();
  const existing = await User.exists({ email: input.ADMIN_EMAIL });
  if (existing) throw new Error('Já existe um usuário com este e-mail. Nenhuma alteração foi realizada.');

  await User.create({
    name: input.ADMIN_NAME,
    email: input.ADMIN_EMAIL,
    passwordHash: await hashPassword(input.ADMIN_PASSWORD),
    role: 'ADMIN',
  });
  console.log(`Administrador criado para ${input.ADMIN_EMAIL}.`);
} finally {
  await disconnectDatabase();
}
