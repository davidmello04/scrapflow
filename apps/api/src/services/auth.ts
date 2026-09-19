import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { UserRole } from '../models/user.js';

type AccessTokenPayload = { sub: string; role: UserRole };

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    issuer: 'scrapflow-api',
    audience: 'scrapflow-mobile',
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET, {
    algorithms: ['HS256'],
    issuer: 'scrapflow-api',
    audience: 'scrapflow-mobile',
  }) as jwt.JwtPayload & AccessTokenPayload;
}
