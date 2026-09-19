import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3333),
  MONGODB_URI: z.string().min(1),
  CORS_ORIGIN: z.string().default('*'),
});

export const env = schema.parse(process.env);
