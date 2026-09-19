import type { NextFunction, Request, Response } from 'express';
import type { UserRole } from '../models/user.js';
import { User } from '../models/user.js';
import { verifyAccessToken } from '../services/auth.js';

export async function authenticate(request: Request, response: Response, next: NextFunction) {
  const authorization = request.header('authorization');
  const [scheme, token] = authorization?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !token) {
    response.status(401).json({ message: 'Sessão não informada.' });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findOne({ _id: payload.sub, active: true });
    if (!user) {
      response.status(401).json({ message: 'Sessão inválida ou usuário inativo.' });
      return;
    }
    request.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    next();
  } catch {
    response.status(401).json({ message: 'Sessão inválida ou expirada.' });
  }
}

export function authorize(...roles: UserRole[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user || !roles.includes(request.user.role)) {
      response.status(403).json({ message: 'Você não possui permissão para esta operação.' });
      return;
    }
    next();
  };
}
