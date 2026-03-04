import Listing, { type ListingStatus } from './listing.model';
import { ApiError } from '../../utils/api.error';
import { getPagination } from '../../helper/query.builder';

export const getListings = async (query: any) => {
  const { page: pageQuery, limit: limitQuery, search, location, minRent, maxRent, availableFrom, amenity } = query;
  const { page, limit, skip } = getPagination(pageQuery as string, limitQuery as string);

  const filter: Record<string, any> = { status: 'PUBLISHED' };

  if (location) {
    filter.location = { $regex: String(location), $options: 'i' };
  }

  if (search) {
    filter.$or = [
      { title: { $regex: String(search), $options: 'i' } },
      { description: { $regex: String(search), $options: 'i' } },
      { location: { $regex: String(search), $options: 'i' } },
    ];
  }

  if (minRent || maxRent) {
    filter.rentAmount = {};
    if (minRent) filter.rentAmount.$gte = Number(minRent);
    if (maxRent) filter.rentAmount.$lte = Number(maxRent);
  }

  if (availableFrom) {
    filter.availableFrom = { $gte: new Date(String(availableFrom)) };
  }

  if (amenity) {
    filter.amenities = { $in: [String(amenity)] };
  }

  const total = await Listing.countDocuments(filter);
  const listings = await Listing.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

  return {
    success: true,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: listings,
  };
};

export const getListing = async (id: string) => {
  const listing = await Listing.findOne({ _id: id, status: 'PUBLISHED' }).lean();
  if (!listing) throw new ApiError(404, 'Listing not found');
  return listing;
};

export const compareListings = async (ids: string[]) => {
  if (!ids.length) throw new ApiError(400, 'Listing ids are required');

  const listings = await Listing.find({ _id: { $in: ids }, status: 'PUBLISHED' }).lean();
  return listings;
};

export const getAdminListings = async (query: any) => {
  const { page: pageQuery, limit: limitQuery, status } = query;
  const { page, limit, skip } = getPagination(pageQuery as string, limitQuery as string);

  const filter: Record<string, any> = {};
  if (status) filter.status = status;

  const total = await Listing.countDocuments(filter);
  const listings = await Listing.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

  return {
    success: true,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: listings,
  };
};

export const createListing = async (data: any, createdBy: string) => {
  const listing = await Listing.create({
    ...data,
    createdBy,
  });

  return listing;
};

const allowedTransitions: Record<ListingStatus, ListingStatus[]> = {
  DRAFT: ['REVIEW'],
  REVIEW: ['DRAFT', 'PUBLISHED'],
  PUBLISHED: ['REVIEW'],
};

export const updateListing = async (id: string, data: any) => {
  const listing = await Listing.findByIdAndUpdate(id, data, { new: true });
  if (!listing) throw new ApiError(404, 'Listing not found');
  return listing;
};

export const updateListingStatus = async (id: string, status: ListingStatus) => {
  const listing = await Listing.findById(id);
  if (!listing) throw new ApiError(404, 'Listing not found');

  const canMove = allowedTransitions[listing.status].includes(status);
  if (!canMove) {
    throw new ApiError(400, `Invalid status transition from ${listing.status} to ${status}`);
  }

  listing.status = status;
  await listing.save();
  return listing;
};

export const deleteListing = async (id: string) => {
  const listing = await Listing.findByIdAndDelete(id);
  if (!listing) throw new ApiError(404, 'Listing not found');
};
