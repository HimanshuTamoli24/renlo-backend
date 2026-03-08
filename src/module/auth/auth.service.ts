import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../user/user.model';
import { ApiError } from '../../utils/api.error';
import { generateAccessToken, generateRefreshToken } from '../../helper/jwttoken.genration';
import { envs } from '../../config/env';

export const register = async (data: any) => {
  const { email, password, name, ...rest } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(400, 'Email already exists');

  const user = await User.create({
    email,
    password,
    name,
    ...rest,
  });

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

  user.refreshToken = refreshToken;
  user.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await user.save();

  return { user, accessToken, refreshToken };
};

export const login = async (data: any) => {
  const user = await User.findOne({ email: data.email }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const isMatch = await user.comparePassword(data.password);
  if (!isMatch) throw new ApiError(401, 'Invalid credentials');

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

  user.refreshToken = refreshToken;
  user.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await user.save();

  const safeUser = await User.findById(user._id);
  return { user: safeUser, accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
  let decoded: any;

  try {
    decoded = jwt.verify(refreshToken, envs.JWT_SECRET) as { id: string; role: string };
  } catch {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user) throw new ApiError(401, 'Invalid refresh token');

  if (!user.refreshToken || user.refreshToken !== refreshToken) {
    throw new ApiError(401, 'Refresh token mismatch');
  }

  if (!user.refreshTokenExpiry || user.refreshTokenExpiry.getTime() < Date.now()) {
    throw new ApiError(401, 'Refresh token expired');
  }

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  return { accessToken };
};

export const logout = async (userId: string) => {
  const user = await User.findById(userId).select('+refreshToken');
  console.log('Logging out user:', userId);
  if (!user) throw new ApiError(404, 'User not found');
  user.refreshToken = undefined;
  user.refreshTokenExpiry = undefined;
  await user.save();
};
