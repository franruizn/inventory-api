import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

type Target = 'body' | 'query' | 'params';

export const validate = (schema: ZodSchema, target: Target = 'body') =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      res.status(400).json({
        error:   'Validation failed',
        details: result.error.flatten().fieldErrors,
      });
      return;
    }
    req[target] = result.data;
    next();
  };
