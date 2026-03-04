import type { ZodSchema } from 'zod';
import type { Request, Response, NextFunction } from 'express';

export const validate =
  (schema: ZodSchema, property: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.issues[0]?.message ?? 'Validation failed',
      });
    }

    req[property] = result.data;
    next();
  };