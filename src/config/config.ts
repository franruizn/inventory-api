import { z } from 'zod';

const EnvSchema = z.object({
  PORT:        z.coerce.number().default(3000),
  DB_HOST:     z.string().default('localhost'),
  DB_PORT:     z.coerce.number().default(3306),
  DB_USER:     z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME:     z.string(),
  NODE_ENV:    z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET:  z.string().min(32),
});

export const config = EnvSchema.parse(process.env);