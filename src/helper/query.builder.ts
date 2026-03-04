import { Model } from 'mongoose';

interface QueryOptions {
  page?: string;
  limit?: string;
  sort?: string;
  order?: string;
  search?: string;
  [key: string]: any;
}

export const queryBuilder = async <T>(
  model: Model<T>,
  queryParams: QueryOptions,
  searchableFields: string[] = [],
) => {
  const page = Math.max(1, Number(queryParams.page) || 1);
  const limit = Math.min(Number(queryParams.limit) || 10, 100);
  const skip = (page - 1) * limit;

  const sortField = queryParams.sort || 'createdAt';
  const order = queryParams.order === 'asc' ? 1 : -1;

  // Build filter
  const filter: any = {};

  Object.keys(queryParams).forEach((key) => {
    if (
      !['page', 'limit', 'sort', 'order', 'search'].includes(key)
    ) {
      filter[key] = queryParams[key];
    }
  });

  // Search logic
  if (queryParams.search && searchableFields.length > 0) {
    filter.$or = searchableFields.map((field) => ({
      [field]: { $regex: queryParams.search, $options: 'i' },
    }));
  }

  const total = await model.countDocuments(filter);

  const data = await model
    .find(filter)
    .sort({ [sortField]: order })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data,
  };
};


export const getPagination = (page?: string, limit?: string) => {
  const pageNumber = Math.max(1, Number(page) || 1);
  const limitNumber = Math.min(Number(limit) || 10, 100);
  const skip = (pageNumber - 1) * limitNumber;

  return {
    page: pageNumber,
    limit: limitNumber,
    skip,
  };
};