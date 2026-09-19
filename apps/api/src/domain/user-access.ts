import type { UserRole } from '../models/user.js';

type Input = {
  actorId: string;
  targetId: string;
  targetRole: UserRole;
  targetActive: boolean;
  nextRole?: UserRole;
  nextActive?: boolean;
  activeAdminCount: number;
};

export function validateUserAccessChange(input: Input) {
  const removesAdmin = input.targetRole === 'ADMIN'
    && input.targetActive
    && (input.nextRole === 'OPERATOR' || input.nextActive === false);

  if (input.actorId === input.targetId && (input.nextRole === 'OPERATOR' || input.nextActive === false)) {
    return 'Você não pode rebaixar ou desativar a própria conta.';
  }

  if (removesAdmin && input.activeAdminCount <= 1) {
    return 'É necessário manter ao menos um administrador ativo.';
  }

  return undefined;
}
