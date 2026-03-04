import jwt from 'jsonwebtoken';
import { envs } from '../config/env';

function generateRefreshToken(user: { id: any; role: string }) {
  const payload = {
    id: user.id,
    role: user.role,
  };

  return jwt.sign(payload, envs.JWT_SECRET, { expiresIn: '7d' });
}

function generateAccessToken(user: { id: any; role: string }) {
  const payload = {
    id: user.id,
    role: user.role,
  };

  return jwt.sign(payload, envs.JWT_SECRET, { expiresIn: '6h' });
}

export { generateRefreshToken, generateAccessToken };
