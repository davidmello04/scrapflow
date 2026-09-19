import { describe, expect, it } from 'vitest';
import { validateAdminPasswordReset, validatePasswordChange } from './password-change.js';

describe('password change rules', () => {
  it('rejects reusing the current password', () => {
    expect(validatePasswordChange('senha-segura', 'senha-segura')).toBe('A nova senha deve ser diferente da senha atual.');
  });

  it('accepts a different password', () => {
    expect(validatePasswordChange('senha-atual', 'senha-nova-segura')).toBeUndefined();
  });

  it('prevents an admin reset from bypassing current-password confirmation', () => {
    expect(validateAdminPasswordReset('user-1', 'user-1')).toBe('Para alterar sua própria senha, informe a senha atual.');
    expect(validateAdminPasswordReset('admin-1', 'user-1')).toBeUndefined();
  });
});
