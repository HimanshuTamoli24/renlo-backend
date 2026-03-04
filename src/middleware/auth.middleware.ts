import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { envs } from '../config/env';
import { ApiError } from '../utils/api.error';

const getCookieValue = (cookieHeader: string | undefined, key: string): string | null => {
  if (!cookieHeader) return null;
  const pairs = cookieHeader.split(';').map((part) => part.trim());
  const target = pairs.find((pair) => pair.startsWith(`${key}=`));
  if (!target) return null;
  return decodeURIComponent(target.split('=').slice(1).join('='));
};

// CHECK IF THE USER IS AUTHENTICATED BY VERIFYING THE JWT TOKEN
function authorize() {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    const bearerToken = header?.startsWith('Bearer ') ? header.split(' ')[1] : undefined;
    const cookieToken = getCookieValue(req.headers.cookie, 'accessToken');

    const token = bearerToken || cookieToken;
    console.log('Authorization Header:', header);
    console.log('Bearer Token:', bearerToken);
    console.log('Cookie Token:', cookieToken);
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const decoded = jwt.verify(token as any, envs.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error :any ) {
      if (error.name === 'TokenExpiredError') {
        return next(new ApiError(401, 'Token expired'));
      }

      return next(new ApiError(401, 'Invalid token'));
    }
  };
}

export default authorize;
