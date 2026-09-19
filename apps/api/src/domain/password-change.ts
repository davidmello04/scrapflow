export function validatePasswordChange(currentPassword: string, newPassword: string) {
  if (currentPassword === newPassword) return 'A nova senha deve ser diferente da senha atual.';
  return undefined;
}

export function validateAdminPasswordReset(actorId: string, targetId: string) {
  if (actorId === targetId) return 'Para alterar sua própria senha, informe a senha atual.';
  return undefined;
}
