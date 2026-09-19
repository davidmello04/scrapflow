import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { User } from '../models/user.js';
import { signAccessToken } from '../services/auth.js';
import { comparePassword } from '../services/password.js';
import { hashPassword } from '../services/password.js';
import { validatePasswordChange } from '../domain/password-change.js';

const loginInput = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(200),
});

const changePasswordInput = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(10).max(200),
});

const loginLimiter = rateLimit({
  windowMs: 60_000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Muitas tentativas de login. Aguarde um minuto.' },
});

export const authRouter = Router();

authRouter.post('/login', loginLimiter, async (request, response) => {
  const input = loginInput.parse(request.body);
  const user = await User.findOne({ email: input.email, active: true }).select('+passwordHash');
  const valid = user ? await comparePassword(input.password, user.passwordHash) : false;
  if (!user || !valid) {
    response.status(401).json({ message: 'E-mail ou senha inválidos.' });
    return;
  }

  response.json({
    accessToken: signAccessToken({ sub: user.id, role: user.role, ver: user.sessionVersion }),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

authRouter.get('/me', authenticate, (request, response) => response.json(request.user));

authRouter.post('/change-password', authenticate, async (request, response) => {
  const input = changePasswordInput.parse(request.body);
  const violation = validatePasswordChange(input.currentPassword, input.newPassword);
  if (violation) {
    response.status(409).json({ message: violation });
    return;
  }

  const user = await User.findById(request.user!.id).select('+passwordHash');
  if (!user || !user.active) {
    response.status(401).json({ message: 'Sessão inválida.' });
    return;
  }
  if (!(await comparePassword(input.currentPassword, user.passwordHash))) {
    response.status(401).json({ message: 'Senha atual incorreta.' });
    return;
  }

  user.passwordHash = await hashPassword(input.newPassword);
  user.sessionVersion += 1;
  await user.save();
  response.status(204).send();
});
