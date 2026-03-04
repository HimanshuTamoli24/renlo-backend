import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async.handler';
import { ApiResponse } from '../../utils/api.response';
import { envs } from '../../config/env';
import * as authService from './auth.service';

const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
  userRole: string,
) => {
  const isProduction = envs.NODE_ENV === 'production';

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 6 * 60 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie('userRole', userRole, {
    httpOnly: false,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body);
  setAuthCookies(res, accessToken, refreshToken, user.role);
  res.status(201).json(new ApiResponse('Registered successfully', user));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  if (!user) throw new Error('User not found');
  setAuthCookies(res, accessToken, refreshToken, user.role);
  res.status(200).json(new ApiResponse('Login successful', user));
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  console.log('Logging out user:', req.user);
  await authService.logout(req.user.id);
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('userRole');
  res.status(200).json(new ApiResponse('Logged out successfully'));
});
