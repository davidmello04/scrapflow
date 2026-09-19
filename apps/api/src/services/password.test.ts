import bcrypt from 'bcryptjs';
import { describe, expect, it } from 'vitest';
import { comparePassword, hashPassword } from './password.js';

describe('password security', () => {
  it('armazena somente hash bcrypt com 12 rounds', async () => {
    const hash = await hashPassword('a-strong-password');
    expect(hash).not.toContain('a-strong-password');
    expect(bcrypt.getRounds(hash)).toBe(12);
    expect(await comparePassword('a-strong-password', hash)).toBe(true);
    expect(await comparePassword('wrong-password', hash)).toBe(false);
  });
});
