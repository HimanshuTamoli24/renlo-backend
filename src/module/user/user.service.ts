import User from './user.model';
import { ApiError } from '../../utils/api.error';
import { getPagination } from '../../helper/query.builder';

export const getUsers = async (query: any) => {
  const { page: pageQuery, limit: limitQuery } = query;
  const { page, limit, skip } = getPagination(pageQuery as string, limitQuery as string);

  const total = await User.countDocuments();
  const users = await User.find().skip(skip).limit(limit).lean();

  return {
    success: true,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: users,
  };
};

export const getUser = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export const createUser = async (data: any) => {
  const { email, password, name, ...rest } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(400, 'Email already exists');

  const user = await User.create({
    email,
    password,
    name,
    ...rest,
  });

  return user;
};

export const updateUser = async (id: string, data: any) => {
  const user = await User.findByIdAndUpdate(id, data, { new: true });

  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new ApiError(404, 'User not found');
  return;
};
