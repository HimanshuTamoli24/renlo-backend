import type { Request, Response } from 'express';
import * as userService from './user.service';
import { asyncHandler } from '../../utils/async.handler';
import { ApiResponse } from '../../utils/api.response';

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.getUsers(req.query);

  res.status(200).json(new ApiResponse('Users fetched successfully', result.data, result.meta));
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUser(req.params.id as string);

  res.status(200).json(new ApiResponse('User fetched', user));
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);

  res.status(201).json(new ApiResponse('User created', user));
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateUser(req.params.id as string, req.body);

  res.status(200).json(new ApiResponse('User updated', user));
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await userService.deleteUser(req.params.id as string);

  res.status(200).json(new ApiResponse('User deleted'));
});
