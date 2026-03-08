import type { ZodSchema } from 'zod';
import type { Request, Response, NextFunction } from 'express';

export const validate =
  (schema: ZodSchema, property: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      const issue = result.error.issues[0];
      const field = issue?.path.join('.') || 'Field';
      const message = issue?.message ?? 'Validation failed';

      return res.status(400).json({
        success: false,
        message: `${field}: ${message}`,
      });
    }

    req[property] = result.data;
    next();
  };
