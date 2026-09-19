import type { UserRole } from '../models/user.js';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; name: string; email: string; role: UserRole };
    }
  }
}

export {};
