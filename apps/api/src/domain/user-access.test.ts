import { describe, expect, it } from 'vitest';
import { validateUserAccessChange } from './user-access.js';

const base = {
  actorId: 'admin-1',
  targetId: 'admin-2',
  targetRole: 'ADMIN' as const,
  targetActive: true,
  activeAdminCount: 2,
};

describe('user access safeguards', () => {
  it('bloqueia o auto-rebaixamento', () => {
    expect(validateUserAccessChange({ ...base, targetId: 'admin-1', nextRole: 'OPERATOR' }))
      .toBe('Você não pode rebaixar ou desativar a própria conta.');
  });

  it('bloqueia a remoção do último administrador ativo', () => {
    expect(validateUserAccessChange({ ...base, activeAdminCount: 1, nextActive: false }))
      .toBe('É necessário manter ao menos um administrador ativo.');
  });

  it('permite desativar outro administrador quando existe redundância', () => {
    expect(validateUserAccessChange({ ...base, nextActive: false })).toBeUndefined();
  });
});
